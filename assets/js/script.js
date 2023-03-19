// select elements
var $questionCard = jQuery("#question-card");
var $questionTitle = jQuery("#question-title");
var $answerOptions = jQuery(".form-check-input");
var $btnBegin = jQuery("#btn-begin");
var $btnsubmit = jQuery("#btn-submit");
var $btnHighScores = jQuery("#btn-high-scores");

// create elements for later use
var $timerElement = jQuery("<h2>");
var $scoreElement = jQuery("<h2>");

// initialize variables
var score = 0;
var timeRemaining = 10;
var timeTaken = 0;
var questionIndex = 0;
var userAnswer;

// hide question card until user clicks begin button
$questionCard.attr("style", "display:none");

// event listeners for begin, high scores, and submit buttons

$btnBegin.click(function () {
  beginQuiz();
});
$btnsubmit.click(function () {
  submitAnswer();
});
$btnHighScores.click(function () {
  highScores();
});

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
function beginQuiz() {
  // reset variables incase quiz taken previously
  score = 0;
  timeRemaining = 10;
  timeTaken = 0;
  questionIndex = 0;
  // reset all radios
  $answerOptions.each(function () {
    if (this.checked) {
      // reset radio to off
      this.checked = false;
    }
  });

  // display question card and hide btnBegin and btnHighScores
  $questionCard.attr("style", "display:none");
  $btnBegin.attr("style", "display:none");
  $btnHighScores.attr("style", "display:none");
  displayQuestion(0);
  // create timer element and start timer
  $timerElement.appendTo(jQuery("header"));
  quizTimer.Start;

  // create score element
  $scoreElement.text(`Score: ${score}`);
  $scoreElement.appendTo(jQuery("header"));
}

// fill out question card using questions array
function displayQuestion(whichQuestion) {
  // place question in question card
  $questionCard.attr("style", "display:block");
  $questionTitle.text(questions[whichQuestion].question);

  // label radios with answer options
  for (var i = 0; i < questions[whichQuestion].answers.length; i++) {
    jQuery(`#answer${i}`).text(questions[whichQuestion].answers[i]);
    jQuery(`#answer${i}_radio`).checked = false;
  }
}

var quizTimer = {
  Start: function () {
    this.timer = setInterval(function () {
      // decrement timer
      timeRemaining--;
      // update timer
      $timerElement.text(`Time Remaining: ${timeRemaining} seconds`);

      if (timeRemaining <= 0) {
        // stop timer
        clearInterval(this.timer);
        // send out of time message
        endQuiz("out of time");
      }
    }, 1000);
  },

  Stop: function () {
    clearInterval(this.timer);
  },
};

// function quizTimer() {
//   var timerInterval = setInterval(function () {
//     // decrement timer
//     timeRemaining--;
//     // update timer
//     $timerElement.text(`Time Remaining: ${timeRemaining} seconds`);

//     if (timeRemaining <= 0) {
//       // stop timer
//       clearInterval(timerInterval);
//       // send out of time message
//       endQuiz('out of time');
//     }
//   }, 1000);
// }

function endQuiz(reason) {
  if (reason === "out of time") {
    // display out of time message
    $timerElement.text("Time's up!");
  } else if (reason === "finished") {
    // end timer and display finished message
    quizTimer.Stop();
    $timerElement.text("You finished the quiz!");
  } else {
    // display error message
    $timerElement.text("Error: " + reason);
  }
  // hide question card
  $questionCard.attr("style", "display:none");
  // show btnBegin and btnHighScores
  $btnBegin.attr("style", "display:block");
  $btnHighScores.attr("style", "display:block");
}

// submit answer function
function submitAnswer() {
  // get correct answer
  var thisAnswer = questions[questionIndex].correctAnswer;
  // loop through radio buttons to find which one is checked
  $answerOptions.each(function () {
    if (this.checked) {
      // reset radio to off
      this.checked = false;
      // get userAnswerIndex from the number in radio id
      let userAnswerIndex = this.id.match(/\d+/)[0];
      userAnswer = questions[questionIndex].answers[userAnswerIndex];
    }
  });
  // check if last question
  if (questionIndex === questions.length - 1) {
    // last question - save score and time then end quiz
    localStorage.setItem("score", score);
    localStorage.setItem("timeTaken", timeTaken);
    endQuiz("finished");
  }

  // increment questionIndex
  questionIndex++;

  // check if user answer is correct
  if (userAnswer === thisAnswer) {
    // correct answer - increment score, add time, display next question
    score++;
    $scoreElement.text(`Score: ${score}`);
    timeRemaining += 10;
    try {
      displayQuestion(questionIndex);
    } catch (error) {
      console.log(error);
    }
  } else {
    // incorrect answer - remove Time, display next question
    timeRemaining -= 10;
    displayQuestion(questionIndex);
  }
}

function highScores() {
  // display high scores
  $scoreElement.text(`High Scores`);
  $scoreElement.appendTo(jQuery("header"));
  // loop through high scores
  for (var i = 0; i < localStorage.length; i++) {
    // get key and value
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    // display key and value
    $scoreElement.text(`${key}: ${value}`);
    $scoreElement.appendTo(jQuery("header"));
  }
}
