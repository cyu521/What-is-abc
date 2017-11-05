/* eslint-disable  func-names */
/* eslint-disable  dot-notation */
/* eslint-disable  new-cap */
/* eslint quote-props: ['error', 'consistent']*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports en-US lauguage.
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-trivia
 **/

'use strict';

const Alexa = require('alexa-sdk');
const TRIVIA = {
	questions:[],
	answers:[]
};
const GAME_LENGTH = 5;  // The number of questions per trivia game.
const GAME_STATES = {
    TRIVIA: '_TRIVIAMODE', // Asking trivia questions.
    START: '_STARTMODE', // Entry point, start the game.
    HELP: '_HELPMODE', // The user is asking for help.
};
let GAME_LEVEL = "EASY";
const APP_ID = "amzn1.ask.skill.b1bd8fd0-3f33-441f-8bbd-cf2d2eb46d26"; // TODO replace with your app ID (OPTIONAL)
const POSSIBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least ANSWER_COUNT answers, any extras will be shuffled in.
 */
const languageString = {
    'en': {
        'translation': {
            'GAME_NAME': 'What is ABC', // Be sure to change this for your skill.
            'HELP_MESSAGE': 'I will ask you %s quiz questions based on selected difficulities. Respond with What is the answer. ' +
                'For example, say what is C. To start a new game at any time, say, start new game.',
            'REPEAT_QUESTION_MESSAGE': 'To repeat the last question, say, repeat. ',
            'ASK_LEVEL_START': 'What level would you like to playing, easy, medium, or hard?',
            'HELP_REPROMPT': 'To give an answer to a question, Start with what is the and end with the answer, for example if the anwser is c say what is c. if the answer are two letters, for example a and b, say what are a and b',
            'STOP_MESSAGE': 'Would you like to keep playing?',
            'CANCEL_MESSAGE': 'Ok, let\'s play again soon.',
            'NO_MESSAGE': 'Ok, we\'ll play another time. Goodbye!',
            'TRIVIA_UNHANDLED': 'Try saying what is the letter or what are the letter one and letter two',
            'HELP_UNHANDLED': 'Say yes to continue, or no to end the game.',
            'START_UNHANDLED': 'Say start to start a new game.',
            'LEVEL_UNHANDLED': 'Say change level to change the difficulties.',
            'NEW_GAME_MESSAGE': 'Welcome to %s. ',
            'WELCOME_MESSAGE': 'I will ask you %s questions, try to get as many right as you can. ',
            'ANSWER_CORRECT_MESSAGE': 'correct. ',
            'ANSWER_WRONG_MESSAGE': 'wrong. ',
            'CORRECT_ANSWER_MESSAGE': 'The correct answer is: What is %s . ',
            'ANSWER_IS_MESSAGE': 'That answer is ',
            'TELL_QUESTION_MESSAGE': 'Question %s. %s',
            'GAME_OVER_MESSAGE': ' You got %s out of %s questions correct. Thank you for playing!',
            'SCORE_IS_MESSAGE': ' Your score is %s. ',
			'LEVEL_START_MESSAGE': "Starting a new game with %s mode"
        },
    }
};

const newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', true);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = GAME_STATES.START;
		this.handler.level = GAME_LEVEL.easy;
        this.emitWithState('StartGame', true);
    },
	'SetLevelIntent': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState('helpTheUser', true);
    },
    'Unhandled': function () {
        const speechOutput = this.t('START_UNHANDLED');
        this.emit(':ask', speechOutput, speechOutput);
    },
};

function populateGameData() {
    const gameQuestions = [];
	
	switch(GAME_LEVEL.toLowerCase()){
		case "medium":
			return populateMediumQuestions();
		case "hard":
			return populateHardQuestions();
		default: 
			return populateEasyQuestions();
	}
}

function getDirection(index, low, high){
	//decide if it should be after or before depending on index
		if(index <= low){
			return "after";
		}else if (index >= high){
			return "before";
		}else{
			if(Math.floor(Math.random() * 100) % 2 == 0){
					return "after";
				}else{
					return "before";
				}
		}
}
function populateEasyQuestions(){
	const gameQuestions = [];
	const gameAnswers = [];


    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (let j = 0; j < GAME_LENGTH; j++) {
		var index = Math.floor(Math.random() * POSSIBLE.length);
        var targetChar = POSSIBLE.charAt(index);
		var direction = getDirection(index, 0, 25);
		if(direction == "before"){
			gameAnswers.push(POSSIBLE.charAt(index-1));
		}else{
			gameAnswers.push(POSSIBLE.charAt(index+1));
		}
		//What is the letter before/after A/B/C....Z?
		gameQuestions.push("What is the letter " + direction + " " + targetChar + "?");
    }

	TRIVIA.questions=gameQuestions;
	TRIVIA.answers=gameAnswers;
}
function populateMediumQuestions(){
	const gameQuestions = [];
	const gameAnswers = [];


    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (let j = 0; j < GAME_LENGTH; j++) {
		var index = Math.floor(Math.random() * POSSIBLE.length);
        var targetChar = POSSIBLE.charAt(index);
		var direction = getDirection(index, 1, 24);
		if(direction == "before"){
			gameAnswers.push(POSSIBLE.charAt(index-1)+","+POSSIBLE.charAt(index-2));
		}else{
			gameAnswers.push(POSSIBLE.charAt(index+1)+","+POSSIBLE.charAt(index+2));
		}
		//What is the letter before/after A/B/C....Z?
		gameQuestions.push("What are the two letters " + direction + " " + targetChar + "?");
    }

	TRIVIA.questions=gameQuestions;
	TRIVIA.answers=gameAnswers;
}

