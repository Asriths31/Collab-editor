import React, {  type ReactNode } from "react";
import {  useUserContext } from "./context";
import SignUpPage from "./signUp";
import SignInPage from "./signIn"
import {axiosInstance} from "../axios"
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";

function LoginPage():ReactNode{

    const {userName,emailId,password,setUserName,setPassword,setEmailId}=useUserContext()


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
            // toast.success("Login Successfull")
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
            else{
               setIsSignIn(false)
                toast.error(err.response.data.message)
        
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
        <form onSubmit={handleSubmit} className="h-screen w-screen flex flex-col justify-center items-center">

            {
                isSignIn?<SignInPage />:<SignUpPage />
            }
            
            {/* <button type="submit">Login</button> */}

            
                {
                    isSignIn?
                    <p className="text-sm text-neutral-400 mt-5">Don't have an account?
                        <button 
                        type="button" 
                        onClick={()=>setIsSignIn(false)}
                        className="ml-1.5 text-black font-medium relative cursor-pointer
                          transition-all duration-300 ease-out
                          hover:text-neutral-200 hover:scale-105
                          active:scale-95
                          after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1.5px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                        >Sign Up</button>
                    </p>
                    :
                    <p className="text-sm text-neutral-400 mt-5">Already have an account?
                        <button 
                        type="button" 
                        onClick={()=>setIsSignIn(true)}
                        className="ml-1.5 text-black font-medium relative cursor-pointer
                          transition-all duration-300 ease-out
                          hover:text-neutral-200 hover:scale-105
                          active:scale-95
                          after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1.5px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                        >Sign In</button>
                    </p>
                }

        </form>
    )

}

export default LoginPage