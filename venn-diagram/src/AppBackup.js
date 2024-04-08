import React, { useEffect, useState } from "react";
import VennDiagram from "./VennDiagram";
// import {Chat} from 'stream-chat';
import io from "socket.io-client";
import "./App.css";
import questions from "./questions";

const socket = io.connect("http://localhost:3001");

const App = () => {
  // const [playerName, setPlayerName] = useState("");

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [namesSubmitted, setNamesSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [playerReady, setPlayerReady] = useState(false);
  const [playerWaiting, setPlayerWaiting] = useState(false);
  // const [form,SetSubmitted]=useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [Numberplayer, setNumberPlayer] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const [commonAnswers, setCommonAnswers] = useState([]);
  // const [Final_answers,setFinalAnswers]=useState([]);
  const [uniqueAnswersPlayer1, setUniqueAnswersPlayer1] = useState([]);
  const [uniqueAnswersPlayer2, setUniqueAnswersPlayer2] = useState([]);

  const [player1Answers, setPlayer1Answers] = useState([]);
  const [player2Answers, setPlayer2Answers] = useState([]);

  // const player1Answers=["Couch potato", 'Travel', 'Blues', "Indian", "Yoga", "Having a cozy night in with movies and snacks"];
  // const player2Answers=["Walking", "Boating", "Blues", "Indian", "Bubble bath", "Having a cozy night in with movies and snacks"];
  const currentQuestion = questions[currentQuestionIndex];
  // const player1Name = "abc";
  // const player2Name = "def";
  const JoinGame = () => {
    setPlayerWaiting(true);
    console.log("Sets", sets);

    // return () => {
    //   // Optionally, reset the title when the component unmounts
    //   document.title = "Venn Diagram game";
    // };

    // console.log("Why!");
    if (player1Name !== "" && roomId !== "") {
      //&& form){
      socket.emit("join_room", roomId, player1Name);
      if (playerReady) {
        handleSubmitNames();
      }
    }
  };

  useEffect(() => {
    socket.on("RoomOccupied", () => {
      console.log("Room already in use");
      alert("Sorry! Room number already in use!");
      setPlayerWaiting(false);
      setRoomId((prevRoomId) => (parseInt(prevRoomId) + 1).toString());
    });
  }, [socket]);

  useEffect(() => {
    socket.on("PlayersJoined", () => {
      console.log("Received confirmation");
      setPlayerReady(true);
      handleSubmitNames();
    });
  }, [socket]);

  useEffect(() => {
    socket.on("UserNos", (nos) => {
      console.log("No of players:" + nos);
      setNumberPlayer(nos);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("PlayerDisconnected", () => {
      console.log("SISTER DISCONNECTED!");
      alert("Sister got Disconnected");
    });
  }, [socket]);

  useEffect(() => {
    socket.on("GameOver", (answers_received1, answers_received2, players) => {
      console.log("GameOver Received");
      console.log(answers_received1);
      console.log(answers_received2);
      console.log(players);

      console.log({ player1Name });
      console.log(player1Name);

      if (players[0] === player1Name) {
        setPlayer2Name(players[1]);

        setPlayer1Answers(answers_received1);
        setPlayer2Answers(answers_received2);
      } else {
        setPlayer2Name(players[0]);

        setPlayer1Answers(answers_received2);
        setPlayer2Answers(answers_received1);
      }
      // setPlayer1Answers(answers_received1);
      // setPlayer1Answers((prevAnswers) => [...prevAnswers, answers_received1]);
      // setPlayer2Answers(answers_received2);

      // findCommon();

      console.log(player1Answers, player2Answers);

      setGameDone(true);
    });
  }, [socket, player1Name]);

  useEffect(() => {
    // Call findCommon whenever player1Answers or player2Answers change
    findCommon();
  }, [player1Answers, player2Answers]);

  const handleAnswerSelect = (player, answer) => {
    if (player === 1) {
      setSelectedOption(answer);
      setPlayerAnswers((prevAnswers) => [...prevAnswers, answer]);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption != null) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

        setSelectedOption(null);
      } else {
        // Last question reached, mark the quiz as completed
        setQuizCompleted(true);

        socket.emit("game_done", roomId, playerAnswers);

        // socket.emit("Answers",playerAnswers);
      }
    } else {
      alert("Select an option Princess");
    }
  };

  const findCommon = () => {
    // console.log(player1Answers);
    // console.log(player2Answers);

    const common = player1Answers.filter((answer) =>
      player2Answers.includes(answer)
    );

    setCommonAnswers(common);
    console.log("Common Answers:", common);

    const uniqueToPlayer1 = player1Answers.filter(
      (answer) => !player2Answers.includes(answer)
    );

    const uniqueToPlayer2 = player2Answers.filter(
      (answer) => !player1Answers.includes(answer)
    );

    setUniqueAnswersPlayer1(uniqueToPlayer1);
    setUniqueAnswersPlayer2(uniqueToPlayer2);
  };

  const handleSubmitNames = () => {
    // Add any additional logic for name submission if needed
    setNamesSubmitted(true);
    setPlayerWaiting(false);
  };

  const sets = [
    { sets: [player1Name], size: player1Answers.length },
    { sets: [player2Name], size: player2Answers.length },
    {
      sets: [player1Name, player2Name],
      size: player1Answers.filter((answer) => player2Answers.includes(answer))
        .length,
    },
  ];

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

      {playerWaiting && !namesSubmitted && (
        <div>
          <h2>Waiting for Your Sister to Join</h2>
        </div>
      )}

      {namesSubmitted && !quizCompleted && (
        <client>
          <div className="OptionSelection">
            <h2>Question: {currentQuestion.text}</h2>
            <p>{player1Name}</p>
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(1, option)}
              >
                {option}
              </button>
            ))}
            <p>Selected Option: {selectedOption}</p>
          </div>
        </client>
      )}

      {namesSubmitted && !quizCompleted && (
        <button onClick={handleNextQuestion}>Next</button>
      )}

      {namesSubmitted && quizCompleted && (
        <div className="answers">
          <h2>{player1Name}'s Answers</h2>
          <p>{playerAnswers.join(", ")}</p>

          {namesSubmitted && quizCompleted && !gameDone && (
            <div>
              <h2>Waiting for your Sister to Finish</h2>
            </div>
          )}

          {/* Compatibility Percentage */}
          {namesSubmitted && quizCompleted && gameDone && (
            <div className="Result">
              <h2>{player2Name}'s Answers</h2>
              <p>{player2Answers.join(", ")}</p>
              <h2>Compatibility Percentage</h2>
              <p>
                {(
                  (sets[2].size / Math.min(sets[0].size, sets[1].size)) *
                  100
                ).toFixed(2)}
                %
              </p>
              <VennDiagram data={sets} />

              <h2>Common Answers between You 2:</h2>
              <p>{commonAnswers.join(", ")}</p>

              <h2>Answers Unique to You:</h2>
              <p>{uniqueAnswersPlayer1.join(", ")}</p>

              <h2>Answers Unique to Your Sister:</h2>
              <p>{uniqueAnswersPlayer2.join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
