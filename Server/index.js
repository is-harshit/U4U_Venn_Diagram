const express=require('express');
const app=express();
const http=require('http')
const cors=require("cors");

const {Server}=require("socket.io");

const server=http.createServer(app)

const io= new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        method : ["GET","POST"],
    },
});
app.use(cors());

roomId_list={};
completed={};
answers={}

io.on("connection",(socket)=>{
    console.log("User Connected: ",socket.id);

    socket.on("join_room", (room)=>{
        socket.join(room);
        completed[socket.id]=0
        if (room in roomId_list)
        {
            roomId_list[room]+=1;
        }
        else
        {
            roomId_list[room]=1;
        }

        if (roomId_list[room]==2)
        {
            console.log("Both Players joined!")

            socket.to(room).emit("PlayersJoined",true)

            socket.emit("PlayersJoined",true)

            
            // socket.broadcast(room).emit("PlayersJoined",true)

            // room.forEach(room => {
            //     socket.to(room).emit("PlayersJoined", true);
            // });
        }
        console.log(roomId_list,roomId_list[room])

        console.log("User with ID: ",socket.id," joined the room: ",room)


    })


    socket.on("game_done",(room) =>{
        completed[socket.id]=1
        console.log(socket.id+" completed");
        console.log(completed); 

        var flag=1
        for (var key in completed)
        {
            if (completed[key]==0)
              flag=0;
            
        }
        if (flag==1){
            console.log("Game Completed!");

            socket.to(room).emit("GameOver",true)

            socket.emit("GameOver",answers)


        }
    })

    socket.on("Answers",(answer_data)=>{
        if (!(answer_data in answers))
            answers[socket.id]=answer_data;
        console.log(answers);
    })


    socket.on("disconnect",()=>{
        roomId_list=[]
        console.log("User Disconnected: ",socket.id);
    })
})

server.listen(3001,()=> {
    console.log("Server Running!");
})
