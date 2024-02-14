import React, { useEffect, useState } from 'react';
import VennDiagram from './VennDiagram';
// import {Chat} from 'stream-chat';
import io from 'socket.io-client'
import './App.css';
import questions from './questions';

const socket =io.connect("http://localhost:3001")

const App = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [namesSubmitted, setNamesSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [roomId,setRoomId]=useState("");
  const [playerReady,setPlayerReady]=useState(false);
  // const [form,SetSubmitted]=useState(false); 
  const [gameDone,setGameDone]=useState(false);
  
  // const [Final_answers,setFinalAnswers]=useState([]);

  const [player1Answers, setPlayer1Answers] = useState([]);
  const [player2Answers, setPlayer2Answers] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];

  const JoinGame = () =>{
    // console.log("Why!");
    if (player1Name !== ""  && roomId !=="" ){ //&& form){
      socket.emit("join_room",roomId)
      if (playerReady)
      {
        handleSubmitNames();
      }
    }
  }

  useEffect( ()=>{
  socket.on("PlayersJoined", ()=>{
    console.log("Received confirmation");
    setPlayerReady(true);
    handleSubmitNames();
  })
  },[socket]); 

  useEffect( ()=>{
    socket.on("GameOver", (answers_received)=>{
      console.log("GameOver Received");
      
      // setPlayer1Answers(answers_received[0]);
      // setPlayer2Answers(answers_received[1]);

      // console.log(player1Answers,player2Answers);

      setGameDone(true);

    })
    },[socket]); 

  const handleAnswerSelect = (player, answer) => {
    if (player === 1) {
      setPlayerAnswers((prevAnswers) => [...prevAnswers, answer]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Last question reached, mark the quiz as completed
      setQuizCompleted(true);

      socket.emit("game_done",roomId);

      // socket.emit("Answers",playerAnswers);
    }
  };

  const handleSubmitNames = () => {
    // Add any additional logic for name submission if needed
    setNamesSubmitted(true);
  };

  // const sets = [
  //   { sets: ['player1Name'], size: player1Answers.length },
  //   { sets: ['player1Name', 'player2Name'], size: player1Answers.filter((answer) => player2Answers.includes(answer)).length },
  // ];

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

          <button onClick={JoinGame}>Submit</button>
        </div>
        
        
      )}

      

      {namesSubmitted && !quizCompleted && (
        <client >
        <div>
          <h2>Question: {currentQuestion.text}</h2>
          <p>{player1Name}</p>
          {currentQuestion.options.map((option) => (
            <button key={option} onClick={() => handleAnswerSelect(1, option)}>
              {option}
            </button>
          ))}
          <p>Selected Option: {playerAnswers[playerAnswers.length - 1]}</p>

        </div>
        </client>
        )}

      {namesSubmitted && !quizCompleted && (
        <button onClick={handleNextQuestion}>Next</button>
      )}

      {namesSubmitted && quizCompleted && (
        <div>
          <h2>{player1Name}'s Answers</h2>
          <p>{playerAnswers.join(', ')}</p>
          
          {namesSubmitted && quizCompleted && !gameDone &&(
            <div>
              <h2>Waiting for other person</h2>
            </div>
          )}

          {/* Compatibility Percentage */}
          {namesSubmitted && quizCompleted && gameDone &&(
            <div>
              <h2>Compatibility Percentage</h2>
              {/* <p>{((sets[2].size / Math.min(sets[0].size, sets[1].size)) * 100).toFixed(2)}%</p>
              <VennDiagram data={sets} /> */}
            </div>
          )}
        </div>
      )}

      
    </div>
  );
};

export default App;
