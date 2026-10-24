require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Running ✅");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

io.on("connection", (socket) => {
  console.log("✅ Client Connected:", socket.id);

  let deepgram = null;
  let audioQueue = [];
  let sessionTranscript = "";

  const createDeepgramConnection = () => {
    deepgram = new WebSocket(
      "wss://api.deepgram.com/v1/listen?model=nova-3&smart_format=true",
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        },
      }
    );

    deepgram.on("open", () => {
      console.log("✅ Deepgram Connected");

      // Flush queued audio
      while (audioQueue.length > 0) {
        const chunk = audioQueue.shift();
        deepgram.send(chunk);
      }
    });

    deepgram.on("message", async (message) => {
      try {
        const dgData = JSON.parse(message.toString());

        const transcript =
          dgData?.channel?.alternatives?.[0]?.transcript;

        if (!transcript?.trim()) return;

        console.log("🎤 Transcript:", transcript);

        // Update frontend with live transcript
        socket.emit("transcript", transcript);

        const isFinal =
          dgData?.is_final === true ||
          dgData?.speech_final === true;

        if (!isFinal) return;

        console.log("✅ Final Transcript:", transcript);

        sessionTranscript += ` ${transcript}`;

        try {
          const completion =
            await groq.chat.completions.create({
              model: "openai/gpt-oss-20b",
              messages: [
                {
                  role: "system",
                  content: `
You are an AI interview assistant.

Rules:
- Give concise interview hints.
- Maximum 30 words.
- Use bullet points.
- Provide only the most helpful guidance.
- Avoid lengthy explanations.
                  `,
                },
                {
                  role: "user",
                  content: sessionTranscript.slice(-2000),
                },
              ],
            });

          const aiResponse =
            completion.choices?.[0]?.message?.content ||
            "No response generated";

          console.log("🤖 AI Response:", aiResponse);

          socket.emit(
            "assistant-response",
            aiResponse
          );
        } catch (groqError) {
          console.error(
            "❌ Groq Error:",
            groqError
          );
        }
      } catch (err) {
        console.error(
          "❌ Deepgram Message Parse Error:",
          err
        );
      }
    });

    deepgram.on("close", () => {
      console.log("❌ Deepgram Closed");
    });

    deepgram.on("error", (err) => {
      console.error(
        "❌ Deepgram WebSocket Error:",
        err
      );
    });
  };

  socket.on("audio-chunk", (audioChunk) => {
    try {
      const buffer = Buffer.from(audioChunk);

      if (!deepgram) {
        createDeepgramConnection();
      }

      if (
        deepgram &&
        deepgram.readyState === WebSocket.OPEN
      ) {
        deepgram.send(buffer);
      } else {
        audioQueue.push(buffer);
      }
    } catch (err) {
      console.error(
        "❌ Audio Chunk Error:",
        err
      );
    }
  });

  socket.on("stop-stream", () => {
    console.log("⏹ Stream Stopped");

    if (
      deepgram &&
      deepgram.readyState === WebSocket.OPEN
    ) {
      deepgram.close();
    }

    deepgram = null;
    audioQueue = [];
  });

  socket.on("disconnect", () => {
    console.log(
      "❌ Client Disconnected:",
      socket.id
    );

    if (
      deepgram &&
      deepgram.readyState === WebSocket.OPEN
    ) {
      deepgram.close();
    }

    deepgram = null;
    audioQueue = [];
  });
});

server.listen(3001, () => {
  console.log(
    "🚀 Socket Server running on http://localhost:3001"
  );
});