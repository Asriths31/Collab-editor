import type { ReactNode } from "react";
import { useUserContext } from "./context";


function SignUpPage():ReactNode{

        const {userName,password,setUserName,setPassword,emailId,setEmailId}=useUserContext()


    return(
        <div>
            <div>
                <label>UserName:</label>
                <input 
                type="text"
                value={userName??""}
                onChange={(e)=>setUserName(e.target.value)}
                className="bg-red-400"
                name="firstName"
                />
            </div>
            
            <div>
                <label>Password:</label>
                <input
                type="password"
                value={password ?? ""}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>

             <div>
                <label>EmailId:</label>
                <input
                type="text"
                value={emailId ?? ""}
                onChange={(e) => setEmailId(e.target.value)}
            />
            </div>
        </div>
    )

}


export default SignUpPage