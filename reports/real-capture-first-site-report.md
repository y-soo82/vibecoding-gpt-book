# 첫 웹사이트 실제 캡처 원본 확보 보고서

작성일: 2026-05-17

## 요약

이번 단계는 기존 `webbook/images/*.png` 98개를 교체하지 않고, 첫 번째 실습인 “이미지 한 장으로 첫 웹사이트 만들기”의 실제 캡처 원본을 확보하는 작업입니다.

사용자의 실제 ChatGPT 캡처 2장은 원본 폴더에 보존했습니다. Codex가 직접 제어 가능한 브라우저 백엔드에는 사용자의 Chrome 탭이 연결되지 않았기 때문에, 나머지 ChatGPT 대화 캡처는 이번 단계에서 생성하지 못했습니다. 대신 자동화 가능한 첫 웹사이트 결과 화면은 Playwright로 데스크톱과 모바일 기준 캡처했습니다.

## Chrome 제어 상태

- Google Chrome 실행 상태: 실행 중입니다.
- Codex Chrome Extension 상태:
  - `Profile 1`: 설치 및 활성화 확인됨
  - 현재 브라우저 런타임에서 제어 가능한 백엔드: Codex In-app Browser만 확인됨
- 결론: 사용자의 실제 Chrome 로그인 탭을 Codex가 직접 제어하지 못했습니다.
- 처리: 실제 ChatGPT 화면은 사용자가 제공한 실제 스크린샷을 원본으로 보존하고, 누락 컷은 다음 단계에서 Chrome 연결 복구 후 촬영해야 합니다.

## 생성한 캡처 파일 목록

| 파일 | 생성 상태 | 실제 ChatGPT 화면 여부 | 설명 | 마스킹 필요 여부 |
|---|---|---|---|---|
| `webbook/images/_source-real/chatgpt-first-site/01_chatgpt_before_attach.png` | 누락 | 해당 없음 | Chrome 제어 불가로 새 대화 시작 전 화면을 캡처하지 못했습니다. | 해당 없음 |
| `webbook/images/_source-real/chatgpt-first-site/02_attached_image_prompt.png` | 생성 | 예 | 사용자가 제공한 실제 ChatGPT 캡처입니다. 이미지 첨부와 프롬프트 입력 상태가 보입니다. | 계정명, 브라우저 프로필, Dock, 바탕화면, 최근 대화 목록 |
| `webbook/images/_source-real/chatgpt-first-site/03_generating_answer.png` | 누락 | 해당 없음 | Chrome 제어 불가로 답변 생성 중 상태를 캡처하지 못했습니다. | 해당 없음 |
| `webbook/images/_source-real/chatgpt-first-site/04_answer_done.png` | 누락 | 해당 없음 | Chrome 제어 불가로 답변 완료 화면을 별도 캡처하지 못했습니다. | 해당 없음 |
| `webbook/images/_source-real/chatgpt-first-site/05_html_preview.png` | 생성 | 예 | 사용자가 제공한 실제 ChatGPT 캡처입니다. 생성된 웹사이트 미리보기 화면이 보입니다. | 계정명, 브라우저 프로필, Dock, 바탕화면, 최근 대화 목록 |
| `webbook/images/_source-real/chatgpt-first-site/06_revision_prompt.png` | 누락 | 해당 없음 | Chrome 제어 불가로 수정 요청 입력 화면을 캡처하지 못했습니다. | 해당 없음 |
| `webbook/images/_source-real/chatgpt-first-site/07_revision_result.png` | 누락 | 해당 없음 | Chrome 제어 불가로 수정 후 답변 화면을 캡처하지 못했습니다. | 해당 없음 |
| `webbook/images/_source-real/chatgpt-first-site/08_first_site_desktop.png` | 생성 | 아니오 | 기존 예제 첫 웹사이트를 로컬 서버에서 열고 Playwright로 캡처했습니다. | 없음 |
| `webbook/images/_source-real/chatgpt-first-site/09_first_site_mobile.png` | 생성 | 아니오 | 기존 예제 첫 웹사이트를 390px 모바일 뷰포트로 열고 Playwright로 캡처했습니다. | 없음 |
| `webbook/images/_source-real/final-public-sites/01_first_site_desktop.png` | 생성 | 아니오 | 첫 웹사이트 데스크톱 결과 화면 보관용 중복 원본입니다. | 없음 |
| `webbook/images/_source-real/final-public-sites/02_first_site_mobile.png` | 생성 | 아니오 | 첫 웹사이트 모바일 결과 화면 보관용 중복 원본입니다. | 없음 |

