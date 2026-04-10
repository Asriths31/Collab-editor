import { EditorContent } from "@tiptap/react";
import type { JSX, ReactElement } from "react";


function Editor({editor}:IEditorProps):JSX.Element{
    return(
        <div className="w-full h-full">
      
            <EditorContent
                placeholder="Enter Here..."
                editor={editor}
                className="h-full! border-none! outline-0!"
            />
    </div>
    )
}


export default Editor