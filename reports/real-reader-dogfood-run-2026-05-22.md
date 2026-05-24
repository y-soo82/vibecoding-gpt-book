# 실제 독자 따라하기 진행 기록

작성일: 2026-05-22

## 목표

독자가 책을 처음부터 끝까지 읽고, 책의 프롬프트(prompt)를 실제 ChatGPT에 입력하며, 첫 웹사이트와 타로(tarot) 사이트를 만들 수 있는지 확인합니다.

## 현재 진행 결과

| 단계 | 상태 | 기록 |
| --- | --- | --- |
| 전체 웹북 구조 확인 | 진행 | 기존 HTML과 이미지 목록을 확인했습니다. |
| 이미지 출처 분류 | 진행 | 현재 full.html 기준 50장을 분류했습니다. |
| ChatGPT 접속 확인 | 진행 | 사용자가 로그인한 일반 Chrome의 ChatGPT 세션을 Codex Chrome Extension으로 연결했습니다. |
| ChatGPT 로그인 확인 | 진행 | ChatGPT 사이드바, 프로필, 새 채팅 화면이 확인됐습니다. |
| Chapter 2 실제 프롬프트 입력 | 진행 | 버블 공연 사진을 첨부한 뒤 `first-site` 프롬프트(prompt) 전문을 실제 ChatGPT에 입력했습니다. |
| 버블 사진 실제 첨부 | 진행 | `/Users/y-soo/workspace/codex_projects/projects/e-book/docs/첫사이트만들기.jpeg`를 실제 ChatGPT 탭에 첨부했습니다. |
| 첫 웹사이트 실제 생성 | 진행 | ChatGPT가 `index.html`과 이미지 파일 기준의 첫 웹사이트를 생성했습니다. |
| 첫 웹사이트 실제 결과 확인 | 진행 | 생성된 HTML 원문을 복사해 로컬 결과 폴더에 저장하고, 데스크톱과 모바일 화면을 캡처했습니다. |
| GitHub 연결/배포 실제 캡처 | 미진행 | ChatGPT 생성 파일 다운로드는 Chrome에서 차단됐고, GitHub 배포 단계는 아직 진행하지 않았습니다. |
| Chapter 3 타로 프롬프트 입력 | 미진행 | Chapter 2 실제 실행 후 진행해야 합니다. |
| 타로 HTML 결과 확인 | 미진행 | 실제 GPT 결과물이 아직 없습니다. |
| GitHub Pages 배포 URL 확인 | 미진행 | 실제 배포가 아직 없습니다. |

## 막힌 지점

초기 별도 Playwright/Chrome 프로필은 ChatGPT 로그인 상태가 아니어서 사용할 수 없었습니다. 이후 사용자가 로그인한 일반 Chrome 탭을 연결해 실제 실행을 진행했습니다.

파일 업로드는 Codex Chrome Extension의 파일 URL 접근 권한을 켠 뒤 새 ChatGPT 탭에서 성공했습니다.

ChatGPT의 `index.html 바로 보기/다운로드` 버튼은 `chatgpt.com/backend-api/estuary/content...` 주소로 이동했지만 Chrome에서 `ERR_BLOCKED_BY_CLIENT`로 차단됐습니다. 직접 URL 다운로드도 HTTP 403으로 실패했습니다. 따라서 이번 단계에서는 코드 보기 탭의 복사 버튼으로 실제 생성 HTML 원문을 확보했습니다.

## 생성된 실제 증거 파일

| 파일 | 의미 |
| --- | --- |
| `webbook/images/_source-real/real-dogfood-2026-05-22/03_new_tab_after_real_upload.jpg` | 실제 ChatGPT 새 탭에 버블 사진이 첨부된 화면 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/04_prompt_filled_before_send.jpg` | 실제 프롬프트(prompt) 입력 후 전송 전 화면 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/05_after_send_generating.jpg` | 실제 답변 생성 중 화면 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/06_answer_done.jpg` | 실제 답변 완료 화면 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/09_chatgpt_preview_area.jpg` | 실제 ChatGPT 미리보기 결과 화면 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/11_code_tab.jpg` | 실제 생성 HTML 코드 보기 화면 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/generated-first-site/index.html` | ChatGPT가 생성한 실제 HTML 원문 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/12_generated_first_site_browser_desktop.jpg` | 실제 생성 HTML의 데스크톱 브라우저 결과 |
| `webbook/images/_source-real/real-dogfood-2026-05-22/14_generated_first_site_browser_mobile.jpg` | 실제 생성 HTML의 모바일 브라우저 결과 |

## 출판용 개인정보 가림 기준

ChatGPT 실제 캡처 원본에는 왼쪽 사이드바의 최근 대화와 계정 정보가 포함됩니다. 책에 삽입할 때는 원본을 그대로 쓰지 않고, 왼쪽 사이드바를 ChatGPT 배경색과 동일하게 가린 출판용 사본을 사용합니다.

출판용 가림 사본은 아래 폴더에 저장했습니다.

- `webbook/images/_source-real/real-dogfood-2026-05-22/_redacted-for-book/`

이 폴더의 이미지는 실제 ChatGPT 입력/응답/코드/미리보기 본문은 유지하고, 왼쪽 최근내역 영역만 가린 파일입니다.

## 현재 판정

Chapter 2의 첫 웹사이트 생성은 실제 ChatGPT 입력, 실제 이미지 첨부, 실제 HTML 생성, 실제 브라우저 결과 확인까지 진행됐습니다. 다만 GitHub 연결, GitHub Pages 배포, 배포 URL 확인은 아직 미진행입니다.
