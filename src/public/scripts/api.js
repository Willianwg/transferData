export default function useApi(axios, baseURL){
    let URL = baseURL;
    if(URL[URL.length - 1] !== "/"){
        URL+="/";
    }
    const api = axios.create({ baseURL:URL });

     async function uploadImage(data, emitImage){
        const response = await api.post("/upload", data);
        const filename = response.data.filename

        emitImage(filename);
    }

    return {
        baseURL:URL,
        uploadImage
    }
}