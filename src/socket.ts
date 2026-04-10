import { io } from "socket.io-client";
import { baseURL } from "./axios";

const socket=io(baseURL,{
    withCredentials:true
})

export default socket