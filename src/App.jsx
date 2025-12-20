import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiGithubFill } from "react-icons/ri";

const API = import.meta.env.VITE_API;

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [activeFileId, setActiveFileId] = useState("");

  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const apiHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // --------------------------------------------------
  // Toast helper
  // --------------------------------------------------
  const showToast = (message, type = "success") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false }), 2500);
  };

  // --------------------------------------------------
  // Auth
  // --------------------------------------------------
  const signup = async () => {
    try {
      setIsLoading(true);
      setProcessingMessage("Creating account...");
      await axios.post(`${API}/signup`, { name, email, password });
      localStorage.setItem("name", name);
      showToast("Signup successful, please login");
      setMode("login");
    } catch (e) {
      showToast(e.response?.data?.message || "Signup failed", "error");
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setProcessingMessage("Logging in...");
      const res = await axios.post(`${API}/login`, { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      showToast("Logged in");
    } catch (e) {
      showToast(e.response?.data?.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setFiles([]);
    setAnswer("");
    showToast("Logged out");
  };

  // --------------------------------------------------
  // File operations
  // --------------------------------------------------
  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API}/files`, { headers: apiHeaders });
      setFiles(res.data || []);
    } catch(e) {
      if(e.response?.status === 401){
        logout();
        return;
      }
      showToast("Failed to load files", "error");
    }
  };

  const uploadFile = async () => {
    if (!file) return showToast("Select a file", "error");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setProcessingMessage("Uploading file...");
      await axios.post(`${API}/upload`, formData, { headers: apiHeaders });
      showToast("Upload complete");
      setFile(null);
      await fetchFiles();
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  const downloadFile = async (id) => {
    try {
      setIsLoading(true);
      setProcessingMessage("Preparing file...");

      const res = await axios.get(`${API}/files/${id}`, { headers: apiHeaders });

      if (res?.data?.url) {
        window.open(res.data.url, "_blank");
        showToast("File opened");
      } else {
        showToast("File URL missing", "error");
      }
    } catch (err) {
      console.error("Download error:", err.response?.data || err.message);
      showToast("Download failed", "error");
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  const deleteFile = async (id) => {
    try {
      setIsLoading(true);
      setProcessingMessage("Deleting file...");
      await axios.delete(`${API}/files/${id}`, { headers: apiHeaders });
      showToast("Delete complete");
      await fetchFiles();
      if (id === activeFileId) setActiveFileId("");
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  const processFile = (id, endpoint, doneMessage) => async () => {
    try {
      setIsLoading(true);
      setProcessingMessage(`${doneMessage} in progress...`);
      await axios.post(`${API}/${endpoint}/${id}`, {}, { headers: apiHeaders });
      showToast(`${doneMessage} complete`);
    } catch {
      showToast(`${doneMessage} failed`, "error");
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  // --------------------------------------------------
  // Ask AI
  // --------------------------------------------------
  const askAI = async () => {
    if (!activeFileId) return showToast("Select a file", "error");
    if (!question.trim()) return showToast("Ask a question", "error");

    try {
      setIsLoading(true);
      setProcessingMessage("Asking AI...");
      const res = await axios.post(
        `${API}/ask-docs`,
        { question, fileId: activeFileId },
        { headers: apiHeaders }
      );
      setAnswer(res.data.answer || "");
      showToast("Answer ready");
    } catch {
      showToast("AI failed", "error");
    } finally {
      setIsLoading(false);
      setProcessingMessage("");
    }
  };

  useEffect(() => {
    if (token) fetchFiles();
  }, [token]);

  // --------------------------------------------------
  // AUTH UI
  // --------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        {toast.show && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded text-white text-sm ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
          >
            {toast.message}
          </div>
        )}

        {/* Processing overlay */}
        {isLoading && processingMessage && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
            <div className="bg-white rounded p-4 text-sm shadow">
              <div className="font-medium mb-1">{processingMessage}</div>
              <div className="text-xs text-gray-500">Please wait...</div>
            </div>
          </div>
        )}

        <div className="w-full max-w-sm bg-white border rounded-lg p-6 shadow">
          <h1 className="text-xl font-semibold text-center mb-2">
            AI Knowledge Vault
          </h1>

          {/* Project intro at login/signup */}
          <p className="text-xs text-center text-gray-600 mb-3">
            A lightweight Hybrid RAG Knowledge Vault — upload documents or images,
            extract text automatically, create embeddings, and ask questions grounded in your data.
          </p>

          <p className="text-xxs text-center text-gray-400 mb-4">
            Secure: your files stay linked to your account. Fast: chunking + embeddings make retrieval precise.
          </p>

          <div className="flex mb-4">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 cursor-pointer text-sm border ${mode === m ? "bg-black text-white" : "bg-gray-200"
                  }`}
              >
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <input
              className="w-full mb-3 p-2 border rounded text-sm"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="w-full mb-3 p-2 border rounded text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-4 p-2 border rounded text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={mode === "login" ? login : signup}
            className="w-full py-2 cursor-pointer bg-black text-white rounded text-sm"
          >
            {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
          </button>

          {/* Small how-to hint */}
          <div className="mt-2 text-xs text-gray-500">
            Built for real-world intelligence — instantly query contracts, summarize research,
            power support knowledge bases, or turn personal notes into an AI assistant.
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN APP UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded text-white text-sm ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Processing overlay */}
      {isLoading && processingMessage && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded p-4 text-sm shadow">
            <div className="font-medium mb-1">{processingMessage}</div>
            <div className="text-xs text-gray-500">Working...</div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Welcome, {name || email}</h2>
          <p className="text-xs text-gray-500">Flow: Upload → Extract → Chunks → Embed → Ask AI</p>
        </div>
        <button onClick={logout} className="px-3 py-1 cursor-pointer border rounded text-sm hover:bg-gray-300">
          Logout
        </button>
      </div>

      {/* Highlight banner about the project */}
      <div className="max-w-5xl mx-auto mb-6 p-4 rounded-lg shadow-sm bg-linear-to-r from-white to-gray-50 border">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-black/90 flex items-center justify-center text-white text-lg font-bold">RAG</div>
          </div>
          <div>
            <div className="text-sm font-semibold">About this project</div>
            <div className="text-xs text-gray-600 mt-1">
              A hybrid RAG-powered knowledge vault that makes documents searchable and answerable.
              The pipeline:
              <strong> extract → chunk → embed → semantic search → AI answer</strong>.
              Answers are grounded in your data for accuracy and transparency.
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Quick start: Upload a file, run <span className="font-medium">Extract → Chunks → Embed</span>,
              select <span className="font-medium">Use for AI</span>, and ask your question.
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Left: Upload + File List */}
        <div>
          <div className="bg-white border rounded p-4 mb-4">
            <h3 className="font-medium mb-2">Upload File</h3>
            <input type="file" className="mb-3 text-sm cursor-pointer hover:bg-gray-200 mr-5" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadFile} className="px-4 py-2 bg-black text-white rounded text-sm cursor-pointer">
              Upload
            </button>
          </div>

          <div className="bg-white border rounded p-4">
            <h3 className="font-medium mb-2">Your Files</h3>
            {files.length === 0 && <div className="text-sm text-gray-500">No files yet</div>}
            {files.map((f) => (
              <div key={f._id} className="border rounded p-2 mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{f.fileName}</span>

                  {/* Download + Delete buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadFile(f._id)}
                      className="px-2 py-1 text-xs border rounded cursor-pointer"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => deleteFile(f._id)}
                      className="text-red-500 px-2 py-1 text-xs border rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={processFile(f._id, "process-file", "Extraction")}
                    className="px-2 py-1 text-xs bg-gray-200 rounded cursor-pointer"
                  >
                    Extract
                  </button>

                  <button
                    onClick={processFile(f._id, "create-chunks", "Chunk creation")}
                    className="px-2 py-1 text-xs bg-gray-200 rounded cursor-pointer"
                  >
                    Chunks
                  </button>

                  <button
                    onClick={processFile(f._id, "create-embeddings", "Embedding creation")}
                    className="px-2 py-1 text-xs bg-gray-200 rounded cursor-pointer"
                  >
                    Embed
                  </button>

                  <button
                    onClick={() => setActiveFileId(f._id)}
                    className={`px-2 py-1 text-xs rounded cursor-pointer ${activeFileId === f._id ? "bg-black text-white" : "bg-gray-200"}`}
                  >
                    Use for AI
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right: Ask AI */}
        <div>
          <div className="bg-white border rounded p-4 flex flex-col">
            <h3 className="font-medium mb-2">Ask AI</h3>

            <div className="text-xs text-gray-500 mb-2 font-bold">Selected file: {activeFileId ? files.find(f => f._id === activeFileId)?.fileName : 'None'}</div>

            <textarea rows={5} className="w-full border p-2 text-sm rounded mb-3" placeholder="Ask anything from the selected file..." value={question} onChange={(e) => setQuestion(e.target.value)} />

            <div className="flex gap-2">
              <button onClick={askAI} className="px-4 py-2 bg-black text-white rounded text-sm cursor-pointer">Ask AI</button>
              <button onClick={() => { setQuestion(''); setAnswer(''); }} className="px-4 py-2 border rounded text-sm cursor-pointer">Clear</button>
            </div>

            {answer && (
              <div className="mt-4 p-3 bg-white rounded border text-sm overflow-auto max-h-72 whitespace-pre-wrap leading-relaxed">
                {answer}
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              <div className="font-medium">RAG (quick)</div>
              <p className="text-xs">We retrieve relevant chunks from your documents using embeddings, then the LLM generates the answer grounded in those chunks — reduces hallucinations and keeps answers tied to your data.</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full mt-10 pb-6 text-center text-[11px] text-gray-500">
        <div className="flex justify-center items-center gap-2">
          <span>Built with ❤️ by</span>

          <a
            href="https://github.com/YashwantBhole"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-black font-medium hover:underline"
          >
            <RiGithubFill className="text-sm" />
            Yashwant Bhole
          </a>

          <span>· AI Knowledge Vault</span>
        </div>
      </footer>


    </div>
  );
}
