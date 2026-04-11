import { useState, type ReactNode } from "react";

import CreateDocPopUp from "./createDocPopUp";
import { useFetchDocs } from "../api/hooks";
import type { IDoc } from "../models";
import DocGrid from "./DocGrid";

function HomePage():ReactNode{
    const[isOpen,setIsOpen]=useState<boolean>(false);

    const{data:docsData}=useFetchDocs() as {data?: {data?: IDoc[]}}
    
    console.log({docsData})
  


    return(
        <div className="min-h-screen bg-[#0d0d0d] px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-white text-xl font-medium tracking-tight">My Documents</h1>
          <p className="text-neutral-600 text-xs mt-0.5">
            {docsData?.data?.length ?? 0} document{docsData?.data?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-white text-black text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <span className="text-base leading-none">+</span>
          New Document
        </button>
      </div>

      {/* Empty State */}
      {(!docsData?.data || docsData.data.length === 0) && (
        <div className="flex flex-col items-center justify-center mt-32 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p className="text-neutral-500 text-sm">No documents yet.</p>
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs text-white underline underline-offset-4 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Create your first one
          </button>
        </div>
      )}

      {/* Document Grid */}
      {docsData?.data&&<DocGrid docs={docsData?.data}/>}

      <CreateDocPopUp isPopUpOpen={isOpen} setIsPopUpOpen={setIsOpen} />
    </div>
    )
}


export default HomePage