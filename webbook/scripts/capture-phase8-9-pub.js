#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "../..");
const imagesDir = path.join(root, "webbook/images");
const outputDir = path.join(root, "webbook/output/playwright");
const reportsDir = path.join(root, "reports");
const placeholdersPath = path.join(reportsDir, "capture-placeholders.json");
const reportPath = path.join(reportsDir, "phase8-9-image-completion-report.md");
const buildVersion = "20260516-pub-001";
const preferredPort = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8"
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureDirs() {
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
}

function readPlaceholders() {
  return JSON.parse(fs.readFileSync(placeholdersPath, "utf8"));
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${preferredPort}`);
    let filePath = path.join(root, decodeURIComponent(url.pathname));

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve({ server: null, baseUrl: `http://127.0.0.1:${preferredPort}` });
        return;
      }
      throw error;
    });

    server.listen(preferredPort, "127.0.0.1", () => {
      resolve({ server, baseUrl: `http://127.0.0.1:${preferredPort}` });
    });
  });
}

function badgeStyle() {
  return `
    .phase-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 10;
      display: inline-flex;
      min-width: 26px;
      height: 22px;
      align-items: center;
      justify-content: center;
      padding: 0 7px;
      border: 1px solid rgba(255,255,255,0.86);
      border-radius: 999px;
      background: #1d5f59;
      color: #fff;
      box-shadow: 0 5px 16px rgba(0,0,0,0.16);
      font: 700 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }
  `;
}

function baseStyle(columns = 3) {
  return `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      padding: 34px;
      background: #f5f1ea;
      color: #28231f;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      position: relative;
      min-height: calc(100vh - 68px);
      padding: 34px;
      border: 1px solid #ded1c2;
      border-radius: 8px;
      background: #fffaf2;
      box-shadow: 0 22px 60px rgba(48, 39, 30, 0.14);
      overflow: hidden;
    }
    .eyebrow {
      margin: 0 0 10px;
      color: #226b63;
      font-weight: 900;
    }
    h1 {
      max-width: 900px;
      margin: 0;
      font-size: 42px;
      line-height: 1.16;
      letter-spacing: 0;
    }
    .lead {
      max-width: 760px;
      margin: 14px 0 0;
      color: #70665c;
      font-size: 18px;
      line-height: 1.65;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(${columns}, minmax(0, 1fr));
      gap: 16px;
      margin-top: 28px;
    }
    article, .panel {
      min-height: 150px;
      padding: 20px;
      border: 1px solid #ded1c2;
      border-radius: 8px;
      background: #fff;
    }
    article span, .step {
      display: inline-flex;
      margin-bottom: 12px;
      color: #b5584b;
      font-weight: 900;
      font-size: 14px;
    }
    h2, h3 {
      margin: 0 0 10px;
      font-size: 22px;
      line-height: 1.28;
      letter-spacing: 0;
    }
    p, li {
      margin: 0;
      color: #70665c;
      line-height: 1.65;
    }
    ul { margin: 0; padding-left: 20px; }
    ${badgeStyle()}
  `;
}

function cardHtml(cards) {
  return cards.map((card, index) => `
    <article>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(card.text)}</p>
    </article>
  `).join("");
}

async function setContentAndCapture(page, item, html, width = 1180, height = 760) {
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: path.join(imagesDir, item.filename), fullPage: false });
}

function boardDocument(item, title, lead, cards, columns = 3) {
  return `<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${baseStyle(columns)}</style>
      </head>
      <body>
        <main>
          <span class="phase-badge">${String(item.no).padStart(2, "0")}</span>
          <p class="eyebrow">바이브코딩 GPT 입문서</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="lead">${escapeHtml(lead)}</p>
          <section class="grid">${cardHtml(cards)}</section>
        </main>
      </body>
    </html>`;
}

