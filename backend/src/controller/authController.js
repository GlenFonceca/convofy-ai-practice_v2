import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signUp(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password should be atleast 6 characters",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email Already Exists. please use a different One",
        });
    }

    //Generating Avatar using Random Index
    const idx = Math.floor(Math.random() * 100) + 1;
    //const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg/seed=${idx}`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    try {
      //CREATE USER IN STREAM
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream User Created for : ${newUser.fullName}`);
    } catch (error) {
      console.error("Error In creating Stream USer");
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None", // Required for cross-site cookies
      secure: true, // Required when SameSite=None
    });

    res
      .status(201)
      .json({ success: true, message: "Account Created Successfully" });
  } catch (error) {
    console.log("Error in SignUp Controller :", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });

    const isPassCorrect = await user.matchPassword(password);
    if (!isPassCorrect)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None", // Required for cross-site cookies
      secure: true, // Required when SameSite=None
    });

    res.status(200).json({ success: true, message: "Login Successfully" });
  } catch (error) {
    console.log("Error in SignUp Controller :", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

// export function logout(req, res) {
//   res.clearCookie("jwt");
//   res.status(200).json({ success: true, message: "Logout Successfull" });
// }

export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None", // Must match cookie settings from login/signup
    secure: true      // Must be true in production with SameSite=None
  });

  res.status(200).json({ success: true, message: "Logout Successful" });
}


export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    // Validate required fields
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for onboarding.",
        missignField: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res
        .status(401)
        .json({ success: false, message: "User Not Found" });

    res
      .status(200)
      .json({ success: true, message: "Details Updated Successfully" });

    try {
      //CREATE USER IN STREAM
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream User Updated after Onboarding for : ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.error("Error In creating Stream USer: ", streamError.message);
    }
  } catch (error) {
    console.log("Error in onboarding:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    // Validate required fields
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
        missignField: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updatedUser)
      return res
        .status(401)
        .json({ success: false, message: "User Not Found" });

    res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully" });

    try {
      //CREATE USER IN STREAM
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream User Updated after Onboarding for : ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.error("Error In creating Stream USer: ", streamError.message);
    }
  } catch (error) {
    console.log("Error in onboarding:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
