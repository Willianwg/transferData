function websockets(sockets){
    const rooms = {};
    const usersSpot = {};

    sockets.on('connection', (socket)=>{
        const userId = socket.id; 
        const baseURL = process.env.URL || 'http://localhost:3000';

        sockets.emit("setup", baseURL);
    
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
            rooms[room].image = filename;

            setTimeout( ()=>removeImageOfTheRoom(room), 119000 );
            
            getMessage(room);
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
         rooms[room] = {
            users:[userId],
            text:'',
            image:''
         }
         usersSpot[userId] = room;
    }
    
    function getMessage(room){
        const { text, image } = rooms[room];
       const roomData = {
            text,
            image
        }
        rooms[room].users.map(id=>{
            sockets.to(id).emit('message', roomData);
        })
    }
    
    function removeUserFromTheLastRoom(userId){
        if(!usersSpot[userId]) return;
    
        const room = usersSpot[userId]; 
    
        const index = rooms[room].users.indexOf(userId);
        rooms[room].users.splice(index,1);
    }

    function removeImageOfTheRoom(room){
        rooms[room].image ='';
        
        getMessage(room);
    }
}


module.exports = websockets;