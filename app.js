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
const category = document.getElementById("categories");
const choices = [optionOne, optionTwo, optionThree, optionFour];
let selectedCat = 0;
let apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCat}&difficulty=easy&type=multiple`;
function getCatValue() {
  selectedCat = category.value;
  console.log(selectedCat);
  apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCat}&difficulty=easy&type=multiple`;
  return selectedCat;
}
category.addEventListener("change", getCatValue);
getCatValue();
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

  questionNumber.textContent = `Question: ${questionIndex + 1}/10`;
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
    setTimeout(remove, 500);
    setTimeout(getNewQuestion, 500);
    questionCount++;
  });
});

function startGame() {
  loadQuestions();
}
function loadGame() {
  startGame();
  content.classList.toggle("hidden");
  startBtn.classList.toggle("hidden");
}
