export default function handleImageChange(event, upload, emitImage){
    const image = event.target.files[0];

    const data = new FormData();
    data.append("image", image);
    data.append("name", "Test");

    upload(data, emitImage);
}