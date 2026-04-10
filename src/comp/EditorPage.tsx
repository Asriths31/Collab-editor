import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./Editor.css"
import { useEffect, useRef, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import { useAddData, useFetchDocData } from "../api/hooks";
import socket from "../socket";
import type { EditorAction, IMember } from "../models";
import Editor from "./Editor";
import ChatBot from "./chatBot";

const EditorPage = (): JSX.Element => {

  
  const {docId}=useParams()
  console.log({docId})
  const{data:docData}=useFetchDocData(docId||"")
  const{mutate:addData}=useAddData();

  const [content, setContent] = useState("")
  const debounceRef = useRef<number | null>(null)
  const isRemoteUpdate=useRef<boolean>(false)

  const[membersInRoom,setMembersInRoom]=useState<IMember[]>([])
  

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      // clear previous timer
      if(isRemoteUpdate.current){
        isRemoteUpdate.current=false
        return;
      }
      const html = editor.getHTML()
      sendMessage(html)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // set new timer
      debounceRef.current = setTimeout(() => {
        const html = editor.getHTML()
        setContent(html)
        console.log("Debounced:", html)
      }, 2000) // 500ms delay
    },
  })

  useEffect(()=>{
        socket.on("receive_message",(data)=>{
            console.log("Message recieved",data);
            if(data!=editor.getHTML()){
              isRemoteUpdate.current=true
              editor.commands.setContent(data);
            }
        })
        socket.on("members_in_room",(data)=>{
          console.log("members in room",data)
          setMembersInRoom(data)
        })
        if(docId){
          socket.emit("join-room",docId)
        }
        


        return () => {
      socket.emit("leave-room",docId)
      socket.off("receive_message");
    };
    },[editor,docId])


  useEffect(()=>{
    if(!editor) return
    const newValue=docData?.data?.value??""
    if(newValue!==editor.getHTML()){
      isRemoteUpdate.current=true
    editor.commands.setContent(docData?.data?.value??"")

    }
    editor.commands.setContent(docData?.data?.value??"")
  },[docData,editor])

  useEffect(()=>{
    const payload={docId:docId??"",value:content}
    addData(payload)
  },[content])    

  const sendMessage = (message1:string) => {
      socket.emit("send_message",{docId,content:message1});
  };

  console.log({content,membersInRoom})
  if (!editor) return <></>;

  return (
   <div className="flex h-screen w-screen bg-[var(--color-background-tertiary)] overflow-hidden">

  {/* Left sidebar — formatting tools */}
  <aside className="w-48 flex-shrink-0 flex flex-col gap-1.5 p-3 bg-[var(--color-background-primary)] border-r border-[var(--color-border-tertiary)]">
    <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-tertiary)] px-1 mb-1">
      Formatting
    </p>

    {[
      { label: "Bold", icon: "B", iconClass: "font-bold", action: "toggleBold" },
      { label: "Italic", icon: "I", iconClass: "italic", action: "toggleItalic" },
      { label: "Underline", icon: "U", iconClass: "underline", action: "toggleUnderline" },
    ].map(({ label, icon, iconClass, action }) => (
      <button
        key={label}
        onClick={() => editor?.chain()?.focus()[action as EditorAction]().run()}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-black hover:bg-gray-600 hover:text-white transition-colors"
      >
        <span className={`w-5 h-5 flex items-center justify-center rounded bg-[var(--color-background-secondary)] text-[12px] text-[var(--color-text-secondary)] ${iconClass}`}>
          {icon}
        </span>
        {label}
      </button>
    ))}

    <div className="h-px bg-[var(--color-border-tertiary)] my-1.5 mx-1" />

    <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-tertiary)] px-1 mb-1">
      Lists
    </p>
    <button
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-600 hover:text-white transition-colors"
    >
      <span className="w-5 h-5 flex items-center justify-center rounded  text-[12px] text-[var(--color-text-secondary)]">•</span>
      Bullet list
    </button>
    <button
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-600 hover:text-white transition-colors"
    >
      <span className="w-5 h-5 flex items-center justify-center rounded text-[11px] text-[var(--color-text-secondary)]">1.</span>
      Numbered
    </button>
  </aside>

  {/* Center — editor only, no topbar */}
  <main className="flex-1 overflow-y-auto bg-[var(--color-background-primary)]">
    <div className="max-w-2xl mx-auto px-8 py-10 h-full">
      <Editor editor={editor} />
    </div>
  </main>

  {/* Right sidebar — members + typing flag */}
  <aside className="w-52 flex-shrink-0 flex flex-col gap-2 p-3 bg-[var(--color-background-primary)] border-l border-[var(--color-border-tertiary)]">
    <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-tertiary)] px-1 mb-1">
      Editing now
    </p>

    {membersInRoom.map(mem => (
      <div key={mem.id} className="flex flex-col gap-1 px-2 py-2 rounded-lg bg-[var(--color-background-secondary)]">

        {/* Member row */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-medium text-blue-700 flex-shrink-0">
            {mem?.userName?.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm text-[var(--color-text-primary)] truncate flex-1">{mem.userName}</span>
          {/* Live dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
        </div>

        {/* Typing flag — show only when user is typing */}
        {/* {mem.isTyping && (
          <div className="flex items-center gap-1.5 pl-8">
            <div className="flex gap-0.5 items-end h-3">
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)] animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)] animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)] animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-[11px] text-[var(--color-text-tertiary)]">typing…</span>
          </div>
        )} */}

      </div>
    ))}
  </aside>
          <ChatBot docId={docId??""} docData={content}/>

</div>
    
  );
};

export default EditorPage;