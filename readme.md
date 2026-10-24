# 🎙️ Voice AI Interview Assistant

A real-time AI-powered interview assistant that enables seamless voice conversations between users and an AI interviewer. The application captures audio from the user's microphone, converts speech to text, processes the transcript through a Large Language Model (LLM), and returns intelligent, contextual responses in real time.

## 🚀 Features

- 🎤 Real-time voice input from the browser
- 📝 Live Speech-to-Text conversion
- 🤖 AI-generated interview responses
- ⚡ Low-latency communication using WebSockets
- 💬 Continuous conversational experience
- 🧠 Context-aware AI interactions
- 📊 Clean and interactive chat interface
- 🔄 Full-duplex communication between client and server
- 🎯 Technical and behavioral interview practice

---

## 🏗️ Architecture

```text
+----------------+
|    User Voice  |
+--------+-------+
         |
         v
+----------------+
| React Frontend |
+--------+-------+
         |
         | WebSocket
         v
+----------------+
| Node.js Server |
+--------+-------+
         |
         +----------------------+
         |                      |
         v                      v
+----------------+    +--------------------+
|   Deepgram STT |    |      LLM API       |
| Speech-to-Text |    | (Groq/OpenAI/etc.) |
+----------------+    +--------------------+
         |                      |
         +----------+-----------+
                    |
                    v
          +------------------+
          | AI Response Text |
          +------------------+
                    |
                    v
          +------------------+
          | Frontend Display |
          +------------------+
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- WebSocket Client
- MediaRecorder API
- HTML/CSS

### Backend
- Node.js
- Express.js
- Socket.IO / WebSocket
- Multer (Audio Uploads)

### AI & Speech Services
- Deepgram Speech-to-Text
- Groq LLM API
- OpenAI Compatible Models
- Llama 3 / Mixtral

---

## 📂 Project Structure

```text
voice-ai-assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── uploads/
│   ├── app.js
│   ├── socket.js
│   ├── services/
│   │   ├── deepgram.js
│   │   └── groq.js
│   │
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/voice-ai-interview-assistant.git

cd voice-ai-interview-assistant
```

---

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

DEEPGRAM_API_KEY=your_deepgram_api_key

GROQ_API_KEY=your_groq_api_key
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Application will start at:

```text
http://localhost:5173
```

---

## 🔄 How It Works

### Step 1: User Speaks

The browser captures microphone input using the MediaRecorder API.

### Step 2: Audio Streaming

Audio chunks are streamed to the backend through a WebSocket connection.

### Step 3: Speech Recognition

Deepgram converts incoming audio into text transcripts.

### Step 4: AI Processing

The transcribed text is forwarded to a Large Language Model (Groq/OpenAI).

### Step 5: Response Generation

The AI generates a context-aware response.

### Step 6: Frontend Display

The generated response is displayed instantly in the UI.

---

## 🎯 Example Workflow

```text
User:
"Explain what closures are in JavaScript."

↓

Speech-to-Text

↓

Transcript:
"Explain what closures are in JavaScript."

↓

LLM

↓

Response:
"A closure is created when a function remembers and
accesses variables from its outer scope even after
the outer function has executed."
```

---

## 🔌 WebSocket Events

### Client → Server

```javascript
{
  type: "audio",
  data: audioChunk
}
```

### Server → Client

```javascript
{
  type: "transcript",
  text: "recognized speech"
}
```

```javascript
{
  type: "ai_response",
  text: "generated answer"
}
```

---

## 🎤 Supported Use Cases

### Interview Preparation

- Data Structures & Algorithms
- JavaScript Interviews
- React Interviews
- Node.js Interviews
- System Design
- Machine Learning
- Cloud Technologies

### Behavioral Practice

- Tell me about yourself
- Strengths and weaknesses
- Leadership scenarios
- Conflict resolution
- Team collaboration

### Learning Assistant

- Technical concepts
- Coding explanations
- Mock Q&A sessions
- General knowledge discussions

---

## 🚧 Future Enhancements

- 🔊 Text-to-Speech for AI responses
- 👤 Speaker detection
- 🎥 Video interview mode
- 📄 Interview transcript export
- ⭐ Interview performance scoring
- 🧠 Retrieval-Augmented Generation (RAG)
- 🌍 Multi-language support
- 📊 Analytics dashboard

---

## 📸 Screenshots

```text
Add screenshots here:

1. Home Screen
2. Live Recording Screen
3. AI Response Chat
4. Interview Summary
```

---

## 🔒 Environment Variables

```env
PORT=5000

DEEPGRAM_API_KEY=

GROQ_API_KEY=
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Harshit Kesharwani**

Developed as a real-time Voice AI Interview Assistant leveraging modern speech recognition, WebSockets, and Large Language Models to create an interactive interview preparation platform.
