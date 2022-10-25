export default function createUser(){
    let room;

    function changeRoom(newRoom){
        this.room = newRoom;
    }
    
    return {
        room,
        changeRoom
    }
}