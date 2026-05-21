const BUILD_VERSION = "20260521-ebook-001";

const CHAPTERS = [
  { id: "01_chapter1", title: "Chapter 1. AI, LLM, 바이브코딩", path: "../manuscript/01_chapter1_current.md" },
  { id: "02_chapter2", title: "Chapter 2. 이미지 하나로 웹사이트 만들고 배포", path: "../manuscript/02_chapter2_current.md" },
  { id: "03_chapter3", title: "Chapter 3. 타로앱 만들기", path: "../manuscript/03_chapter3_current.md" },
  { id: "04_chapter4", title: "Chapter 4. 부록", path: "../manuscript/04_chapter4_current.md" }
];

const contentEl = document.querySelector("#book-content");
const navEl = document.querySelector("#chapter-nav");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

async function fetchText(path) {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${path}${separator}v=${BUILD_VERSION}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다.`);
  }
  return response.text();
}

function parsePromptMarkdown(markdown, filePath) {
  const prompts = {};
  const sections = markdown.split(/^## /m).slice(1);

  for (const section of sections) {
    const id = section.split("\n", 1)[0].trim();
    const previewMatch = section.match(/### 본문 3줄 미리보기\s+```text\s+([\s\S]*?)\s+```/);
    const fullMatch = section.match(/### 복사용 전문\s+```text\s+([\s\S]*?)\s+```/);
    const locationMatch = section.match(/### 사용 위치\s+([\s\S]*)$/);

    if (!id || !previewMatch || !fullMatch) continue;

    prompts[id] = {
      id,
      preview: previewMatch[1].trim(),
      full: fullMatch[1].trim(),
      source: filePath,
      location: locationMatch ? locationMatch[1].trim() : ""
    };
  }

  return prompts;
}

async function loadPrompts() {
  const config = window.VIBE_PROMPT_CONFIG || { files: [] };
  const promptEntries = await Promise.all(config.files.map(async (filePath) => {
    const markdown = await fetchText(filePath);
    return parsePromptMarkdown(markdown, filePath);
  }));

  return Object.assign({}, ...promptEntries);
}

function renderPromptCard(lines, prompts) {
  const idLine = lines.find((line) => line.includes("프롬프트 박스:")) || "";
  const id = idLine.split("프롬프트 박스:")[1]?.trim();
  const prompt = prompts[id];

  if (!id) return "";

  if (!prompt) {
    return `
      <section class="prompt-card" data-prompt-id="${escapeHtml(id)}">
        <div class="prompt-card__header">
          <h3 class="prompt-card__title">${escapeHtml(id)}</h3>
        </div>
        <p>프롬프트 원문을 찾지 못했습니다.</p>
      </section>
    `;
  }

  return `
    <section class="prompt-card" data-prompt-id="${escapeHtml(id)}">
      <div class="prompt-card__header">
        <h3 class="prompt-card__title">${escapeHtml(id)}</h3>
        <button class="prompt-card__copy" type="button" data-copy-prompt="${escapeHtml(id)}">복사하기</button>
      </div>
      <pre class="prompt-card__preview">${escapeHtml(prompt.preview)}</pre>
      <button class="prompt-card__toggle" type="button" data-toggle-prompt="${escapeHtml(id)}">전체 보기</button>
      <pre class="prompt-card__full" hidden>${escapeHtml(prompt.full)}</pre>
      <a class="prompt-card__epub-link" href="${escapeHtml(prompt.source)}?v=${BUILD_VERSION}">프롬프트 전문 보기</a>
    </section>
  `;
}

function imageFrame(alt, src) {
  const cleanSrc = src.replace("../webbook/", "./");
  const fileName = cleanSrc.split("/").pop();
  const caption = alt.replace(/^이미지 자리:\s*/, "").trim();

  return `
    <figure class="image-frame" data-image-src="${escapeHtml(cleanSrc)}">
      <div class="image-placeholder">
        <strong>이미지 준비 중</strong>
        <span>${escapeHtml(caption)}</span>
        <code>${escapeHtml(fileName)}</code>
      </div>
      <figcaption>그림. ${escapeHtml(caption)}</figcaption>
    </figure>
  `;
}

function flushParagraph(paragraphLines, html) {
  if (!paragraphLines.length) return;
  html.push(`<p>${paragraphLines.map(inlineMarkdown).join("<br>")}</p>`);
  paragraphLines.length = 0;
}

function flushList(listItems, html) {
  if (!listItems.length) return;
  html.push("<ul>");
  for (const item of listItems) {
    html.push(`<li>${inlineMarkdown(item)}</li>`);
  }
  html.push("</ul>");
  listItems.length = 0;
}

function markdownToHtml(markdown, prompts) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  const paragraph = [];
  const listItems = [];
  let inFence = false;
  let fenceLines = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inFence) {
        html.push(`<pre><code>${escapeHtml(fenceLines.join("\n"))}</code></pre>`);
        fenceLines = [];
        inFence = false;
      } else {
        flushParagraph(paragraph, html);
        flushList(listItems, html);
        inFence = true;
      }
      continue;
    }

    if (inFence) {
      fenceLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      continue;
    }

    const promptLines = [];
    if (line.startsWith("> ") && line.includes("프롬프트 박스:")) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      while (i < lines.length && lines[i].startsWith("> ")) {
        promptLines.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      i -= 1;
      html.push(renderPromptCard(promptLines, prompts));
      continue;
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      html.push(imageFrame(imageMatch[1], imageMatch[2]));
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^-\s+(.*)$/);
    if (listMatch) {
      flushParagraph(paragraph, html);
      listItems.push(listMatch[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph(paragraph, html);
  flushList(listItems, html);
  return html.join("\n");
}

function buildNavigation() {
  navEl.innerHTML = CHAPTERS.map((chapter) => (
    `<a href="#chapter-${chapter.id}">${escapeHtml(chapter.title)}</a>`
  )).join("");
}

async function hydrateImages() {
  const frames = Array.from(document.querySelectorAll(".image-frame"));
  await Promise.all(frames.map((frame) => new Promise((resolve) => {
    const src = frame.dataset.imageSrc;
    const image = new Image();
    image.onload = () => {
      frame.querySelector(".image-placeholder")?.remove();
      image.alt = frame.querySelector("figcaption")?.textContent || "";
      image.src = `${src}?v=${BUILD_VERSION}`;
      frame.prepend(image);
      resolve();
    };
    image.onerror = () => resolve();
    image.src = `${src}?v=${BUILD_VERSION}`;
  })));
}

function bindPromptButtons(prompts) {
  document.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-copy-prompt]");
    const toggleButton = event.target.closest("[data-toggle-prompt]");

    if (copyButton) {
      const id = copyButton.dataset.copyPrompt;
      const prompt = prompts[id];
      if (!prompt) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(prompt.full);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = prompt.full;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.top = "-1000px";
          textarea.style.left = "-1000px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          textarea.setSelectionRange(0, textarea.value.length);
          document.execCommand("copy");
          textarea.remove();
        }
        copyButton.textContent = "복사됨";
        copyButton.classList.add("is-copied");
        window.setTimeout(() => {
          copyButton.textContent = "복사하기";
          copyButton.classList.remove("is-copied");
        }, 1500);
      } catch {
        copyButton.textContent = "직접 복사";
      }
    }

    if (toggleButton) {
      const card = toggleButton.closest(".prompt-card");
      const full = card?.querySelector(".prompt-card__full");
      if (!full) return;
      const willOpen = full.hasAttribute("hidden");
      full.toggleAttribute("hidden", !willOpen);
      toggleButton.textContent = willOpen ? "접기" : "전체 보기";
    }
  });
}

async function init() {
  buildNavigation();

  try {
    const prompts = await loadPrompts();
    const chapters = await Promise.all(CHAPTERS.map(async (chapter) => {
      const markdown = await fetchText(chapter.path);
      return `
        <section id="chapter-${chapter.id}" class="chapter" data-chapter="${chapter.id}">
          ${markdownToHtml(markdown, prompts)}
        </section>
      `;
    }));

    contentEl.innerHTML = chapters.join("\n");
    bindPromptButtons(prompts);
    await hydrateImages();
  } catch (error) {
    contentEl.innerHTML = `<div class="error-box">${escapeHtml(error.message)}</div>`;
  }
}

init();
