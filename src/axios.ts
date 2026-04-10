import axios from "axios";



const baseURL="https://collab-editor-server-fd2i.onrender.com"
// const baseURL="http://localhost:2000/backend"

export const axiosInstance = axios.create({
    baseURL,
    withCredentials:true
})