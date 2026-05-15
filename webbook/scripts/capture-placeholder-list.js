#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const manuscriptDir = path.join(root, "manuscript");
const reportsDir = path.join(root, "reports");
const outputJson = path.join(reportsDir, "capture-placeholders.json");
const outputPlan = path.join(reportsDir, "capture-plan.md");

const files = [
  "00_intro.md",
  "01_ai_vibecoding.md",
  "02_chatgpt_ui.md",
  "03_first_site.md",
  "04_github_connector_deploy.md",
  "05_tarot_preview.md",
  "06_tarot_assets.md",
  "07_tarot_build.md",
  "08_tarot_deploy.md",
  "09_appendix.md"
];

function classify(description, filename) {
  const text = `${description} ${filename}`;
  const needsAccount = [
    "ChatGPT",
    "GitHub",
    "로그인",
    "가입",
    "인증",
    "권한",
    "커넥터",
    "최종 주소",
    "외부 URL"
  ].some((word) => text.includes(word));
  const promptBox = text.includes("프롬프트 박스");
  const webbook = text.includes("전자책") || text.includes("책 표지") || text.includes("복사하기");
  const exampleSite = text.includes("첫 사이트") || text.includes("타로") || text.includes("카드");

  if (needsAccount) {
    return {
      method: "수동 확인 필요 컷",
      automatable: false,
      priority: "상",
      note: "로그인, 권한, 계정 상태가 화면에 영향을 줄 수 있으므로 Playwright 자동화 가능 범위를 먼저 확인합니다."
    };
  }

  if (promptBox || webbook) {
    return {
      method: "웹북 자동 캡처",
      automatable: true,
      priority: "상",
      note: "현재 웹북에서 Playwright로 캡처할 수 있습니다."
    };
  }

  if (exampleSite) {
    return {
      method: "예제 사이트 자동 캡처",
      automatable: true,
      priority: "중",
      note: "예제 사이트 화면이 구현된 뒤 Playwright로 캡처합니다."
    };
  }

  return {
    method: "자료 화면 자동 캡처",
    automatable: true,
    priority: "중",
    note: "캡처용 HTML 또는 로컬 자료 화면을 만든 뒤 Playwright로 캡처합니다."
  };
}

function getPageTitle(lines, index) {
  for (let i = index; i >= 0; i -= 1) {
    const match = lines[i].match(/^###\s+(.+)$/);
    if (match) return match[1];
  }
  return "";
}

function extractPlaceholders() {
  const items = [];

  for (const file of files) {
    const filePath = path.join(manuscriptDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const match = line.match(/^!\[(이미지 자리:\s*.*?)\]\(\.\.\/webbook\/images\/(.*?)\)$/);
      if (!match) return;

      const description = match[1].replace(/^이미지 자리:\s*/, "").trim();
      const filename = match[2].trim();
      const classification = classify(description, filename);
      items.push({
        no: items.length + 1,
        file: `manuscript/${file}`,
        line: index + 1,
        page: getPageTitle(lines, index),
        filename,
        path: `webbook/images/${filename}`,
        description,
        method: classification.method,
        automatable: classification.automatable,
        priority: classification.priority,
        note: classification.note
      });
    });
  }

  return items;
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = String(item[key]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function markdownTable(items) {
  const header = "| 번호 | 파일명 | 원고 위치 | 이미지 설명 | 캡처 방식 | 자동화 | 우선순위 |\n|---:|---|---|---|---|---|---|";
  const rows = items.map((item) => (
    `| ${item.no} | \`${item.filename}\` | \`${item.file}:${item.line}\` | ${item.description} | ${item.method} | ${item.automatable ? "가능" : "확인 필요"} | ${item.priority} |`
  ));
  return [header, ...rows].join("\n");
}

function writeOutputs(items) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(outputJson, `${JSON.stringify(items, null, 2)}\n`, "utf8");

  const methodCounts = countBy(items, "method");
  const autoCount = items.filter((item) => item.automatable).length;
  const manualCount = items.length - autoCount;
  const duplicated = Object.entries(countBy(items, "filename")).filter(([, count]) => count > 1);

  const plan = `# Phase 5 캡처 계획

## 목표

현재 웹북의 이미지 placeholder ${items.length}개를 실제 캡처 이미지로 교체하기 위한 Playwright 캡처 파이프라인을 준비합니다.

## 고정 원칙

- 모든 캡처 이미지는 Codex가 Playwright로 직접 실행해 생성합니다.
- 수동 캡처나 임의 이미지 대체를 기본 방식으로 쓰지 않습니다.
- ChatGPT와 GitHub처럼 로그인, 권한, 계정 상태가 필요한 화면은 \`수동 확인 필요 컷\`으로 표시합니다.
- 자동화가 막히는 컷은 대체 캡처 계획을 문서화한 뒤 진행합니다.
- 이미지 번호는 실제 UI 글자보다 약 20% 작게 배치합니다.
- 이미지 번호는 버튼, 입력칸, 본문 글자를 가리지 않습니다.
- 반복 이미지와 반복 설명으로 콘텐츠 품질이 낮아지지 않게 중복 컷을 검토합니다.

## 현재 수치

- 전체 이미지 자리: ${items.length}개
- 자동화 가능 컷: ${autoCount}개
- 수동 확인 필요 컷: ${manualCount}개

## 캡처 방식별 수량

${Object.entries(methodCounts).map(([method, count]) => `- ${method}: ${count}개`).join("\n")}

## 중복 컷 검토

${duplicated.length ? duplicated.map(([filename, count]) => `- \`${filename}\`: ${count}회`).join("\n") : "- 파일명 기준 중복 컷은 없습니다."}

