const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const buildRoot = path.join(root, "epub", "build", "vibecoding-gpt-book");
const textDir = path.join(buildRoot, "OEBPS", "Text");
const styleDir = path.join(buildRoot, "OEBPS", "Styles");
const imageDir = path.join(buildRoot, "OEBPS", "Images");
const metaDir = path.join(buildRoot, "META-INF");

const chapters = [
  ["chapter1.xhtml", "Chapter 1. AI, LLM, 바이브코딩", "manuscript/01_chapter1_current.md"],
  ["chapter2.xhtml", "Chapter 2. 이미지 하나로 웹사이트 만들고 배포", "manuscript/02_chapter2_current.md"],
  ["chapter3.xhtml", "Chapter 3. 타로앱 만들기", "manuscript/03_chapter3_current.md"],
  ["chapter4.xhtml", "Chapter 4. 부록", "manuscript/04_chapter4_current.md"]
];

function cleanDir(target) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
}

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

function imageName(src) {
  return path.basename(src);
}

function markdownToXhtml(markdown, usedImages) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  const paragraph = [];
  const listItems = [];
  let inFence = false;
  let fenceLines = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    html.push(`<p>${paragraph.map(inlineMarkdown).join("<br />")}</p>`);
    paragraph.length = 0;
  }

  function flushList() {
    if (!listItems.length) return;
    html.push("<ul>");
    for (const item of listItems) html.push(`<li>${inlineMarkdown(item)}</li>`);
    html.push("</ul>");
    listItems.length = 0;
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inFence) {
        html.push(`<pre><code>${escapeHtml(fenceLines.join("\n"))}</code></pre>`);
        fenceLines = [];
        inFence = false;
      } else {
        flushParagraph();
        flushList();
        inFence = true;
      }
      continue;
    }

    if (inFence) {
      fenceLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      const alt = imageMatch[1].replace(/^이미지 자리:\s*/, "").trim();
      const src = imageMatch[2];
      const name = imageName(src);
      usedImages.add(name);
      html.push(`<figure><img src="../Images/${escapeHtml(name)}" alt="${escapeHtml(alt)}" /><figcaption>${escapeHtml(alt)}</figcaption></figure>`);
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      html.push(`<aside class="prompt-note">${inlineMarkdown(line.replace(/^>\s?/, ""))}</aside>`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^-\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  return html.join("\n");
}

function xhtmlPage(title, body) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" type="text/css" href="../Styles/book.css" />
</head>
<body>
  <section class="chapter">
${body}
  </section>
</body>
</html>
`;
}

cleanDir(buildRoot);
fs.mkdirSync(textDir, { recursive: true });
fs.mkdirSync(styleDir, { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(metaDir, { recursive: true });

fs.writeFileSync(path.join(buildRoot, "mimetype"), "application/epub+zip");
fs.writeFileSync(path.join(metaDir, "container.xml"), `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`);

const usedImages = new Set();
for (const [fileName, title, markdownPath] of chapters) {
  const markdown = fs.readFileSync(path.join(root, markdownPath), "utf8");
  fs.writeFileSync(path.join(textDir, fileName), xhtmlPage(title, markdownToXhtml(markdown, usedImages)));
}

for (const name of usedImages) {
  const source = path.join(root, "webbook", "images", name);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, path.join(imageDir, name));
  }
}

fs.writeFileSync(path.join(styleDir, "book.css"), `body { margin: 0; padding: 1.4em; color: #1f2933; font-family: sans-serif; line-height: 1.7; }
.chapter { max-width: 760px; margin: 0 auto; }
h1 { font-size: 1.8em; line-height: 1.25; border-bottom: 2px solid #dbeafe; padding-bottom: 0.4em; }
h2 { margin-top: 1.6em; font-size: 1.35em; }
p { margin: 0.8em 0; }
figure { margin: 1.4em 0; }
img { max-width: 100%; height: auto; border: 1px solid #e5e7eb; }
figcaption { margin-top: 0.4em; color: #667085; font-size: 0.9em; }
.prompt-note { margin: 0.5em 0; padding: 0.7em; border-left: 4px solid #2563eb; background: #eff6ff; }
code, pre { background: #f3f4f6; }
`);

const navItems = chapters.map(([fileName, title]) => `<li><a href="Text/${fileName}">${escapeHtml(title)}</a></li>`).join("\n");
fs.writeFileSync(path.join(buildRoot, "OEBPS", "nav.xhtml"), `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="ko" xml:lang="ko">
<head><meta charset="utf-8" /><title>목차</title></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>목차</h1>
    <ol>${navItems}</ol>
  </nav>
</body>
</html>
`);

const imageItems = Array.from(usedImages).map((name, index) => {
  const ext = path.extname(name).toLowerCase();
  const media = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  return `<item id="img${index + 1}" href="Images/${escapeHtml(name)}" media-type="${media}" />`;
}).join("\n    ");

const chapterItems = chapters.map(([fileName], index) => `<item id="chapter${index + 1}" href="Text/${fileName}" media-type="application/xhtml+xml" />`).join("\n    ");
const spineItems = chapters.map((_, index) => `<itemref idref="chapter${index + 1}" />`).join("\n    ");

fs.writeFileSync(path.join(buildRoot, "OEBPS", "content.opf"), `<?xml version="1.0" encoding="utf-8"?>
<package version="3.0" unique-identifier="bookid" xmlns="http://www.idpf.org/2007/opf">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:vibecoding-gpt-book-20260521</dc:identifier>
    <dc:title>보면서 따라 하는 바이브코딩 입문</dc:title>
    <dc:language>ko</dc:language>
    <dc:creator>y-soo82</dc:creator>
    <dc:description>ChatGPT 대화창을 따라 하며 첫 웹사이트와 타로 사이트를 만드는 바이브코딩 입문 전자책입니다.</dc:description>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="css" href="Styles/book.css" media-type="text/css" />
    ${chapterItems}
    ${imageItems}
  </manifest>
  <spine>
    ${spineItems}
  </spine>
</package>
`);

console.log(`EPUB build folder: ${buildRoot}`);
console.log(`Images copied: ${usedImages.size}`);
