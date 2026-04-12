import { useState, type ReactNode } from "react";

import CreateDocPopUp from "./createDocPopUp";
import { useFetchDocs } from "../api/hooks";
import type { IDoc } from "../models";
import DocGrid from "./DocGrid";

function HomePage():ReactNode{
    const[isOpen,setIsOpen]=useState<boolean>(false);

    const{data:docsData,isPending:isDocsLoading}=useFetchDocs() as {data?: {data?: IDoc[]},isPending:boolean}
    
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

     
      {/* Document Grid */}
      {<DocGrid docs={docsData?.data} isDocsLoading={isDocsLoading}/>}

      <CreateDocPopUp isPopUpOpen={isOpen} setIsPopUpOpen={setIsOpen} />
    </div>
    )
}


export default HomePage