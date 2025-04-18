// Element refs
    const provider = document.getElementById('provider');
    const ollamaFields = document.getElementById('ollamaFields');
    const geminiFields = document.getElementById('geminiFields');
    const geminiKeyInput = document.getElementById('geminiKey');
    const ollamaUrlInput = document.getElementById('ollamaUrl');
    const refreshModelsBtn = document.getElementById('refreshModels');
    const ollamaModelSelect = document.getElementById('ollamaModel');
    const temperatureInput = document.getElementById('temperature');
    const topPInput = document.getElementById('topP');
    const tempValSpan = document.getElementById('tempVal');
    const topPValSpan = document.getElementById('topPVal');
    const templateSelect = document.getElementById('templateSelect');
    const pinnedList = document.getElementById('pinnedList');
    const userPrompt = document.getElementById('userPrompt');
    const inputTokensSpan = document.getElementById('inputTokens');
    const refineBtn = document.getElementById('refineBtn');
    const outputBox = document.getElementById('outputBox');
    const outputTokensSpan = document.getElementById('outputTokens');
    const copyBtn = document.getElementById('copyBtn');
    const pinOutputBtn = document.getElementById('pinOutputBtn');
    const copyToastEl = document.getElementById('copyToast');
    const pinToastEl = document.getElementById('pinToast');
    const copyToast = new bootstrap.Toast(copyToastEl);
    const pinToast = new bootstrap.Toast(pinToastEl);

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) root.setAttribute('data-bs-theme', savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.setAttribute('data-bs-theme', 'dark');
    }
    themeToggle.addEventListener('click', () => {
      const newTheme = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });

    // Provider toggle
    provider.addEventListener('change', () => {
      const isGem = provider.value === 'gemini';
      geminiFields.classList.toggle('d-none', !isGem);
      ollamaFields.classList.toggle('d-none', isGem);
      if (!isGem) fetchModels();
      updateLayoutWidths();
    });

    // Layout width adjust helper
    function updateLayoutWidths() {
      const leftW = document.querySelector('.input-panel').offsetWidth;
      document.querySelector('.output-panel').style.width = `calc(100% - ${leftW}px)`;
    }

    // Refresh Ollama models
    async function fetchModels() {
      const url = ollamaUrlInput.value.trim();
      try {
        const res = await fetch(`${url}/api/tags`);
        const data = await res.json();
        ollamaModelSelect.innerHTML = data.models
          .map(m => `<option>${m.name}</option>`)
          .join('');
      } catch {
        alert('Failed to fetch Ollama models');
      }
    }
    refreshModelsBtn.addEventListener('click', fetchModels);

    // Load encrypted Gemini key
    const encryptedKey = localStorage.getItem('encryptedGeminiKey');
    const skipGeminiSave = localStorage.getItem('geminiKeySkipReminder') === 'true';
    if (encryptedKey) {
      const pass = prompt('Enter passphrase to decrypt your Gemini API key:');
      let decrypted = '';
      try {
        decrypted = CryptoJS.AES.decrypt(encryptedKey, pass).toString(CryptoJS.enc.Utf8);
      } catch (e) {
        decrypted = '';
      }
      if (!decrypted) {
        alert('Invalid Gemini key passphrase');
        // clear it so we don’t keep prompting forever
        localStorage.removeItem('encryptedGeminiKey');
      } else {
        geminiKeyInput.value = decrypted;
      }
    }

    // Token counting
    function countTokens(text) {
      return Math.ceil(text.trim().split(/\s+/).length * 1.33);
    }
    function updateInputTokens() {
      inputTokensSpan.textContent = countTokens(userPrompt.value);
    }
    function updateOutputTokens() {
      outputTokensSpan.textContent = countTokens(outputBox.textContent);
    }
    userPrompt.addEventListener('input', updateInputTokens);

    // Model settings display
    temperatureInput.addEventListener('input', () => {
      tempValSpan.textContent = temperatureInput.value;
    });
    topPInput.addEventListener('input', () => {
      topPValSpan.textContent = topPInput.value;
    });

    // Templates
    templateSelect.addEventListener('change', () => {
      if (templateSelect.value) {
        userPrompt.value = templateSelect.value;
        updateInputTokens();
      }
    });

    // Pin the current input idea
    pinOutputBtn.addEventListener('click', () => {
        const idea = userPrompt.value.trim();
        if (!idea) return;
        pinned.unshift(idea);
        localStorage.setItem('i2p-pinned', JSON.stringify(pinned));
        renderPinned();
        pinToast.show();
    });

    // Helpers to always read/write the same array
    function getPinned() {
    return JSON.parse(localStorage.getItem('i2p-pinned') || '[]');
    }
    function setPinned(arr) {
    localStorage.setItem('i2p-pinned', JSON.stringify(arr));
    }

    // Render “Pinned Ideas” as badges with a bulb icon + close button
    function renderPinned() {
    const pinned = getPinned();
    pinnedList.innerHTML = '';
    pinned.forEach((fullText, i) => {
        const display = fullText.length > 15
        ? fullText.slice(0, 15) + '…'
        : fullText;

        // Badge container
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary d-inline-flex align-items-center me-2 mb-2';
        badge.style.cursor = 'pointer';
        badge.title = fullText;
        badge.onclick = () => {
        userPrompt.value = fullText;
        updateInputTokens();
        };

        // Bulb icon
        const bulb = document.createElement('i');
        bulb.className = 'bi bi-lightbulb-fill me-1';
        badge.appendChild(bulb);

        // Text
        const txt = document.createElement('span');
        txt.textContent = display;
        badge.appendChild(txt);

        // Close button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-close btn-close-white btn-sm ms-2';
        removeBtn.setAttribute('aria-label', 'Remove');
        removeBtn.onclick = e => {
        e.stopPropagation();
        const arr = getPinned();
        arr.splice(i, 1);
        setPinned(arr);
        renderPinned();
        };
        badge.appendChild(removeBtn);

        pinnedList.appendChild(badge);
    });
    }

    // Pin the current idea (reads latest state, writes updated state)
    pinOutputBtn.addEventListener('click', () => {
    const idea = userPrompt.value.trim();
    if (!idea) return;
    const arr = getPinned();
    arr.unshift(idea);
    setPinned(arr);
    renderPinned();
    pinToast.show();
    });

    // Initial render
    renderPinned();


    document.addEventListener('click', e => {
      if (e.target.closest('.load-pin')) {
        const i = e.target.closest('.load-pin').dataset.idx;
        userPrompt.value = pinned[i];
        updateInputTokens();
      }
      if (e.target.closest('.remove-pin')) {
        const i = e.target.closest('.remove-pin').dataset.idx;
        pinned.splice(i, 1);
        localStorage.setItem('i2p-pinned', JSON.stringify(pinned));
        renderPinned();
      }
    });

    // Refine prompt
    refineBtn.addEventListener('click', async () => {
      outputBox.textContent = '';
      updateOutputTokens();
      pinOutputBtn.disabled = true;

      // Show loading
      const ico = refineBtn.querySelector('i');
      ico.className = 'bi bi-arrow-repeat spin';
      refineBtn.disabled = true;
      refineBtn.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> Loading...`;

      const idea = userPrompt.value.trim();
      const systemPrompt = `Rewrite the user’s idea as a clear, complete prompt a large‑language model can act on. Keep intent, add context, specify role, format, constraints. Respond with the prompt only.`;

      const temp = parseFloat(temperatureInput.value);
      const topP = parseFloat(topPInput.value);

      try {
        let result = '';
        if (provider.value === 'gemini') {
          const key = geminiKeyInput.value.trim();
          if (!key) throw new Error('Gemini API key required');
          if (!encryptedKey && !skipGeminiSave && confirm('Save Gemini API key to browser?')) {
            const pass = prompt('Create passphrase to encrypt your Gemini key (remember it!)');
            const cipher = CryptoJS.AES.encrypt(key, pass).toString();
            localStorage.setItem('encryptedGeminiKey', cipher);
            localStorage.setItem('geminiKeySkipReminder', 'true');
          } else if (!encryptedKey && !skipGeminiSave) {
            localStorage.setItem('geminiKeySkipReminder', 'true');
          }
          const url =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              generationConfig: { temperature: temp, topP },
              contents: [{ parts: [{ text: systemPrompt }, { text: idea }] }]
            })
          });
          const data = await res.json();
          result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          const baseUrl = ollamaUrlInput.value.trim();
          const model = ollamaModelSelect.value;
          const res = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model,
              prompt: `${systemPrompt}\n\n${idea}`,
              stream: false,
              temperature: temp,
              top_p: topP
            })
          });
          const data = await res.json();
          result = data.response || '';
        }

        outputBox.textContent = result;
        updateOutputTokens();
        pinOutputBtn.disabled = false;
      } catch (err) {
        outputBox.textContent = `Error: ${err.message}`;
        updateOutputTokens();
      } finally {
        // Reset button
        refineBtn.disabled = false;
        refineBtn.innerHTML = `<i class="bi bi-stars"></i> Refine Prompt`;
        updateLayoutWidths();
      }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(outputBox.textContent);
      copyToast.show();
    });

    // Pin output
    pinOutputBtn.addEventListener('click', () => {
      const text = outputBox.textContent.trim();
      if (!text) return;
      pinned.unshift(text);
      localStorage.setItem('i2p-pinned', JSON.stringify(pinned));
      renderPinned();
      pinToast.show();
    });

    // Initial setup
    provider.dispatchEvent(new Event('change'));
    if (provider.value === 'ollama') fetchModels();
    updateInputTokens();
    updateLayoutWidths();