function populateHardQuestions(){
	const gameQuestions = [];
	const gameAnswers = [];


    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (let j = 0; j < GAME_LENGTH; j++) {
		var index = Math.floor(Math.random() * POSSIBLE.length);
        var targetChar = POSSIBLE.charAt(index);
		//randomly pick a digit 6 chars away from target
		var digitFromTarget = Math.floor(Math.random() * 6)+1;
		
		var direction = getDirection(index, digitFromTarget-1, 26-digitFromTarget);
		if(direction == "before"){
			gameAnswers.push(POSSIBLE.charAt(index-digitFromTarget));
		}else{
			gameAnswers.push(POSSIBLE.charAt(index+digitFromTarget));
		}
		//What is the letter before/after A/B/C....Z?
		gameQuestions.push("What is the "+ getWordOfNum(digitFromTarget) +" letter " + direction + " " + targetChar + "?");
    }

	TRIVIA.questions=gameQuestions;
	TRIVIA.answers=gameAnswers;
}

function getWordOfNum(n){
var special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
 if (n < 20) return special[n];
  if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
  return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];

}
function handleUserGuess(userGaveUp) {
    let speechOutput = '';
    let speechOutputAnalysis = '';
    const gameQuestions = this.attributes.questions;
	const gameAnswers = this.attributes.answers;
    let currentScore = parseInt(this.attributes.score, 10);
    let currentQuestionIndex = parseInt(this.attributes.currentQuestionIndex, 10);
	let correctAnswerText =  gameAnswers[currentQuestionIndex];
	
	if(this.event.request.intent.slots == null || this.event.request.intent.slots == undefined || this.event.request.intent.slots.Answer_one ==undefined){
		 if (userGaveUp) {
			 
			currentQuestionIndex += 1;
			const spokenQuestion = TRIVIA.questions[currentQuestionIndex];
			const questionIndexForSpeech = currentQuestionIndex + 1;
			let repromptText = this.t('TELL_QUESTION_MESSAGE', questionIndexForSpeech.toString(), spokenQuestion);

            text = this.t('CORRECT_ANSWER_MESSAGE', correctAnswerText) + this.t('SCORE_IS_MESSAGE', currentScore.toString()) + repromptText;
			
			Object.assign(this.attributes, {
				'speechOutput': text,
				'repromptText': repromptText,
				'currentQuestionIndex': currentQuestionIndex,
				'questions': TRIVIA.questions,
				'answers': TRIVIA.answers,
				'score': currentScore
			});

			this.emit(':askWithCard', text, repromptText, this.t('GAME_NAME'), repromptText);
        }else{
			var text =  "Invalid response, You must answer like What is A. or What are A and B";
			this.emit(':askWithCard',  text,text , this.t('GAME_NAME'), text);
		}

	}else{
		
		var userAnswer = this.event.request.intent.slots.Answer_one.value;
		userAnswer = userAnswer.replace(".", "").toUpperCase();
		var answerTwo = "";
		if(GAME_LEVEL.toLowerCase() == "medium"){
			if(this.event.request.intent.slots.Answer_two != null ){
				var answer_two = this.event.request.intent.slots.Answer_two.value;
				answerTwo = answer_two +","+ userAnswer;
				userAnswer += "," + answer_two;
			}
		}
		console.log(this.event.request.intent.slots.Answer_one.value , userAnswer);
    if (userAnswer.toLowerCase() ==correctAnswerText.toLowerCase() || answerTwo.toLowerCase() == correctAnswerText.toLowerCase()) {
        currentScore++;
        speechOutputAnalysis = this.t('ANSWER_CORRECT_MESSAGE');
    } else {
        if (!userGaveUp) {
            speechOutputAnalysis = this.t('ANSWER_WRONG_MESSAGE') + ". you said what is " + userAnswer;
        }
        speechOutputAnalysis += this.t('CORRECT_ANSWER_MESSAGE', correctAnswerText) + "...";
    }

    // Check if we can exit the game session after GAME_LENGTH questions (zero-indexed)
    if (this.attributes['currentQuestionIndex'] === GAME_LENGTH - 1) {
        speechOutput = userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE');
        speechOutput += speechOutputAnalysis + this.t('GAME_OVER_MESSAGE', currentScore.toString(), GAME_LENGTH.toString());

        this.emit(':tell', speechOutput);
    } else {
        currentQuestionIndex += 1;
        const spokenQuestion = TRIVIA.questions[currentQuestionIndex];
        const questionIndexForSpeech = currentQuestionIndex + 1;
        let repromptText = this.t('TELL_QUESTION_MESSAGE', questionIndexForSpeech.toString(), spokenQuestion);


        speechOutput += userGaveUp ? '' : this.t('ANSWER_IS_MESSAGE');
        speechOutput += speechOutputAnalysis + this.t('SCORE_IS_MESSAGE', currentScore.toString()) + repromptText;
		
        Object.assign(this.attributes, {
            'speechOutput': speechOutput,
            'repromptText': repromptText,
            'currentQuestionIndex': currentQuestionIndex,
            'questions': TRIVIA.questions,
			'answers': TRIVIA.answers,
            'score': currentScore
        });

        this.emit(':askWithCard', speechOutput, repromptText, this.t('GAME_NAME'), repromptText);
    }
	}
		
}

