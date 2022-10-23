export default function handleJoin(event,socket,roomInput,user){
    event.preventDefault();
    socket.emit('join', roomInput.value);
    user.changeRoom(roomInput.value);
}