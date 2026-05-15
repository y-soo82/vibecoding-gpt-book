# Phase 5 캡처 계획

## 목표

현재 웹북의 이미지 placeholder 98개를 실제 캡처 이미지로 교체하기 위한 Playwright 캡처 파이프라인을 준비합니다.

## 고정 원칙

- 모든 캡처 이미지는 Codex가 Playwright로 직접 실행해 생성합니다.
- 수동 캡처나 임의 이미지 대체를 기본 방식으로 쓰지 않습니다.
- ChatGPT와 GitHub처럼 로그인, 권한, 계정 상태가 필요한 화면은 `수동 확인 필요 컷`으로 표시합니다.
- 자동화가 막히는 컷은 대체 캡처 계획을 문서화한 뒤 진행합니다.
- 이미지 번호는 실제 UI 글자보다 약 20% 작게 배치합니다.
- 이미지 번호는 버튼, 입력칸, 본문 글자를 가리지 않습니다.
- 반복 이미지와 반복 설명으로 콘텐츠 품질이 낮아지지 않게 중복 컷을 검토합니다.

## 현재 수치

- 전체 이미지 자리: 98개
- 자동화 가능 컷: 68개
- 수동 확인 필요 컷: 30개

## 캡처 방식별 수량

- 수동 확인 필요 컷: 30개
- 예제 사이트 자동 캡처: 34개
- 웹북 자동 캡처: 20개
- 자료 화면 자동 캡처: 14개

## 중복 컷 검토

- 파일명 기준 중복 컷은 없습니다.

## ChatGPT/GitHub 로그인 화면 대체 계획

- 먼저 Playwright로 로그인 전 공개 화면, 로그인 화면, 권한 승인 진입 화면까지 자동 접근 가능한지 확인합니다.
- 실제 계정 정보, 이메일, 토큰, 개인 저장소가 보이는 화면은 캡처 전 별도 캡처용 계정 또는 마스킹 기준을 정합니다.
- 자동 접근이 막히는 화면은 `수동 확인 필요 컷`으로 유지하고, 화면 구성 재현용 로컬 mock 페이지를 만든 뒤 Playwright로 캡처하는 대체안을 사용합니다.
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
2. `webbook/scripts/capture-placeholder-list.js`로 목록을 최신화합니다.
3. `webbook/scripts/capture-webbook.js`로 390px, 430px, 768px, 1280px 테스트 캡처를 생성합니다.
4. 자동 캡처 가능 컷부터 실제 PNG를 `webbook/images/`에 저장합니다.
5. 저장 후 웹북을 다시 열어 placeholder가 실제 이미지로 교체되는지 확인합니다.

## 98개 이미지 자리 전체 목록

