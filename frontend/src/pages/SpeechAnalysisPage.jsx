import {
  Mic,
  MicOff,
  Award,
  TrendingUp,
  Target,
  X,
  Loader2,
  NotepadText,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { uploadSpeech } from "../lib/api";
import { useLocation } from "react-router-dom";

const SpeechAnalysisPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [transcript, setTranscript] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);

  const [feedbackData, setFeedbackData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [overall, setOverall] = useState(null);

  const location = useLocation();
  const topic = location.state?.topic || "Default Topic";

  const getScoreColor = (score) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-info";
    if (score >= 70) return "text-warning";
    return "text-error";
  };
  const getGrade = (score) => {
    if (score >= 90) return "Outstanding";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Above Average";
    if (score >= 50) return "Average";
    return "Needs Improvement";
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    startTimeRef.current = Date.now();

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();

      const durationInSeconds = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );
      
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("topic", topic);
      formData.append("duration", durationInSeconds.toString());

      try {
        const response = await uploadSpeech(formData);

        //testing
        // console.log(response);

        setTranscript(response.transcript);
        setEvaluation(response.evaluation);
        setOverall(response.evaluation.overall_score);

        setFeedbackData([
          {
            label: "Fluency",
            score: response.evaluation.fluency,
            color: "progress-primary",
          },
          {
            label: "Pronunciation",
            score: response.evaluation.pronunciation,
            color: "progress-primary",
          },
          {
            label: "Vocabulary",
            score: response.evaluation.vocabulary,
            color: "progress-primary",
          },
          {
            label: "Grammar",
            score: response.evaluation.grammar,
            color: "progress-primary",
          },
        ]);
        setSuggestions(
          response.evaluation.suggestions.map((text) => ({ text }))
        );
        setShowResults(true);
      } catch (err) {
        console.error("Upload/Evaluation error", err);
        setTranscript("❌ Evaluation failed");
        setErrorMessage(
          "We couldn't analyze your transcript. Please try again."
        );
        setShowError(true);
      } finally {
        setIsAnalyzing(false);
        chunksRef.current = [];
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingTime]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
    } else {
      startRecording();
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setRecordingTime(0);
  };

  const handleNewRecording = () => {
    setShowResults(false);
    setRecordingTime(0);
    setTranscript("");
    setEvaluation(null);
    setFeedbackData([]);
    setSuggestions([]);
    startRecording(); // start a new recording immediately
  };

  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage("");
    setRecordingTime(0);
  };

  const handleRetryFromError = () => {
    setShowError(false);
    setErrorMessage("");
    setRecordingTime(0);
    startRecording(); // start a new recording immediately
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Award className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">
              Speech Analysis
            </h1>
          </div>
          <p className="text-base text-base-content/70">
            Practice your speaking skills and get AI-powered feedback
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Selected Topic */}
          <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-2xl p-6 border border-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-bold text-secondary">
                Selected Topic
              </h2>
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              {topic}
            </h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Share your ideas, experiences, and insights on everyday life,
              technology, current affairs, and professional scenarios. This is
              an opportunity to practice expressing yourself clearly and
              confidently.
            </p>
          </div>

          {/* Speaking Guidelines */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Speaking Guidelines
            </h3>
            <div className="space-y-3">
              {[
                "Aim for 1-2 minutes of speaking",
                "Speak clearly and at a natural pace",
                "Stay focused on the topic",
                "Express your personal views and opinions",
              ].map((guideline, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-base-content">{guideline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recording Interface */}
        <div className="max-w-2xl mx-auto">
          <div
            className={`bg-gradient-to-r ${
              isRecording
                ? "from-error/20 to-error/10"
                : "from-accent/20 to-accent/10"
            } rounded-2xl p-8 border border-accent/20 text-center`}
          >
            <h3
              className={`text-xl font-bold ${
                isRecording ? "text-error" : "text-accent"
              } mb-6 flex items-center justify-center gap-2`}
            >
              <Mic className="w-5 h-5" />
              Recording Studio
            </h3>

            {/* Status */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                className={`w-3 h-3 rounded-full ${
                  isRecording ? "bg-error animate-pulse" : "bg-success"
                }`}
              ></div>
              <span className="text-sm text-base-content font-medium">
                {isRecording ? "Recording in progress..." : "Ready to record"}
              </span>
            </div>

            {/* Timer Display */}
            <div className="mb-8">
              <div className="bg-base-100/80 rounded-xl p-6 inline-block">
                <span className="text-4xl font-mono font-bold text-base-content">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleRecordingToggle}
                disabled={isAnalyzing}
                className={`btn btn-lg ${
                  isRecording ? "btn-error" : "btn-primary"
                } gap-3 shadow-lg hover:shadow-xl transition-all duration-300 px-8`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </button>
            </div>

            {/* Volume Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {/* <span className="text-xs text-base-content/70 font-medium">
                  Audio Level
                </span> */}
                {/* <span className="text-xs text-base-content/70">
                  {isRecording ? Math.floor(Math.random() * 60 + 20) : 0}%
                </span> */}
              </div>
              <progress
                className="progress progress-accent w-full h-2"
                value={isRecording ? Math.floor(Math.random() * 60 + 20) : 0}
                max="100"
              ></progress>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              Analyzing Your Speech
            </h3>
            <p className="text-base-content/70 mb-6">
              Our AI is processing your recording and generating detailed
              feedback. This may take a few moments.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-base-100 border-b border-base-300/50 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold text-primary">
                  Speech Analysis Results
                </h2>
              </div>
              <button
                onClick={handleCloseResults}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 mb-8 text-center border border-primary/20">
                <h3 className="text-xl font-bold text-primary mb-4">
                  Overall Performance
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/30">
                      <span
                        className={`text-4xl font-bold ${getScoreColor(
                          overall
                        )}`}
                      >
                        {overall}
                      </span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-sm text-base-content/70 mb-2">
                      Grade
                    </div>
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        overall
                      )} mb-2`}
                    >
                      {getGrade(overall)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbackData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-base-200/50 rounded-xl p-4 hover:bg-base-200 transition-colors border border-base-300/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-semibold text-base-content">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-base-content">
                          {item.score}%
                        </span>
                      </div>
                      <progress
                        className={`progress ${item.color} w-full h-3`}
                        value={item.score}
                        max="100"
                      ></progress>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recommendations for Improvement
                </h3>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-base-200/50 rounded-xl p-4 border border-base-300/30 hover:bg-base-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-base text-base-content flex-1">
                          {suggestion.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <NotepadText className="w-5 h-5" />
                  Transcript
                </h3>
                <div className="space-y-4">{transcript}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleNewRecording}
                  className="btn btn-primary btn-lg gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Record Again
                </button>
                <button
                  onClick={handleCloseResults}
                  className="btn btn-outline btn-lg"
                >
                  Close Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl max-w-2xl w-full shadow-2xl">
            {/* Error Header */}
            <div className="bg-error/10 border-b border-error/20 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-error-content" />
                </div>
                <h2 className="text-2xl font-bold text-error">
                  Analysis Failed
                </h2>
              </div>
              <button
                onClick={handleCloseError}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Content */}
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-error"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-base-content mb-3">
                  Oops! Something went wrong
                </h3>
                <p className="text-base-content/70 mb-6">
                  We couldn't analyze your speech recording. Here's what
                  happened:
                </p>

                {/* Error Message */}
                <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6">
                  <p className="text-error font-medium text-center">
                    We couldn't analyze your speech recording. Please try again.
                  </p>
                </div>

                {/* Troubleshooting Tips */}
                <div className="bg-base-200/50 rounded-xl p-4 mb-6 text-left">
                  <h4 className="font-semibold text-base-content mb-3">
                    💡 Troubleshooting Tips:
                  </h4>
                  <ul className="space-y-2 text-sm text-base-content/80">
                    <li>• Make sure your microphone is working properly</li>
                    <li>• Check your internet connection</li>
                    <li>• Try recording for at least 10-15 seconds</li>
                    <li>• Ensure you spoke clearly during the recording</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRetryFromError}
                  className="btn btn-primary btn-lg gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Try Recording Again
                </button>
                <button
                  onClick={handleCloseError}
                  className="btn btn-outline btn-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechAnalysisPage;
