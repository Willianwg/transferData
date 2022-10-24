export default function useApi(axios){
    const api = axios.create({
        baseURL:"http://localhost:3000"
    })

     async function uploadImage(data, setImage){
        const response = await api.post("/upload", data);
        
        setImage(response.data.filename);
    }

    return {
        uploadImage
    }
}