import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { io } from "socket.io-client";

export default function VoiceRecorder() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const connectSocket = () => {
    if (socketRef.current?.connected) {
      return;
    }

    socketRef.current = io("http://localhost:3001", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected");
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected");
      setConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket Error:", error);
    });

    socketRef.current.on("transcript", (text) => {
      setLiveTranscript(text);
    });

    socketRef.current.on("assistant-response", (response) => {
      setSuggestions((prev) => {
        if (
          prev.length > 0 &&
          prev[prev.length - 1] === response
        ) {
          return prev;
        }

        return [...prev, response];
      });
    });
  };

  const startRecording = async () => {
    try {
      connectSocket();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0) {
          const arrayBuffer =
            await event.data.arrayBuffer();

          socketRef.current?.emit(
            "audio-chunk",
            arrayBuffer
          );
        }
      };

      mediaRecorderRef.current = mediaRecorder;

      // Tell backend to initialize Deepgram
      socketRef.current?.emit("start-stream");

      // Stream chunks every 100ms
      mediaRecorder.start(100);

      setLiveTranscript("");
      setSuggestions([]);

      setIsRecording(true);

      console.log("🎤 Assistant Started");
    } catch (error) {
      console.error(error);
      alert("Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    socketRef.current?.emit("stop-stream");

    socketRef.current?.disconnect();

    setConnected(false);
    setIsRecording(false);

    console.log("⏹ Assistant Stopped");
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "Inter, Segoe UI, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 30px",
          background: "#111827",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#fff",
          }}
        >
          🎙️ AI Interview Assistant
        </h1>

        <div
          style={{
            marginTop: "10px",
            color: "#94a3b8",
          }}
        >
          {connected
            ? "🟢 Connected"
            : "🔴 Disconnected"}
        </div>

        <div
          style={{
            marginTop: "5px",
            fontWeight: "600",
          }}
        >
          {isRecording
            ? "🎤 Listening..."
            : "⏹ Assistant Stopped"}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          padding: "20px",
          overflow: "hidden",
        }}
      >
        {/* Transcript Panel */}
        <div
          style={{
            background: "#1e293b",
            borderRadius: "18px",
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#38bdf8",
            }}
          >
            🎤 Live Transcript
          </h2>

          <div
            style={{
              marginTop: "20px",
              lineHeight: 1.8,
              fontSize: "18px",
              color: "#f8fafc",
              whiteSpace: "pre-wrap",
            }}
          >
            {liveTranscript ||
              "Start speaking to see your transcript in real-time..."}
          </div>
        </div>

        {/* Assistant Panel */}
        <div
          style={{
            background: "#1e293b",
            borderRadius: "18px",
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#22c55e",
            }}
          >
            🤖 AI Interview Coach
          </h2>

          {suggestions.length === 0 ? (
            <div
              style={{
                color: "#94a3b8",
                marginTop: "20px",
              }}
            >
              AI suggestions will appear here...
            </div>
          ) : (
            suggestions.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#0f172a",
                  marginTop: "16px",
                  padding: "16px",
                  borderRadius: "12px",
                  border:
                    "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <ReactMarkdown>
                  {item}
                </ReactMarkdown>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "25px",
          background: "#111827",
          borderTop: "1px solid #1e293b",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isRecording ? (
          <button
            onClick={startRecording}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontSize: "36px",
              color: "white",
              background:
                "linear-gradient(135deg,#22c55e,#16a34a)",
              boxShadow:
                "0 0 35px rgba(34,197,94,0.45)",
            }}
          >
            🎤
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontSize: "36px",
              color: "white",
              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",
              boxShadow:
                "0 0 35px rgba(239,68,68,0.45)",
            }}
          >
            ⏹
          </button>
        )}
      </div>
    </div>
  );
}