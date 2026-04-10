import { io } from "socket.io-client";
import Cookies from "js-cookie";

const socket=io("http://localhost:2000",{
    withCredentials:true
})

export default socket