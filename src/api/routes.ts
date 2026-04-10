
import { axiosInstance } from "../axios";
import type { IAddData, IDoc, IUser } from "../models";


export async function fetchDocs():Promise<IDoc[]>{
        const response=await axiosInstance.get("/docs");
        return response?.data;    
}

export async function fetchDocData(docId:string):Promise<{data:IDoc}>{
    const response=await axiosInstance.get(`/getDoc/${docId}`)
    return response?.data
}

export async function fetchUsers():Promise<IUser>{
    const response=await axiosInstance.get("/getUsers")
    return response?.data;
}

export async function addData(payload:IAddData){
    const response=await axiosInstance.post("/addData",payload)
    return response?.data;
}

export async function chatBot(payload){
    const response=await axiosInstance.post("/chatBot",payload)
    return response?.data;
}