import React, {  type ReactNode } from "react";
import {  useUserContext } from "./context";
import SignUpPage from "./signUp";
import SignInPage from "./signIn"
import {axiosInstance} from "../axios"
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

function LoginPage():ReactNode{

    const {userName,userId,emailId,password,setUserId,setUserName,setPassword,setEmailId}=useUserContext()


    const[isSignIn,setIsSignIn]=React.useState<boolean>(true)

    const navigate=useNavigate()



    function handleSubmit(e:React.FormEvent){
        e.preventDefault();

       if(isSignIn){
        axiosInstance.post("/signIn",{
            userName,password
        })
        .then((res)=>{
            console.log("response",res.data);
            toast.success("Login Successfull")
            navigate("home")
            
            // Cookies.set("user-token",res.data.token)
            

        })
        .catch((err)=>{
            console.log("error in signIn",err,err.response.data.message);
            if(err.response.data.message==="User Not Found"){
                setIsSignIn(false)
                console.log("userNotFound")
                toast.error("User not found! Please Sign Up first.")
            }
        })

       }
       
       else {
        axiosInstance.post("/signUp",{
            userName,password,emailId
        })
        .then((res)=>{
            console.log("response",res);
            toast.success("user created successfully! Please Sign In.")
            setIsSignIn(true)
        })
        .catch((err)=>{
            toast.error(err.response.data.message)
            console.log("error in signUp",err)
        })
    }
    }

    React.useEffect(()=>{
        setPassword(null)
        setUserName(null)
        setEmailId(null)   
    },[isSignIn])

    
    return(
        <form onSubmit={handleSubmit}>

            {
                isSignIn?<SignInPage />:<SignUpPage />
            }
            
            <button type="submit">Login</button>

            
                {
                    isSignIn?
                    <p>Don't have an account?
                        <button 
                        type="button" 
                        
                        onClick={()=>setIsSignIn(false)}
                        className="login-button"
                        >Sign Up</button>
                    </p>
                    :
                    <p>Already have an account?
                        <button 
                        type="button" 
                        onClick={()=>setIsSignIn(true)}
                        className="login-button"
                        >Sign In</button>
                    </p>
                }

        </form>
    )

}

export default LoginPage