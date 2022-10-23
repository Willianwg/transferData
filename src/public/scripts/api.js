export default function useApi(axios){
    const api = axios.create({
        baseURL:"http://localhost:3000"
    })

     async function uploadImage(data){
        const response = await api.post("/upload", data);
        console.log(response.data);
    }

    return {
        uploadImage
    }
}