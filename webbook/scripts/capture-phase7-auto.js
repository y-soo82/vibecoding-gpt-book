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
const reportPath = path.join(reportsDir, "phase7-capture-report.md");
const buildVersion = "20260516-phase7";
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

function readPlaceholders() {
  return JSON.parse(fs.readFileSync(placeholdersPath, "utf8"));
}

function ensureDirs() {
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
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

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
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

async function setViewport(page, width, height = 900) {
  await page.setViewportSize({ width, height });
}

async function goto(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
}

async function addBadgeToElement(element, number) {
  await element.evaluate((el, no) => {
    el.querySelectorAll(".phase7-capture-badge").forEach((badge) => badge.remove());
    const previousPosition = getComputedStyle(el).position;
    if (previousPosition === "static") {
      el.dataset.phase7PreviousPosition = "static";
      el.style.position = "relative";
    }

    const badge = document.createElement("span");
    badge.className = "phase7-capture-badge";
    badge.textContent = String(no).padStart(2, "0");
    badge.style.position = "absolute";
    badge.style.top = "10px";
    badge.style.left = "10px";
    badge.style.zIndex = "9999";
    badge.style.display = "inline-flex";
    badge.style.alignItems = "center";
    badge.style.justifyContent = "center";
    badge.style.minWidth = "26px";
    badge.style.height = "22px";
    badge.style.padding = "0 7px";
    badge.style.borderRadius = "999px";
    badge.style.background = "#1d5f59";
    badge.style.color = "#fff";
    badge.style.border = "1px solid rgba(255,255,255,0.86)";
    badge.style.boxShadow = "0 5px 16px rgba(0,0,0,0.16)";
    badge.style.font = "700 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    badge.style.letterSpacing = "0";
    badge.setAttribute("aria-hidden", "true");
    el.prepend(badge);
  }, number);
}

async function addBadgeToPage(page, number) {
  await page.evaluate((no) => {
    document.querySelectorAll(".phase7-capture-badge").forEach((badge) => badge.remove());
    const badge = document.createElement("span");
    badge.className = "phase7-capture-badge";
    badge.textContent = String(no).padStart(2, "0");
    Object.assign(badge.style, {
      position: "fixed",
      top: "12px",
      left: "12px",
      zIndex: "99999",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "26px",
      height: "22px",
      padding: "0 7px",
      borderRadius: "999px",
      background: "#1d5f59",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.86)",
      boxShadow: "0 5px 16px rgba(0,0,0,0.16)",
      font: "700 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      letterSpacing: "0"
    });
    badge.setAttribute("aria-hidden", "true");
    document.body.appendChild(badge);
  }, number);
}

async function captureElement(element, item) {
  const output = path.join(imagesDir, item.filename);
  await addBadgeToElement(element, item.no);
  await element.screenshot({ path: output });
  return output;
}

async function capturePage(page, item) {
  const output = path.join(imagesDir, item.filename);
  await addBadgeToPage(page, item.no);
  await page.screenshot({ path: output, fullPage: false });
  return output;
}