## 생성 수량

- 실제 ChatGPT 화면 원본: 2개
- Playwright 결과 사이트 캡처: 4개
- 필수 ChatGPT 컷 중 누락: 5개
- 기존 `webbook/images/*.png` 교체: 0개

## 실제 생성된 첫 웹사이트 결과 파일 또는 URL

이번 단계에서는 ChatGPT에서 새 HTML을 직접 추출하지 못했습니다. 결과 사이트 캡처는 기존 예제 사이트를 로컬 서버로 열어 생성했습니다.

- 로컬 확인 URL: `http://127.0.0.1:4179/examples/first-site/?v=real-capture-20260517`
- 원본 파일: `examples/first-site/index.html`

## Playwright 데스크톱/모바일 검증 결과

| 캡처 | 뷰포트 | 제목 | 이미지 | 버튼 | 가로 넘침 |
|---|---|---|---|---|---|
| `01_first_site_desktop.png` | 1280x900 | 있음 | 있음 | 있음 | 없음 |
| `08_first_site_desktop.png` | 1280x900 | 있음 | 있음 | 있음 | 없음 |
| `02_first_site_mobile.png` | 390x844 | 있음 | 있음 | 있음 | 없음 |
| `09_first_site_mobile.png` | 390x844 | 있음 | 있음 | 있음 | 없음 |

## 기존 이미지와 매핑 후보

| 새 원본 | 기존 교체 후보 | 비고 |
|---|---|---|
| `02_attached_image_prompt.png` | `ch02_03_attach_image.png`, `ch02_04_first_site_prompt.png` | 실제 ChatGPT 입력 장면으로 교체 후보입니다. |
| `05_html_preview.png` | `ch02_06_answer_ready.png`, `ch02_07_first_site_desktop.png` | 실제 ChatGPT 결과 미리보기 장면으로 교체 후보입니다. |
| `08_first_site_desktop.png` | `ch02_07_first_site_desktop.png` | 결과 화면 데스크톱 재촬영 후보입니다. |
| `09_first_site_mobile.png` | `ch02_10_first_site_mobile.png` | 결과 화면 모바일 재촬영 후보입니다. |

## 누락된 컷

- `01_chatgpt_before_attach.png`
- `03_generating_answer.png`
- `04_answer_done.png`
- `06_revision_prompt.png`
- `07_revision_result.png`

누락 사유는 모두 동일합니다. 현재 Codex 브라우저 런타임이 사용자의 실제 Chrome 로그인 탭을 제어하지 못했습니다.

## 마스킹 필요 항목

사용자가 제공한 실제 ChatGPT 캡처 2장에는 다음 항목이 보입니다.

- Chrome 프로필 아이콘과 계정 이니셜
- ChatGPT 왼쪽 최근 대화 목록
- 브라우저 주소창의 대화 URL
- macOS Dock
- 바탕화면 일부
- 브라우저 확장/상단 UI 일부

출판용 편집 단계에서는 위 항목을 크롭하거나 마스킹해야 합니다. 단, ChatGPT 입력창, 첨부 이미지 썸네일, 프롬프트 문장, 결과 미리보기 영역은 보존해야 합니다.

## 다음 단계

1. Codex Chrome Extension이 활성화된 `Profile 1`을 실제 제어 백엔드로 연결할 수 있게 Chrome 연결을 복구합니다.
2. 같은 대화 또는 새 대화에서 누락된 5개 ChatGPT 컷을 실제 화면으로 캡처합니다.
3. ChatGPT에서 생성된 HTML을 직접 추출하거나, 결과 미리보기 화면을 기준으로 데스크톱/모바일 결과 캡처를 다시 생성합니다.
4. 원본 캡처가 모두 모이면 `_edited/` 폴더에서 크롭, 마스킹, 번호 오버레이를 적용합니다.
5. 최종 선별 후 기존 `webbook/images/*.png`와 매핑해 교체합니다.

## 이번 단계에서 하지 않은 일

- 기존 최종 이미지 98개를 덮어쓰지 않았습니다.
- 웹북 레이아웃을 수정하지 않았습니다.
- GitHub Pages에 배포하지 않았습니다.
- GitHub 연동 배포와 타로 사이트 캡처는 진행하지 않았습니다.
