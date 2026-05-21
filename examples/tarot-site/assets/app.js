const topics = [
  { id: "today", title: "오늘의 운세", text: "오늘 하루의 흐름을 부드럽게 살펴봅니다." },
  { id: "love", title: "연애", text: "마음의 방향과 관계의 온도를 확인합니다." },
  { id: "work", title: "일", text: "일과 선택에서 신경 쓸 부분을 봅니다." },
  { id: "choice", title: "선택 고민", text: "두 갈래 길 앞에서 참고할 조언을 봅니다." }
];

const imageCards = new Set([
  "the-fool",
  "the-magician",
  "the-empress",
  "strength",
  "the-hermit",
  "wheel",
  "justice",
  "temperance",
  "the-moon",
  "the-sun",
  "the-star",
  "the-world"
]);

const cardSeed = [
  ["the-fool", "바보", "새로운 시작", "익숙한 방식에 오래 머무르지 않아도 좋습니다.", "준비 없이 움직이면 작은 실수가 커질 수 있습니다."],
  ["the-magician", "마법사", "실행력", "이미 가진 도구를 믿고 한 걸음 움직여 보세요.", "말만 앞서고 실제 행동이 늦어질 수 있습니다."],
  ["the-high-priestess", "여사제", "직감", "겉으로 드러난 말보다 조용한 느낌을 살펴보세요.", "확인하지 않은 추측을 사실처럼 받아들이지 마세요."],
  ["the-empress", "여제", "돌봄", "여유와 돌봄이 좋은 결과를 키웁니다.", "편안함에 머무르다 중요한 결정을 미룰 수 있습니다."],
  ["the-emperor", "황제", "기준", "먼저 기준을 세우면 다음 행동이 단단해집니다.", "내 방식만 고집하면 주변 흐름을 놓칠 수 있습니다."],
  ["the-hierophant", "교황", "조언", "혼자 판단하기보다 믿을 만한 기준을 참고해 보세요.", "남의 말에 기대어 내 생각을 잃지 않게 주의하세요."],
  ["the-lovers", "연인", "선택", "마음이 향하는 방향과 현실 조건을 함께 보세요.", "좋아 보이는 선택이 전부는 아닐 수 있습니다."],
  ["the-chariot", "전차", "추진", "방향을 정했다면 흔들리지 말고 앞으로 가도 좋습니다.", "속도만 내면 주변 상황을 놓칠 수 있습니다."],
  ["strength", "힘", "부드러운 힘", "부드러운 태도가 더 오래 가는 힘이 됩니다.", "참는 것과 미루는 것을 혼동하지 마세요."],
  ["the-hermit", "은둔자", "성찰", "잠시 혼자 생각할 시간이 도움이 됩니다.", "너무 오래 혼자 고민하면 답이 더 멀어질 수 있습니다."],
  ["wheel", "운명의 수레바퀴", "전환", "흐름이 바뀌는 지점을 관찰해 보세요.", "상황 탓만 하면 잡을 수 있는 기회를 놓칩니다."],
  ["justice", "정의", "균형", "차분히 기준을 세우면 선택이 선명해집니다.", "옳고 그름만 따지다 마음의 신호를 놓칠 수 있습니다."],
  ["the-hanged-man", "매달린 사람", "관점 전환", "잠시 멈춰 다른 각도에서 보면 답이 보입니다.", "멈춤이 길어지면 필요한 행동까지 늦어질 수 있습니다."],
  ["death", "죽음", "마무리", "끝내야 할 것을 정리하면 다음 문이 열립니다.", "변화를 거부하면 낡은 문제가 반복될 수 있습니다."],
  ["temperance", "절제", "조율", "속도를 조절하면 균형이 다시 잡힙니다.", "무리하게 맞추려다 내 리듬을 잃지 마세요."],
  ["the-devil", "악마", "집착", "반복되는 욕심이나 습관을 알아차릴 때입니다.", "당장의 편함이 장기적으로 발목을 잡을 수 있습니다."],
  ["the-tower", "탑", "변화", "예상 밖 변화가 숨은 문제를 드러낼 수 있습니다.", "갑작스러운 말이나 행동은 상황을 더 흔들 수 있습니다."],
  ["the-star", "별", "희망", "조용한 희망이 방향을 밝혀 줍니다.", "기대만 하다 현실의 작은 행동을 놓치지 마세요."],
  ["the-moon", "달", "불확실함", "불확실함 속에서도 감정을 천천히 살펴보세요.", "불안이 사실처럼 느껴질 수 있으니 한 번 더 확인하세요."],
  ["the-sun", "태양", "활력", "밝게 드러나는 일이 힘을 줄 수 있습니다.", "좋은 흐름일수록 세부 확인을 잊지 마세요."],
  ["judgement", "심판", "새 판단", "지난 일을 정리하고 다시 선택할 기회가 보입니다.", "후회에만 머무르면 새 판단이 늦어질 수 있습니다."],
  ["the-world", "세계", "완성", "마무리와 다음 시작이 함께 보입니다.", "끝났다고 생각한 일에도 마지막 확인이 필요합니다."]
];

