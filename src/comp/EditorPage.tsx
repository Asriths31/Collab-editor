import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./Editor.css";
import { useEffect, useRef, useState, type JSX } from "react";
import { Link, useParams } from "react-router-dom";
import { useAddData, useFetchDocData } from "../api/hooks";
import socket from "../socket";
import type { EditorAction, IMember } from "../models";
import Editor from "./Editor";
import ChatBot from "./chatBot";

const EditorPage = (): JSX.Element => {
  const { docId } = useParams();
  const { data: docData } = useFetchDocData(docId || "");
  const { mutate: addData } = useAddData();

  const [content, setContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const isRemoteUpdate = useRef<boolean>(false);
  const [membersInRoom, setMembersInRoom] = useState<IMember[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }
      const html = editor.getHTML();
      sendMessage(html);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setContent(html);
        addData({ docId: docId ?? "", value: html });
      }, 2000);
    },
  });

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data != editor.getHTML()) {
        isRemoteUpdate.current = true;
        editor.commands.setContent(data.content);
        setContent(data.content)
      }
    });
    socket.on("members_in_room", (data) => setMembersInRoom(data));
    if (docId) socket.emit("join-room", docId);
    return () => {
      socket.emit("leave-room", docId);
      socket.off("receive_message");
    };
  }, [editor, docId]);

  useEffect(() => {
    if (!editor) return;
    const newValue = docData?.data?.value ?? "";
    if (newValue !== editor.getHTML()) {
      isRemoteUpdate.current = true;
      editor.commands.setContent(newValue);
    }
  }, [docData, editor]);


  const sendMessage = (message: string) => {
    socket.emit("send_message", { docId, content: message });
  };

  if (!editor) return <></>;

  const formattingButtons = [
    { label: "Bold", icon: "B", iconClass: "font-bold", action: "toggleBold" },
    { label: "Italic", icon: "I", iconClass: "italic", action: "toggleItalic" },
    { label: "Underline", icon: "U", iconClass: "underline", action: "toggleUnderline" },
  ];

  return (
    // outer wrapper — on mobile it's a column layout, on desktop it's a row
    <div className="flex flex-col sm:flex-row h-screen w-screen bg-[#0d0d0d] overflow-hidden">

      {/* ── Mobile top bar ── */}
      <div className="sm:hidden flex-shrink-0 flex items-center justify-between px-4 py-3 bg-[#111] border-b border-[#1e1e1e]">
        <Link to="/home">
          <button className="text-xs font-medium hover:text-white transition-colors">
             Back
          </button>
        </Link>
        <span className="text-white text-sm font-semibold tracking-tight truncate max-w-[140px]">
          {docData?.data?.docName ?? "Document"}
        </span>
        <div className="flex items-center gap-4">
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              setMembersOpen(p => !p);
              setSidebarOpen(false);
            }}
            className="text-neutral-500 active:text-white transition-colors p-1 md:invisible"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              setSidebarOpen(p => !p);
              setMembersOpen(false);
            }}
            className="text-neutral-500 active:text-white transition-colors p-1 md:invisible"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile formatting drawer ── */}
      {sidebarOpen && (
        <div className="sm:hidden flex-shrink-0 flex flex-wrap gap-2 px-4 py-3 bg-[#111] border-b border-[#1e1e1e]">
          {formattingButtons.map(({ label, icon, iconClass, action }) => (
            <button
              key={label}
              onPointerDown={(e) => {
                e.preventDefault();
                editor?.chain()?.focus()[action as EditorAction]().run();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2a2a2a] text-neutral-400 active:text-white active:border-[#555] transition-colors ${iconClass}`}
            >
              {icon} {label}
            </button>
          ))}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2a2a2a] text-neutral-400 active:text-white active:border-[#555] transition-colors"
          >
            • Bullet
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#2a2a2a] text-neutral-400 active:text-white active:border-[#555] transition-colors"
          >
            1. Numbered
          </button>
        </div>
      )}

      {/* ── Mobile members drawer ── */}
      {membersOpen && (
        <div className="sm:hidden flex-shrink-0 flex flex-wrap gap-2 px-4 py-3 bg-[#111] border-b border-[#1e1e1e]">
          {membersInRoom.length === 0 ? (
            <p className="text-neutral-700 text-xs">No one else here</p>
          ) : (
            membersInRoom.map(mem => (
              <div key={mem.id} className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1e2a3a] flex items-center justify-center text-[9px] font-medium text-blue-400">
                  {mem?.userName?.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-neutral-300">{mem.userName}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Desktop + mobile body row ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Desktop left sidebar ── */}
        <aside className="hidden sm:flex w-48 flex-shrink-0 flex-col gap-1.5 p-4 bg-[#111] border-r border-[#1e1e1e]">
          

          <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-700 px-1 mb-1">
            Formatting
          </p>

          {formattingButtons.map(({ label, icon, iconClass, action }) => (
            <button
              key={label}
              onClick={() => editor?.chain()?.focus()[action as EditorAction]().run()}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-colors group"
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-lg bg-[#1a1a1a] group-hover:bg-[#222] text-[11px] text-neutral-400 border border-[#2a2a2a] ${iconClass}`}>
                {icon}
              </span>
              {label}
            </button>
          ))}

          <div className="h-px bg-[#1e1e1e] my-2 mx-1" />

          <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-700 px-1 mb-1">
            Lists
          </p>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-colors group"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1a1a1a] group-hover:bg-[#222] text-[13px] text-neutral-400 border border-[#2a2a2a]">•</span>
            Bullet list
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-500 hover:text-white hover:bg-[#1a1a1a] transition-colors group"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1a1a1a] group-hover:bg-[#222] text-[11px] text-neutral-400 border border-[#2a2a2a]">1.</span>
            Numbered
          </button>
        </aside>

        {/* ── Center editor ── */}
        <main className="flex-1 overflow-y-auto bg-[#0d0d0d]">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-10 min-h-full">
            <Editor editor={editor} />
          </div>
        </main>

        {/* ── Desktop right sidebar ── */}
        <aside className="hidden sm:flex w-52 flex-shrink-0 flex-col gap-2 p-4 bg-[#111] border-l border-[#1e1e1e]">
          <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-700 px-1 mb-1">
            Editing now
          </p>

          {membersInRoom.length === 0 && (
            <p className="text-neutral-700 text-xs px-1">No one else here</p>
          )}

          {membersInRoom.map(mem => (
            <div key={mem.id} className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl bg-[#161616] border border-[#1e1e1e]">
              <div className="w-7 h-7 rounded-full bg-[#1e2a3a] flex items-center justify-center text-[10px] font-medium text-blue-400 flex-shrink-0 border border-[#2a3a4a]">
                {mem?.userName?.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs text-neutral-300 truncate flex-1">{mem.userName}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            </div>
          ))}
        </aside>

      </div>

      <ChatBot docId={docId ?? ""} docData={content} />
    </div>
  );
};

export default EditorPage;