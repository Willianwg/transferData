export default function useApi(axios){
    const api = axios.create({
        baseURL:"https://transfer-wg.herokuapp.com/"
    })

     async function uploadImage(data, emitImage){
        const response = await api.post("/upload", data);
        const filename = response.data.filename

        emitImage(filename);
    }

    return {
        uploadImage
    }
}