const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});
app.use(cors());

roomId_list = {};
const UserRoom = new Map();
// completed = {};
const compltedMap = new Map();

// all_answers = [];

const all_answersMap = new Map();

users = [];
userName = {};
const RoomDone = new Map();

io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);
  users.push(socket.id);

  socket.emit("UserNos", users.length);

  socket.on("join_room", (room, playerName) => {
    if (roomId_list[room] !== 2) {
      socket.join(room);

      if (UserRoom.get(socket.id) === room) {
        console.log("Repeated");
        return;
      }

      userName[socket.id] = playerName;

      UserRoom.set(socket.id, room);
      // const room1 = io.sockets.adapter.rooms.get(room);
      // if (room1) {
      //   console.log(`Hosts in room ${room}:`);
      //   room1.forEach((socketId) => {
      //     const socket = io.sockets.sockets.get(socketId);
      //     console.log(`- Socket ID: ${socket.id}`);
      //     // You can print additional information about the socket if needed
      //     // For example, socket.handshake.address will give you the IP address
      //   });
      // } else {
      //   console.log(`Room ${room} does not exist or is empty.`);
      // }

      // completed[socket.id] = 0;

      if (room in roomId_list) {
        roomId_list[room] += 1;
      } else {
        roomId_list[room] = 1;
      }

      if (roomId_list[room] == 2) {
        console.log("Both Players joined!");

        io.to(room).emit("PlayersJoined", true);

        compltedMap.set(room, [0, 0]);

        all_answersMap.set(room, []);
        // socket.emit("PlayersJoined", true);

        // socket.broadcast(room).emit("PlayersJoined",true)

        // room.forEach(room => {
        //     socket.to(room).emit("PlayersJoined", true);
        // });
      }

      console.log(roomId_list, roomId_list[room]);

      console.log("User with ID: ", socket.id, " joined the room: ", room);
    } else {
      console.log(socket.id + " tried to join occupied room");
      socket.emit("RoomOccupied");
    }
  });

  socket.on("game_done", (room, answers) => {
    const arr = compltedMap.get(room);
    if (arr[0] === 0) {
      arr[0] = 1;
    } else {
      arr[1] = 1;
    }
    compltedMap.set(room, arr);

    // completed[socket.id] = 1;

    // console.log(socket.id + " completed");
    console.log("Its answers: " + answers);

    // all_answers.push(answers);

    const arrayans = all_answersMap.get(room) || [];

    console.log("Map Answers update : " + arrayans);
    arrayans.push(answers);
    all_answersMap.set(room, arrayans);

    // all_answersMap.set(room, answers);
    // console.log(completed);

    console.log("All ANswers map:" + all_answersMap.get(room));

    console.log(RoomDone);

    const array = RoomDone.get(room) || [];
    array.push(userName[socket.id]);
    RoomDone.set(room, array);

    console.log(RoomDone.get(room));

    console.log(compltedMap.get(room));
    // var flag = 1;
    // for (var key in completed) {
    //   if (completed[key] == 0) flag = 0;
    // }

    var flag = 1;
    for (const key of compltedMap.get(room)) {
      // console.log("keys:" + key);
      if (key == 0) flag = 0;
    }

    if (flag == 1 || RoomDone.length === 2) {
      console.log("Game Completed!");

      // socket.to(room).emit("GameOver",true)
      console.log("GAME OVER!");
      console.log(all_answersMap);

      const all_answers = all_answersMap.get(room);

      console.log("ans:" + all_answers);

      io.to(room).emit(
        "GameOver",
        all_answers[0],
        all_answers[1],
        RoomDone.get(room)
      );
      // socket.emit("GameOver", all_answers[1], all_answers[0]);
      RoomDone.delete(room);
      compltedMap.delete(room);

      all_answersMap.delete(room);

      console.log("Finito");

      // console.log(completed);

      // console.log(roomId_list);
      // console.log(UserRoom);
      // console.log(compltedMap);
      // console.log(all_answersMap);
      // console.log(users);
      // console.log(userName);
      // console.log(RoomDone);
    }
  });

  socket.on("Answers", (answer_data) => {
    if (!(answer_data in answers)) answers[socket.id] = answer_data;
    console.log(answers);
  });

  socket.on("disconnect", () => {
    // roomId_list.pop(socket.id);
    // console.log(roomId_list);

    const arr = compltedMap.get(UserRoom.get(socket.id)) || [];

    console.log(arr);
    if (arr.length === 2) {
      if (arr[0] === 0 || arr[1] === 0) {
        console.log("Emitting Disconnection");
        console.log(UserRoom.get(socket.id));
        io.to(UserRoom.get(socket.id)).emit("PlayerDisconnected");
      }
    }
    delete roomId_list[UserRoom.get(socket.id)];

    delete userName[socket.id];

    UserRoom.delete(socket.id);

    users.filter((item) => item !== socket.id);
    console.log("User Disconnected: ", socket.id);

    // console.log(users.includes(socket.id));
    const ind = users.indexOf(socket.id);
    users.splice(ind, 1);

    // console.log(roomId_list);
    // console.log(UserRoom);
    // console.log(compltedMap);
    // console.log(all_answersMap);
    // console.log(users);
    // console.log(userName);
    // console.log(RoomDone);
  });
});

server.listen(3001, () => {
  console.log("Server Running!");
});