function chatMockDocument(item, title, lead, messages, sideItems = []) {
  const messageHtml = messages.map((message) => `
    <div class="bubble ${message.role}">
      <strong>${message.role === "user" ? "나" : "ChatGPT"}</strong>
      <p>${escapeHtml(message.text)}</p>
    </div>
  `).join("");
  const sideHtml = sideItems.map((label) => `<button>${escapeHtml(label)}</button>`).join("");

  return `<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${baseStyle(2)}
          body { padding: 24px; background: #f7f7f4; }
          main {
            display: grid;
            grid-template-columns: 240px minmax(0, 1fr);
            gap: 18px;
            padding: 20px;
            background: #ffffff;
          }
          .sidebar {
            position: relative;
            padding: 18px;
            border: 1px solid #ded1c2;
            border-radius: 8px;
            background: #f5f1ea;
          }
          .sidebar h2 { font-size: 20px; }
          .sidebar button {
            display: block;
            width: 100%;
            min-height: 40px;
            margin-top: 10px;
            border: 1px solid #d5c7b8;
            border-radius: 8px;
            background: #fff;
            color: #28231f;
            text-align: left;
            font-weight: 700;
          }
          .chat {
            position: relative;
            display: grid;
            min-height: 610px;
            grid-template-rows: auto 1fr auto;
            gap: 16px;
          }
          .chat-header {
            padding: 16px;
            border: 1px solid #ded1c2;
            border-radius: 8px;
            background: #fffaf2;
          }
          .chat-header h1 { font-size: 30px; }
          .messages {
            display: grid;
            align-content: start;
            gap: 12px;
          }
          .bubble {
            max-width: 78%;
            padding: 14px 16px;
            border: 1px solid #ded1c2;
            border-radius: 8px;
            background: #fffaf2;
          }
          .bubble.user {
            justify-self: end;
            background: #eaf5f2;
            border-color: #b9d8d0;
          }
          .bubble strong {
            display: block;
            margin-bottom: 6px;
            color: #226b63;
          }
          .composer {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 10px;
            align-items: center;
            padding: 12px;
            border: 1px solid #cfc2b5;
            border-radius: 8px;
            background: #fff;
          }
          .input {
            min-height: 44px;
            padding: 12px 14px;
            border: 1px solid #ded1c2;
            border-radius: 8px;
            color: #70665c;
          }
          .send {
            min-width: 44px;
            min-height: 44px;
            border: 0;
            border-radius: 8px;
            background: #226b63;
            color: #fff;
            font-weight: 900;
          }
        </style>
      </head>
      <body>
        <main>
          <span class="phase-badge">${String(item.no).padStart(2, "0")}</span>
          <aside class="sidebar">
            <h2>ChatGPT</h2>
            ${sideHtml || "<button>새 채팅</button><button>프로젝트</button><button>설정</button>"}
          </aside>
          <section class="chat">
            <div class="chat-header">
              <p class="eyebrow">민감정보 없는 출판용 mock 화면</p>
              <h1>${escapeHtml(title)}</h1>
              <p class="lead">${escapeHtml(lead)}</p>
            </div>
            <div class="messages">${messageHtml}</div>
            <div class="composer">
              <div class="input">여기에 부탁할 내용을 적습니다.</div>
              <button class="send">↑</button>
            </div>
          </section>
        </main>
      </body>
    </html>`;
}

function githubMockDocument(item, title, lead, panels) {
  const panelHtml = panels.map((panel, index) => `
    <article>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h2>${escapeHtml(panel.title)}</h2>
      <p>${escapeHtml(panel.text)}</p>
    </article>
  `).join("");

  return `<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${baseStyle(3)}
          .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding: 14px 18px;
            border-radius: 8px;
            background: #24292f;
            color: #fff;
          }
          .topbar strong { font-size: 20px; }
          .topbar span { color: #d0d7de; }
          .repo-card {
            margin-top: 26px;
            padding: 22px;
            border: 1px solid #ded1c2;
            border-radius: 8px;
            background: #fff;
          }
          code {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 10px;
            border-radius: 6px;
            background: #f5f1ea;
            color: #226b63;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          }
        </style>
      </head>
      <body>
        <main>
          <span class="phase-badge">${String(item.no).padStart(2, "0")}</span>
          <div class="topbar">
            <strong>GitHub</strong>
            <span>출판용 예시 계정 · 개인정보 없음</span>
          </div>
          <p class="eyebrow">ChatGPT GitHub 연동 흐름</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="lead">${escapeHtml(lead)}</p>
          <section class="grid">${panelHtml}</section>
          <div class="repo-card">
            <h2>예시 주소</h2>
            <p>실제 계정, 이메일, 토큰, 개인 저장소 이름은 보여 주지 않습니다.</p>
            <code>https://example.github.io/my-first-site/?v=20260516-pub-001</code>
          </div>
        </main>
      </body>
    </html>`;
}

