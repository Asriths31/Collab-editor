import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { addData, chatBot, createDoc, fetchDocData, fetchDocs, fetchUsers } from "./routes";
import type { IAddData, IChatBotPayload, ICreateDocPayload, IDoc, IQuery } from "../models";



export function useFetchDocs():UseQueryResult{
    return useQuery<IQuery<IDoc[]>>({
        queryKey:["docs"],
        queryFn:fetchDocs,
        refetchOnWindowFocus:false,
        
    })
}

export function useFetchDocData(docId:string){
    return useQuery({
        queryKey:["docs",docId],
        queryFn:()=>fetchDocData(docId),
        refetchOnWindowFocus:false,
    })
}

export function useFetchUsers(){
    return useQuery(
        {
            queryKey:["users"],
            queryFn:()=>fetchUsers(),
            refetchOnWindowFocus:false
        }
    )
}

export function useCreateDoc(){
    
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:(payload:ICreateDocPayload)=>createDoc(payload),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["docs"]})
        }
    })
}

export function useAddData(){
    // const queryClient=useQueryClient();
    return useMutation({
        mutationFn:(payload:IAddData)=>addData(payload)
    })
}

export function useChatBot(){
    // const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(payload:IChatBotPayload)=>chatBot(payload)
    })
}
