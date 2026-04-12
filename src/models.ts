import type { Dispatch, SetStateAction } from "react";
import { Editor } from "@tiptap/core"

// export interface ILoginPage{

// }

export interface IContextType{
    userName:string|null,
    password:string|null,
    emailId:string|null,
    userId:string|null,
    setUserName:Dispatch<SetStateAction<string|null>>,
    setPassword:Dispatch<SetStateAction<string|null>>,
    setEmailId:Dispatch<SetStateAction<string|null>>,
    setUserId:Dispatch<SetStateAction<string|null>>,
}

export interface ICreateDocPopUp{
    isPopUpOpen:boolean,
    setIsPopUpOpen:Dispatch<SetStateAction<boolean>>
}

export interface IDoc{
    _id:string,
    userId:string,
    docName:string,
    userName:string,
    guests:string[],
    value:string
}

export interface IChatBotProps{
    docId:string,
    docData:string
}

export interface IUser {
_id:string,
  userName: string;
  password: string;
  emailId: string;
  docId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember{
    id:string,
    userName:string
}

export interface IAddData{
    docId:string,
    value:string
}

export interface IEditorProps{
    editor:Editor|null
}

export type EditorAction =

  | "toggleUnderline"
  |"toggleItalic"|"toggleBold";

export interface IChatBotPayload{
    docId:string,
    content:string,
    userQue:string
}

export interface ICreateDocPayload{
    docName:string
}

export interface IQuery<T>{
    message:string,
    data:T
}

export interface IDocsGridProps{ 
    docs: IDoc[] |undefined,
    isDocsLoading:boolean
}