## ChatGPT/GitHub 로그인 화면 대체 계획

- 먼저 Playwright로 로그인 전 공개 화면, 로그인 화면, 권한 승인 진입 화면까지 자동 접근 가능한지 확인합니다.
- 실제 계정 정보, 이메일, 토큰, 개인 저장소가 보이는 화면은 캡처 전 별도 캡처용 계정 또는 마스킹 기준을 정합니다.
- 자동 접근이 막히는 화면은 \`수동 확인 필요 컷\`으로 유지하고, 화면 구성 재현용 로컬 mock 페이지를 만든 뒤 Playwright로 캡처하는 대체안을 사용합니다.
- 대체 mock을 쓰는 경우 캡션에 실제 화면과 달라질 수 있는 요소를 명확히 남깁니다.

## 이미지 번호 표시 기준

- 번호는 대상 UI 글자보다 약 20% 작게 배치합니다.
- 번호는 대상 요소 바로 옆에 두되, 클릭할 버튼이나 입력칸을 가리지 않습니다.
- 번호와 본문 단계 번호는 반드시 일치시킵니다.
- 모바일 캡처에서는 번호가 본문 글자보다 커 보이면 재합성합니다.

## 캡처 우선순위

1. 웹북에서 바로 자동 캡처 가능한 프롬프트 박스와 안내 화면을 먼저 캡처합니다.
2. 예제 사이트 화면은 예제 사이트 구현 후 Playwright로 캡처합니다.
3. ChatGPT/GitHub 연동 화면은 로그인·권한 상태를 검토한 뒤 가능한 구간만 자동 캡처합니다.
4. 자동화가 막히는 구간은 수동 확인 필요 컷으로 남기고 대체 mock 캡처 계획을 확정합니다.

## 다음 단계 실제 캡처 순서

1. 로컬 웹북 서버를 실행합니다.
2. \`webbook/scripts/capture-placeholder-list.js\`로 목록을 최신화합니다.
3. \`webbook/scripts/capture-webbook.js\`로 390px, 430px, 768px, 1280px 테스트 캡처를 생성합니다.
4. 자동 캡처 가능 컷부터 실제 PNG를 \`webbook/images/\`에 저장합니다.
5. 저장 후 웹북을 다시 열어 placeholder가 실제 이미지로 교체되는지 확인합니다.

## 98개 이미지 자리 전체 목록

${markdownTable(items)}
`;

  fs.writeFileSync(outputPlan, plan, "utf8");
}

const items = extractPlaceholders();
writeOutputs(items);

console.log(`이미지 자리 ${items.length}개를 추출했습니다.`);
console.log(`JSON: ${path.relative(root, outputJson)}`);
console.log(`계획서: ${path.relative(root, outputPlan)}`);

if (items.length !== 98) {
  console.error(`예상 수량 98개와 다릅니다. 현재: ${items.length}개`);
  process.exitCode = 1;
}
