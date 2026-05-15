# Phase 8~9 이미지 완성 보고서

## 결과 요약

- Phase 8 자료 화면 자동 캡처: 14개 생성
- Phase 9 수동 확인 필요 컷 mock 대체 캡처: 30개 생성
- 실패 이미지: 0개
- 현재 `webbook/images/` PNG 수: 98개
- 남은 이미지 자리: 0개

## 민감정보 처리 기준

- 실제 ChatGPT/GitHub 계정, 이메일, 토큰, 개인 저장소 이름은 캡처하지 않았습니다.
- 로그인, 권한 승인, 최종 주소 답변 화면은 출판용 mock 화면으로 대체했습니다.
- mock 화면에는 실제 화면과 다를 수 있음을 보고서에 남기며, 책 본문에서는 독자의 행동 흐름을 이해시키는 용도로 사용합니다.
- 이미지 번호는 실제 UI 글자보다 작게 배치하고 버튼, 입력칸, 본문을 가리지 않게 했습니다.

## Phase 8 생성 목록

- `ch00_01_vibecoding_flow.png` - 말로 부탁하고 결과를 받고 다시 부탁하는 흐름도
- `ch00_05_tool_scope.png` - 사용하는 도구와 사용하지 않는 도구를 나눈 표
- `ch00_07_next_chatgpt.png` - Chapter 1로 이어지는 학습 지도
- `ch01_02_new_chat.png` - 새 채팅 버튼 클로즈업
- `ch01_04_attach_button.png` - 첨부 단추 클로즈업
- `ch01_05_send_button.png` - 보내기 단추 클로즈업
- `ch02_01_first_site_preview.png` - 이미지 한 장으로 만든 첫 웹사이트 완성 예시
- `ch02_07_first_site_desktop.png` - 첫 웹사이트 데스크톱 결과 화면
- `ch02_11_first_site_check.png` - 첫 번째 사이트 완성 체크리스트
- `ch03_15_deploy_fallback.png` - 직접 배포 실패 답변과 보조 경로 체크리스트
- `ch06_18_history_result.png` - 최근 이력 화면 결과
- `ch07_01_deploy_recap.png` - 첫 번째 사이트 배포 흐름 요약
- `ch09_01_problem_table.png` - 막힘 상황 유형 표
- `ch09_04_image_limit_broken.png` - 이미지 생성 한도와 깨진 이미지 대응 화면

## Phase 9 mock 대체 목록

- `ch00_01_book_start.png` - 책 표지와 ChatGPT 대화창이 함께 보이는 시작 화면
- `ch00_05_ready_check.png` - ChatGPT 계정, GitHub 계정, 브라우저, 인터넷 연결 체크 화면
- `ch00_04_beginner_market.png` - 일반 사용자가 ChatGPT로 웹사이트를 만드는 시작 단계 그래픽
- `ch01_01_chatgpt_home.png` - ChatGPT 첫 화면 전체
- `ch01_03_input_box.png` - ChatGPT 입력창 클로즈업
- `ch01_06_generating.png` - ChatGPT 답변 생성 중 화면
- `ch01_07_answer_done.png` - ChatGPT 답변 완료 화면
- `ch01_08_skip_menus.png` - 지금은 몰라도 되는 ChatGPT 메뉴 표시
- `ch02_03_attach_image.png` - ChatGPT 이미지 첨부 직전 화면
- `ch02_05_wait_answer.png` - 첫 사이트 요청 후 ChatGPT 답변 생성 화면
- `ch02_06_answer_ready.png` - 첫 사이트 결과 답변이 나온 ChatGPT 화면
- `ch03_01_github_shelf.png` - GitHub를 공개 책장으로 비유한 그림
- `ch03_02_github_home.png` - GitHub 메인 화면 전체
- `ch03_03_signup_login.png` - GitHub 가입 로그인 버튼 클로즈업
- `ch03_04_github_signup.png` - GitHub 가입 화면 입력칸
- `ch03_05_github_verify_login.png` - GitHub 이메일 인증 또는 로그인 화면
- `ch03_06_chatgpt_connector_entry.png` - ChatGPT 설정 또는 커넥터 진입 화면
- `ch03_07_github_connector.png` - ChatGPT 커넥터 목록의 GitHub 화면
- `ch03_08_github_authorize.png` - GitHub 권한 승인 화면
- `ch03_09_connector_done.png` - ChatGPT GitHub 연결 완료 화면
- `ch03_11_deploy_progress.png` - ChatGPT 배포 진행 답변 화면
- `ch03_12_final_url.png` - ChatGPT 최종 주소 답변 화면
- `ch03_13_first_site_public_desktop.png` - 첫 사이트 데스크톱 외부 URL 결과 화면
- `ch03_14_first_site_public_mobile.png` - 첫 사이트 모바일 외부 URL 결과 화면
- `ch05_02_image_limit.png` - ChatGPT 이미지 생성 한도 안내 화면
- `ch07_02_connector_check.png` - ChatGPT GitHub 연결 상태 확인 화면
- `ch07_06_tarot_final_url.png` - 타로 사이트 최종 주소 답변
- `ch07_07_tarot_public_desktop.png` - 타로 사이트 데스크톱 외부 URL 결과
- `ch07_08_tarot_public_mobile.png` - 타로 사이트 모바일 외부 URL 결과
- `ch09_03_pages_wait.png` - GitHub Pages 대기와 주소 확인 안내

## 실패 목록

- 실패한 이미지는 없습니다.

## 웹북 표시 검증

- 390px: 실제 이미지 98개, placeholder 0개, 깨진 이미지 0개, 가로 넘침 없음, 캡처 `webbook/output/playwright/phase8-9-webbook-verify-390.png`
- 430px: 실제 이미지 98개, placeholder 0개, 깨진 이미지 0개, 가로 넘침 없음, 캡처 `webbook/output/playwright/phase8-9-webbook-verify-430.png`
- 768px: 실제 이미지 98개, placeholder 0개, 깨진 이미지 0개, 가로 넘침 없음, 캡처 `webbook/output/playwright/phase8-9-webbook-verify-768.png`
- 1280px: 실제 이미지 98개, placeholder 0개, 깨진 이미지 0개, 가로 넘침 없음, 캡처 `webbook/output/playwright/phase8-9-webbook-verify-1280.png`

## 출판 전 주의

- mock 화면은 실제 ChatGPT/GitHub UI와 완전히 같다는 의미가 아닙니다.
- 실제 화면 캡처가 필요할 경우 별도 캡처용 계정과 마스킹 기준을 먼저 확정해야 합니다.
- 현재 목적은 비개발자 독자가 대화 배포 흐름을 이해할 수 있도록 안전한 출판용 이미지를 채우는 것입니다.
