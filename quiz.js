const questionText = document.getElementById("question-text");
const optionsArea = document.getElementById("options-area");
const progressText = document.getElementById("progress-text");
const nextBtn = document.getElementById("next-btn");
const liveResults = document.getElementById("live-results");

let currentQuestion = 0;
let selectedAnswer = null;
let collectedTags = [];

// SAMPLE PLACES
const places = [
  { name: "Sethi Café", tags: ["cafe", "friends", "romantic"] },
  { name: "Smart City Lake", tags: ["lake", "park", "chill"] },
  { name: "South Avenue Mall", tags: ["mall", "fun"] },
  { name: "Bargi Dam", tags: ["adventure", "nature"] },
  { name: "Domino's", tags: ["food"] },
  { name: "Rani Talab Park", tags: ["park", "family"] }
];

// QUIZ QUESTIONS
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

// Initialize map for quiz page
initMap();
addMarkers(places); // show all initially

function loadQuestion() {
  selectedAnswer = null;
  const q = quizData[currentQuestion];
  questionText.textContent = q.question;
  optionsArea.innerHTML = "";

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
  let allTags = collectedTags.flat();

  let filtered = places.filter(place =>
    place.tags.some(tag => allTags.includes(tag))
  );

  liveResults.innerHTML = "";
  filtered.forEach(p => {
    let li = document.createElement("li");
    li.textContent = p.name;
    liveResults.appendChild(li);
  });
  
  addMarkers(filtered);
}


nextBtn.addEventListener("click", () => {
  if (!selectedAnswer) return alert("Please select an option");

  const selectedIndex = quizData[currentQuestion].options.indexOf(selectedAnswer);
  collectedTags.push(quizData[currentQuestion].tags[selectedIndex]);

  updateLiveResults();

  currentQuestion++;

  if (currentQuestion >= quizData.length) {
    alert("Quiz completed!");
    return;
  }

  loadQuestion();
});

loadQuestion();