const startStateHandlers = Alexa.CreateStateHandler(GAME_STATES.START, {
    'StartGame': function (newGame, state) {
        let speechOutput = newGame ? this.t('NEW_GAME_MESSAGE', this.t('GAME_NAME')) + this.t('WELCOME_MESSAGE', GAME_LENGTH.toString()) : '';
		if(this.event != null && this.event.request != null && this.event.request.intent != null && this.event.request.intent.slots!= null && this.event.request.intent.slots.level !=null)
        {
				switch(this.event.request.intent.slots.level.value.toLowerCase()){
					case "medium":
						GAME_LEVEL="MEDIUM";
						break;
					case "hard":
						GAME_LEVEL="HARD";
						break;
					default:
						GAME_LEVEL="EASY";

				}
		}
		speechOutput +=  this.t('LEVEL_START_MESSAGE', GAME_LEVEL);
        
		populateGameData();
		
		var currentQuestionIndex =0;
        const spokenQuestion = TRIVIA.questions[currentQuestionIndex];

        let repromptText = this.t('TELL_QUESTION_MESSAGE', '1', spokenQuestion) + " You must answer like What is A. or What are A and B";
		
		

        speechOutput += repromptText;

        Object.assign(this.attributes, {
            'speechOutput': speechOutput,
            'repromptText': repromptText,
            'currentQuestionIndex': currentQuestionIndex,
            'questions': TRIVIA.questions,
			'answers': TRIVIA.answers,
            'score': 0
        });

        // Set the current state to trivia mode. The skill will now use handlers defined in triviaStateHandlers
        this.handler.state = GAME_STATES.TRIVIA;
        this.emit(':askWithCard', speechOutput, repromptText, this.t('GAME_NAME'), repromptText);
    },
});

const triviaStateHandlers = Alexa.CreateStateHandler(GAME_STATES.TRIVIA, {
    'AnswerIntent': function () {
        handleUserGuess.call(this, false);
    },
    'DontKnowIntent': function () {
        handleUserGuess.call(this, true);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
	'SetLevelIntent': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptText']);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState('helpTheUser', false);
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = GAME_STATES.HELP;
        const speechOutput = this.t('STOP_MESSAGE');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('CANCEL_MESSAGE'));
    },
    'Unhandled': function () {
        const speechOutput = this.t('TRIVIA_UNHANDLED');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended in trivia state: ${this.event.request.reason}`);
    },
});

const helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
    'helpTheUser': function (newGame) {
        const askMessage = newGame ? this.t('ASK_MESSAGE_START') : this.t('REPEAT_QUESTION_MESSAGE') + this.t('STOP_MESSAGE');
        const speechOutput = this.t('HELP_MESSAGE', GAME_LENGTH) + askMessage;
        const repromptText = this.t('HELP_REPROMPT') + askMessage;
        this.emit(':ask', speechOutput, repromptText);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
	'SetLevelIntent': function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState('StartGame', false);
    },
    'AMAZON.RepeatIntent': function () {
        const newGame = !(this.attributes['speechOutput'] && this.attributes['repromptText']);
        this.emitWithState('helpTheUser', newGame);
    },
    'AMAZON.HelpIntent': function () {
        const newGame = !(this.attributes['speechOutput'] && this.attributes['repromptText']);
        this.emitWithState('helpTheUser', newGame);
    },
    'AMAZON.YesIntent': function () {
        if (this.attributes['speechOutput'] && this.attributes['repromptText']) {
            this.handler.state = GAME_STATES.TRIVIA;
            this.emitWithState('AMAZON.RepeatIntent');
        } else {
            this.handler.state = GAME_STATES.START;
            this.emitWithState('StartGame', false);
        }
    },
    'AMAZON.NoIntent': function () {
        const speechOutput = this.t('NO_MESSAGE');
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        const speechOutput = this.t('STOP_MESSAGE');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('CANCEL_MESSAGE'));
    },
    'Unhandled': function () {
        const speechOutput = this.t('HELP_UNHANDLED');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended in help state: ${this.event.request.reason}`);
    },
});

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
    alexa.execute();
};
