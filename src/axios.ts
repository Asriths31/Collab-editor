import axios from "axios";



export const baseURL="https://collab-editor-server-fd2i.onrender.com"
// export const baseURL="http://localhost:2000"

export const axiosInstance = axios.create({
    baseURL:`${baseURL}/backend`,
    withCredentials:true
})  