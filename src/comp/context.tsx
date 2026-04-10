import React, { createContext, useContext, type ReactNode } from "react"
import {type IContextType } from "../models"

export const userContext=createContext<undefined|IContextType>(undefined)


export const useUserContext=()=>{
    const context=useContext(userContext)

    if(context===undefined){
        throw new Error("Cannot find the context")
    }

    return context;
}

function Context({children}:{children:ReactNode}){

    const[userName,setUserName]=React.useState<null|string>(null)
    const[userId,setUserId]=React.useState<null|string>(null)
    const[password,setPassword]=React.useState<null|string>(null)
    const[emailId,setEmailId]=React.useState<null|string>(null)


    return(
        <userContext.Provider value={{userName,password,setUserName,setPassword,emailId,setEmailId,userId,setUserId}}>
            {children}
        </userContext.Provider>
    )

}

export default Context;