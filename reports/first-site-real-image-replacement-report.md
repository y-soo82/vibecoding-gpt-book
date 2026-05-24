# 첫 웹사이트 실습 실제 캡처 이미지 교체 보고서

작성일: 2026-05-17

## 1. CDP 연결 상태

- CDP 주소: `http://127.0.0.1:9222`
- 연결 상태: 연결 성공
- 대상 탭: `cdp`
- 실제 ChatGPT 로그인 상태: 확인 완료
- 실제 대화 URL: `https://chatgpt.com/c/6a089ff4-bccc-83a3-95e9-2e46f47aae7c`

이번 작업은 사용자가 로그인한 실제 ChatGPT 화면에서 진행했습니다.

## 2. 생성 또는 갱신한 원본 캡처

저장 위치:

`/Users/y-soo/workspace/codex_projects/projects/e-book/vibecoding/1/webbook/images/_source-real/chatgpt-first-site/`

- `01_chatgpt_before_attach.png`: 실제 ChatGPT 대화 시작 전 화면
- `02_attached_image_prompt.png`: 실제 첨부 이미지와 첫 웹사이트 요청 프롬프트가 포함된 화면
- `03_generating_answer.png`: 실제 ChatGPT 답변 생성 중 화면
- `04_answer_done.png`: 실제 ChatGPT 첫 답변 완료 화면
- `05_html_preview.png`: 첫 답변 완료 화면 기준 결과 확인 컷
- `06_revision_prompt.png`: 실제 수정 요청 프롬프트 입력 화면
- `07_revision_result.png`: 실제 수정 결과 답변 화면
- `08_first_site_desktop.png`: ChatGPT가 생성한 `index.html`을 브라우저에서 연 데스크톱 화면
- `09_first_site_mobile.png`: ChatGPT가 생성한 `index.html`을 모바일 뷰포트에서 연 화면

추가 저장 위치:

`/Users/y-soo/workspace/codex_projects/projects/e-book/vibecoding/1/webbook/images/_source-real/final-public-sites/`

- `actual-first-site-index.html`: ChatGPT 답변에서 실제 다운로드한 `index.html`
- `sample-image.png`: `actual-first-site-index.html` 표시용 샘플 이미지
- `01_first_site_desktop.png`: 실제 생성 HTML 데스크톱 캡처
- `02_first_site_mobile.png`: 실제 생성 HTML 모바일 캡처

## 3. 생성한 편집본

저장 위치:

`/Users/y-soo/workspace/codex_projects/projects/e-book/vibecoding/1/webbook/images/_edited/first-site-real/`

- `ch02_03_attach_image.png`
- `ch02_04_first_site_prompt.png`
- `ch02_05_wait_answer.png`
- `ch02_06_answer_ready.png`
- `ch02_07_first_site_desktop.png`
- `ch02_08_revise_prompt.png`
- `ch02_09_revised_result.png`
- `ch02_10_first_site_mobile.png`

편집 기준:

- 브라우저 주소창과 불필요한 상단 영역을 가능한 한 제거했습니다.
- 최근 대화 목록과 계정 영역이 보이지 않도록 크롭했습니다.
- 입력 프롬프트, 첨부 이미지, ChatGPT 답변, 결과 화면은 가리지 않았습니다.
- 이번 단계에서는 이미지 번호 오버레이를 넣지 않았습니다.

## 4. 교체한 최종 이미지

교체 위치:

`/Users/y-soo/workspace/codex_projects/projects/e-book/vibecoding/1/webbook/images/`

- `ch02_03_attach_image.png`
- `ch02_04_first_site_prompt.png`
- `ch02_05_wait_answer.png`
- `ch02_06_answer_ready.png`
- `ch02_07_first_site_desktop.png`
- `ch02_08_revise_prompt.png`
- `ch02_09_revised_result.png`
- `ch02_10_first_site_mobile.png`

교체 전 mock 이미지는 아래에 보존했습니다.

`/Users/y-soo/workspace/codex_projects/projects/e-book/vibecoding/1/webbook/images/_rejected/original-mock-ch02-before-real-replacement/`

## 5. 교체하지 않은 파일과 이유

- `ch02_02_select_image.png`: 샘플 이미지 선택 설명용 컷입니다. 실제 ChatGPT 대화 흐름 컷과 역할이 달라 이번 단계에서는 유지했습니다.
- `ch02_11_first_site_check.png`: 체크리스트 성격의 마무리 컷입니다. 실제 ChatGPT 캡처 교체 범위가 아니므로 이번 단계에서는 유지했습니다.

## 6. 마스킹 또는 크롭한 항목

- 브라우저 주소창 대부분
- ChatGPT 좌측 최근 대화 목록
- 계정 하단 영역
- 불필요한 화면 여백

현재 편집본에는 이메일, 토큰, 저장소 권한, 개인 프로필 상세 정보는 보이지 않습니다.

## 7. 누락된 컷

- 완전한 “전송 전 입력창” 컷은 독립 컷으로 확보하지 못했습니다.
- 대신 실제 전송 직후 화면에서 첨부 이미지, 사용자 프롬프트, 생성 중 상태가 함께 보이는 컷을 `02_attached_image_prompt.png`의 기준 원본으로 사용했습니다.
- GitHub 연동 배포와 타로 사이트 실제 캡처는 이번 작업 범위가 아니므로 진행하지 않았습니다.

## 8. 웹북 Playwright 검증 결과

검증 URL:

`http://127.0.0.1:4180/webbook/?v=first-site-real-20260517`

검증 뷰포트:

- 390x844
- 430x932
- 768x1024
- 1280x900

검증 결과:

- 웹북 전체 이미지 수: 98개
- 깨진 이미지: 0개
- 첫 웹사이트 구간 교체 이미지 로드: 정상
- 390px 가로 넘침: 없음
- 430px 가로 넘침: 없음
- 768px 가로 넘침: 없음
- 1280px 가로 넘침: 없음

저장된 검증 스크린샷:

`/Users/y-soo/workspace/codex_projects/projects/e-book/vibecoding/1/webbook/output/playwright/`

- `first-site-real-390.png`
- `first-site-real-430.png`
- `first-site-real-768.png`
- `first-site-real-1280.png`

## 9. 이미지 수 확인

작업 전후 최상위 최종 이미지 수:

- `webbook/images/*.png`: 98개 유지

## 10. 다음 단계: GitHub 연동 배포 캡처 계획

다음 단계에서는 GitHub 연동 배포 구간만 별도로 진행해야 합니다.

권장 순서:

1. 실제 ChatGPT에서 GitHub 연동 안내 요청 화면을 캡처합니다.
2. GitHub 권한 승인, 계정명, 이메일, 저장소명이 보이는 화면은 먼저 마스킹 기준을 확정합니다.
3. 민감정보가 없는 화면은 실제 캡처를 우선합니다.
4. 민감정보 노출 위험이 큰 화면만 mock 또는 마스킹 캡처로 분리합니다.
5. `ch03_*` 이미지와 매핑한 뒤 `_edited/` 편집본을 먼저 만들고 최종 이미지만 교체합니다.

이번 작업에서는 GitHub 연동 배포 이미지와 타로 사이트 이미지는 수정하지 않았습니다.
