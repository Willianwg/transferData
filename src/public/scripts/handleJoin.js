export default function handleJoin(event,socket,roomInput,user, imageDiv, text, roomName){
    event.preventDefault();
    socket.emit('join', roomInput.value);
    user.changeRoom(roomInput.value);
    imageDiv.innerHTML = '';
    text.innerText = '';
    roomName.innerHTML = roomInput.value;
}