#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../..");
const outputDir = path.join(root, "webbook/output/playwright");
const url = process.env.WEBBOOK_URL || "http://127.0.0.1:4173/webbook/?v=20260515-001";
const viewports = (process.env.VIEWPORTS || "390,430,768,1280")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter(Boolean);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0) {
    throw new Error([
      `${command} ${args.join(" ")} 실행에 실패했습니다.`,
      result.stdout,
      result.stderr
    ].filter(Boolean).join("\n"));
  }

  return result;
}

fs.mkdirSync(outputDir, { recursive: true });

const outputs = [];

for (const width of viewports) {
  const output = path.join(outputDir, `phase5-webbook-${width}.png`);
  run("playwright", [
    "screenshot",
    "--full-page",
    `--viewport-size=${width},900`,
    url,
    output
  ]);
  outputs.push(output);
}

console.log("Playwright 웹북 테스트 캡처를 생성했습니다.");
for (const output of outputs) {
  console.log(path.relative(root, output));
}
