import { useState, type ReactNode } from "react";

import CreateDocPopUp from "./createDocPopUp";
import { useFetchDocs } from "../api/hooks";
import type { IDoc } from "../models";
import { Link } from "react-router-dom";

function HomePage():ReactNode{
    const[isOpen,setIsOpen]=useState<boolean>(false);

    const{data:docsData}=useFetchDocs() as {data?: {data?: IDoc[]}}
    
    console.log({docsData})

    return(
        <div>
            <button onClick={()=>setIsOpen(true)}>Create a new Document</button>
            {/* <button onClick={sendMessage}>send Message</button> */}
            <div className="flex gap-1 flex-wrap">
                {docsData?.data&&docsData?.data.map((doc:IDoc)=>(
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