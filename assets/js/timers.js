$(document).ready(function(){
  
  // event listeners
  $("#time-remaining").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  questions: {
    q1: 'What Causes Most Forest Fires?',
    q2: 'A ______ is a Forest Fires Buring Accross Top Trees?',
    q3: 'Complete the Cumbustion Reaction [(CHO)+(___)] ---> [(CO2) + (H2O) + Heat]',
    q4: 'Forest Fires likely spread in what Weather Conditions?',
    q5: "_______ Reaction is the Chemical Reaction for Fire",
    q6: 'How can Humans cause Forest Fires?',
    q7: "Forest Fires are ALWAYS Bad for the Environemnt"
  },
  options: {
    q1: ['Climate Change', 'Lightning', 'Humans', 'Weather'],
    q2: ['Tall Fire', 'Top Fire', 'Crown Fire', 'High Fire'],
    q3: ['H2O', 'O2', 'CO2', 'Heat'],
    q4: ['Rain', 'Snow', 'Drought', 'Summer'],
    q5: ['Fusion','Heat','Explosion','Combustion'],
    q6: ['Camp Fires','Smoking Drugs','Roasting','All of the Above'],
    q7: ['True', 'False']
  },
  answers: {
    q1: 'Humans',
    q2: 'Crown Fire',
    q3: 'O2',
    q4: 'Drought',
    q5: 'Combustion',
    q6: 'All of the Above',
    q7: 'False'
  },
  // trivia methods
  // method to initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').css("display", "flex");
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    $('#start').hide();
    $('#time-remaining').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 40;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1e3);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Please play again!</p>');
      

      $('#game').hide();
      $('#start').show();
      $('#content-text').show();
    }
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<div id="correct" class="behind"><h1>That is how you put out forest fires</h1></div>');

    }
    else{
      $(this).addClass('btn-danger').removeClass('btn-info');
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<div id="incorrect"> <h1>YippieKiYay M#*$*%*#F**#*! ' + currentAnswer + '</h1></div>');
    } 
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();    
  }
}