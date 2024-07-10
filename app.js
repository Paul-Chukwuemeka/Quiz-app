const themeToggle = document.getElementById("bg-mode");
const themeIcon = document.getElementById("themeIcon");
const body = document.body;
const trivaQuestion = document.getElementById("question");
const optionOne = document.getElementById("1");
const optionTwo = document.getElementById("2");
const optionThree = document.getElementById("3");
const optionFour = document.getElementById("4");
const gameScore = document.getElementById("score");
const questionNumber = document.getElementById("questionNumber");
const startBtn = document.getElementById("startBtn");
const content = document.getElementById("quizContent");
const custom = document.getElementById("custom")
const category = document.getElementById("categories");
const difficulty = document.getElementById("difficulty")
const choices = [optionOne, optionTwo, optionThree, optionFour];
const scorePage = document.getElementById("scorePage")
let selectedCat = 0;
let selectedDiff = 0;
let apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCat}&difficulty=${selectedDiff}&type=multiple`;
function getValues() {
  selectedCat = category.value;
  selectedDiff = difficulty.value;
  console.log(selectedDiff);
  apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCat}&difficulty=${selectedDiff}&type=multiple`;
  return selectedCat;
}
category.addEventListener("change", getValues);
difficulty.addEventListener("change", getValues);
getValues();
let questions = [];
let questionIndex = 0;
let questionCount = 0;
let score = 0;

console.log(apiUrl);
async function loadQuestions() {
  try {
    const result = await fetch(apiUrl);
    const data = await result.json();
    console.log(data)
    if (!result.ok) {
      throw new Error(`Error ${result.status}`);
    }
    if (data && data.results) {
      questions = data.results;
      getNewQuestion();
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

function getNewQuestion() {
  if (questionIndex >= questions.length) {
    console.log("No more questions");
    scorePage.classList.remove('hidden')
    return;
  }

  const currentQuestion = questions[questionIndex];
  const allAnswers = [
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ];

  trivaQuestion.innerHTML = currentQuestion.question;
  const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
  optionOne.innerHTML = shuffledAnswers[0];
  optionTwo.innerHTML = shuffledAnswers[1];
  optionThree.textContent = shuffledAnswers[2];
  optionFour.textContent = shuffledAnswers[3];

  questionNumber.textContent = `Question: ${questionIndex + 1}/${questions.length}`;
  questionIndex++;
}

themeIcon.addEventListener("click", () => {
  body.classList.toggle("darkmode");
  themeIcon.classList.toggle("fa-sun");
  themeIcon.classList.toggle("fa-moon");
});

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    const selectedAnswer = e.target.innerHTML;
    const correctAnswer = questions[questionCount].correct_answer;

    function remove() {
      choice.classList.remove("correct", "incorrect");
    }

    if (selectedAnswer === correctAnswer) {
      choice.classList.add("correct");
      score++;
      gameScore.textContent = `Score: ${score}`;
      console.log("Correct! :" + score);
    } else {
      choice.classList.add("incorrect");
      console.log("Incorrect " + score +" Correct Answer: "+correctAnswer);
    }
    setTimeout(remove, 800);
    setTimeout(getNewQuestion, 800);
    questionCount++;
  });
});

function startGame() {
  loadQuestions();
}
function loadGame() {
  startGame();
  content.classList.toggle("hidden");
  custom.classList.toggle("hidden");
}
