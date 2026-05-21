# Sigil EPUB 변환 준비 문서

## 목적

이 문서는 바이브코딩 1차 GPT 입문서 웹북을 Sigil에서 EPUB로 옮기기 전에 확인할 항목을 정리합니다. 웹북은 복사 버튼과 동적 이미지 로딩을 포함하지만, EPUB에서는 리더 앱에 따라 JavaScript가 제한될 수 있으므로 정적 구조를 우선합니다.

현재 초안 EPUB 산출물은 `epub/dist/vibecoding-gpt-book.epub`입니다. Sigil 최종 검증 전 단계의 패키지이며, Sigil에서 열어 Validate를 실행한 뒤 최종 출판본으로 확정합니다.

## EPUB 기본 구조

- 제목: 바이브코딩 GPT 입문서
- 부제: ChatGPT 대화창으로 웹사이트 2개 만들기
- 언어: ko
- 제작 기준: 1차 GPT 입문서
- 원고 원본: `manuscript/`
- 프롬프트 원문: `prompts/`
- 이미지 원본: `webbook/images/`
- 웹북 CSS 참고: `webbook/assets/book.css`

## 권장 XHTML 분리

- `chapter1.xhtml`
- `chapter2.xhtml`
- `chapter3.xhtml`
- `chapter4.xhtml`
- `prompts.xhtml`

## 목차 기준

- Chapter 1. AI, LLM, 바이브코딩 개요와 시장 소개
- Chapter 2. 이미지 하나로 웹사이트 만들고 배포합니다
- Chapter 3. 타로앱을 만듭니다
- Chapter 4. 부록
- 프롬프트 전문 모음

## 이미지 경로 준비

- EPUB 내부 이미지는 `Images/` 폴더로 복사합니다.
- 현재 웹북 이미지는 `webbook/images/*.png`를 기준으로 사용합니다.
- XHTML에서는 `../webbook/images/...` 대신 `../Images/파일명.png` 또는 Sigil 프로젝트 구조에 맞는 상대 경로로 바꿉니다.
- 이미지 번호는 이미 캡처 이미지 안에 포함되어 있으므로 EPUB 변환 중 별도 번호를 덧씌우지 않습니다.
- ChatGPT/GitHub 로그인과 권한 화면은 최종 출판 전에 실제 캡처 또는 출판용 예시 화면 판정을 완료합니다.

## CSS 분리 기준

- 웹북 CSS에서 EPUB에 필요한 항목만 `Styles/book.css`로 옮깁니다.
- 사이드바, 고정 레이아웃, 복사 버튼 성공 상태처럼 EPUB에서 의미가 약한 스타일은 줄입니다.
- 이미지 폭은 `max-width: 100%; height: auto;`를 기본으로 둡니다.
- 모바일 웹용 미디어쿼리는 유지하되, 전자책 리더에서 깨질 수 있는 고정 높이와 스크롤 의존 스타일은 제거합니다.

## 프롬프트 전문 처리

웹북에서는 프롬프트 박스가 3줄 미리보기와 `복사하기` 버튼으로 동작합니다. EPUB에서는 JavaScript 복사가 제한될 수 있으므로 아래 구조를 권장합니다.

- 본문: 3줄 미리보기 유지
- 본문 아래: `프롬프트 전문은 부록의 prompt-id를 확인해 주세요.` 문장 추가
- 부록: `prompts.xhtml`에 24개 프롬프트 전문 전체 수록
- 각 프롬프트 박스: `prompts.xhtml#prompt-id`로 내부 링크 연결

## 표지 준비

- 표지 후보: `webbook/images/ch00_01_book_start.png`
- 표지에 들어갈 문구:
  - 바이브코딩 GPT 입문서
  - ChatGPT 대화창으로 웹사이트 2개 만들기
  - 비개발자를 위한 이미지 중심 실습서
- 표지는 Sigil에서 `Add Cover`로 지정합니다.

## 메타데이터

- Title: 바이브코딩 GPT 입문서
- Language: ko
- Subject: ChatGPT, 바이브코딩, 전자책, 웹사이트 제작
- Description: 웹서핑과 유튜브 정도만 할 줄 아는 비개발자가 ChatGPT 대화창을 따라 하며 웹사이트 2개를 만들고 GitHub 연동 배포 흐름을 익히는 입문서입니다.
- Publisher: 출판사 확정 후 입력
- Date: 2026-05-16

## Sigil 체크리스트

- 모든 XHTML 파일이 목차 순서대로 들어갔는지 확인합니다.
- 이미지 98개가 누락 없이 `Images/`에 들어갔는지 확인합니다.
- 깨진 이미지 아이콘이 없는지 확인합니다.
- 프롬프트 박스가 본문 3줄 미리보기로 보이는지 확인합니다.
- 프롬프트 전문 부록 링크가 열리는지 확인합니다.
- 표지 이미지가 EPUB 표지로 지정되어 있는지 확인합니다.
- Sigil의 `Tools > Validate EPUB`를 실행합니다.
- 경고가 나오면 이미지 경로, XHTML 닫힘 태그, CSS 속성 순서로 확인합니다.

## 웹북과 EPUB 차이

- 웹북: 복사 버튼, 전체 보기 토글, noCache, 버전 쿼리, 동적 이미지 로딩을 사용할 수 있습니다.
- EPUB: 리더 앱 호환성을 위해 정적 XHTML, 정적 이미지, 내부 링크 중심으로 구성합니다.
- 웹북: GitHub Pages 외부 URL에서 최신 상태를 확인합니다.
- EPUB: Sigil 검증과 실제 리더 앱 미리보기로 확인합니다.
