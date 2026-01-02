import { useState } from "react";
import { MdHowToVote } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export function ElectionsCard() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={() => navigate("/elections")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#142828] border border-[#234848] cursor-pointer relative group overflow-hidden flex flex-col items-center justify-center p-6 sm:p-8 min-h-[200px] sm:min-h-[250px] md:min-h-[280px] lg:min-h-[300px]"
    >
      {/* Icon - large, moves up and shrinks on hover */}
      <div 
        className="flex items-center justify-center mb-4 sm:mb-6 transition-all duration-400 ease scale-110 group-hover:scale-100"
      >
        <MdHowToVote 
          className="text-[#13ecec] transition-all duration-300 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 group-hover:text-[#13ecec] group-hover:scale-110 group-hover:translate-y-[-10%]" 
        />
      </div>

      {/* Text content - appears below icon on hover (desktop) or always visible (mobile) */}
      <div 
        className={`flex flex-col items-center justify-center text-center transition-all duration-400 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-5 ${
          isHovered ? "lg:opacity-100 lg:translate-y-0" : ""
        }`}
      >
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">Elections</h3>
        <p className="text-[#92c9c9] text-xs sm:text-sm text-center px-2">Browse all elections</p>
      </div>
    </div>
  );
}

