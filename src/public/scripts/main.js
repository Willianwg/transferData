import useApi from "./api.js";
import createListener from "./createEventListener.js"
import getElementById from "./getElement.js";
import handleJoinRoom from "./handleJoin.js";
import handleChange from "./handleChange.js";
import handleApplyContent from "./handleApply.js";
import createUser from "./createUser.js";

let api;
const socket = io();

const text = getElementById(document,"text");
const imageDiv = getElementById(document,"imageDiv");
const roomInput = getElementById(document,"room");
const roomName = getElementById(document,"roomName");
const contentInput = getElementById(document,"contentInput");
const joinButton = getElementById(document,"join-btn");
const applyButton = getElementById(document,"apply-btn");
const imageInput = getElementById(document,"image");
const user = createUser();

const handleJoin = (event) => handleJoinRoom(event, socket, roomInput, user, imageDiv, text, roomName);
const handleApply = (event) => handleApplyContent(event, socket, contentInput, user);
const handleImageChange = (event) => {
    if(!user.room) return imageInput.value = null;
    handleChange(event, api.uploadImage, emitImage);
}

createListener(joinButton,"click", handleJoin);
createListener(applyButton,"click", handleApply);


function setImage(filename){
    console.log(filename)
    imageDiv.innerHTML = '';
    imageInput.value = null;
    if(!filename) return;

    let image;
    let re = /(?:\.([^.]+))?$/;
    const extension = re.exec(filename)[1];

    if(extension === 'jpg' || extension === "jpeg" || extension === "png"){
        image = document.createElement("img");
        image.src = api.baseURL+'files/'+ filename;
    }
    else if(extension === 'pdf' || extension === "mp4"){
        image = document.createElement("iframe");
        image.src = api.baseURL+'files/'+ filename;
    }else{
        image = document.createElement("iframe");
        image.src = 'https://view.officeapps.live.com/op/embed.aspx?src=' + api.baseURL+'files/'+ filename;
    }
    image.width = 300;
    image.height = 300;
   

    imageDiv.appendChild(image);

}

function emitImage(filename){
    const data = {
        room:user.room,
        filename
    }
    socket.emit("imageUpload", data);
}

socket.on("setup", (baseURL)=>{
    api = useApi(axios, baseURL);
    createListener(imageInput ,"change", handleImageChange);
})

socket.on('message', (roomData)=>{
    text.innerText = roomData.text;
    setImage(roomData.image);
})