const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const buildVersion = "20260521-fullbook-001";

const chapters = [
  { id: "01_chapter1", title: "Chapter 1. AI, LLM, 바이브코딩", path: "manuscript/01_chapter1_current.md" },
  { id: "02_chapter2", title: "Chapter 2. 이미지 하나로 웹사이트 만들고 배포", path: "manuscript/02_chapter2_current.md" },
  { id: "03_chapter3", title: "Chapter 3. 타로앱 만들기", path: "manuscript/03_chapter3_current.md" },
  { id: "04_chapter4", title: "Chapter 4. 부록", path: "manuscript/04_chapter4_current.md" }
];

const promptFiles = [
  "prompts/first-site.md",
  "prompts/tarot-main.md",
  "prompts/tarot-topic.md",
  "prompts/tarot-question.md",
  "prompts/tarot-spread.md",
  "prompts/tarot-result.md",
  "prompts/repair-prompts.md"
];

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

function loadPrompts() {
  return Object.assign({}, ...promptFiles.map((filePath) => {
    const markdown = fs.readFileSync(path.join(root, filePath), "utf8");
    return parsePromptMarkdown(markdown, filePath);
  }));
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
        <button class="prompt-card__copy" type="button" data-copy-value="${escapeHtml(prompt.full)}">복사하기</button>
      </div>
      <pre class="prompt-card__preview">${escapeHtml(prompt.preview)}</pre>
      <button class="prompt-card__toggle" type="button">전체 보기</button>
      <pre class="prompt-card__full" hidden>${escapeHtml(prompt.full)}</pre>
      <a class="prompt-card__epub-link" href="../${escapeHtml(prompt.source)}?v=${buildVersion}">프롬프트 전문 보기</a>
    </section>
  `;
}

function imageFrame(alt, src) {
  const cleanSrc = src.replace("../webbook/", "./");
  const caption = alt.replace(/^이미지 자리:\s*/, "").trim();

  return `
    <figure class="image-frame" data-image-src="${escapeHtml(cleanSrc)}">
      <img src="${escapeHtml(cleanSrc)}?v=${buildVersion}" alt="${escapeHtml(caption)}" loading="lazy">
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

function cleanLegacyTitle(text) {
  return text
    .replace(/^Chapter\s+\d+\.\s*/i, "")
    .replace(/^부록\.\s*/, "");
}

function markdownToHtml(markdown, prompts, chapterTitle) {
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
      const title = headingMatch[2].trim();
      if (level === 1 && title === chapterTitle) {
        continue;
      }
      if (level === 1) {
        html.push(`<h2>${inlineMarkdown(cleanLegacyTitle(title))}</h2>`);
        continue;
      }
      html.push(`<h${level}>${inlineMarkdown(title)}</h${level}>`);
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

function renderChapter(chapter, prompts) {
  const markdown = fs.readFileSync(path.join(root, chapter.path), "utf8");
  return `
    <section id="chapter-${chapter.id}" class="chapter" data-chapter="${escapeHtml(chapter.id)}">
      <h1>${escapeHtml(chapter.title)}</h1>
      ${markdownToHtml(markdown, prompts, chapter.title)}
    </section>
  `;
}

const prompts = loadPrompts();
const chapterHtml = chapters.map((chapter) => renderChapter(chapter, prompts)).join("\n");
const navHtml = chapters.map((chapter) => `<a href="#chapter-${escapeHtml(chapter.id)}">${escapeHtml(chapter.title)}</a>`).join("\n");

const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>보면서 따라 하는 바이브코딩 입문 - 전체 스크롤판</title>
    <link rel="stylesheet" href="./assets/book.css?v=${buildVersion}">
  </head>
  <body>
    <!-- build: ${buildVersion} -->
    <a class="skip-link" href="#book-content">본문으로 바로가기</a>
    <div class="app-shell">
      <aside class="book-sidebar" aria-label="전자책 목차">
        <div class="brand-block">
          <p class="series-label">바이브코딩</p>
          <h1>GPT 입문서</h1>
          <p>전체 스크롤판</p>
        </div>
        <nav id="chapter-nav" class="chapter-nav">${navHtml}</nav>
      </aside>

      <main class="book-main">
        <header class="book-header">
          <div>
            <p class="eyebrow">반응형 전자책</p>
            <h2>보면서 따라 하는 바이브코딩 입문</h2>
            <p>전체 본문이 한 HTML 안에 들어간 스크롤 확인본입니다.</p>
          </div>
          <div class="build-badge" aria-label="빌드 번호">버전 ${buildVersion}</div>
        </header>

        <section class="reader-note" aria-label="읽기 안내">
          <strong>읽기 안내</strong>
          <span>위에서 아래로 계속 스크롤하면서 실제 책처럼 읽습니다. 프롬프트는 3줄만 보고 복사하기 버튼으로 전문을 복사합니다.</span>
        </section>

        <article id="book-content" class="book-content">
${chapterHtml}
        </article>

        <footer class="book-footer">
          <span>바이브코딩 GPT 입문서</span>
          <span>build ${buildVersion}</span>
        </footer>
      </main>
    </div>

    <script>
      document.addEventListener("click", async (event) => {
        const copyButton = event.target.closest("[data-copy-value]");
        const toggleButton = event.target.closest(".prompt-card__toggle");

        if (copyButton) {
          const value = copyButton.dataset.copyValue || "";
          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(value);
            } else {
              const textarea = document.createElement("textarea");
              textarea.value = value;
              textarea.setAttribute("readonly", "");
              textarea.style.position = "fixed";
              textarea.style.top = "-1000px";
              textarea.style.left = "-1000px";
              document.body.appendChild(textarea);
              textarea.focus();
              textarea.select();
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
          const full = card && card.querySelector(".prompt-card__full");
          if (!full) return;
          const willOpen = full.hasAttribute("hidden");
          full.toggleAttribute("hidden", !willOpen);
          toggleButton.textContent = willOpen ? "접기" : "전체 보기";
        }
      });
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(root, "webbook", "full.html"), html);
console.log(`Generated webbook/full.html (${Buffer.byteLength(html)} bytes)`);
