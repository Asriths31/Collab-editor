import { useEffect, useState, type ReactNode } from "react";
import { axiosInstance } from "../axios";
import socket from "../socket";
import CreateDocPopUp from "./createDocPopUp";
import { useFetchDocs } from "../api/hooks";
import type { IDoc } from "../models";
import { Link } from "react-router-dom";

function HomePage():ReactNode{
    const[message,setMessage]=useState<string|null>(null)
    const[isOpen,setIsOpen]=useState<boolean>(false);
    const[docsData,setDocsData]=useState<IDoc[]>([])

    const{data:docs,isPending}=useFetchDocs();
    

    useEffect(()=>{
        setDocsData(docs?.data)
    },[docs])
    console.log({docsData})
    useEffect(()=>{
        socket.on("receive_message",(data)=>{
            console.log("Message recieved",data);
            setMessage(data);
        })

        return () => {
      socket.off("receive_message");
    };
    },[])

const sendMessage = (message1:string) => {
    socket.emit("send_message",message1);

    setMessage(message1);
  };

    return(
        <div>
            <button onClick={()=>setIsOpen(true)}>Create a new Document</button>
            {/* <button onClick={sendMessage}>send Message</button> */}
            <div className="flex gap-1 flex-wrap">
                {docsData&&docsData.map(doc=>(
                <Link to={`/editor/${doc._id}`}>
                        <div
                            key={doc._id}
                            className="border h-56 w-66 rounded-sm flex justify-center items-center">
                            <p className="text-3xl font-bold">{doc?.docName}</p>

                        </div>
                </Link>
            ))}
            </div>
            
            {<CreateDocPopUp isPopUpOpen={isOpen} setIsPopUpOpen={setIsOpen}/>}
        </div>
    )
}


export default HomePage