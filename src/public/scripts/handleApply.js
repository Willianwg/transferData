export default function handleApply(event, socket, contentInput, user){
    event.preventDefault();

    if(!user.room) return;

    const roomData = {
        text: contentInput.value,
        room: user.room
    }

    socket.emit('transferData', roomData);
}