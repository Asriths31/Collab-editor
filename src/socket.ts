import { io } from "socket.io-client";
import { baseURL } from "./axios";

const socket=io(baseURL,{
      transports: ["polling", "websocket"],
    withCredentials:true
})

export default socket