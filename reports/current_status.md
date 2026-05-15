# 바이브코딩 1차 GPT 입문서 현재 상태 요약

## 1. 프로젝트 정체성

- 이 프로젝트는 **바이브코딩 출판 프로젝트**입니다.
- 현재 작업 대상은 **1차 GPT 입문서**입니다.
- 1차 책은 ChatGPT 대화창 중심 입문서입니다.
- 2차 책은 Codex App 실습서이며, 1차 GPT 입문서와 섞지 않습니다.

## 2. 고정 독자

- 독자는 웹서핑과 유튜브 정도만 할 줄 아는 비개발자입니다.
- 독자는 ChatGPT 대화창을 중심으로 화면을 보고 따라 합니다.
- 독자는 GitHub, 웹 배포, 코드 구조에 익숙하지 않다는 전제로 작성합니다.

## 3. 절대 지킬 방향

- 핵심 경험은 **ChatGPT 대화창만으로 개발하는 경험**입니다.
- GitHub 배포는 **ChatGPT GitHub 연동 대화 배포** 중심으로 설명합니다.
- GitHub 웹 UI 직접 조작 중심으로 흐르지 않습니다.
- 책은 반응형 전자책입니다.
- 최종 패키징은 Sigil EPUB 변환을 고려합니다.
- 전체 분량은 80~100페이지 목표입니다.
- 이미지 비중은 60~70%입니다.
- 긴 프롬프트는 본문에서 3줄 미리보기만 보여 주고, 우측 상단 `복사하기` 버튼으로 전문을 복사하게 합니다.
- 이미지 번호는 실제 UI 글자보다 약 20% 작게 배치합니다.
- 반복 이미지와 반복 설명으로 분량을 늘리지 않습니다.
- 최종 확인은 GitHub Pages 등 외부 공개 URL 기준으로 진행합니다.
- noCache, 버전 쿼리, 확인용 URL 쿼리를 포함합니다.
- 모든 캡처 이미지는 Codex가 Playwright로 직접 실행해 생성합니다.
- ChatGPT/GitHub처럼 로그인, 권한, 계정 상태가 필요한 화면은 `수동 확인 필요 컷`으로 표시하고 대체 캡처 계획을 문서화합니다.

## 4. 완료된 Phase

### Phase 1. 출판 설계 산출물 완료

- 최종 목차 재기획을 완료했습니다.
- 98페이지 기준 페이지 설계를 완료했습니다.
- 페이지별 이미지 컷 리스트를 작성했습니다.
- 프롬프트 박스 UX 설계를 완료했습니다.
- Reviewer/Verifier 검수 루프를 설계했습니다.
- GitHub Pages 외부 확인 및 캐시 무효화 전략을 작성했습니다.

### Phase 2. 원고 초안 완료

- `manuscript/` 아래 장별 원고 초안 10개를 작성했습니다.
- 원고는 이미지 자리, 짧은 설명, 독자 행동 안내, 프롬프트 박스 자리, 장별 체크리스트 중심입니다.
- 본문에는 프롬프트 전문을 넣지 않고 프롬프트 박스 자리만 넣었습니다.

### Phase 3. 프롬프트 원문 완료

- `prompts/` 아래 프롬프트 원문 파일 7개를 작성했습니다.
- 원고의 프롬프트 박스 ID 24개와 프롬프트 원문 24개가 1:1로 일치합니다.
- 각 프롬프트는 본문 3줄 미리보기와 복사용 전문을 포함합니다.
- 미리보기 3줄과 전문 앞 3줄 일치 검수는 `PASS`입니다.

### Phase 4. 반응형 웹북 초안 완료

- `webbook/` 아래 원고를 읽을 수 있는 반응형 웹북 초안을 제작했습니다.
- 10개 원고 파일을 장별로 접근할 수 있게 구성했습니다.
- 목차와 사이드바를 제공했습니다.
- 프롬프트 박스는 `prompts/` 원문과 연결했습니다.
- 프롬프트 박스는 앞 3줄 미리보기, 우측 상단 `복사하기` 버튼, `전체 보기` 토글을 포함합니다.
- 이미지가 아직 없어도 깨진 이미지 아이콘 대신 placeholder가 보이도록 구성했습니다.
- noCache 메타 태그, CSS/JS 버전 쿼리, 빌드 번호를 반영했습니다.
- Playwright로 390px, 430px, 768px, 1280px 화면 검증을 완료했습니다.

### Phase 5. 캡처 목록 및 Playwright 캡처 파이프라인 완료

- 이미지 placeholder 98개를 추출해 캡처 목록으로 정리했습니다.
- `reports/capture-plan.md`를 생성했습니다.
- `reports/capture-placeholders.json`을 생성했습니다.
- `webbook/scripts/capture-placeholder-list.js`를 생성했습니다.
- `webbook/scripts/capture-webbook.js`를 생성했습니다.
- 이미지 자리 98개 추출을 완료했습니다.
- 자동화 가능 컷은 68개입니다.
- 수동 확인 필요 컷은 30개입니다.
- 웹북 테스트 캡처 `phase5-webbook-*` 파일을 생성했습니다.

### Phase 6. 예제 사이트 2개 로컬 제작 완료

