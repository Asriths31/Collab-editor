import axios from "axios";



export const baseURL="https://collab-editor-server-fd2i.onrender.com/backend"
//export const baseURL="http://localhost:2000/backend"

export const axiosInstance = axios.create({
    baseURL,
    withCredentials:true
})