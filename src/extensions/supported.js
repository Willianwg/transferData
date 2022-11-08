const path = require('path');

function isSupported(mimetype){
    const supportedMimetype = ['image/png', 'image/jpg', 'video/mp4', "application/pdf"];
    const supportedExtensions = [".document", ".presentation", '.sheet'];
    
    if(supportedMimetype.find(type => type === mimetype)) return true;

    const microsoftDoc = path.extname(mimetype);
    if(supportedExtensions.find(type => type === microsoftDoc)) return true;

    return false;
}

module.exports = isSupported;