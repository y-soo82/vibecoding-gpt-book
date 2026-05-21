# Chapter 7. 타로(tarot) 사이트를 웹에 올리기

## 이 장의 목표

완성한 타로(tarot) 사이트를 ChatGPT GitHub 연동으로 배포합니다. 첫 번째 사이트 배포와 같은 흐름을 반복하되, 타로(tarot) 사이트용 새 저장소와 새 주소를 받는 데 집중합니다.

## 페이지별 원고

### 1페이지. 첫 번째 배포 흐름 복습

![이미지 자리: 첫 번째 사이트 배포 흐름 요약](../webbook/images/ch07_01_deploy_recap.png)

첫 번째 사이트를 올릴 때 했던 흐름을 다시 떠올립니다.  
GitHub 연결 확인, 새 저장소 요청, 파일 업로드, Pages 활성화, 주소 확인 순서입니다.

독자 행동 안내: Chapter 3에서 받은 첫 번째 사이트 주소를 떠올려 주세요.

### 2페이지. GitHub 연결 상태 확인하기

![이미지 자리: ChatGPT GitHub 연결 상태 확인 화면](../webbook/images/ch07_02_connector_check.png)

배포를 시작하기 전에 ChatGPT와 GitHub 연결 상태를 확인합니다.  
연결이 풀려 있으면 다시 연결한 뒤 진행합니다.

독자 행동 안내: GitHub 연결 상태가 보이는지 확인해 주세요.

### 3페이지. 타로(tarot) 사이트용 새 저장소 요청하기

![이미지 자리: 타로(tarot) 사이트 새 저장소 요청 프롬프트(prompt) 박스](../webbook/images/ch07_03_new_repo_prompt.png)

첫 번째 사이트와 타로(tarot) 사이트는 서로 다른 주소로 관리하는 것이 좋습니다.  
ChatGPT에게 타로(tarot) 사이트용 새 저장소를 만들어 달라고 부탁합니다.

> 프롬프트(prompt) 박스: github-deploy-tarot
> 표시: 앞 3줄 미리보기
> 버튼: 복사하기

독자 행동 안내: 복사한 프롬프트(prompt)를 ChatGPT에 보내 주세요.

### 4페이지. 업로드 진행 답변 기다리기

![이미지 자리: 타로(tarot) 사이트 업로드 진행 답변](../webbook/images/ch07_04_upload_progress.png)

ChatGPT가 타로(tarot) 사이트 파일을 정리하고 GitHub에 올리는 과정을 안내합니다.  
답변이 길어져도 정상입니다.

독자 행동 안내: 중간에 멈춘 것 같으면 잠시 기다린 뒤, 이어서 진행해 달라고 부탁해 주세요.

### 5페이지. GitHub Pages 활성화 부탁하기

![이미지 자리: 타로(tarot) 사이트 Pages 활성화 요청 프롬프트(prompt) 박스](../webbook/images/ch07_05_pages_prompt.png)

파일이 올라갔다면 웹주소로 열 수 있게 Pages 활성화를 부탁합니다.  
이 단계가 끝나야 외부에서 사이트를 열 수 있습니다.

> 프롬프트(prompt) 박스: github-pages-tarot
> 표시: 앞 3줄 미리보기
> 버튼: 복사하기

독자 행동 안내: ChatGPT에게 Pages 활성화와 최종 주소 확인을 함께 부탁해 주세요.

### 6페이지. 최종 주소 확인하기

![이미지 자리: 타로(tarot) 사이트 최종 주소 답변](../webbook/images/ch07_06_tarot_final_url.png)

ChatGPT 답변에서 최종 주소를 찾습니다.  
주소가 바로 열리지 않으면 GitHub Pages 반영 시간이 조금 필요할 수 있습니다.

독자 행동 안내: 주소를 열고, 안 열리면 몇 분 뒤 다시 확인해 주세요.

### 7페이지. 데스크톱(desktop)에서 열어 보기

![이미지 자리: 타로(tarot) 사이트 데스크톱(desktop) 외부 URL(Uniform Resource Locator) 결과](../webbook/images/ch07_07_tarot_public_desktop.png)

데스크톱(desktop)에서 타로(tarot) 사이트가 열리면 큰 성공입니다.  
이제 사이트는 ChatGPT 대화창 밖의 실제 주소에서 보입니다.

독자 행동 안내: 메인 화면이 보이고 시작 버튼이 눌릴 수 있어 보이는지 확인해 주세요.

### 8페이지. 휴대전화에서 열어 보기

![이미지 자리: 타로(tarot) 사이트 모바일(mobile) 외부 URL(Uniform Resource Locator) 결과](../webbook/images/ch07_08_tarot_public_mobile.png)

휴대전화에서도 같은 주소를 열어 봅니다.  
타로(tarot) 사이트는 카드와 결과 문장이 중요하므로 모바일(mobile) 가독성을 꼭 확인해야 합니다.

독자 행동 안내: 카드가 잘 보이고 결과 문장이 잘리지 않는지 확인해 주세요.

### 9페이지. 친구에게 주소 보내 보기

![이미지 자리: 타로(tarot) 사이트 주소 공유 체크 화면](../webbook/images/ch07_09_share_url.png)

주소가 열리면 다른 사람에게도 보여 줄 수 있습니다.  
이 순간이 이 책의 두 번째 완성 경험입니다.

독자 행동 안내: 주소를 복사해 본인에게 메시지로 보내 보고 다시 열어 보세요.

## 이 장에서 확인할 것

- [ ] ChatGPT GitHub 연결 상태를 확인했습니다.
- [ ] 타로(tarot) 사이트용 새 저장소 생성을 부탁했습니다.
- [ ] GitHub Pages 활성화를 부탁했습니다.
- [ ] 타로(tarot) 사이트 최종 주소를 받았습니다.
- [ ] 데스크톱(desktop)과 휴대전화에서 외부 주소를 열어 봤습니다.