| 번호 | 파일명 | 원고 위치 | 이미지 설명 | 캡처 방식 | 자동화 | 우선순위 |
|---:|---|---|---|---|---|---|
| 1 | `ch00_01_book_start.png` | `manuscript/00_intro.md:11` | 책 표지와 ChatGPT 대화창이 함께 보이는 시작 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 2 | `ch00_02_two_results.png` | `manuscript/00_intro.md:20` | 첫 웹사이트와 타로 사이트 완성 화면 미리보기 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 3 | `ch00_03_responsive_book.png` | `manuscript/00_intro.md:29` | 휴대전화와 데스크톱에서 같은 전자책이 열려 있는 화면 | 웹북 자동 캡처 | 가능 | 상 |
| 4 | `ch00_04_prompt_copy.png` | `manuscript/00_intro.md:38` | 3줄 프롬프트 박스와 우측 상단 복사하기 버튼 | 웹북 자동 캡처 | 가능 | 상 |
| 5 | `ch00_05_ready_check.png` | `manuscript/00_intro.md:51` | ChatGPT 계정, GitHub 계정, 브라우저, 인터넷 연결 체크 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 6 | `ch00_01_vibecoding_flow.png` | `manuscript/01_ai_vibecoding.md:11` | 말로 부탁하고 결과를 받고 다시 부탁하는 흐름도 | 자료 화면 자동 캡처 | 가능 | 중 |
| 7 | `ch00_02_what_is_vibecoding.png` | `manuscript/01_ai_vibecoding.md:20` | 아이디어에서 웹사이트까지 이어지는 간단한 단계 카드 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 8 | `ch00_03_ai_coding_market.png` | `manuscript/01_ai_vibecoding.md:29` | AI 코딩 도구 사용 확산을 보여 주는 카드형 그래픽 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 9 | `ch00_04_beginner_market.png` | `manuscript/01_ai_vibecoding.md:38` | 일반 사용자가 ChatGPT로 웹사이트를 만드는 시작 단계 그래픽 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 10 | `ch00_05_tool_scope.png` | `manuscript/01_ai_vibecoding.md:47` | 사용하는 도구와 사용하지 않는 도구를 나눈 표 | 자료 화면 자동 캡처 | 가능 | 중 |
| 11 | `ch00_06_result_preview.png` | `manuscript/01_ai_vibecoding.md:56` | 첫 웹사이트와 타로 사이트의 완성 화면 비교 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 12 | `ch00_07_next_chatgpt.png` | `manuscript/01_ai_vibecoding.md:65` | Chapter 1로 이어지는 학습 지도 | 자료 화면 자동 캡처 | 가능 | 중 |
| 13 | `ch01_01_chatgpt_home.png` | `manuscript/02_chatgpt_ui.md:11` | ChatGPT 첫 화면 전체 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 14 | `ch01_02_new_chat.png` | `manuscript/02_chatgpt_ui.md:20` | 새 채팅 버튼 클로즈업 | 자료 화면 자동 캡처 | 가능 | 중 |
| 15 | `ch01_03_input_box.png` | `manuscript/02_chatgpt_ui.md:29` | ChatGPT 입력창 클로즈업 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 16 | `ch01_04_attach_button.png` | `manuscript/02_chatgpt_ui.md:38` | 첨부 단추 클로즈업 | 자료 화면 자동 캡처 | 가능 | 중 |
| 17 | `ch01_05_send_button.png` | `manuscript/02_chatgpt_ui.md:47` | 보내기 단추 클로즈업 | 자료 화면 자동 캡처 | 가능 | 중 |
| 18 | `ch01_06_generating.png` | `manuscript/02_chatgpt_ui.md:56` | ChatGPT 답변 생성 중 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 19 | `ch01_07_answer_done.png` | `manuscript/02_chatgpt_ui.md:65` | ChatGPT 답변 완료 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 20 | `ch01_08_skip_menus.png` | `manuscript/02_chatgpt_ui.md:74` | 지금은 몰라도 되는 ChatGPT 메뉴 표시 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 21 | `ch01_09_prompt_structure.png` | `manuscript/02_chatgpt_ui.md:83` | 목적, 재료, 원하는 결과로 나눈 부탁 문장 카드 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 22 | `ch02_01_first_site_preview.png` | `manuscript/03_first_site.md:11` | 이미지 한 장으로 만든 첫 웹사이트 완성 예시 | 자료 화면 자동 캡처 | 가능 | 중 |
| 23 | `ch02_02_select_image.png` | `manuscript/03_first_site.md:20` | 첫 사이트에 사용할 이미지 예시 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 24 | `ch02_03_attach_image.png` | `manuscript/03_first_site.md:29` | ChatGPT 이미지 첨부 직전 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 25 | `ch02_04_first_site_prompt.png` | `manuscript/03_first_site.md:38` | 첫 사이트 제작 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 26 | `ch02_05_wait_answer.png` | `manuscript/03_first_site.md:51` | 첫 사이트 요청 후 ChatGPT 답변 생성 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 27 | `ch02_06_answer_ready.png` | `manuscript/03_first_site.md:60` | 첫 사이트 결과 답변이 나온 ChatGPT 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 28 | `ch02_07_first_site_desktop.png` | `manuscript/03_first_site.md:69` | 첫 웹사이트 데스크톱 결과 화면 | 자료 화면 자동 캡처 | 가능 | 중 |
| 29 | `ch02_08_revise_prompt.png` | `manuscript/03_first_site.md:78` | 첫 사이트 수정 요청 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 30 | `ch02_09_revised_result.png` | `manuscript/03_first_site.md:91` | 첫 사이트 수정 전후 비교 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 31 | `ch02_10_first_site_mobile.png` | `manuscript/03_first_site.md:100` | 첫 사이트 모바일 결과 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 32 | `ch02_11_first_site_check.png` | `manuscript/03_first_site.md:109` | 첫 번째 사이트 완성 체크리스트 | 자료 화면 자동 캡처 | 가능 | 중 |
| 33 | `ch03_01_github_shelf.png` | `manuscript/04_github_connector_deploy.md:11` | GitHub를 공개 책장으로 비유한 그림 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 34 | `ch03_02_github_home.png` | `manuscript/04_github_connector_deploy.md:20` | GitHub 메인 화면 전체 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 35 | `ch03_03_signup_login.png` | `manuscript/04_github_connector_deploy.md:29` | GitHub 가입 로그인 버튼 클로즈업 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 36 | `ch03_04_github_signup.png` | `manuscript/04_github_connector_deploy.md:38` | GitHub 가입 화면 입력칸 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 37 | `ch03_05_github_verify_login.png` | `manuscript/04_github_connector_deploy.md:47` | GitHub 이메일 인증 또는 로그인 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 38 | `ch03_06_chatgpt_connector_entry.png` | `manuscript/04_github_connector_deploy.md:56` | ChatGPT 설정 또는 커넥터 진입 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 39 | `ch03_07_github_connector.png` | `manuscript/04_github_connector_deploy.md:65` | ChatGPT 커넥터 목록의 GitHub 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 40 | `ch03_08_github_authorize.png` | `manuscript/04_github_connector_deploy.md:74` | GitHub 권한 승인 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 41 | `ch03_09_connector_done.png` | `manuscript/04_github_connector_deploy.md:83` | ChatGPT GitHub 연결 완료 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 42 | `ch03_10_deploy_prompt.png` | `manuscript/04_github_connector_deploy.md:92` | 첫 사이트 배포 요청 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 43 | `ch03_11_deploy_progress.png` | `manuscript/04_github_connector_deploy.md:105` | ChatGPT 배포 진행 답변 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 44 | `ch03_12_final_url.png` | `manuscript/04_github_connector_deploy.md:114` | ChatGPT 최종 주소 답변 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 45 | `ch03_13_first_site_public_desktop.png` | `manuscript/04_github_connector_deploy.md:123` | 첫 사이트 데스크톱 외부 URL 결과 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 46 | `ch03_14_first_site_public_mobile.png` | `manuscript/04_github_connector_deploy.md:132` | 첫 사이트 모바일 외부 URL 결과 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 47 | `ch03_15_deploy_fallback.png` | `manuscript/04_github_connector_deploy.md:141` | 직접 배포 실패 답변과 보조 경로 체크리스트 | 자료 화면 자동 캡처 | 가능 | 중 |
| 48 | `ch04_01_tarot_preview.png` | `manuscript/05_tarot_preview.md:11` | 타로 사이트 전체 완성 미리보기 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 49 | `ch04_02_tarot_home.png` | `manuscript/05_tarot_preview.md:20` | 타로 사이트 메인 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 50 | `ch04_03_tarot_topic.png` | `manuscript/05_tarot_preview.md:29` | 타로 사이트 주제 선택 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 51 | `ch04_04_tarot_question.png` | `manuscript/05_tarot_preview.md:38` | 타로 사이트 질문 입력 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 52 | `ch04_05_tarot_spread.png` | `manuscript/05_tarot_preview.md:47` | 타로 사이트 카드 뽑기 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 53 | `ch04_06_tarot_result.png` | `manuscript/05_tarot_preview.md:56` | 타로 사이트 결과 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 54 | `ch04_07_tarot_map.png` | `manuscript/05_tarot_preview.md:65` | 타로 사이트 화면 제작 순서 지도 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 55 | `ch05_01_tarot_78_cards.png` | `manuscript/06_tarot_assets.md:11` | 타로카드 78장 구조 안내 카드 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 56 | `ch05_02_image_limit.png` | `manuscript/06_tarot_assets.md:20` | ChatGPT 이미지 생성 한도 안내 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 57 | `ch05_03_card_sample_1_prompt.png` | `manuscript/06_tarot_assets.md:29` | 샘플 카드 1 생성 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 58 | `ch05_04_card_sample_1_result.png` | `manuscript/06_tarot_assets.md:42` | 샘플 카드 1 생성 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 59 | `ch05_05_card_sample_2_prompt.png` | `manuscript/06_tarot_assets.md:51` | 샘플 카드 2 생성 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 60 | `ch05_06_card_sample_2_result.png` | `manuscript/06_tarot_assets.md:64` | 샘플 카드 2 생성 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 61 | `ch05_07_provided_assets.png` | `manuscript/06_tarot_assets.md:73` | 제공 타로 이미지 자료 폴더 예시 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 62 | `ch05_08_image_check.png` | `manuscript/06_tarot_assets.md:82` | 카드 이미지 정상 표시와 깨짐 비교 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 63 | `ch06_01_build_flow.png` | `manuscript/07_tarot_build.md:11` | 타로 사이트 제작 전체 흐름 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 64 | `ch06_02_design_prompt.png` | `manuscript/07_tarot_build.md:20` | 타로 사이트 공통 디자인 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 65 | `ch06_03_design_result.png` | `manuscript/07_tarot_build.md:33` | 타로 사이트 공통 디자인 결과 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 66 | `ch06_04_main_prompt.png` | `manuscript/07_tarot_build.md:42` | 타로 메인 화면 제작 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 67 | `ch06_05_main_result.png` | `manuscript/07_tarot_build.md:55` | 타로 메인 화면 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 68 | `ch06_06_topic_prompt.png` | `manuscript/07_tarot_build.md:64` | 주제 선택 화면 제작 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 69 | `ch06_07_topic_result.png` | `manuscript/07_tarot_build.md:77` | 타로 주제 선택 화면 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 70 | `ch06_08_question_prompt.png` | `manuscript/07_tarot_build.md:86` | 질문 입력 화면 제작 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 71 | `ch06_09_question_result.png` | `manuscript/07_tarot_build.md:99` | 타로 질문 입력 화면 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 72 | `ch06_10_spread_prompt.png` | `manuscript/07_tarot_build.md:108` | 카드 뽑기 화면 제작 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 73 | `ch06_11_spread_result.png` | `manuscript/07_tarot_build.md:121` | 카드 뽑기 화면 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 74 | `ch06_12_three_cards_selected.png` | `manuscript/07_tarot_build.md:130` | 카드 3장 선택 완료 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 75 | `ch06_13_result_prompt.png` | `manuscript/07_tarot_build.md:139` | 타로 결과 화면 제작 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 76 | `ch06_14_result_screen.png` | `manuscript/07_tarot_build.md:152` | 타로 결과 화면 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 77 | `ch06_15_detail_prompt.png` | `manuscript/07_tarot_build.md:161` | 카드 상세 보기 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 78 | `ch06_16_detail_popup.png` | `manuscript/07_tarot_build.md:174` | 카드 상세 팝업 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 79 | `ch06_17_history_prompt.png` | `manuscript/07_tarot_build.md:183` | 최근 이력 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 80 | `ch06_18_history_result.png` | `manuscript/07_tarot_build.md:196` | 최근 이력 화면 결과 | 자료 화면 자동 캡처 | 가능 | 중 |
| 81 | `ch06_19_mobile_fix_prompt.png` | `manuscript/07_tarot_build.md:205` | 모바일 보정 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 82 | `ch06_20_mobile_result.png` | `manuscript/07_tarot_build.md:218` | 타로 사이트 모바일 결과 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 83 | `ch06_21_repair_prompt.png` | `manuscript/07_tarot_build.md:227` | 타로 사이트 오류 수정 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 84 | `ch06_22_tarot_done_check.png` | `manuscript/07_tarot_build.md:240` | 타로 사이트 완성 체크리스트 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 85 | `ch07_01_deploy_recap.png` | `manuscript/08_tarot_deploy.md:11` | 첫 번째 사이트 배포 흐름 요약 | 자료 화면 자동 캡처 | 가능 | 중 |
| 86 | `ch07_02_connector_check.png` | `manuscript/08_tarot_deploy.md:20` | ChatGPT GitHub 연결 상태 확인 화면 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 87 | `ch07_03_new_repo_prompt.png` | `manuscript/08_tarot_deploy.md:29` | 타로 사이트 새 저장소 요청 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 88 | `ch07_04_upload_progress.png` | `manuscript/08_tarot_deploy.md:42` | 타로 사이트 업로드 진행 답변 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 89 | `ch07_05_pages_prompt.png` | `manuscript/08_tarot_deploy.md:51` | 타로 사이트 Pages 활성화 요청 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 90 | `ch07_06_tarot_final_url.png` | `manuscript/08_tarot_deploy.md:64` | 타로 사이트 최종 주소 답변 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 91 | `ch07_07_tarot_public_desktop.png` | `manuscript/08_tarot_deploy.md:73` | 타로 사이트 데스크톱 외부 URL 결과 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 92 | `ch07_08_tarot_public_mobile.png` | `manuscript/08_tarot_deploy.md:82` | 타로 사이트 모바일 외부 URL 결과 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 93 | `ch07_09_share_url.png` | `manuscript/08_tarot_deploy.md:91` | 타로 사이트 주소 공유 체크 화면 | 예제 사이트 자동 캡처 | 가능 | 중 |
| 94 | `ch09_01_problem_table.png` | `manuscript/09_appendix.md:11` | 막힘 상황 유형 표 | 자료 화면 자동 캡처 | 가능 | 중 |
| 95 | `ch09_02_wrong_answer_prompt.png` | `manuscript/09_appendix.md:20` | 엉뚱한 답변을 바로잡는 프롬프트 박스 | 웹북 자동 캡처 | 가능 | 상 |
| 96 | `ch09_03_pages_wait.png` | `manuscript/09_appendix.md:33` | GitHub Pages 대기와 주소 확인 안내 | 수동 확인 필요 컷 | 확인 필요 | 상 |
| 97 | `ch09_04_image_limit_broken.png` | `manuscript/09_appendix.md:46` | 이미지 생성 한도와 깨진 이미지 대응 화면 | 자료 화면 자동 캡처 | 가능 | 중 |
| 98 | `ch09_05_next_ideas.png` | `manuscript/09_appendix.md:59` | 다음 사이트 아이디어 카드 모음 | 예제 사이트 자동 캡처 | 가능 | 중 |
