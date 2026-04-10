// ChatBot.tsx
import { useState, useRef, useEffect } from "react";
import { useChatBot } from "../api/hooks";
import type { IChatBotProps } from "../models";
import { IoSend, IoSendSharp } from "react-icons/io5";


// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "bot" | "user";

interface Message {
  id: number;
  role: Role;
  text: string;
}

interface ChatBotProps {
  botName?: string;
  introMessage?: string;
  apiEndpoint: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface BubbleProps {
  message: Message;
}

// ReactNode isn't needed — JSX.Element is the precise return type here
// because Bubble always returns a single concrete element, never null/array
const Bubble = ({ message }: BubbleProps): JSX.Element => {
  const isBot = message.role === "bot";
  return (
    <div className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-medium text-blue-700 flex-shrink-0 mr-2 mt-1">
          B
        </div>
      )}
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] rounded-tl-sm"
            : "bg-blue-600 text-white rounded-tr-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

// TypingIndicator always renders one concrete element — JSX.Element is correct
const TypingIndicator = (): JSX.Element => (
  <div className="flex items-center gap-2 justify-start">
    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-medium text-blue-700 flex-shrink-0">
      B
    </div>
    <div className="flex items-end gap-1 bg-[var(--color-background-secondary)] px-3 py-2.5 rounded-2xl rounded-tl-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

// ─── Icons ───────────────────────────────────────────────────────────────────

// SVG icons return a single JSX element — JSX.Element, not ReactNode
const ChatIcon = (): JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path
      d="M8 10h8M8 14h5M12 21C7.029 21 3 16.971 3 12S7.029 3 12 3s9 4.029 9 9a8.96 8.96 0 01-1.528 5L21 21l-4-.528A8.96 8.96 0 0112 21z"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = (): JSX.Element => (
  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);



// ─── Main component ───────────────────────────────────────────────────────────

// Top-level page component returns JSX.Element | null in some cases,
// but since ChatBot always renders (just toggles visibility via state),
// JSX.Element is the right return type — not ReactNode or FC<>
const ChatBot = ({docId,docData}:IChatBotProps): JSX.Element => {
    const{mutate:chatBot,data:botResponse,isPending:isBotLoading}=useChatBot()
  // useState<T> — T is inferred from initial value where possible,
  // but Message[] needs explicit generic since [] alone gives never[]
  const botName = "Assistant"
  const introMessage = "Hi! How can I help you today?"
//   apiEndpoint,
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: introMessage },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useRef<HTMLDivElement> — typed to the exact DOM element we attach it to
  // so .scrollTop and .scrollHeight are available without casting
  const bottomRef = useRef<HTMLDivElement>(null);
  // useRef<number> — tracks auto-incrementing message id
  const idRef = useRef<number>(1);

  // useEffect returns void — side effects don't return values
  useEffect((): void => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotLoading]);

  // Event handler: React.ChangeEvent<HTMLInputElement> gives us .target.value
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  // Keyboard handler: React.KeyboardEvent — .key is available on all keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

      console.log("response of chatbot",botResponse)


  // Async function that calls backend — returns Promise<void>
  // because we only care about its side-effects (updating state), not its resolved value
  const sendMessage = async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed || isBotLoading) return;

    const userMsg: Message = {
      id: idRef.current++,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const payload={
        docId,
        content:docData,
        userQue:trimmed,
    }
    chatBot(payload)

    // try {
    //   // fetch returns Promise<Response>
    //   const res: Response = await fetch(apiEndpoint, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ message: trimmed }),
    //   });

    //   if (!res.ok) throw new Error(`HTTP ${res.status}`);

    //   // res.json() returns Promise<unknown> — cast to your actual API shape
    //   const data = await res.json() as { reply: string };

     
    // } catch {
    //   const errMsg: Message = {
    //     id: idRef.current++,
    //     role: "bot",
    //     text: "Sorry, something went wrong. Please try again.",
    //   };
    //   setMessages((prev) => [...prev, errMsg]);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  useEffect(()=>{
    if(botResponse?.data){ const botMsg: Message = {
        id: idRef.current++,
        role: "bot",
        text: botResponse?.data,
      };
      setMessages((prev) => [...prev, botMsg]);
}
  },[botResponse])
  console.log({messages})

  return (
    // Wrapper is position:fixed in real usage — sits over your actual page
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 ">

      {/* Chat box */}
      <div
        className={`
          flex flex-col w-[340px] h-[480px]
          bg-black
          border border-[var(--color-border-tertiary)]
          rounded-2xl overflow-hidden
          transition-all duration-200 origin-bottom-right
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-tertiary)] bg-[var(--color-background-primary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-medium text-white">
              B
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)] leading-none">{botName}</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <Bubble key={msg.id} message={msg} />
          ))}
          {isBotLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-3 py-3 border-t border-[var(--color-border-tertiary)] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            disabled={isBotLoading}
            className="
              flex-1 h-9 px-3 text-sm rounded-lg
              bg-[var(--color-background-secondary)]
              border border-[var(--color-border-tertiary)]
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-tertiary)]
              focus:outline-none focus:ring-1 focus:ring-blue-500
              disabled:opacity-50
            "
          />
          <button
            onClick={() => void sendMessage()}
            disabled={!input.trim() || isBotLoading}
            className="
              w-10 h-10 flex items-center justify-center rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all
            "
          >
            <IoSendSharp size={40}/>
          </button>
        </div>
      </div>

      {/* FAB toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          w-12 h-12 rounded-full bg-blue-600
          flex items-center justify-center
          hover:scale-105 active:scale-95
          transition-transform
        "
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

    </div>
  );
};

export default ChatBot;