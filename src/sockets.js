function websockets(sockets){
    const rooms = {};
    const usersSpot = {};

    sockets.on('connection', (socket)=>{
        const userId = socket.id; 
    
        socket.on('transferData', (roomData)=>{
            const { room, text } = roomData;
            rooms[room].text = text;
    
            getMessage(room);
        })
    
        socket.on('join', (room)=>{
            rooms[room] ? joinUser(userId, room) : createRoom(userId, room);
        })

        socket.on("imageUpload", (data) =>{
            const { room, filename } = data;
            rooms[room].users.map(id=>{
                sockets.to(id).emit('newImage', filename );
            })
        })
    
        socket.on('disconnect', ()=>{
            removeUserFromTheLastRoom(userId);
        })
    })
    
    function isUserIn(userId, room){
        const user = rooms[room].users.find(item=>item === userId);
    
        return !!user;
    }
    
    function joinUser(userId, room){
        if(isUserIn(userId,room)) return;
        removeUserFromTheLastRoom(userId);
    
        usersSpot[userId] = room;
        rooms[room].users.push(userId);
        getMessage(room);
    }
    
    function createRoom(userId, room){
        removeUserFromTheLastRoom(userId);
         rooms[room] = [userId];
         rooms[room] = {
            users:[userId],
            text:''
         }
         usersSpot[userId] = room;
    }
    
    function getMessage(room){
        rooms[room].users.map(id=>{
            sockets.to(id).emit('message', rooms[room].text);
        })
    }
    
    function removeUserFromTheLastRoom(userId){
        if(!usersSpot[userId]) return;
    
        const room = usersSpot[userId]; 
    
        const index = rooms[room].users.indexOf(userId);
        rooms[room].users.splice(index,1);
    }
}


module.exports = websockets;