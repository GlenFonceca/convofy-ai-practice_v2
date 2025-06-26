# 🌐 Convofy-AI-Practice

**Convofy** is a responsive and secure web application that helps users practice new languages by connecting with others through **chat**, **video calls**, and **AI-powered English speaking practice**. Built with modern web technologies, Convofy enables a smooth user experience with real-time communication, personalized feedback, and dynamic UI themes.

## ✨ Key Features

### 🎙️ Practice Speaking with AI (only for English)

* Choose a **topic** from a curated list of categories.
* Speak freely while the app **records your voice using WebSockets**.
* Audio is transcribed using **Vosk**, an offline speech-to-text model.
* Transcript is evaluated using **LLaMA 3**, an advanced language model.
* Receive a detailed **evaluation scorecard** for:

  * Fluency
  * Pronunciation
  * Grammar
  * Vocabulary
  * Overall Score
* Get **personalized suggestions** to improve your speaking skills.
* View your **test history** and track progress over time.

### 🔐 Authentication

Secure Sign Up and Login functionality using **JWT-based authentication** to protect user sessions and data.

### 💳 Premium Plans with Stripe

* Upgrade to **Premium** with secure payments via **Stripe**.
* Choose between:
  - **Monthly Plan**
  - **Annual Plan**
* Automatically update your account status post-payment.
* Handled using **Stripe Webhooks** for event-driven updates.


### 🏠 Home Page

* Discover **recommended users** based on shared interests
* View your list of **friends**
* **Send friend requests** to connect with others

### 🛎️ Notifications Page

* View **incoming friend requests**
* **Accept** or **reject** requests

### 👥 Friends Page

* View all your **accepted friends**
* **Start a chat** or **video call** directly from this list

### 💬 Chat

Real-time messaging with friends using **Stream Chat API**.

### 🎥 Video Calling

High-quality video calls using the **Stream Video API**.

### 🎨 UI Themes

Switch between **multiple themes** using **DaisyUI + Tailwind CSS**.

### 📱 Responsive Design

Optimized for **desktop, tablet, and mobile** platforms.

---

## 🛠️ Tech Stack

### **Frontend**

* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
* [Stream Chat & Video SDK](https://getstream.io/)

### **Backend**

* [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) via Mongoose
* [Stripe](https://stripe.com/) for payment processing
* [Vosk](https://alphacephei.com/vosk/) (Python) for speech transcription
* [Meta LLaMA 3](https://ai.meta.com/llama) for transcript evaluation
* JWT-based authentication

---

## 🔧 Environment Variables

### 📦 Backend (`backend/.env`)

```
PORT=5001 #your port Number
MONGO_URI=your_mongo_uri

STEAM_API_KEY=your_steam_api_key
STEAM_API_SECRET=your_steam_api_secret

JWT_SECRET_KEY=your_jwt_secret

LLAMA_API_KEY=your_llama_api_key
LLAMA_API_ENDPOINT= your_llama_api_endpoint
LLAMA_MODEL_ID=llama-3-model-id

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

STRIPE_MONTHLY_PRICE_ID=your_stripe_monthly_price_id
STRIPE_ANNUAL_PRICE_ID=your_stripe_annual_price_id

```

### 🌐 Frontend (`frontend/.env`)

```
VITE_STREAM_API_KEY=your_stream_key_here
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* Python (v3.8 or higher)
* FFmpeg (for audio conversion)
* MongoDB Database
* Stream API Key and Secret
* Access to LLaMA 3 API
* [Vosk English Model](https://alphacephei.com/vosk/models) (e.g., `vosk-model-small-en-us-0.15`)

### 📥 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/GlenFonceca/convofy-ai-practice.git
cd convofy-ai-practice
```

---

### ⚙️ Backend Setup (Node + Python + Vosk)

```bash
cd backend
npm install
```

2. **Setup Python Virtual Environment and Vosk**

```bash
# Navigate to transcription directory
cd src/vosk_transcriber

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Install Vosk
pip install vosk

# Download and extract Vosk model into this folder
# Ensure structure: src/vosk_transcriber/model/

# Return to backend root
cd ../../../
```

3. **Configure Environment Variables**
   Create `.env` inside `backend/` and paste the required values.

4. **Start Backend Server**

```bash
#Make sure activating the venv before starting the backend server
npm start
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

5. **Configure Environment Variables**
   Create `.env` inside `frontend/` and paste the required values.

6. **Start Frontend Server**

```bash
npm run dev
```

---

## 📸 Screenshots


<p align="center">
  <b>Home Theme 1</b>
</p>
<p align="center">
  <img src="./screenshots/homePage.gif"  />
</p>
  
<p align="center">
  <b>Home Theme 2</b>
</p>
<p align="center">
  <img src="./screenshots/homePage2.gif" />
</p>
  


<p align="center">
  <b>Login Page</b> 
  <img src="./screenshots/loginPage.png" alt="Login Page" />
</p>

<p align="center">
  <b>Practice with AI</b> 
  <img src="./screenshots/practiceWithAiPage.png" alt="AIPage"  />
  <b>Check Previous Tests</b>
  <img src="./screenshots/checkTestHistory.png" alt="historyPage" />
  <b> Take Test </b>
  <img src="./screenshots/recordSpeech.png" alt="recordPage" />
</p>

<p align="center">
  <b>Upgrade to Premium</b>
  <img src="./screenshots/upgradePremium.png" alt="Premium Page" />
</p>


<p align="center">
  <b>Profile</b> 
  <img src="./screenshots/profilePage.png" alt="ProfilePage"  />
  <b>Friends</b>
  <img src="./screenshots/friendsPage.png" alt="friendsPage" />
  <b>Notifications</b>
  <img src="./screenshots/notificationsPage.png" alt="notificationPage" />
</p>

<p align="center">
  <b>Chat</b>
  <img src="./screenshots/chatPage.png" alt="ChatPage"  />
  <b>Video Call</b>
  <img src="./screenshots/videoCallPage.png" alt="VideoCallPage" />
</p>

---

## 🧩 Future Improvements

* Multilingual support for speaking practice
* Support for emotion/tone analysis
* Gamification elements and rewards

---

## 🤝 Contributing

We welcome all contributions to improve this AI-based speaking practice app. Feel free to fork the repo, raise issues, and submit pull requests.

---

## 🌟 Thank You!

Thank you for checking out **Convofy-AI-Practice**!
If this project helps you or someone learning English, please ⭐ the repository and share it!
