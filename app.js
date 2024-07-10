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
const loadingElement = document.getElementById("loadingElement")
const content = document.getElementById("quizContent");
const custom = document.getElementById("custom")
const category = document.getElementById("categories");
const difficulty = document.getElementById("difficulty")
const choices = [optionOne, optionTwo, optionThree, optionFour];
const scorePage = document.getElementById("scorePage")
let selectedCat = 0;
let selectedDiff = 0;
let apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCat}&difficulty=${selectedDiff}&type=multiple&token=87a5554db38a7b70436940be318b05198f6903210a3511f9a13579acb8bb40fb`;
function getValues() {
  selectedCat = category.value;
  selectedDiff = difficulty.value;
  console.log(selectedDiff);
  apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCat}&difficulty=${selectedDiff}&type=multiple&token=87a5554db38a7b70436940be318b05198f6903210a3511f9a13579acb8bb40fb`;
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
      loadingElement.style.display = 'none'
      setTimeout(content.style.display = 'block',800)
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
  optionThree.innerHTML = shuffledAnswers[2];
  optionFour.innerHTML = shuffledAnswers[3];

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
  loadingElement.style.display ="block"
  content.style.display ="none"
  startGame();
  content.classList.toggle("hidden");
  custom.classList.toggle("hidden");
}