- `examples/first-site/`에 이미지 한 장으로 만든 첫 웹사이트를 제작했습니다.
- `examples/tarot-site/`에 타로카드 리딩 웹사이트를 제작했습니다.
- 첫 웹사이트용 `sample-image.png`를 생성했습니다.
- 타로 카드 이미지 12장을 생성했습니다.
- Playwright로 390px, 430px, 768px, 1280px 검증을 완료했고 결과는 `PASS`입니다.
- 첫 웹사이트에서 제목, 설명, 이미지, 버튼 표시를 확인했습니다.
- 타로 사이트에서 메인, 주제 선택, 질문 입력, 카드 3장 선택, 결과, 카드 상세, 최근 이력 흐름을 확인했습니다.
- 깨진 이미지는 0개입니다.
- 가로 넘침은 없습니다.
- `phase6-*` 캡처 스크린샷을 생성했습니다.

## 5. 생성된 주요 파일 목록

### plan 문서

- `plan/2026-05-15_출판_상세기획_superbrain.md`
- `plan/실행계획.md`
- `plan/최종목차.md`
- `plan/페이지설계.md`
- `plan/이미지컷리스트.md`
- `plan/프롬프트설계.md`
- `plan/검수계획.md`
- `plan/배포확인계획.md`

### manuscript 원고

- `manuscript/00_intro.md`
- `manuscript/01_ai_vibecoding.md`
- `manuscript/02_chatgpt_ui.md`
- `manuscript/03_first_site.md`
- `manuscript/04_github_connector_deploy.md`
- `manuscript/05_tarot_preview.md`
- `manuscript/06_tarot_assets.md`
- `manuscript/07_tarot_build.md`
- `manuscript/08_tarot_deploy.md`
- `manuscript/09_appendix.md`

### prompts 원문

- `prompts/first-site.md`
- `prompts/tarot-main.md`
- `prompts/tarot-topic.md`
- `prompts/tarot-question.md`
- `prompts/tarot-spread.md`
- `prompts/tarot-result.md`
- `prompts/repair-prompts.md`

### webbook 웹북

- `webbook/index.html`
- `webbook/README.md`
- `webbook/_sidebar.md`
- `webbook/assets/book.css`
- `webbook/assets/book.js`
- `webbook/assets/prompts.js`
- `webbook/assets/placeholder.css`
- `webbook/scripts/capture-placeholder-list.js`
- `webbook/scripts/capture-webbook.js`

### reports 보고서

- `reports/current_status.md`
- `reports/capture-plan.md`
- `reports/capture-placeholders.json`

### examples 예제 사이트

- `examples/first-site/index.html`
- `examples/first-site/assets/style.css`
- `examples/first-site/assets/app.js`
- `examples/first-site/assets/sample-image.png`
- `examples/tarot-site/index.html`
- `examples/tarot-site/assets/style.css`
- `examples/tarot-site/assets/app.js`
- `examples/tarot-site/assets/cards/`

## 6. 현재 수치

- 원고 페이지 자리: 98개
- 이미지 자리: 98개
- 프롬프트 박스: 24개
- 프롬프트 원문: 24개
- 프롬프트 ID 매칭: 원고 24개와 prompts 24개 1:1 일치
- 미리보기 3줄과 전문 앞 3줄 일치 검수: PASS
- 캡처 대상 이미지 자리: 98개
- 자동화 가능 컷: 68개
- 수동 확인 필요 컷: 30개
- 첫 웹사이트 예제: 1개
- 타로카드 리딩 웹사이트 예제: 1개
- 타로 카드 이미지: 12장

## 7. 현재 로컬 URL

- 웹북: `http://127.0.0.1:4173/webbook/?v=20260515-001`
- 첫 웹사이트: `http://127.0.0.1:4173/examples/first-site/?v=20260516-001`
- 타로카드 리딩 웹사이트: `http://127.0.0.1:4173/examples/tarot-site/?v=20260516-001`

## 8. GitHub 상태

- 레포: `https://github.com/y-soo82/vibecoding-gpt-book`
- `main` 브랜치 첫 push를 완료했습니다.
- Phase 5, Phase 6 변경분은 아직 로컬에만 있고 커밋/push 전입니다.

## 9. 다음 Phase

다음 단계는 **Phase 7: 실제 캡처 이미지 생성**입니다.

Phase 7에서 해야 할 일은 아래와 같습니다.

- 실제 캡처 이미지 98개 중 자동화 가능 컷부터 `webbook/images/`에 생성합니다.
- 첫 목표는 웹북 자동 캡처 20개와 예제 사이트 자동 캡처 34개입니다.
- ChatGPT/GitHub 관련 30개는 수동 확인 필요 컷 또는 mock 대체 계획을 확정한 뒤 진행합니다.
- 캡처 이미지는 Playwright로 직접 실행해 생성합니다.
- 이미지 번호는 실제 UI 글자보다 약 20% 작게 배치하고, 버튼, 입력칸, 본문 글자를 가리지 않게 합니다.

## 10. 아직 하지 않은 일

- 실제 98개 이미지 전부 생성
- `webbook/images/`에 최종 캡처 반영
- GitHub Pages 외부 배포
- 캐시 무효화 외부 확인
- Sigil EPUB 변환
- Reviewer/Verifier 최종 검수
- Phase 5/6 변경분 커밋 및 push

## 11. 다음 작업 시작 시 읽을 파일

다음 작업자는 아래 순서로 읽으면 됩니다.

1. `vibecoding/AGENTS.md`
2. `vibecoding/1/gpt/reports/current_status.md`
3. `vibecoding/1/gpt/reports/capture-plan.md`
4. `vibecoding/1/gpt/reports/capture-placeholders.json`
5. `vibecoding/1/gpt/webbook/`
6. `vibecoding/1/gpt/examples/`
7. `vibecoding/1/gpt/manuscript/`
8. `vibecoding/1/gpt/prompts/`

이 파일을 기준으로 Phase 7을 시작하면 됩니다.
