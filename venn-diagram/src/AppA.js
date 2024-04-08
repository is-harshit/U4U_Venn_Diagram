import React, { useEffect, useState } from 'react';
import VennDiagram from './VennDiagram';
import io from 'socket.io-client'
import './App.css';
import questions from './questions';

const socket = io.connect("http://localhost:3001")

const App = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [playerAnswers, setPlayerAnswers] = useState(Array(questions.length).fill(''));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [namesSubmitted, setNamesSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [playerReady, setPlayerReady] = useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    socket.on("PlayersJoined", () => {
      setPlayerReady(true);
      handleSubmitNames();
    })
  }, [socket]);

  useEffect(() => {
    socket.on("GameOver", () => {
      setGameDone(true);
    })
  }, [socket]);

  const handleAnswerSelect = (answer) => {
    const updatedAnswers = [...playerAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setPlayerAnswers(updatedAnswers);
    setSelectedOption(answer); // Highlight selected option
  };

  const handleNextQuestion = () => {
    // Check if current question is answered before proceeding
    if (playerAnswers[currentQuestionIndex] === '') {
      alert('Please answer the current question before proceeding!');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null); // Clear highlighted option when moving to next question
    } else {
      setQuizCompleted(true);
      socket.emit("game_done", roomId);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      setSelectedOption(null); // Clear highlighted option when moving to previous question
    }
  };

  const handleSubmitNames = () => {
    if (player1Name !== "" && roomId !== "") {
      setNamesSubmitted(true);
    } else {
      alert('Please fill in all required fields!');
    }
  };

  return (
    <div>
      <h1>U4U Venn Diagram Quiz</h1>

      {!namesSubmitted && (
        <div className="player-names">
          <label>Player Name: </label>
          <input
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
          />
          <br></br>
          <label>Room ID: </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleSubmitNames}>Submit</button>
        </div>
      )}

      {namesSubmitted && !quizCompleted && (
        <div>
          <h2>Question: {currentQuestion.text}</h2>
          {currentQuestion.options.map((option) => (
            <button 
              key={option} 
              className={selectedOption === option ? 'selected-option' : null} // Apply 'selected-option' class if option is selected
              onClick={() => handleAnswerSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {namesSubmitted && !quizCompleted && (
        <div>
          <button onClick={handlePreviousQuestion}>Back</button>
          <button onClick={handleNextQuestion}>Next</button>
        </div>
      )}

      {namesSubmitted && quizCompleted && (
        <div>
          <h2>{player1Name}'s Answers</h2>
          <p>{playerAnswers.join(', ')}</p>
          {namesSubmitted && quizCompleted && !gameDone && (
            <div>
              <h2>Waiting for other person</h2>
            </div>
          )}
          {/* Compatibility Percentage */}
          {namesSubmitted && quizCompleted && gameDone && (
            <div>
              <h2>Compatibility Percentage</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
