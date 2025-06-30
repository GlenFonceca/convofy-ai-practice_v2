import axios from "axios";
import TestResult from "../models/TestResult.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getTestHistory = async (req, res) => {
  try {
    const history = await TestResult.find({ user: req.user._id })
      .select("topic transcript evaluation durationInSeconds createdAt")
      .sort({ createdAt: -1 }); // descending order for latest first

    res.status(200).json(history);
  } catch (error) {
    console.error("Error in getTestHistory controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const transcribeAndEvaluate = async (req, res) => {

  const MODEL_API_KEY = process.env.MODEL_API_KEY;
  const MODEL_API_ENDPOINT = process.env.MODEL_API_ENDPOINT;
  const MODEL_ID = process.env.MODEL_ID;
  const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY;

  const userId = req.user._id;
  const topic = req.body.topic || "Unknown Topic";
  const durationInSeconds = parseInt(req.body.duration, 10);

  if (isNaN(durationInSeconds)) {
    return res.status(400).json({ error: "Invalid or missing duration" });
  }

  let transcriptText = "";

  // ─── AssemblyAI Upload & Transcription ─────────────────────────────────────
  try {
    // 1. Upload audio buffer
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      req.file.buffer,
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    const audioUrl = uploadResponse.data.upload_url;

    // 2. Request transcription
    const transcriptResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        language_code: "en",
        disfluencies: true
      },
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;
    const pollingUrl = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    // 3. Polling until transcription is complete. Means Calling api untill complete transcript is ready.
    let completed = false;
    while (!completed) {
      const pollingRes = await axios.get(pollingUrl, {
        headers: {
          authorization: ASSEMBLY_API_KEY,
        },
      });

      if (pollingRes.data.status === "completed") {
        transcriptText = pollingRes.data.text;
        completed = true;
      } else if (pollingRes.data.status === "error") {
        return res
          .status(500)
          .json({ error: "AssemblyAI transcription failed" });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 sec
      }
      //Testing
      // console.log(transcriptText);
    }
  } catch (assemblyError) {
    console.error("AssemblyAI Error:", assemblyError.message);
    return res.status(500).json({ error: "Failed to transcribe audio" });
  }

  // ─── model API Evaluation ─────────────────────────────────────────────────
  try {
    const evaluationPrompt = `
You are an expert language tutor. Evaluate the following speech transcript provided by a language learner. The user is practicing their speaking skills in the context of the given topic.

Focus your evaluation strictly on the user's **spoken language proficiency**: fluency, pronunciation, grammar, and vocabulary. Do **not** judge topic accuracy or content knowledge. Do **not** provide suggestions related to topic ideas or content.

Provide clear, actionable tips for improving their **spoken English**.

Topic: """${topic}"""

Transcript: """${transcriptText}"""

Return ONLY a valid JSON object in the following format:

{
  "overall_score": <0-100>,           // General score based on all criteria
  "fluency": <0-100>,                 // Smoothness and flow of speech
  "pronunciation": <0-100>,          // Clarity and accuracy of pronunciation
  "grammar": <0-100>,                // Correctness of sentence structure
  "vocabulary": <0-100>,             // Range and appropriateness of words used
  "suggestions": [
    "<language learning tip 1>",
    "<language learning tip 2>",
    "<language learning tip 3>"
  ]
}
`;

    const modelResponse = await axios.post(
      MODEL_API_ENDPOINT,
      {
        model: MODEL_ID,
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that evaluates speech transcripts and provides feedback in JSON format. Your output must be a valid JSON object, and nothing else.Do NOT include code block formatting (e.g., ```json).",
          },
          {
            role: "user",
            content: evaluationPrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 700,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MODEL_API_KEY}`,
          "X-Title": "Convofy Ai Practice",
        },
        family: 4,
      }
    );

    let raw = modelResponse.data.choices[0].message.content.trim();

    //This is to remove the markdown code which the model is returning so that it will become valid JSON
    if (raw.startsWith("```")) {
      raw = raw
        .replace(/^```(?:json)?\n/, "")
        .replace(/```$/, "")
        .trim();
    }
    let evaluation;

    try {
      evaluation = JSON.parse(raw); //Convert to JSON
    } catch (jsonErr) {
      return res
        .status(500)
        .json({ error: "Invalid JSON from model", rawOutput: raw });
    }

    //testing
    // console.log(evaluation);

    // ✅ Save to MongoDB
    await TestResult.create({
      user: userId,
      topic,
      transcript:transcriptText,
      durationInSeconds: parseInt(durationInSeconds, 10),
      evaluation: {
        fluency: evaluation.fluency,
        grammar: evaluation.grammar,
        vocabulary: evaluation.vocabulary,
        pronunciation: evaluation.pronunciation,
        overall_score: evaluation.overall_score,
        suggestions: evaluation.suggestions,
      },
    });

    return res.status(200).json({ transcript: transcriptText, evaluation });
    
  } catch (modelError) {
    console.error("model API error:", modelError.message);
    return res.status(500).json({ error: "model evaluation failed" });
  }
};
