import axios from "axios";
import Cookies from "js-cookie";



export const axiosInstance = axios.create({
    baseURL:"http://localhost:2000/backend",
    withCredentials:true
})