const cards = cardSeed.map(([id, name, keyword, upright, reversed]) => ({
  id,
  name,
  keyword,
  upright,
  reversed,
  hasImage: imageCards.has(id),
  image: imageCards.has(id) ? `./assets/cards/${id}.png` : ""
}));

const readingFields = [
  { id: "flow", title: "현재 흐름", text: "지금 상황이 어디로 움직이는지 봅니다." },
  { id: "heart", title: "마음의 신호", text: "겉으로 말하지 못한 마음의 방향을 봅니다." },
  { id: "advice", title: "오늘의 조언", text: "오늘 바로 적용할 수 있는 태도를 봅니다." },
  { id: "caution", title: "주의할 점", text: "서두르기 전에 확인할 부분을 봅니다." },
  { id: "action", title: "다음 행동", text: "작게 시작할 수 있는 한 가지 행동을 봅니다." }
];

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

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderTopics() {
  topicGrid.textContent = "";
  topics.forEach((topic) => {
    const button = createElement("button", "topic-card");
    button.type = "button";
    button.dataset.topic = topic.id;
    button.append(createElement("strong", "", topic.title));
    button.append(createElement("span", "", topic.text));
    topicGrid.append(button);
  });
}

function renderCards() {
  cardGrid.textContent = "";
  cards.forEach((card, index) => {
    const button = createElement("button", "tarot-card");
    button.type = "button";
    button.dataset.card = card.id;
    button.setAttribute("aria-label", `${index + 1}번 카드 선택`);

    const back = createElement("span", "card-back");
    back.append(createElement("span", "card-back__mark", "Major"));
    back.append(createElement("strong", "", String(index + 1).padStart(2, "0")));
    back.append(createElement("span", "", "마음이 가는 카드"));

    button.append(back);
    cardGrid.append(button);
  });
  updateCardState();
}

function drawOrientation(cardId) {
  const index = cards.findIndex((card) => card.id === cardId);
  return index % 2 === 0 ? "정방향" : "역방향";
}

function updateCardState() {
  document.querySelectorAll(".tarot-card").forEach((button) => {
    const selectedIndex = state.selected.indexOf(button.dataset.card);
    button.classList.toggle("is-selected", selectedIndex !== -1);
    button.dataset.order = selectedIndex === -1 ? "" : `${selectedIndex + 1}`;
  });
  cardCounter.textContent = `${state.selected.length}장을 선택했습니다. 22장 중 마음이 가는 카드 3장을 골라 주세요.`;
  document.querySelector('[data-action="showResult"]').disabled = state.selected.length !== 3;
}

function selectedCards() {
  return state.selected.map((id) => cards.find((card) => card.id === id)).filter(Boolean);
}

function meaningFor(card) {
  return drawOrientation(card.id) === "정방향" ? card.upright : card.reversed;
}

