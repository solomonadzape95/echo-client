import { MdCalendarToday, MdArrowForward } from "react-icons/md";

interface UpcomingElectionCardProps {
  title: string;
  description: string;
  startDate: Date;
  onView: () => void;
}

export function UpcomingElectionCard({ title, description, startDate, onView }: UpcomingElectionCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#142828] border border-[#234848] p-6 md:p-8 relative overflow-hidden group">
      {/* Decorative icon */}
      <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <MdCalendarToday className="w-32 h-32 text-[#13ecec]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        {/* Left section - Main content */}
        <div className="flex-1">
          {/* Status tag */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#568888]"></div>
            <span className="text-[#568888] text-xs font-medium uppercase tracking-wider">
              UPCOMING
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-[#92c9c9] text-base leading-relaxed mb-6">
            {description}
          </p>

          {/* View button */}
          <button
            onClick={onView}
            className="bg-[#234848] hover:bg-[#2a5555] text-white font-bold px-6 py-3 flex items-center gap-2 transition-colors"
          >
            <span>View Details</span>
            <MdArrowForward className="w-5 h-5" />
          </button>
        </div>

        {/* Right section - Date info */}
        <div className="flex flex-col justify-center items-center md:items-end">
          <div className="bg-[#102222] border border-[#234848] p-6 text-center min-w-[200px]">
            <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">STARTS ON</div>
            <div className="text-2xl font-bold text-white mb-1">{formatDate(startDate)}</div>
            <div className="text-sm text-[#92c9c9]">
              {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

