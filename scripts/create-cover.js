const path = require("path");
const { chromium } = require("/Users/y-soo/workspace/comm_mcp/playwright/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "webbook/images/cover.png");

const html = String.raw`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: 1600px;
      height: 2400px;
      background: #f7fbff;
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", sans-serif;
      color: #071b4d;
    }
    .cover {
      position: relative;
      width: 1600px;
      height: 2400px;
      padding: 120px 112px;
      overflow: hidden;
      background:
        radial-gradient(circle at 22% 12%, rgba(37, 99, 235, 0.10), transparent 28%),
        radial-gradient(circle at 80% 72%, rgba(139, 92, 246, 0.10), transparent 30%),
        linear-gradient(180deg, #ffffff 0%, #f4fbff 54%, #fffaf4 100%);
    }
    .topline {
      display: inline-flex;
      align-items: center;
      gap: 18px;
      padding: 14px 24px;
      border: 3px solid #b8d7ff;
      border-radius: 999px;
      color: #2563eb;
      font-size: 34px;
      font-weight: 900;
      background: rgba(255, 255, 255, 0.78);
    }
    .title {
      margin: 90px 0 0;
      font-size: 138px;
      line-height: 1.05;
      letter-spacing: 0;
      font-weight: 1000;
      color: #061846;
    }
    .title .accent {
      display: block;
      color: #f26b16;
    }
    .subtitle {
      margin: 38px 0 0;
      max-width: 1180px;
      font-size: 46px;
      line-height: 1.42;
      font-weight: 760;
      color: #344563;
    }
    .relation {
      margin-top: 118px;
      padding: 58px 56px 66px;
      border: 4px solid #94c6ff;
      border-radius: 38px;
      background: rgba(255, 255, 255, 0.76);
      box-shadow: 0 26px 70px rgba(7, 24, 70, 0.10);
    }
    .relation-title {
      margin: 0 0 34px;
      text-align: center;
      font-size: 44px;
      font-weight: 950;
      color: #061846;
    }
    .layers {
      display: grid;
      gap: 28px;
    }
    .layer {
      display: grid;
      grid-template-columns: 210px 1fr;
      align-items: center;
      min-height: 142px;
      border: 4px solid var(--line);
      border-radius: 32px;
      background: var(--bg);
      padding: 26px 34px;
    }
    .layer strong {
      display: block;
      font-size: 52px;
      line-height: 1;
      font-weight: 1000;
      color: var(--main);
    }
    .layer span {
      display: block;
      font-size: 32px;
      line-height: 1.36;
      font-weight: 740;
      color: #27384f;
    }
    .icon-row {
      display: none;
    }
    .icon-card {
      min-height: 265px;
      border: 3px solid #d7e7ff;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.86);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 26px;
    }
    .icon {
      width: 108px;
      height: 108px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 22px;
      background: #edf6ff;
      border: 3px solid #c8e0ff;
      color: #0f3f9a;
      font-size: 62px;
      font-weight: 950;
    }
    .icon-card b {
      font-size: 34px;
      line-height: 1.22;
      color: #071b4d;
    }
    .flow {
      margin-top: 78px;
      border: 4px solid #c7b5ff;
      border-radius: 36px;
      background: rgba(250, 247, 255, 0.86);
      padding: 40px;
    }
    .flow-title {
      margin: 0 0 30px;
      text-align: center;
      font-size: 48px;
      font-weight: 1000;
      color: #5f3dc4;
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
    }
    .step {
      min-height: 170px;
      border: 3px solid #d6ccff;
      border-radius: 26px;
      background: #ffffff;
      padding: 24px 18px;
      text-align: center;
    }
    .step .num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin-bottom: 14px;
      border-radius: 50%;
      background: #7c5ce6;
      color: #ffffff;
      font-size: 30px;
      font-weight: 950;
    }
    .step b {
      display: block;
      font-size: 32px;
      color: #071b4d;
    }
    .bottom {
      position: absolute;
      left: 112px;
      right: 112px;
      bottom: 96px;
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 40px;
    }
    .promise {
      max-width: 860px;
      font-size: 34px;
      line-height: 1.44;
      color: #344563;
      font-weight: 760;
    }
    .badge {
      padding: 22px 28px;
      border-radius: 24px;
      background: #fff4e8;
      border: 3px solid #ffbd7d;
      color: #d95a00;
      font-size: 34px;
      font-weight: 950;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <main class="cover">
    <div class="topline">반응형 웹 전자책 · 이미지 중심 실습</div>
    <h1 class="title">보면서 따라 하는 <span class="accent">바이브코딩 입문</span></h1>
    <p class="subtitle">ChatGPT로 첫 웹사이트를 만들고, 최종 타로앱까지 따라 만드는 초보자용 실습서</p>

    <section class="relation">
      <h2 class="relation-title">AI → LLM → AI 서비스 → 바이브코딩</h2>
      <div class="layers">
        <div class="layer" style="--line:#94c6ff; --bg:#f4f9ff; --main:#0b54d8">
          <strong>AI</strong>
          <span>배우고 판단하고 결과를 만들어내도록 만든 기술</span>
        </div>
        <div class="layer" style="--line:#8ed4bd; --bg:#f3fffb; --main:#078a78">
          <strong>LLM</strong>
          <span>사람의 말을 이해하고 답변과 결과물을 만드는 AI 두뇌 역할</span>
        </div>
        <div class="layer" style="--line:#ffd27a; --bg:#fffaf0; --main:#d97706">
          <strong>AI 서비스</strong>
          <span>ChatGPT, Claude, Gemini처럼 쉽게 사용할 수 있게 만든 도구</span>
        </div>
      </div>
      <div class="flow">
        <h3 class="flow-title">바이브코딩은 말로 요청하고 결과를 보며 완성합니다</h3>
        <div class="steps">
          <div class="step"><span class="num">1</span><b>말로 요청</b></div>
          <div class="step"><span class="num">2</span><b>초안 생성</b></div>
          <div class="step"><span class="num">3</span><b>결과 확인</b></div>
          <div class="step"><span class="num">4</span><b>수정 반복</b></div>
        </div>
      </div>
    </section>

    <div class="bottom">
      <p class="promise">웹서핑과 유튜브 정도만 익숙해도, 책을 따라 하며 화면으로 결과를 확인할 수 있게 구성했습니다.</p>
      <div class="badge">GPT 입문서</div>
    </div>
  </main>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 2400 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: output, fullPage: false });
  await browser.close();
  console.log(output);
})();
