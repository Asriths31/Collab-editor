import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { addData, chatBot, fetchDocData, fetchDocs, fetchUsers } from "./routes";
import type { IAddData, IChatBotPayload, IDoc, IQuery } from "../models";



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