function cardsForItem(item) {
  const map = {
    "ch00_01_vibecoding_flow.png": [
      ["말로 부탁합니다", "ChatGPT 대화창에 만들고 싶은 결과를 편하게 적습니다."],
      ["결과를 봅니다", "브라우저 화면을 보며 마음에 드는 부분과 아쉬운 부분을 확인합니다."],
      ["다시 부탁합니다", "수정 요청을 이어 가며 원하는 모습에 가까워집니다."]
    ],
    "ch00_05_tool_scope.png": [
      ["사용합니다", "ChatGPT, GitHub 연동, 브라우저 확인, 복사하기 버튼을 사용합니다."],
      ["최소화합니다", "터미널, 코드 편집기, GitHub 웹 UI 직접 조작은 중심 흐름에서 뺍니다."],
      ["기억합니다", "독자는 대화창에서 부탁하고 웹에서 결과를 확인합니다."]
    ],
    "ch00_07_next_chatgpt.png": [
      ["Chapter 1", "ChatGPT 화면에서 꼭 볼 위치만 익힙니다."],
      ["Chapter 2", "이미지 한 장으로 첫 웹사이트를 만듭니다."],
      ["Chapter 3", "GitHub 연동으로 대화 배포 흐름을 봅니다."]
    ],
    "ch02_11_first_site_check.png": [
      ["제목", "사이트의 제목이 한눈에 보입니다."],
      ["이미지", "첨부한 이미지 분위기가 화면에 반영됩니다."],
      ["모바일", "휴대전화에서도 버튼과 글자가 잘립니다."]
    ],
    "ch03_15_deploy_fallback.png": [
      ["주소가 늦게 열림", "몇 분 기다린 뒤 버전 쿼리를 붙여 다시 확인합니다."],
      ["연동이 끊김", "ChatGPT 설정에서 GitHub 연결 상태를 다시 봅니다."],
      ["다시 부탁", "오류 메시지를 그대로 붙여 넣고 수정 요청합니다."]
    ],
    "ch07_01_deploy_recap.png": [
      ["연동 확인", "ChatGPT와 GitHub가 연결되어 있는지 확인합니다."],
      ["배포 요청", "사이트 파일을 저장소에 올리고 Pages 주소를 요청합니다."],
      ["외부 확인", "시크릿 창과 모바일 폭에서 공개 주소를 확인합니다."]
    ],
    "ch09_01_problem_table.png": [
      ["답변이 엉뚱함", "목표와 원하는 결과를 다시 짧게 정리해 부탁합니다."],
      ["주소가 안 열림", "Pages 반영 시간과 버전 쿼리를 확인합니다."],
      ["이미지가 깨짐", "파일명, 폴더 위치, 경로를 함께 알려 수정합니다."]
    ],
    "ch09_04_image_limit_broken.png": [
      ["한도 도달", "새 이미지는 멈추고 제공 자료로 진행합니다."],
      ["깨진 이미지", "이미지 파일명과 경로를 ChatGPT에 알려 줍니다."],
      ["다시 확인", "수정 뒤 새 버전 쿼리로 화면을 확인합니다."]
    ]
  };

  return (map[item.filename] || [
    ["화면 확인", item.description],
    ["다음 행동", "독자가 화면을 보고 바로 다음 단계를 알 수 있게 합니다."],
    ["주의점", "반복 설명보다 실제 행동이 보이는 이미지를 우선합니다."]
  ]).map(([title, text]) => ({ title, text }));
}

