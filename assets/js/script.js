// select elements
var $questionCard = jQuery("#question-card");
var $questionTitle = jQuery("#question-title");
var $answerOptions = jQuery(".form-check-input");
var $btnBegin = jQuery("#btn-begin");
var $btnsubmit = jQuery("#btn-submit");
var $btnHighScores = jQuery("#btn-high-scores");

var score = 0;
var TimeRemaining = 30;
var questionIndex = 0;
var userAnswer;

// hide question card until user clicks begin button
$questionCard.attr("style", "display:none");

// event listeners for begin, high scores, and submit buttons

$btnBegin.click(function () {
  beginGame();
});
$btnsubmit.click(function () {
  submitAnswer();
});
// btnHighScores.addEventListener("click", highScores);

// list of question objects each containing
// a question, a list of answers, and the correct answer
var questions = [
  {
    question: "Commonly used data types DO NOT include:",
    answers: ["strings", "booleans", "alerts", "numbers"],
    correctAnswer: "alerts",
  },
  {
    question:
      "The condition in an if / else statement is enclosed within ____.",
    answers: ["quotes", "curly brackets", "parentheses", "square brackets"],
    correctAnswer: "parentheses",
  },
  {
    question: "Arrays in JavaScript can be used to store ____.",
    answers: [
      "numbers and strings",
      "other arrays",
      "booleans",
      "all of the above",
    ],
    correctAnswer: "all of the above",
  },
  {
    question:
      "String values must be enclosed within ____ when being assigned to variables.",
    answers: ["commas", "curly brackets", "quotes", "parentheses"],
    correctAnswer: "quotes",
  },
  {
    question:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    answers: ["JavaScript", "terminal/bash", "for loops", "console.log"],
    correctAnswer: "console.log",
  },
];

// begin game function
function beginGame() {
  // display question card and hide btnBegin and btnHighScores
  $questionCard.attr("style", "display:none");
  $btnBegin.attr("style", "display:none");
  $btnHighScores.attr("style", "display:none");
  displayQuestion(0);
  // // create timer element below question card
  // timerElement = document.createElement("h2");
  // timerElement.textContent =`Time Remaining: ${TimeRemaining}`;
  // $questionCard.appendChild(timerElement);

  // // create score element below question card
  // scoreElement = document.createElement("h2");
  // scoreElement.textContent = "Score: ";
  // $questionCard.appendChild(scoreElement);
}

// fill out question card using questions array
function displayQuestion(whichQuestion) {
  // place question in question card
  $questionCard.attr("style", "display:block");
  $questionTitle.text(questions[whichQuestion].question);
  // console.log(questions[whichQuestion].question);
  // console.log($questionTitle);

  // create list of answer elements
  for (var i = 0; i < questions[whichQuestion].answers.length; i++) {
    jQuery(`#answer${i}`).text(questions[whichQuestion].answers[i]);
    jQuery(`#answer${i}_radio`).checked = false;
    // console.log(questions[whichQuestion].answers[i]);
  }
}

// submit answer function
function submitAnswer() {
  // get correct answer
  var thisAnswer = questions[questionIndex].correctAnswer;
  // get user answer
  // TODO: loop through answer options and find which was selected
  $answerOptions.each(function () {
    if (this.checked) {
      // DEBUG: make sure this works
      // reset radio to off
      this.checked = false;
      let userAnswerIndex = this.id.match(/\d+/)[0];
      userAnswer = questions[questionIndex].answers[userAnswerIndex];
    }
  });

  // increment questionIndex
  questionIndex++;
  // check if user answer is correct
  if (userAnswer === thisAnswer) {
    // correct answer - increment score, add time, display next question
    score++;
    TimeRemaining += 10;
    displayQuestion(questionIndex);
  } else {
    // incorrect answer - remove Time, display next question
    TimeRemaining -= 10;
    displayQuestion(questionIndex);
  }
}
