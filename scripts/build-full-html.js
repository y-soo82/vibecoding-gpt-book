const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const buildVersion = "20260523-chapter1-ai-001";

const chapters = [
  { id: "01_chapter1", title: "Chapter 1. AI, LLM, AI 서비스, 바이브코딩 쉽게 이해하기", path: "manuscript/01_chapter1_current.md", output: "chapter1.html" },
  { id: "02_chapter2", title: "Chapter 2. 이미지 하나로 웹사이트 만들고 배포", path: "manuscript/02_chapter2_current.md", output: "chapter2.html" },
  { id: "03_chapter3", title: "Chapter 3. 타로앱 만들기", path: "manuscript/03_chapter3_current.md", output: "chapter3.html" },
  { id: "04_chapter4", title: "Chapter 4. 부록", path: "manuscript/04_chapter4_current.md", output: "chapter4.html" }
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
  const idLine = lines.find((line) => /프롬프트(?:\(prompt\))? 박스:/.test(line)) || "";
  const id = idLine.split(/프롬프트(?:\(prompt\))? 박스:/)[1]?.trim();
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

function flushTable(tableRows, html) {
  if (!tableRows.length) return;
  const rows = tableRows
    .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()))
    .filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell)));

  if (!rows.length) {
    tableRows.length = 0;
    return;
  }

  const [header, ...bodyRows] = rows;
  html.push('<table class="book-table">');
  html.push("<thead><tr>");
  for (const cell of header) {
    html.push(`<th>${inlineMarkdown(cell)}</th>`);
  }
  html.push("</tr></thead>");
  html.push("<tbody>");
  for (const row of bodyRows) {
    html.push("<tr>");
    for (const cell of row) {
      html.push(`<td>${inlineMarkdown(cell)}</td>`);
    }
    html.push("</tr>");
  }
  html.push("</tbody></table>");
  tableRows.length = 0;
}

function cleanLegacyTitle(text) {
  return text
    .replace(/^Chapter\s+\d+\.\s*/i, "")
    .replace(/^부록\.\s*/, "");
}

function nextPageHeading(level, title, pageState) {
  pageState.number += 1;
  const pageId = `page-${String(pageState.number).padStart(3, "0")}`;
  const pageLabel = `P${String(pageState.number).padStart(3, "0")}`;

  return `
    <div class="page-heading" id="${pageId}">
      <a class="page-number" href="#${pageId}" aria-label="${pageLabel}">${pageLabel}</a>
      <h${level}>${inlineMarkdown(title)}</h${level}>
    </div>
  `;
}

function markdownToHtml(markdown, prompts, chapterTitle, pageState) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  const paragraph = [];
  const listItems = [];
  const tableRows = [];
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
        flushTable(tableRows, html);
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
      flushTable(tableRows, html);
      continue;
    }

    if (/^\|.+\|$/.test(line.trim())) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      tableRows.push(line);
      continue;
    }

    const promptLines = [];
    if (line.startsWith("> ") && /프롬프트(?:\(prompt\))? 박스:/.test(line)) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      flushTable(tableRows, html);
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
      flushTable(tableRows, html);
      html.push(imageFrame(imageMatch[1], imageMatch[2]));
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      flushTable(tableRows, html);
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      if (level === 1 && title === chapterTitle) {
        continue;
      }
      if (level === 1) {
        html.push(nextPageHeading(2, cleanLegacyTitle(title), pageState));
        continue;
      }
      if (level === 2 || level === 3) {
        html.push(nextPageHeading(level, title, pageState));
        continue;
      }
      html.push(`<h${level}>${inlineMarkdown(title)}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^-\s+(.*)$/);
    if (listMatch) {
      flushParagraph(paragraph, html);
      flushTable(tableRows, html);
      listItems.push(listMatch[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph(paragraph, html);
  flushList(listItems, html);
  flushTable(tableRows, html);
  return html.join("\n");
}

function renderChapter(chapter, prompts, pageState) {
  const markdown = fs.readFileSync(path.join(root, chapter.path), "utf8");
  return `
    <section id="chapter-${chapter.id}" class="chapter" data-chapter="${escapeHtml(chapter.id)}">
      <h1>${escapeHtml(chapter.title)}</h1>
      ${markdownToHtml(markdown, prompts, chapter.title, pageState)}
    </section>
  `;
}

const prompts = loadPrompts();
const pageState = { number: 0 };
const renderedChapters = chapters.map((chapter) => ({
  ...chapter,
  html: renderChapter(chapter, prompts, pageState)
}));

function buildModeNav(activeOutput) {
  const modes = [
    { output: "index.html", title: "전체" },
    ...chapters.map((chapter, index) => ({ output: chapter.output, title: `Chapter ${index + 1}` }))
  ];

  return modes.map((mode) => {
    const active = mode.output === activeOutput ? " is-active" : "";
    return `<a class="${active.trim()}" href="./${escapeHtml(mode.output)}?v=${buildVersion}">${escapeHtml(mode.title)}</a>`;
  }).join("\n");
}

function buildChapterNav(activeOutput) {
  return chapters.map((chapter) => {
    const active = chapter.output === activeOutput ? " is-active" : "";
    const href = activeOutput === "index.html" || activeOutput === "full.html"
      ? `#chapter-${escapeHtml(chapter.id)}`
      : `./${escapeHtml(chapter.output)}?v=${buildVersion}`;
    return `<a class="${active.trim()}" href="${href}">${escapeHtml(chapter.title)}</a>`;
  }).join("\n");
}

function renderPage({ activeOutput, pageTitle, modeLabel, description, chapterHtml }) {
  const modeNavHtml = buildModeNav(activeOutput);
  const navHtml = buildChapterNav(activeOutput);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>${escapeHtml(pageTitle)}</title>
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
          <p>${escapeHtml(modeLabel)}</p>
        </div>
        <nav class="mode-nav" aria-label="보기 방식">${modeNavHtml}</nav>
        <nav id="chapter-nav" class="chapter-nav">${navHtml}</nav>
      </aside>

      <main class="book-main">
        <header class="book-header">
          <div>
            <p class="eyebrow">반응형 전자책</p>
            <h2>보면서 따라 하는 바이브코딩 입문</h2>
            <p>${escapeHtml(description)}</p>
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
}

const pages = [
  {
    activeOutput: "index.html",
    pageTitle: "보면서 따라 하는 바이브코딩 입문 - 전체 스크롤판",
    modeLabel: "전체 스크롤판",
    description: "Chapter 1부터 Chapter 4까지 한 HTML 안에 들어간 전체 확인본입니다.",
    chapterHtml: renderedChapters.map((chapter) => chapter.html).join("\n")
  },
  ...renderedChapters.map((chapter, index) => ({
    activeOutput: chapter.output,
    pageTitle: `보면서 따라 하는 바이브코딩 입문 - Chapter ${index + 1}`,
    modeLabel: `Chapter ${index + 1}`,
    description: `${chapter.title}만 따로 보는 챕터별 확인본입니다.`,
    chapterHtml: chapter.html
  }))
];

for (const page of pages) {
  const html = renderPage(page);
  fs.writeFileSync(path.join(root, "webbook", page.activeOutput), html);
  console.log(`Generated webbook/${page.activeOutput} (${Buffer.byteLength(html)} bytes)`);
}

const indexHtml = fs.readFileSync(path.join(root, "webbook", "index.html"), "utf8");
fs.writeFileSync(path.join(root, "webbook", "full.html"), indexHtml);
console.log(`Generated webbook/full.html (${Buffer.byteLength(indexHtml)} bytes, index alias)`);
