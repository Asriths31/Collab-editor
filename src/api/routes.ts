
import { axiosInstance } from "../axios";
import type { IAddData, IChatBotPayload, ICreateDocPayload, IDoc, IQuery, IUser } from "../models";


export async function fetchDocs():Promise<IQuery<IDoc[]>>{
        const response=await axiosInstance.get("/docs");
        return response?.data;    
}

export async function fetchDocData(docId:string):Promise<IQuery<IDoc>>{
    const response=await axiosInstance.get(`/getDoc/${docId}`)
    return response?.data
}

export async function fetchUsers():Promise<IQuery<IUser>>{
    const response=await axiosInstance.get("/getUsers")
    return response?.data;
}

export async function addData(payload:IAddData){
    const response=await axiosInstance.post("/addData",payload)
    return response?.data;
}

export async function createDoc(payload:ICreateDocPayload) {
    const response=await axiosInstance.post("/createDoc",payload)
    return response?.data;
}

export async function chatBot(payload:IChatBotPayload){
    const response=await axiosInstance.post("/chatBot",payload)
    return response?.data;
}