async function captureMaterial(page, item, baseUrl) {
  if (item.filename === "ch01_02_new_chat.png") {
    await setContentAndCapture(page, item, chatMockDocument(item, "새 채팅 버튼 위치", "왼쪽 위의 새 채팅 버튼만 기억하면 새 실습을 시작할 수 있습니다.", [
      { role: "assistant", text: "새 실습을 시작할 때는 새 채팅을 누르고 첫 프롬프트를 붙여 넣습니다." }
    ], ["+ 새 채팅", "GPT 입문서 실습", "최근 대화"]), 1180, 760);
    return;
  }

  if (item.filename === "ch01_04_attach_button.png") {
    await setContentAndCapture(page, item, chatMockDocument(item, "첨부 단추 위치", "이미지 한 장으로 사이트를 만들 때는 입력창 옆 첨부 단추를 사용합니다.", [
      { role: "user", text: "이 이미지를 참고해서 소개 사이트를 만들어 주세요." },
      { role: "assistant", text: "이미지 분위기에 맞춰 제목, 설명, 버튼이 있는 반응형 사이트로 구성하겠습니다." }
    ], ["+ 새 채팅", "첨부", "이미지"]), 1180, 760);
    return;
  }

  if (item.filename === "ch01_05_send_button.png") {
    await setContentAndCapture(page, item, chatMockDocument(item, "보내기 단추 위치", "부탁 문장을 다 적은 뒤 보내기 단추를 누르면 ChatGPT가 답을 만들기 시작합니다.", [
      { role: "user", text: "타로 사이트 메인 화면을 만들어 주세요." }
    ], ["+ 새 채팅", "입력창", "보내기"]), 1180, 760);
    return;
  }

  if (["ch02_01_first_site_preview.png", "ch02_07_first_site_desktop.png"].includes(item.filename)) {
    await page.setViewportSize({ width: 1180, height: 860 });
    await page.goto(`${baseUrl}/examples/first-site/?v=${buildVersion}`, { waitUntil: "networkidle" });
    await page.evaluate((no) => {
      document.body.insertAdjacentHTML("beforeend", `<span class="phase-badge">${String(no).padStart(2, "0")}</span>`);
      const badge = document.querySelector(".phase-badge");
      Object.assign(badge.style, {
        position: "fixed", top: "12px", left: "12px", zIndex: "9999", minWidth: "26px", height: "22px",
        padding: "5px 7px", borderRadius: "999px", background: "#1d5f59", color: "#fff",
        font: "700 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      });
    }, item.no);
    await page.screenshot({ path: path.join(imagesDir, item.filename), fullPage: false });
    return;
  }

  if (item.filename === "ch06_18_history_result.png") {
    await page.setViewportSize({ width: 1180, height: 860 });
    await page.goto(`${baseUrl}/examples/tarot-site/?v=${buildVersion}`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.click('[data-action="start"]');
    await page.click('[data-topic="today"]');
    await page.fill("#questionInput", "오늘 제가 가장 신경 써야 할 것은 무엇인가요?");
    await page.click('[data-action="questionNext"]');
    await page.click('[data-card="the-fool"]');
    await page.click('[data-card="the-magician"]');
    await page.click('[data-card="the-star"]');
    await page.click('[data-action="showResult"]');
    await page.click('[data-action="saveHistory"]');
    await page.evaluate((no) => {
      document.body.insertAdjacentHTML("beforeend", `<span class="phase-badge">${String(no).padStart(2, "0")}</span>`);
      const badge = document.querySelector(".phase-badge");
      Object.assign(badge.style, {
        position: "fixed", top: "12px", left: "12px", zIndex: "9999", minWidth: "26px", height: "22px",
        padding: "5px 7px", borderRadius: "999px", background: "#1d5f59", color: "#fff",
        font: "700 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      });
    }, item.no);
    await page.screenshot({ path: path.join(imagesDir, item.filename), fullPage: false });
    return;
  }

  await setContentAndCapture(page, item, boardDocument(item, item.description, "출판용 자료 화면입니다. 독자가 화면만 보고 다음 행동을 이해하도록 구성했습니다.", cardsForItem(item)));
}

async function captureManualMock(page, item) {
  const chatFiles = [
    "ch00_01_book_start.png", "ch00_05_ready_check.png", "ch00_04_beginner_market.png",
    "ch01_01_chatgpt_home.png", "ch01_03_input_box.png", "ch01_06_generating.png",
    "ch01_07_answer_done.png", "ch01_08_skip_menus.png", "ch02_03_attach_image.png",
    "ch02_05_wait_answer.png", "ch02_06_answer_ready.png", "ch05_02_image_limit.png"
  ];

  if (chatFiles.includes(item.filename)) {
    await setContentAndCapture(page, item, chatMockDocument(item, item.description, "실제 계정 화면 대신 개인정보가 없는 출판용 mock 화면으로 구성했습니다.", [
      { role: "user", text: "이미지 한 장으로 소개 사이트를 만들어 주세요." },
      { role: "assistant", text: "좋습니다. 제목, 짧은 설명, 이미지 영역, 버튼이 있는 반응형 사이트로 구성하겠습니다." },
      { role: "user", text: "GitHub 연동으로 웹에서 볼 수 있게 배포해 주세요." }
    ], ["+ 새 채팅", "첨부", "설정", "GitHub 연결"]), 1180, 760);
    return;
  }

  await setContentAndCapture(page, item, githubMockDocument(item, item.description, "실제 계정, 이메일, 토큰, 개인 저장소가 노출되지 않도록 출판용 예시 화면으로 대체했습니다.", [
    { title: "ChatGPT에 요청", text: "GitHub 웹 UI를 직접 누르기보다 ChatGPT 대화창에서 배포를 부탁합니다." },
    { title: "권한은 확인", text: "연결과 승인 화면에서는 실제 계정 정보가 보일 수 있어 마스킹 기준을 지킵니다." },
    { title: "공개 주소 확인", text: "완성 뒤에는 버전 쿼리를 붙인 외부 URL로 새 화면을 확인합니다." }
  ]), 1180, 760);
}

async function verifyWebbook(browser, baseUrl) {
  const page = await browser.newPage();
  const results = [];

  for (const width of [390, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseUrl}/webbook/?v=${buildVersion}`, { waitUntil: "networkidle" });
    await page.waitForSelector("#book-content .chapter");
    await page.waitForTimeout(700);
    const result = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll(".image-frame img"));
      const placeholders = document.querySelectorAll(".image-placeholder").length;
      const broken = images.filter((image) => !image.naturalWidth || !image.naturalHeight).length;
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      return { images: images.length, placeholders, broken, overflow };
    });
    const screenshotPath = path.join(outputDir, `phase8-9-webbook-verify-${width}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    results.push({ width, screenshotPath, ...result });
  }

  await page.close();
  return results;
}

function writeReport({ material, manual, failed, verification }) {
  const totalImages = fs.readdirSync(imagesDir).filter((name) => name.endsWith(".png")).length;
  const report = `# Phase 8~9 이미지 완성 보고서

## 결과 요약

- Phase 8 자료 화면 자동 캡처: ${material.length}개 생성
- Phase 9 수동 확인 필요 컷 mock 대체 캡처: ${manual.length}개 생성
- 실패 이미지: ${failed.length}개
- 현재 \`webbook/images/\` PNG 수: ${totalImages}개
- 남은 이미지 자리: ${Math.max(0, 98 - totalImages)}개

## 민감정보 처리 기준

- 실제 ChatGPT/GitHub 계정, 이메일, 토큰, 개인 저장소 이름은 캡처하지 않았습니다.
- 로그인, 권한 승인, 최종 주소 답변 화면은 출판용 mock 화면으로 대체했습니다.
- mock 화면에는 실제 화면과 다를 수 있음을 보고서에 남기며, 책 본문에서는 독자의 행동 흐름을 이해시키는 용도로 사용합니다.
- 이미지 번호는 실제 UI 글자보다 작게 배치하고 버튼, 입력칸, 본문을 가리지 않게 했습니다.

## Phase 8 생성 목록

${material.map((item) => `- \`${item.filename}\` - ${item.description}`).join("\n")}

## Phase 9 mock 대체 목록

${manual.map((item) => `- \`${item.filename}\` - ${item.description}`).join("\n")}

## 실패 목록

${failed.length ? failed.map((item) => `- \`${item.filename}\` - ${item.error}`).join("\n") : "- 실패한 이미지는 없습니다."}

## 웹북 표시 검증

${verification.map((item) => `- ${item.width}px: 실제 이미지 ${item.images}개, placeholder ${item.placeholders}개, 깨진 이미지 ${item.broken}개, 가로 넘침 ${item.overflow ? "있음" : "없음"}, 캡처 \`${path.relative(root, item.screenshotPath)}\``).join("\n")}

## 출판 전 주의

- mock 화면은 실제 ChatGPT/GitHub UI와 완전히 같다는 의미가 아닙니다.
- 실제 화면 캡처가 필요할 경우 별도 캡처용 계정과 마스킹 기준을 먼저 확정해야 합니다.
- 현재 목적은 비개발자 독자가 대화 배포 흐름을 이해할 수 있도록 안전한 출판용 이미지를 채우는 것입니다.
`;

  fs.writeFileSync(reportPath, report, "utf8");
}

async function main() {
  ensureDirs();
  const placeholders = readPlaceholders();
  const existing = new Set(fs.readdirSync(imagesDir).filter((name) => name.endsWith(".png")));
  const missing = placeholders.filter((item) => !existing.has(item.filename));
  const materialTargets = missing.filter((item) => item.method === "자료 화면 자동 캡처");
  const manualTargets = missing.filter((item) => item.method === "수동 확인 필요 컷");
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const material = [];
  const manual = [];
  const failed = [];

  for (const item of materialTargets) {
    try {
      await captureMaterial(page, item, baseUrl);
      material.push(item);
      console.log(`자료 화면 생성: ${item.filename}`);
    } catch (error) {
      failed.push({ ...item, error: error.message });
      console.error(`자료 화면 실패: ${item.filename} - ${error.message}`);
    }
  }

  for (const item of manualTargets) {
    try {
      await captureManualMock(page, item);
      manual.push(item);
      console.log(`mock 생성: ${item.filename}`);
    } catch (error) {
      failed.push({ ...item, error: error.message });
      console.error(`mock 실패: ${item.filename} - ${error.message}`);
    }
  }

  const verification = await verifyWebbook(browser, baseUrl);

  await page.close();
  await browser.close();
  if (server) server.close();

  writeReport({ material, manual, failed, verification });
  console.log(`자료 화면: ${material.length}개`);
  console.log(`mock 화면: ${manual.length}개`);
  console.log(`실패: ${failed.length}개`);
  console.log(`보고서: ${path.relative(root, reportPath)}`);

  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
