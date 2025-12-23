document.addEventListener("DOMContentLoaded", () => {
  initMap();
  addMarkers(places);
  loadQuestion();
});

const questionText = document.getElementById("question-text");
const optionsArea = document.getElementById("options-area");
const progressText = document.getElementById("progress-text");
const nextBtn = document.getElementById("next-btn");
const liveResults = document.getElementById("live-results");

let currentQuestion = 0;
let selectedAnswer = null;
let collectedTags = [];

const quizData = [
  {
    question: "What vibe are you in the mood for?",
    options: ["Chill & Quiet", "Fun with Friends", "Romantic", "Adventure", "Food Craving"],
    tags: [["chill"], ["fun"], ["romantic"], ["adventure"], ["food"]]
  },
  {
    question: "What is your budget?",
    options: ["Free", "Under ₹200", "₹200–₹500", "Premium"],
    tags: [["free"], ["cheap"], ["cafe"], ["premium"]]
  },
  {
    question: "Who are you going with?",
    options: ["Solo", "Friends", "Partner", "Family"],
    tags: [["solo"], ["friends"], ["romantic"], ["family"]]
  }
];

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionText.textContent = q.question;
  optionsArea.innerHTML = "";
  selectedAnswer = null;

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;

    btn.onclick = () => {
      document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedAnswer = option;
    };

    optionsArea.appendChild(btn);
  });

  progressText.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
}

function updateLiveResults() {
  const allTags = collectedTags.flat();
  const filtered = places.filter(p =>
    p.tags.some(tag => allTags.includes(tag))
  );

  liveResults.innerHTML = "";
  filtered.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.name;
    liveResults.appendChild(li);
  });

  addMarkers(filtered);
}

nextBtn.onclick = () => {
  if (!selectedAnswer) return alert("Select an option");

  const idx = quizData[currentQuestion].options.indexOf(selectedAnswer);
  collectedTags.push(quizData[currentQuestion].tags[idx]);

  updateLiveResults();
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    alert("Quiz completed!");
  }
};
