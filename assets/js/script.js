// debug: submit score button removal not working. Clicking high 
// debug: scores button a second time adds a second list instead of 
// debug: overwriting the old list. 
// select elements
var $questionCard = jQuery("#question-card");
var $questionTitle = jQuery("#question-title");
var $answerOptions = jQuery(".form-check-input");
var $btnBegin = jQuery("#btn-begin");
var $btnSubmit = jQuery("#btn-submit"); // starts hidden
var $btnHighScores = jQuery("#btn-high-scores");

// create elements for later use
var $timerElement = jQuery("<h2>");
var $scoreElement = jQuery("<h2>");
var $scoreRecords = jQuery("<ul>")
var $nameInputHeaderElement = jQuery(
  "<h3>Enter your name to save your score:</h3>"
);
var $nameInputElement = jQuery(
  `<div class="input-group flex-nowrap">
  <input 
    type="text" 
    class="form-control" 
    placeholder="Name" 
    aria-label="Username" 
    style="max-width:15rem"
</div>`
);
var $btnSubmitScore = jQuery(
  `<button
  class="btn btn-primary col-3 mx-auto my-3"
  type="button"
  id="btn-submit-score"
>
  Submit Score
</button>`
);

// initialize variables
var score = 0;
var questionIndex = 0;
var userAnswer;

// hide question card until user clicks begin button
$questionCard.attr("style", "display:none");

// event listeners for begin, high scores, and submit buttons
$btnBegin.click(function () {
  beginQuiz();
});
$btnSubmit.click(function () {
  submitAnswer();
});
$btnHighScores.click(function () {
  displayScores();
});
$btnSubmitScore.click(function () {
  submitScore();
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
      // fixme: fix this sentence
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    answers: ["JavaScript", "terminal/bash", "for loops", "console.log"],
    correctAnswer: "console.log",
  },
];

// begin game function
function beginQuiz() {
  displayReset();
  // hide btnBegin, btnHighScores and display question card
  $btnHighScores.attr("style", "display:none");
  displayQuestion(0);
  $btnBegin.attr("style", "display:none");
  // create timer element and start timer
  $timerElement.appendTo(jQuery("main"));
  $timerElement.attr("class", "container");
  $timerElement.addClass("mx-auto");
  $timerElement.addClass("text-center");
  quizTimer.Start();

  // create score element
  $scoreElement.text(`Score: ${score}`);
  $scoreElement.appendTo(jQuery("header"));
}

function displayReset() {
  // reset variables incase quiz taken previously
  score = 0;
  questionIndex = 0;

  if ($nameInputHeaderElement) {
    $nameInputHeaderElement.remove();
  }
  if ($nameInputElement) {
    $nameInputElement.remove();
  }
  // fixme: this breaks submission
  // if ($btnSubmitScore) {
  //   $btnSubmitScore.remove();
  // }
  if ($timerElement) {
    $timerElement.remove();
  }
  if ($scoreRecords) {
    $scoreRecords.remove();
  }

  // reset all radios
  $answerOptions.each(function () {
    if (this.checked) {
      // reset radio to off
      this.checked = false;
    }
  });
}

// fill out question card using questions array
function displayQuestion(whichQuestion) {
  // place question in question card
  $questionCard.attr("style", "display:block; max-width:40rem");
  $questionTitle.text(questions[whichQuestion].question);

  // label radios with answer options
  for (let i = 0; i < questions[whichQuestion].answers.length; i++) {
    jQuery(`#answer${i}`).text(questions[whichQuestion].answers[i]);
    jQuery(`#answer${i}_radio`).checked = false;
  }
}

var quizTimer = {
  Start: function () {
    timeRemaining = 15;
    this.timer = setInterval(function () {
      // decrement timer
      timeRemaining--;
      // update timer
      $timerElement.text(`Time Remaining: ${timeRemaining}`);

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

function endQuiz(reason) {
  if (reason === "out of time") {
    // display out of time message
    quizTimer.Stop();
    $timerElement.text("Time's up!");
  } else if (reason === "finished") {
    // end timer and display finished message
    quizTimer.Stop();
    $timerElement.text("You finished the quiz!");
    // display score for this attempt
    $scoreElement.text(`Score: ${score} out of ${questions.length}`);
  } else {
    // display error message
    $timerElement.text("Error: " + reason);
  }
  // hide question card
  $questionCard.attr("style", "display:none");
  // show btnBegin and btnHighScores
  $btnBegin.attr("style", "display:block");
  $btnHighScores.attr("style", "display:block");

  // prompt user to save score
  promptUser();
}

// prompt user to save their score
function promptUser() {
  // prompt user to save score
  $nameInputHeaderElement.appendTo(jQuery("#btn-group"));
  $nameInputHeaderElement.attr("class", "mx-auto");

  $nameInputElement.appendTo(jQuery("#btn-group"));
  $nameInputElement.attr("class", "col-3 mx-auto my-3");

  $btnSubmitScore.appendTo(jQuery("#btn-group"));
  $btnSubmitScore.attr("class", "btn btn-primary mx-auto my-3");
}

function submitScore() {
  // store name and score in local storage
  var userName = jQuery(".form-control").val();
  localStorage.setItem(userName, `${score}/${questions.length}`);
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

  // increment questionIndex
  questionIndex++;

  // check if user answer is correct
  if (userAnswer === thisAnswer) {
    // correct answer - increment score, add time
    score++;
    $scoreElement.text(`Score: ${score}`);
    timeRemaining += 10;
  } else {
    // incorrect answer - remove Time
    timeRemaining -= 10;
  }
  // check if last question
  if (0 <= questionIndex && questionIndex < questions.length) {
    displayQuestion(questionIndex);
  } else {
    endQuiz("finished");
  }
}

function displayScores() {
  // display high scores
  // todo: add header
  // todo: make text larger
  // todo: remove bullet points
  // todo: line breaks between entries
  $scoreRecords.appendTo(jQuery("main"));
  // loop through high scores
  for (let i = 0; i < localStorage.length; i++) {
    // get key and value
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    // remove bullet points and display key value pairs
    $scoreRecords.append(`<li>\n${key} : ${value}</li>`);
    $scoreRecords
      .appendTo(jQuery("main"))
      .attr("class", "container mx-auto text-center");
  }
}
