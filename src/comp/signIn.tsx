import  { type ReactNode } from "react";
import { useUserContext } from "./context";


function SignInPage():ReactNode{

    const {userName,password,setUserName,setPassword}=useUserContext()

    return (
        <div>
            <div>
                <label>UserName:</label>
                <input 
                type="text"
                value={userName??""}
                onChange={(e)=>setUserName(e.target.value)}
                className=""
                name="firstName"
                autoComplete="name"
                />
            </div>
            
            <div>
                <label>Password:</label>
                <input
                type="text"
                value={password ?? ""}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="password"
            />
            </div>
            

        </div>
    )
}


export default SignInPage