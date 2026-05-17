# 실제 캡처 중심 이미지 재제작 계획

작성일: 2026-05-17

## 결론

기존 98개 이미지는 최종본이 아니라 임시 이미지 묶음으로 봐야 합니다. 기획서의 핵심은 실제 ChatGPT 대화창에서 프롬프트를 넣고, ChatGPT 답변이 나오고, 실제 결과물이 열리는 장면을 책 이미지로 보여 주는 것입니다. 따라서 다음 단계는 디자인 수정이 아니라 실제 캡처 원본 확보입니다.

## 생성한 원본 폴더 구조

- `webbook/images/_source-real/`
- `webbook/images/_source-real/chatgpt-first-site/`
- `webbook/images/_source-real/chatgpt-github-deploy/`
- `webbook/images/_source-real/tarot-build/`
- `webbook/images/_source-real/final-public-sites/`
- `webbook/images/_edited/`
- `webbook/images/_rejected/`

기존 98개 이미지는 덮어쓰거나 삭제하지 않았습니다.

## 사용자가 제공한 실제 ChatGPT 캡처 예시와 현재 이미지의 차이

- 제공 예시는 실제 chatgpt.com 주소창, 실제 ChatGPT 사이드바, 실제 이미지 첨부 썸네일, 실제 프롬프트 입력 문장이 보입니다.
- 제공 예시는 실제 대화 결과 화면과 생성된 사이트 미리보기가 연결되어 있습니다.
- 현재 이미지는 이런 실제 대화 맥락이 약하고, mock 화면이나 설명 카드가 많아 독자가 같은 화면을 찾기 어렵습니다.
- 제공 예시는 출판 전 크롭/마스킹이 필요하지만 방향은 맞습니다. 현재 이미지는 방향 자체를 다시 맞춰야 합니다.

## 핵심 실습 흐름별 필수 실제 캡처

### 첫 웹사이트 만들기

| 필수 컷 | 캡처 방식 | 저장 위치 | 기존 이미지 매핑 |
|---|---|---|---|
| 이미지 첨부 전 ChatGPT 화면 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-first-site/01_chatgpt_before_attach.png` | 기존 ch02_03 또는 ch01_01 계열 교체 |
| 이미지 첨부 후 프롬프트 입력 화면 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-first-site/02_attached_image_prompt.png` | 사용자 예시 이미지와 같은 실제 입력 장면 |
| ChatGPT 답변 생성 중 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-first-site/03_generating_answer.png` | 기존 ch02_05 교체 |
| ChatGPT 답변 완료 화면 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-first-site/04_answer_done.png` | 기존 ch02_06 교체 |
| 생성된 HTML/미리보기 화면 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-first-site/05_html_preview.png` | 기존 ch02_07 전 단계 보강 |
| 브라우저 첫 웹사이트 데스크톱 | Playwright 가능 | `webbook/images/_source-real/final-public-sites/01_first_site_desktop.png` | 기존 ch02_07 재촬영 |
| 브라우저 첫 웹사이트 모바일 | Playwright 가능 | `webbook/images/_source-real/final-public-sites/02_first_site_mobile.png` | 기존 ch02_10 재촬영 |
| 수정 요청 프롬프트 입력 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-first-site/06_revision_prompt.png` | 기존 ch02_08 교체 |
| 수정 후 결과 화면 | Chrome 로그인 세션 + Playwright | `webbook/images/_source-real/chatgpt-first-site/07_revision_result.png` | 기존 ch02_09 교체 |

### GitHub 연동 배포

| 필수 컷 | 캡처 방식 | 저장 위치 | 기존 이미지 매핑 |
|---|---|---|---|
| ChatGPT에서 GitHub 연동 안내 요청 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-github-deploy/01_ask_github_connector.png` | 실제 대화 장면 |
| 커넥터/설정 진입 안내 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-github-deploy/02_connector_instruction.png` | 실제 ChatGPT 답변 장면 |
| GitHub 연결 화면 | Chrome 로그인 세션 또는 사용자 협조 | `webbook/images/_source-real/chatgpt-github-deploy/03_github_connect.png` | 민감정보 마스킹 |
| 권한 승인 화면 | 사용자 협조 또는 mock 허용 | `webbook/images/_source-real/chatgpt-github-deploy/04_authorize_masked.png` | 권한/계정 정보 마스킹 |
| ChatGPT 배포 요청 프롬프트 입력 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-github-deploy/05_deploy_prompt.png` | 실제 입력 장면 |
| ChatGPT 배포 진행 답변 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-github-deploy/06_deploy_progress.png` | 실제 답변 장면 |
| ChatGPT 최종 URL 답변 | Chrome 로그인 세션 | `webbook/images/_source-real/chatgpt-github-deploy/07_final_url_reply.png` | 저장소명/계정명 예시 처리 |
| 공개 URL 데스크톱 확인 | Playwright 가능 | `webbook/images/_source-real/final-public-sites/03_first_public_desktop.png` | 실제 GitHub Pages URL |
| 공개 URL 모바일 확인 | Playwright 가능 | `webbook/images/_source-real/final-public-sites/04_first_public_mobile.png` | 390px/430px 확인 |

