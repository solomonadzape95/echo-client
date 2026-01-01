import { useState } from "react";
import { MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";

export function ProfileCard() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { data: dashboardResponse } = useDashboard();
  const profile = dashboardResponse?.success ? dashboardResponse.data.profile : null;

  return (
    <div 
      onClick={() => navigate("/profile")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#142828] border border-[#234848] cursor-pointer relative group overflow-hidden flex flex-col items-center justify-center lg:min-h-[300px]"
    >
      {/* Icon - large, moves up and shrinks on hover */}
      <div 
        className="flex items-center justify-center transition-all duration-400 ease scale-110 group-hover:scale-100"
      >
        <MdPerson 
          className="text-[#13ecec] transition-all duration-300 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 group-hover:text-[#13ecec] group-hover:scale-110 group-hover:translate-y-[-10%]" 
        />
      </div>

      {/* Text content - appears below icon on hover (desktop) or always visible (mobile) */}
      <div 
        className={`flex flex-col items-center justify-center transition-all duration-400 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-5 ${
          isHovered ? "lg:opacity-100 lg:translate-y-0" : ""
        }`}
      >
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Profile</h3>
        {profile && (
          <p className="text-[#92c9c9] text-xs sm:text-sm text-center mb-1">
            {profile.name}
          </p>
        )}
        <p className="text-[#92c9c9] text-xs sm:text-sm text-center">View and manage your account</p>
      </div>
    </div>
  );
}

