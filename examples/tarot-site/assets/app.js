const topics = [
  { id: "today", title: "오늘의 운세", text: "오늘 하루의 흐름을 부드럽게 살펴봅니다." },
  { id: "love", title: "연애", text: "마음의 방향과 관계의 온도를 확인합니다." },
  { id: "work", title: "일", text: "일과 선택에서 신경 쓸 부분을 봅니다." },
  { id: "choice", title: "선택 고민", text: "두 갈래 길 앞에서 참고할 조언을 봅니다." }
];

const cards = [
  ["the-fool", "바보", "새로운 시작을 두려워하지 않아도 좋습니다."],
  ["the-magician", "마법사", "이미 가진 도구를 믿고 한 걸음 움직여 보세요."],
  ["the-star", "별", "조용한 희망이 방향을 밝혀 줍니다."],
  ["the-sun", "태양", "밝게 드러나는 일이 힘을 줄 수 있습니다."],
  ["the-moon", "달", "불확실함 속에서도 감정을 천천히 살펴보세요."],
  ["strength", "힘", "부드러운 태도가 더 오래 가는 힘이 됩니다."],
  ["temperance", "절제", "속도를 조절하면 균형이 다시 잡힙니다."],
  ["the-world", "세계", "마무리와 다음 시작이 함께 보입니다."],
  ["justice", "정의", "차분히 기준을 세우면 선택이 선명해집니다."],
  ["the-hermit", "은둔자", "잠시 혼자 생각할 시간이 도움이 됩니다."],
  ["wheel", "운명의 수레바퀴", "흐름이 바뀌는 지점을 관찰해 보세요."],
  ["the-empress", "여제", "돌봄과 여유가 좋은 결과를 키웁니다."]
].map(([id, name, meaning]) => ({
  id,
  name,
  meaning,
  image: `./assets/cards/${id}.png`
}));

const state = {
  topic: topics[0],
  question: "",
  selected: []
};

const screens = document.querySelectorAll(".screen");
const topicGrid = document.querySelector("#topicGrid");
const selectedTopicText = document.querySelector("#selectedTopicText");
const questionInput = document.querySelector("#questionInput");
const questionHelper = document.querySelector("#questionHelper");
const cardGrid = document.querySelector("#cardGrid");
const cardCounter = document.querySelector("#cardCounter");
const resultGrid = document.querySelector("#resultGrid");
const resultQuestion = document.querySelector("#resultQuestion");
const summaryText = document.querySelector("#summaryText");
const historyList = document.querySelector("#historyList");
const dialog = document.querySelector("#cardDialog");

function showScreen(name) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
  });
}

function renderTopics() {
  topicGrid.innerHTML = topics.map((topic) => `
    <button class="topic-card" type="button" data-topic="${topic.id}">
      <strong>${topic.title}</strong>
      <span>${topic.text}</span>
    </button>
  `).join("");
}

function renderCards() {
  cardGrid.innerHTML = cards.map((card) => `
    <button class="tarot-card" type="button" data-card="${card.id}">
      <img src="${card.image}" alt="${card.name} 카드">
      <span>${card.name}</span>
    </button>
  `).join("");
  updateCardState();
}

function updateCardState() {
  document.querySelectorAll(".tarot-card").forEach((button) => {
    button.classList.toggle("is-selected", state.selected.includes(button.dataset.card));
  });
  cardCounter.textContent = `${state.selected.length}장을 선택했습니다.`;
  document.querySelector('[data-action="showResult"]').disabled = state.selected.length !== 3;
}

function selectedCards() {
  return state.selected.map((id) => cards.find((card) => card.id === id)).filter(Boolean);
}

function renderResult() {
  const picked = selectedCards();
  resultQuestion.textContent = `${state.topic.title} · ${state.question}`;
  resultGrid.innerHTML = picked.map((card) => `
    <article class="result-card">
      <img src="${card.image}" alt="${card.name} 카드">
      <h3>${card.name}</h3>
      <p>${card.meaning}</p>
      <button type="button" data-detail="${card.id}">자세히 보기</button>
    </article>
  `).join("");
  summaryText.textContent = "오늘은 한 번에 결론을 내리기보다, 이미 보이는 신호를 차분히 확인하는 편이 좋습니다.";
}

function saveHistory() {
  const picked = selectedCards().map((card) => card.name).join(", ");
  const history = JSON.parse(localStorage.getItem("tarot-history") || "[]");
  history.unshift({
    topic: state.topic.title,
    question: state.question,
    cards: picked,
    summary: summaryText.textContent
  });
  localStorage.setItem("tarot-history", JSON.stringify(history.slice(0, 3)));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("tarot-history") || "[]");
  if (!history.length) {
    historyList.innerHTML = '<article class="history-card"><h3>아직 저장된 리딩이 없습니다</h3><p>결과 화면에서 이력에 남기기를 누르면 여기에 표시됩니다.</p></article>';
    return;
  }
  historyList.innerHTML = history.map((item) => `
    <article class="history-card">
      <h3>${item.topic}</h3>
      <p>${item.question}</p>
      <p>${item.cards}</p>
      <p>${item.summary}</p>
    </article>
  `).join("");
}

function restart() {
  state.topic = topics[0];
  state.question = "";
  state.selected = [];
  questionInput.value = "";
  questionHelper.textContent = "";
  updateCardState();
  showScreen("home");
}

function openDetail(cardId) {
  const card = cards.find((item) => item.id === cardId);
  if (!card) return;
  document.querySelector("#dialogImage").src = card.image;
  document.querySelector("#dialogImage").alt = `${card.name} 카드`;
  document.querySelector("#dialogTitle").textContent = card.name;
  document.querySelector("#dialogText").textContent = `${card.meaning} 지금은 이 의미를 정답처럼 받아들이기보다, 오늘의 질문을 다시 바라보는 힌트로 사용해 보세요.`;
  dialog.showModal();
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const topicId = event.target.closest("[data-topic]")?.dataset.topic;
  const cardId = event.target.closest("[data-card]")?.dataset.card;
  const detailId = event.target.closest("[data-detail]")?.dataset.detail;

  if (topicId) {
    state.topic = topics.find((topic) => topic.id === topicId) || topics[0];
    selectedTopicText.textContent = `선택한 주제: ${state.topic.title}`;
    showScreen("question");
  }

  if (cardId) {
    if (state.selected.includes(cardId)) {
      state.selected = state.selected.filter((id) => id !== cardId);
    } else if (state.selected.length < 3) {
      state.selected.push(cardId);
    }
    updateCardState();
  }

  if (detailId) openDetail(detailId);

  if (action === "start") showScreen("topic");
  if (action === "questionNext") {
    const value = questionInput.value.trim();
    if (!value) {
      questionHelper.textContent = "질문을 한 문장으로 적어 주세요.";
      return;
    }
    state.question = value;
    questionHelper.textContent = "";
    showScreen("spread");
  }
  if (action === "showResult") {
    renderResult();
    showScreen("result");
  }
  if (action === "saveHistory") {
    saveHistory();
    renderHistory();
    showScreen("history");
  }
  if (action === "restart") restart();
  if (action === "closeDialog") dialog.close();
});

renderTopics();
renderCards();
renderHistory();