### 타로 사이트 만들기

| 필수 컷 | 캡처 방식 | 저장 위치 | 기존 이미지 매핑 |
|---|---|---|---|
| 타로 사이트 디자인 프롬프트 입력 | Chrome 로그인 세션 | `webbook/images/_source-real/tarot-build/01_design_prompt.png` | 실제 입력 장면 |
| ChatGPT 답변 완료 | Chrome 로그인 세션 | `webbook/images/_source-real/tarot-build/02_design_answer_done.png` | 실제 답변 장면 |
| 타로 메인 화면 결과 | Playwright 가능 | `webbook/images/_source-real/tarot-build/03_tarot_home.png` | 기존 결과 재촬영 |
| 주제 선택 화면 결과 | Playwright 가능 | `webbook/images/_source-real/tarot-build/04_tarot_topic.png` | 기존 결과 재촬영 |
| 질문 입력 화면 결과 | Playwright 가능 | `webbook/images/_source-real/tarot-build/05_tarot_question.png` | 기존 결과 재촬영 |
| 카드 선택 화면 결과 | Playwright 가능 | `webbook/images/_source-real/tarot-build/06_tarot_spread.png` | 기존 결과 재촬영 |
| 카드 3장 선택 완료 | Playwright 가능 | `webbook/images/_source-real/tarot-build/07_three_cards_selected.png` | 기존 결과 재촬영 |
| 결과 화면 | Playwright 가능 | `webbook/images/_source-real/tarot-build/08_tarot_result.png` | 기존 결과 재촬영 |
| 카드 상세 보기 | Playwright 가능 | `webbook/images/_source-real/tarot-build/09_card_detail.png` | 기존 결과 재촬영 |
| 최근 이력 화면 | Playwright 가능 | `webbook/images/_source-real/tarot-build/10_recent_history.png` | 기존 결과 재촬영 |
| 모바일 결과 화면 | Playwright 가능 | `webbook/images/_source-real/tarot-build/11_mobile_result.png` | 390px/430px 재촬영 |


## 캡처 방식 판단

- Playwright 가능: 예제 사이트 결과 화면, 공개 URL, 타로 사이트 화면, 모바일/데스크톱 결과 확인.
- Chrome 로그인 세션 필요: ChatGPT 프롬프트 입력, 이미지 첨부, 답변 생성, 답변 완료, ChatGPT GitHub 연동 안내.
- 사용자 협조 필요: GitHub 권한 승인, 커넥터 연결, 이메일 인증, 실제 계정 권한이 필요한 화면.
- mock 허용: 권한 승인, 이메일 인증, 계정명/이메일/토큰이 드러나는 화면만 제한적으로 허용.

## 마스킹 기준

- 이메일 주소는 `reader@example.com`처럼 예시 주소로 처리합니다.
- GitHub 계정명은 `mybook2026` 또는 `vibe-reader`처럼 예시명으로 처리합니다.
- 저장소명은 책 실습명과 맞춰 `my-first-page`, `tarot-reading-site`를 씁니다.
- 권한 범위, 토큰, 개인 저장소명, 개인 대화 제목, 브라우저 프로필 정보는 가립니다.
- 독자가 눌러야 하는 버튼과 입력칸은 가리지 않습니다.

## 다음 단계 실제 캡처 작업 순서

1. Chrome 로그인 세션에서 ChatGPT 첫 웹사이트 실습을 새 대화로 시작합니다.
2. 이미지 첨부 전, 첨부 후 프롬프트 입력, 답변 생성 중, 답변 완료를 순서대로 캡처합니다.
3. ChatGPT가 만든 HTML/미리보기 또는 결과 화면을 캡처합니다.
4. 결과물을 로컬 또는 공개 URL로 열어 데스크톱/모바일을 Playwright로 캡처합니다.
5. 수정 요청 프롬프트와 수정 후 결과를 다시 캡처합니다.
6. GitHub 연동 배포 흐름은 민감정보 마스킹 기준을 적용해 실제 가능한 화면부터 캡처합니다.
7. 타로 사이트는 실제 프롬프트 입력 장면과 결과 화면을 분리해 캡처합니다.
8. 캡처 원본은 `_source-real/`에 저장하고, 편집본은 `_edited/`에 저장합니다.
9. 최종 선별 이미지만 기존 `webbook/images/*.png`와 매핑해 교체합니다.
10. 교체 후 웹북과 EPUB 기준으로 모바일 390px, 430px, 태블릿 768px, 데스크톱 1280px 검증을 진행합니다.

## 첫 실행 우선순위

가장 먼저 다시 촬영할 컷은 첫 웹사이트 만들기 흐름입니다. 이유는 책의 첫 성취 경험이고, 사용자가 제공한 실제 캡처 예시와 바로 연결되기 때문입니다. GitHub 연동과 타로는 그 다음 순서로 진행합니다.

## 이번 단계에서 하지 않은 일

- 기존 이미지 98개를 덮어쓰지 않았습니다.
- 웹북 레이아웃을 수정하지 않았습니다.
- GitHub Pages에 배포하지 않았습니다.
- 실제 새 캡처를 아직 생성하지 않았습니다.