async function captureBoard(page, item, title, cards, options = {}) {
  const width = options.width || 1180;
  const height = options.height || 760;
  await setViewport(page, width, height);
  const cardHtml = cards.map((card, index) => `
    <article>
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h2>${card.title}</h2>
      <p>${card.text}</p>
    </article>
  `).join("");

  await page.setContent(`<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
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
            min-height: calc(100vh - 68px);
            padding: 32px;
            border: 1px solid #ded1c2;
            border-radius: 8px;
            background: #fffaf2;
            box-shadow: 0 22px 60px rgba(48, 39, 30, 0.14);
          }
          .eyebrow {
            margin: 0 0 10px;
            color: #226b63;
            font-weight: 900;
          }
          h1 {
            margin: 0;
            font-size: 42px;
            line-height: 1.16;
            letter-spacing: 0;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(${options.columns || 3}, minmax(0, 1fr));
            gap: 16px;
            margin-top: 26px;
          }
          article {
            min-height: 150px;
            padding: 20px;
            border: 1px solid #ded1c2;
            border-radius: 8px;
            background: #fff;
          }
          article span {
            display: inline-flex;
            margin-bottom: 12px;
            color: #b5584b;
            font-weight: 900;
            font-size: 14px;
          }
          h2 {
            margin: 0 0 10px;
            font-size: 22px;
            line-height: 1.28;
            letter-spacing: 0;
          }
          p {
            margin: 0;
            color: #70665c;
            line-height: 1.65;
          }
        </style>
      </head>
      <body>
        <main>
          <p class="eyebrow">바이브코딩 GPT 입문서</p>
          <h1>${escapeHtml(title)}</h1>
          <section class="grid">${cardHtml}</section>
        </main>
      </body>
    </html>`, { waitUntil: "load" });
  await capturePage(page, item);
  return path.join(imagesDir, item.filename);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function captureWebbook(page, baseUrl, item) {
  await setViewport(page, item.filename === "ch00_03_responsive_book.png" ? 1280 : 900, 900);
  await goto(page, `${baseUrl}/webbook/?v=${buildVersion}`);
  await page.waitForSelector("#book-content .chapter");

  if (item.filename === "ch00_03_responsive_book.png") {
    const main = await page.$(".book-main");
    return captureElement(main, item);
  }

  const frameSelector = `.image-frame[data-image-src="./images/${item.filename}"]`;
  await page.waitForSelector(frameSelector);
  const frame = await page.$(frameSelector);
  const targetHandle = await frame.evaluateHandle((el) => {
    let current = el.nextElementSibling;
    while (current) {
      if (current.classList && current.classList.contains("prompt-card")) return current;
      current = current.nextElementSibling;
    }
    return el;
  });
  const target = targetHandle.asElement();
  await target.scrollIntoViewIfNeeded();
  return captureElement(target, item);
}

async function prepareTarotScreen(page, baseUrl, screen) {
  await goto(page, `${baseUrl}/examples/tarot-site/?v=${buildVersion}`);
  await page.evaluate(() => localStorage.clear());

  if (screen === "home") return;

  await page.click('[data-action="start"]');
  if (screen === "topic") return;

  await page.click('[data-topic="today"]');
  if (screen === "question") return;

  await page.fill("#questionInput", "오늘 제가 가장 신경 써야 할 것은 무엇인가요?");
  await page.click('[data-action="questionNext"]');
  if (screen === "spread") return;

  await page.click('[data-card="the-fool"]');
  await page.click('[data-card="the-magician"]');
  await page.click('[data-card="the-star"]');
  if (screen === "three") return;

  await page.click('[data-action="showResult"]');
  if (screen === "result") return;

  if (screen === "detail") {
    await page.click('[data-detail="the-fool"]');
    return;
  }

  if (screen === "history") {
    await page.click('[data-action="saveHistory"]');
  }
}

async function captureTarot(page, baseUrl, item, screen, width = 1180) {
  await setViewport(page, width, 900);
  await prepareTarotScreen(page, baseUrl, screen);
  if (screen === "detail") {
    await capturePage(page, item);
    return path.join(imagesDir, item.filename);
  }
  const target = await page.$(".screen.is-active");
  return captureElement(target, item);
}

async function captureFirstSite(page, baseUrl, item, width = 1180, selector = ".site-shell") {
  await setViewport(page, width, 900);
  await goto(page, `${baseUrl}/examples/first-site/?v=${buildVersion}`);
  const target = await page.$(selector);
  return captureElement(target, item);
}

async function captureExample(page, baseUrl, item) {
  const tarotMap = {
    "ch04_02_tarot_home.png": ["home", 1180],
    "ch04_03_tarot_topic.png": ["topic", 1180],
    "ch04_04_tarot_question.png": ["question", 1180],
    "ch04_05_tarot_spread.png": ["spread", 1180],
    "ch04_06_tarot_result.png": ["result", 1180],
    "ch06_05_main_result.png": ["home", 1180],
    "ch06_07_topic_result.png": ["topic", 1180],
    "ch06_09_question_result.png": ["question", 1180],
    "ch06_11_spread_result.png": ["spread", 1180],
    "ch06_12_three_cards_selected.png": ["three", 1180],
    "ch06_14_result_screen.png": ["result", 1180],
    "ch06_16_detail_popup.png": ["detail", 1180],
    "ch06_20_mobile_result.png": ["result", 390]
  };

  if (item.filename === "ch02_02_select_image.png") {
    return captureFirstSite(page, baseUrl, item, 1180, ".hero-image");
  }

  if (item.filename === "ch02_10_first_site_mobile.png") {
    return captureFirstSite(page, baseUrl, item, 390);
  }

  if (item.filename === "ch05_04_card_sample_1_result.png") {
    await setViewport(page, 760, 900);
    await prepareTarotScreen(page, baseUrl, "spread");
    const target = await page.$('[data-card="the-fool"]');
    return captureElement(target, item);
  }

  if (item.filename === "ch05_06_card_sample_2_result.png") {
    await setViewport(page, 760, 900);
    await prepareTarotScreen(page, baseUrl, "spread");
    const target = await page.$('[data-card="the-star"]');
    return captureElement(target, item);
  }

  if (tarotMap[item.filename]) {
    const [screen, width] = tarotMap[item.filename];
    return captureTarot(page, baseUrl, item, screen, width);
  }

  if ([
    "ch00_02_two_results.png",
    "ch00_06_result_preview.png",
    "ch04_01_tarot_preview.png"
  ].includes(item.filename)) {
    return captureBoard(page, item, item.description, [
      { title: "첫 웹사이트", text: "이미지 한 장의 분위기를 살린 소개 페이지입니다." },
      { title: "타로 사이트", text: "주제 선택, 질문 입력, 카드 선택, 결과 확인까지 이어집니다." },
      { title: "웹에서 확인", text: "완성된 결과물은 이후 GitHub Pages 주소로 확인합니다." }
    ]);
  }

  if (item.filename === "ch00_02_what_is_vibecoding.png") {
    return captureBoard(page, item, item.description, [
      { title: "생각을 말합니다", text: "ChatGPT 대화창에 원하는 사이트를 자연어로 부탁합니다." },
      { title: "결과를 확인합니다", text: "브라우저에서 보이는 화면을 기준으로 좋고 아쉬운 점을 봅니다." },
      { title: "다시 부탁합니다", text: "수정 요청을 이어 가며 완성도를 높입니다." }
    ]);
  }

  if (item.filename === "ch00_03_ai_coding_market.png") {
    return captureBoard(page, item, item.description, [
      { title: "대화형 제작", text: "코드를 직접 외우기보다 원하는 결과를 설명하는 방식이 열리고 있습니다." },
      { title: "도구 연결", text: "ChatGPT, GitHub, 브라우저가 연결되면 초보자도 결과물을 볼 수 있습니다." },
      { title: "아직 초입", text: "일반 독자가 따라 할 수 있는 실전형 안내는 아직 더 필요합니다." }
    ]);
  }

  if (item.filename === "ch01_09_prompt_structure.png") {
    return captureBoard(page, item, item.description, [
      { title: "목적", text: "무엇을 만들고 싶은지 먼저 말합니다." },
      { title: "재료", text: "이미지, 문장, 원하는 분위기를 함께 줍니다." },
      { title: "결과", text: "모바일, 버튼, 배포처럼 원하는 완성 조건을 붙입니다." }
    ]);
  }

  if (item.filename === "ch02_09_revised_result.png") {
    return captureBoard(page, item, item.description, [
      { title: "수정 전", text: "처음 받은 화면에서 글자 크기와 여백을 확인합니다." },
      { title: "수정 요청", text: "마음에 들지 않는 부분을 한 문장으로 다시 부탁합니다." },
      { title: "수정 후", text: "버튼, 이미지, 모바일 화면이 더 자연스러워졌는지 봅니다." }
    ]);
  }

  if (item.filename === "ch04_07_tarot_map.png") {
    return captureBoard(page, item, item.description, [
      { title: "메인", text: "시작 버튼으로 리딩을 시작합니다." },
      { title: "주제와 질문", text: "주제를 고르고 궁금한 내용을 한 문장으로 적습니다." },
      { title: "카드와 결과", text: "카드 3장을 고르고 결과와 상세 설명을 확인합니다." }
    ]);
  }

  if (item.filename === "ch05_01_tarot_78_cards.png") {
    return captureBoard(page, item, item.description, [
      { title: "메이저 카드", text: "책에서는 샘플 카드 2장만 직접 만들어 봅니다." },
      { title: "제공 자료", text: "나머지 카드는 실습 진행을 위해 준비된 이미지로 사용합니다." },
      { title: "한도 관리", text: "무료 이미지 생성 한도를 아끼며 사이트 완성에 집중합니다." }
    ]);
  }

  if (item.filename === "ch05_07_provided_assets.png") {
    return captureBoard(page, item, item.description, [
      { title: "assets/cards", text: "타로 카드 이미지가 한 폴더에 모여 있습니다." },
      { title: "파일명", text: "카드 이름과 파일명이 연결되어 있어 깨짐을 줄입니다." },
      { title: "확인", text: "브라우저에서 카드 이미지가 모두 보이는지 확인합니다." }
    ]);
  }

  if (item.filename === "ch05_08_image_check.png") {
    return captureBoard(page, item, item.description, [
      { title: "정상 표시", text: "카드 그림과 이름이 함께 보이면 정상입니다." },
      { title: "깨짐 표시", text: "이미지가 비면 파일명이나 경로를 다시 확인합니다." },
      { title: "다시 요청", text: "ChatGPT에 깨진 이미지와 파일명을 알려 수정합니다." }
    ]);
  }

  if (item.filename === "ch06_01_build_flow.png") {
    return captureBoard(page, item, item.description, [
      { title: "공통 디자인", text: "사이트의 분위기와 기본 화면을 먼저 잡습니다." },
      { title: "화면별 제작", text: "메인, 주제, 질문, 카드, 결과 화면을 차례대로 만듭니다." },
      { title: "오류 수정", text: "모바일과 깨진 이미지를 확인하고 다시 요청합니다." }
    ]);
  }

  if (item.filename === "ch06_03_design_result.png") {
    return captureTarot(page, baseUrl, item, "home", 1180);
  }

  if (item.filename === "ch06_22_tarot_done_check.png") {
    return captureBoard(page, item, item.description, [
      { title: "화면 흐름", text: "메인부터 최근 이력까지 끊기지 않고 이동합니다." },
      { title: "이미지", text: "카드 이미지가 깨지지 않고 모바일에서도 보입니다." },
      { title: "다음 단계", text: "이제 GitHub 연동 배포 프롬프트로 넘어갑니다." }
    ]);
  }

  if (item.filename === "ch07_04_upload_progress.png") {
    return captureBoard(page, item, item.description, [
      { title: "저장소 준비", text: "ChatGPT가 파일을 정리해 저장소에 올리는 흐름입니다." },
      { title: "업로드 확인", text: "index.html, CSS, JS, 이미지 폴더가 함께 올라가야 합니다." },
      { title: "주소 대기", text: "Pages 주소가 열릴 때까지 잠시 기다립니다." }
    ]);
  }

  if (item.filename === "ch07_09_share_url.png") {
    return captureBoard(page, item, item.description, [
      { title: "시크릿 창", text: "로그인하지 않은 브라우저에서도 주소가 열리는지 확인합니다." },
      { title: "모바일", text: "휴대전화 폭에서도 카드와 버튼이 넘치지 않는지 봅니다." },
      { title: "버전 쿼리", text: "수정 확인 주소 끝에 ?v=번호를 붙여 캐시를 피합니다." }
    ]);
  }

  if (item.filename === "ch09_05_next_ideas.png") {
    return captureBoard(page, item, item.description, [
      { title: "가게 소개", text: "사진 한 장으로 매장 소개 페이지를 만들 수 있습니다." },
      { title: "상담 예약", text: "질문을 받고 답을 보여 주는 간단한 도구로 확장합니다." },
      { title: "포트폴리오", text: "내 작업물과 연락 버튼을 모아 첫 개인 사이트를 만듭니다." }
    ]);
  }

  return captureFirstSite(page, baseUrl, item);
}

function verifyOutput(filePath) {
  const stat = fs.statSync(filePath);
  return stat.size > 4096;
}

async function verifyWebbook(browser, baseUrl) {
  const page = await browser.newPage();
  const results = [];

  for (const width of [390, 430, 768, 1280]) {
    await setViewport(page, width, 900);
    await goto(page, `${baseUrl}/webbook/?v=${buildVersion}`);
    await page.waitForSelector("#book-content .chapter");
    await page.waitForTimeout(800);
    const result = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll(".image-frame img"));
      const broken = images.filter((image) => !image.naturalWidth || !image.naturalHeight).length;
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      return {
        images: images.length,
        broken,
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    const screenshotPath = path.join(outputDir, `phase7-webbook-verify-${width}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    results.push({ width, screenshotPath, ...result });
  }

  await page.close();
  return results;
}

function writeReport({ generated, failed, manual, remainingAuto, verification, baseUrl }) {
  const report = `# Phase 7 캡처 결과 보고서

## 목표

Phase 5 캡처 계획과 Phase 6 예제 사이트를 기준으로, 실제 웹북에 들어갈 자동화 가능 캡처 이미지를 Playwright로 생성했습니다.

## 생성 결과

- 웹북 자동 캡처 목표: 20개
- 예제 사이트 자동 캡처 목표: 34개
- 이번 Phase 7 생성 이미지: ${generated.length}개
- 실패 이미지: ${failed.length}개
- 수동 확인 필요 컷: ${manual.length}개
- 아직 남은 자동화 가능 자료 화면 컷: ${remainingAuto.length}개

## 로컬 확인 URL

- 웹북: \`${baseUrl}/webbook/?v=${buildVersion}\`
- 첫 웹사이트: \`${baseUrl}/examples/first-site/?v=20260516-001\`
- 타로카드 리딩 웹사이트: \`${baseUrl}/examples/tarot-site/?v=20260516-001\`

## 생성된 이미지 목록

${generated.map((item) => `- \`${item.filename}\` - ${item.description}`).join("\n")}

## 실패 목록

${failed.length ? failed.map((item) => `- \`${item.filename}\` - ${item.description}: ${item.error}`).join("\n") : "- 실패한 자동 캡처 이미지는 없습니다."}

## 웹북 표시 검증

${verification.map((item) => `- ${item.width}px: 실제 이미지 ${item.images}개 표시, 깨진 이미지 ${item.broken}개, 가로 넘침 ${item.overflow ? "있음" : "없음"}, 검증 캡처 \`${path.relative(root, item.screenshotPath)}\``).join("\n")}

## 보류된 수동 확인 필요 컷

${manual.map((item) => `- \`${item.filename}\` - ${item.description}`).join("\n")}

## 다음에 처리할 자동화 가능 자료 화면 컷

${remainingAuto.map((item) => `- \`${item.filename}\` - ${item.description}`).join("\n")}

## 다음 작업

- 수동 확인 필요 컷 30개는 ChatGPT/GitHub 로그인, 권한, 계정 상태를 확인한 뒤 실제 캡처 또는 mock 대체 계획으로 진행합니다.
- 자료 화면 자동 캡처 14개는 별도 캡처용 HTML 화면을 확정한 뒤 Playwright로 생성합니다.
- 모든 이미지가 준비되면 GitHub Pages 외부 배포와 캐시 무효화 확인으로 넘어갑니다.
`;

  fs.writeFileSync(reportPath, report, "utf8");
}

async function main() {
  ensureDirs();
  const placeholders = readPlaceholders();
  const webbookItems = placeholders.filter((item) => item.method === "웹북 자동 캡처");
  const exampleItems = placeholders.filter((item) => item.method === "예제 사이트 자동 캡처");
  const manual = placeholders.filter((item) => item.method === "수동 확인 필요 컷");
  const remainingAuto = placeholders.filter((item) => item.method === "자료 화면 자동 캡처");
  const targets = [...webbookItems, ...exampleItems];
  const { server, baseUrl } = await startServer();

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const generated = [];
  const failed = [];

  for (const item of targets) {
    try {
      const output = item.method === "웹북 자동 캡처"
        ? await captureWebbook(page, baseUrl, item)
        : await captureExample(page, baseUrl, item);

      if (!verifyOutput(output)) {
        throw new Error("이미지 파일 크기가 너무 작습니다.");
      }

      generated.push(item);
      console.log(`생성 완료: ${item.filename}`);
    } catch (error) {
      failed.push({ ...item, error: error.message });
      console.error(`생성 실패: ${item.filename} - ${error.message}`);
    }
  }

  const verification = await verifyWebbook(browser, baseUrl);
  await page.close();
  await browser.close();
  if (server) server.close();

  writeReport({ generated, failed, manual, remainingAuto, verification, baseUrl });

  console.log(`생성 이미지: ${generated.length}개`);
  console.log(`실패 이미지: ${failed.length}개`);
  console.log(`보고서: ${path.relative(root, reportPath)}`);

  if (generated.length !== 54 || failed.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
