# 🌟 [Idea2Prompt](https://simkeyur.github.io/idea2prompt/) — Turn Ideas into Polished Prompts

Idea2Prompt is a beautifully designed, installable PWA that transforms rough ideas into precise prompts for LLMs. Powered by Gemini or Ollama, it’s fast, lightweight, and built for creators.

---

## ✨ Features

✅ **Two backend options**:  
• **Gemini (Google AI)** with runtime API key  
• **Ollama (Local or remote)** with model picker and refresh  

✅ **Prompt Refinement Engine**  
• Automatically enhances intent, adds context, specifies role and format  
• One-click magic wand UX 🪄  

✅ **Modern UI/UX**  
• Fullscreen layout with dark/light toggle  
• Drag-to-resize input/output panels  
• Mobile-optimized: vertical layout on phones  
• Bootstrap 5 + Bootstrap Icons  
• Toasts, tooltips, loading states, and scrollable output  

✅ **Copy-to-Clipboard**  
• Refined prompt is one click away from your clipboard  

✅ **Gemini Key Memory**  
• Prompted to store your key once — respects your choice  

✅ **Ollama Integration**  
• Set custom URL (e.g. via ngrok)  
• Refresh models instantly  

✅ **Installable PWA**  
• Works offline after first load  
• Add to Home Screen or Desktop  
• Custom magic wand icon and black-themed splash  

---

## 🚀 Getting Started

### 🔗 Live App  
👉 [https://simkeyur.github.io/idea2prompt/](https://simkeyur.github.io/idea2prompt/)

---

## 🛠 Setup Instructions

### 🧠 Gemini (Cloud)

1. Go to: [Google AI API Key](https://makersuite.google.com/app/apikey)
2. Paste it into the field (you’ll be asked once to store it)

---

### 💻 Ollama (Local/Remote)

1. Install [Ollama](https://ollama.com/)
2. Start a model:  
   ```bash
   ollama run llama3
   ```
3. Update the Base URL if using a remote tunnel like ngrok  
4. Click 🔁 to load available models

---

### 💾 Offline Usage

1. Open app once online
2. Click browser install prompt or Add to Home Screen
3. App works offline from next launch 🎉

---

## 📦 How to Deploy on GitHub Pages

1. Clone or fork this repo  
2. Push all files (`index.html`, `manifest.json`, `sw.js`, `README.md`, icon)  
3. Go to **Settings > Pages**, select `main` branch  
4. Live at: `https://simkeyur.github.io/idea2prompt/`

---

## 🧙 Icon Attribution

Magic wand icon © Generated with OpenAI (free for use)

---

## 🛡 Privacy

- No keys or data ever stored externally  
- Everything runs 100% client-side in your browser

---

Built with ❤️ and JavaScript.
