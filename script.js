const provider = document.getElementById("provider");
const ollamaFields = document.getElementById("ollamaFields");
const geminiFields = document.getElementById("geminiFields");
const geminiKeyInput = document.getElementById("geminiKey");
const ollamaModelSelect = document.getElementById("ollamaModel");

const outputBox = document.getElementById("outputBox");
const refineBtn = document.getElementById("refineBtn");
const copyBtn = document.getElementById("copyBtn");
const toastEl = document.getElementById("copyToast");

// Load saved Gemini key
const savedKey = localStorage.getItem("geminiKey");
if (savedKey) geminiKeyInput.value = savedKey;

provider.addEventListener("change", () => {
  const isGemini = provider.value === "gemini";
  geminiFields.classList.toggle("d-none", !isGemini);
  ollamaFields.classList.toggle("d-none", isGemini);
});

document.getElementById("refreshModels").addEventListener("click", async () => {
  const url = document.getElementById("ollamaUrl").value.trim();
  try {
    const res = await fetch(`${url}/api/tags`);
    const data = await res.json();
    ollamaModelSelect.innerHTML = data.models
      .map((m) => `<option value="${m.name}">${m.name}</option>`)
      .join("");
  } catch (err) {
    alert("Failed to fetch models.");
  }
});

refineBtn.addEventListener("click", async () => {
  outputBox.textContent = "";
  const prompt = document.getElementById("userPrompt").value.trim();
  if (!prompt) return;

  const icon = refineBtn.querySelector("i");
  icon.className = "bi bi-arrow-repeat spin";
  refineBtn.disabled = true;
  refineBtn.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> Loading...`;

  const systemPrompt =
    "Rewrite the user’s idea as a clear, complete prompt a large‑language model can act on. Keep intent, add context, specify role, format, constraints. Respond with the prompt only.";

  try {
    let finalText = "";
    if (provider.value === "gemini") {
      const key = geminiKeyInput.value.trim();
      if (!key) throw new Error("API key required.");
      if (!savedKey && confirm("Save Gemini API key to browser?")) {
        localStorage.setItem("geminiKey", key);
      }

      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        key;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }, { text: prompt }],
            },
          ],
        }),
      });
      const data = await res.json();
      finalText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      const url = document.getElementById("ollamaUrl").value.trim();
      const model = ollamaModelSelect.value;
      const res = await fetch(`${url}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: `${systemPrompt}\n\n${prompt}`,
          stream: false,
        }),
      });
      const data = await res.json();
      finalText = data.response || "";
    }

    outputBox.textContent = finalText;
  } catch (e) {
    outputBox.textContent = "Error: " + e.message;
  } finally {
    refineBtn.disabled = false;
    refineBtn.innerHTML = `<i class="bi bi-stars"></i> Refine Prompt`;
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputBox.textContent);
  new bootstrap.Toast(toastEl).show();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  const root = document.documentElement;
  const newTheme =
    root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Load models on page load if Ollama is default
if (provider.value === "ollama") {
  document.getElementById("refreshModels").click();
}

//PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch((err) => console.error('Service Worker registration failed:', err));
  }
  