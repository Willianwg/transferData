export default function useApi(axios, baseURL){
    const api = axios.create({ baseURL });

     async function uploadImage(data, emitImage){
        const response = await api.post("/upload", data);
        const filename = response.data.filename

        emitImage(filename);
    }

    return {
        baseURL,
        uploadImage
    }
}