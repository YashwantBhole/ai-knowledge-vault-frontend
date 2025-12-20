# 📚 AI Knowledge Vault — Hybrid RAG System

> A **Hybrid Retrieval-Augmented Generation (RAG) Knowledge Vault** that lets users upload documents and images, extract text automatically, generate semantic embeddings, and ask intelligent questions grounded in their own data.

This project demonstrates **real-world AI system design**, combining MERN, OCR, vector search, and LLMs into a clean, scalable pipeline.

---

## 🚀 Features

- 🔐 **Secure Authentication** — Files and data are isolated per user
- 📄 **Multi-format Support** — PDF, DOCX, TXT, PNG, JPG
- 🧠 **Hybrid RAG Architecture**
  - Document-grounded answers
  - Optional fallback to general AI knowledge
- 🔍 **Semantic Search** — Vector-based similarity search using embeddings
- 🖼️ **Image OCR Support** — Extract text from scanned documents and images
- ✂️ **Intelligent Chunking** — Overlapping chunks preserve context
- 🤖 **AI Question Answering** — Answers generated using retrieved document context
- ⚡ **Fast Retrieval** — Optimized chunking + embeddings
- 🧩 **Auditable Results** — Answers tied back to document chunks

---

## 🖼️ Demo & Screenshots

### 📸 Screenshots
> Paste screenshots here (GitHub will auto-render images)

```md
![Upload Page](screenshots/upload.png)
![Search Results](screenshots/search.png)
![Ask Docs Answer](screenshots/ask-docs.png)


📁 Recommended folder: screenshots/

🎥 Demo Video

Paste demo video link (YouTube / Loom / Drive)

🎬 Demo Video: https://your-demo-video-link-here

🏗️ System Architecture
Upload File / Image
        ↓
Text Extraction (PDF Parse / OCR)
        ↓
Chunking (with overlap)
        ↓
Embeddings (Gemini)
        ↓
Vector Search (Cosine Similarity)
        ↓
LLM Answer (Grounded Context)


🧠 What is Hybrid RAG?

This project uses Hybrid Retrieval-Augmented Generation:

📌 Answers are primarily grounded in user-uploaded documents

🧠 If documents are incomplete, the AI may supplement with general knowledge

✅ Reduces hallucinations while remaining practical for learning use cases

🛠️ Tech Stack
Frontend

⚛️ React

🎨 Tailwind CSS

Backend

🟢 Node.js

🚂 Express.js

🍃 MongoDB + Mongoose

AI / ML

🧠 Google Gemini (Embeddings + Generation)

📐 Cosine Similarity (Vector Search)

File & Data Processing

📄 pdf-parse (PDF text extraction)

🖼️ Tesseract.js (OCR for images)

☁️ AWS SDK (S3-compatible storage — Backblaze B2)

Auth & Security

🔑 JWT Authentication

🔒 User-isolated data access

📡 API Workflow
1️⃣ Extract Text
POST /api/process-file/:id

2️⃣ Create Chunks
POST /api/create-chunks/:id

3️⃣ Generate Embeddings
POST /api/create-embeddings/:id

4️⃣ Semantic Search
POST /api/search-docs

5️⃣ Ask Questions (RAG)
POST /api/ask-docs

🧪 Example Use Cases

📑 Contract question answering

📚 Coding interview preparation

🔬 Research paper summarization

💬 Internal support knowledge base

🧠 Personal notes assistant

🖼️ Query scanned notes or images using OCR


▶️ Run Locally
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

📌 Why This Is Not a CRUD App

Implements real AI system architecture

Uses vector similarity search, not keyword matching

Handles OCR + unstructured data

Demonstrates production-style pipeline separation

Built with scalability and extensibility in mind

🔮 Future Improvements

Background job queue for embedding generation

Hybrid keyword + vector search

Source highlighting per answer

Streaming AI responses

Multi-file context aggregation

👨‍💻 Author

Yashwant Bhole
Designed & Developed with ❤️

⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub — it really helps!