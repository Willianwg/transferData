const fs = require("fs");

function deleteImage(filename){

    setTimeout(deleteFile, 120000);
    
    function deleteFile(){
        fs.unlink(`./images/${filename}`, (err)=>{
            if(err){
                console.log("UNABLE TO DELETE IMAGE, ERROR :" + err);
            }
        });
    }
}

module.exports = deleteImage;