function renderCardVisual(parent, card) {
  if (card.hasImage) {
    const image = document.createElement("img");
    image.src = card.image;
    image.alt = `${card.name} 카드`;
    parent.append(image);
    return;
  }

  const fallback = createElement("div", "text-card");
  fallback.append(createElement("span", "", card.keyword));
  fallback.append(createElement("strong", "", card.name));
  parent.append(fallback);
}

function renderResult() {
  const picked = selectedCards();
  resultQuestion.textContent = `${state.topic.title} · ${state.question}`;
  resultGrid.textContent = "";

  picked.forEach((card, index) => {
    const article = createElement("article", "result-card");
    renderCardVisual(article, card);
    article.append(createElement("span", "orientation-pill", drawOrientation(card.id)));
    article.append(createElement("h3", "", `${index + 1}. ${card.name}`));
    article.append(createElement("p", "", meaningFor(card)));

    const button = createElement("button", "");
    button.type = "button";
    button.dataset.detail = card.id;
    button.textContent = "자세히 보기";
    article.append(button);
    resultGrid.append(article);
  });

  renderReadingFields(picked);
  summaryText.textContent = "오늘은 카드가 말하는 흐름을 정답으로 고정하기보다, 현재 상황과 마음을 함께 비춰 보는 힌트로 사용해 보세요.";
}

function renderReadingFields(picked) {
  const existing = document.querySelector(".reading-grid");
  existing?.remove();

  const grid = createElement("div", "reading-grid");
  readingFields.forEach((field, index) => {
    const card = picked[index % picked.length];
    const article = createElement("article", "reading-field");
    article.append(createElement("span", "", field.title));
    article.append(createElement("h3", "", card.name));
    article.append(createElement("p", "", `${field.text} ${meaningFor(card)}`));
    grid.append(article);
  });

  resultGrid.insertAdjacentElement("afterend", grid);
}

function saveHistory() {
  const picked = selectedCards().map((card) => `${card.name}(${drawOrientation(card.id)})`).join(", ");
  const history = JSON.parse(localStorage.getItem("tarot-history") || "[]");
  history.unshift({
    date: new Date().toLocaleDateString("ko-KR"),
    topic: state.topic.title,
    question: state.question,
    cards: picked,
    summary: summaryText.textContent
  });
  localStorage.setItem("tarot-history", JSON.stringify(history.slice(0, 5)));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("tarot-history") || "[]");
  historyList.textContent = "";

  if (!history.length) {
    const empty = createElement("article", "history-card");
    empty.append(createElement("h3", "", "아직 저장된 리딩이 없습니다"));
    empty.append(createElement("p", "", "결과 화면에서 이력에 남기기를 누르면 여기에 표시됩니다."));
    historyList.append(empty);
    return;
  }

  history.forEach((item) => {
    const article = createElement("article", "history-card");
    article.append(createElement("span", "history-date", item.date));
    article.append(createElement("h3", "", item.topic));
    article.append(createElement("p", "", item.question));
    article.append(createElement("p", "", item.cards));
    article.append(createElement("p", "", item.summary));
    historyList.append(article);
  });
}

function restart() {
  state.topic = topics[0];
  state.question = "";
  state.selected = [];
  questionInput.value = "";
  questionHelper.textContent = "";
  updateCardState();
  document.querySelector(".reading-grid")?.remove();
  showScreen("home");
}

function openDetail(cardId) {
  const card = cards.find((item) => item.id === cardId);
  if (!card) return;

  const image = document.querySelector("#dialogImage");
  if (card.hasImage) {
    image.hidden = false;
    image.src = card.image;
    image.alt = `${card.name} 카드`;
  } else {
    image.hidden = true;
  }

  document.querySelector("#dialogTitle").textContent = `${card.name} · ${drawOrientation(card.id)}`;
  document.querySelector("#dialogText").textContent = `${meaningFor(card)} 지금은 이 의미를 정답처럼 받아들이기보다, 오늘의 질문을 다시 바라보는 힌트로 사용해 보세요.`;
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
