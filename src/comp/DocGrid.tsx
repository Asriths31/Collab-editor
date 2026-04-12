import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { IDoc, IDocsGridProps } from "../models";

const cardBg = [
  "bg-[#0f0f0f]",
  "bg-[#0d1117]",
  "bg-[#110f0f]",
  "bg-[#0f110d]",
  "bg-[#10100f]",
  "bg-[#0d0f11]",
];

function DocGrid({ docs,isDocsLoading }: IDocsGridProps) {
  const navigate = useNavigate();
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [origin, setOrigin] = useState("center center");
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleOpen = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    const card = cardRefs.current[id];
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setOrigin(`${x}px ${y}px`);
    }

    setClickedId(id);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitioning(true);
      });
    });

    setTimeout(() => navigate(`/editor/${id}`), 650);
  };

  return (
    <>
      {/* Full screen expand from card */}
      <div
        className="fixed inset-0 z-50 bg-[#0d0d0d] pointer-events-none"
        style={{
          transformOrigin: origin,
          transform: transitioning ? "scale(1)" : "scale(0)",
          opacity: transitioning ? 1 : 0,
          transition: transitioning
            ? "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease"
            : "none",
          boxShadow: transitioning
            ? "inset 0 0 0 1px #2a2a2a, inset 0 0 80px 2px #ffffff08"
            : "inset 0 0 0 1px #1a1a1a",
        }}
      />
       {/* Empty State */}
            {isDocsLoading?
                <div className="h-full w-full flex justify-center items-center">
                    Fetching Documents Please Wait...
                </div>
            :(!docs || docs.length === 0) ? (
              <div className="flex flex-col items-center justify-center mt-32 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <p className="text-neutral-500 text-sm">No documents yet.</p>
                {/* <button
                  onClick={() => setIsOpen(true)}
                  className="text-xs text-white underline underline-offset-4 hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  Create your first one
                </button> */}
              </div>
            )
      

      :(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {docs.map((doc: IDoc, index: number) => (
          <Link
            to={`/editor/${doc._id}`}
            key={doc._id}
            onClick={(e) => handleOpen(e, doc._id)}
            className="block"
          >
            <div
              ref={(el) => {
                if (el) cardRefs.current[doc._id] = el;
              }}
              className={`
                group relative h-40 sm:h-52 rounded-2xl overflow-hidden cursor-pointer
                border border-[#1e1e1e] hover:border-[#333]
                ${cardBg[index % cardBg.length]}
                ${clickedId === doc._id ? "border-[#555]" : ""}
              `}
              style={{ transition: "border-color 0.3s" }}
            >

              {/* Big background letter watermark */}
              <span className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-[80px] sm:text-[130px] font-black leading-none select-none text-white/[0.04] group-hover:text-white/[0.07] transition-all duration-300 uppercase">
                {doc.docName.charAt(0)}
              </span>

              {/* Index pill */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="text-[9px] sm:text-[10px] font-mono text-neutral-600 bg-[#ffffff08] border border-[#ffffff08] rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Ripple ring on click */}
              {clickedId === doc._id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 animate-ping" />
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                <div className="h-px w-6 sm:w-8 bg-neutral-700 mb-2 sm:mb-3 group-hover:w-12 sm:group-hover:w-16 transition-all duration-300" />
                <h2 className="text-white text-lg sm:text-2xl font-bold tracking-tight leading-tight line-clamp-2">
                  {doc.docName}
                </h2>
                <p className="text-neutral-600 text-[10px] sm:text-xs mt-1 sm:mt-1.5 group-hover:text-neutral-400 transition-colors duration-200">
                  Open document →
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>)}
    </>
  );
}

export default DocGrid;