import { useState, useEffect } from "react";
import { MdArrowForward, MdVolumeUp } from "react-icons/md";

interface ActiveElectionCardProps {
  id?: string;
  title: string;
  description: string;
  endTime: Date;
  onVote: () => void;
}

export function ActiveElectionCard({ id, title, description, endTime, onVote }: ActiveElectionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ hours, minutes, seconds });
      } else {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div className="bg-[#142828] border border-[#234848] p-6 md:p-8 relative overflow-hidden group">
      {/* Decorative icon */}
      <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <MdVolumeUp className="w-32 h-32 text-[#13ecec]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        {/* Left section - Main content */}
        <div className="flex-1">
          {/* Status tag */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#13ecec] shadow-[0_0_8px_rgba(19,236,236,0.8)]"></div>
            <span className="text-[#13ecec] text-xs font-medium uppercase tracking-wider">
              POLLS OPEN
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

          {/* Vote button */}
          <button
            onClick={onVote}
            className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-3 flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)]"
          >
            <span>Cast Your Vote</span>
            <MdArrowForward className="w-5 h-5" />
          </button>
        </div>

        {/* Right section - Countdown timer */}
        <div className="flex flex-col">
          <h3 className="text-[#568888] text-xs uppercase tracking-wider mb-4">TIME REMAINING</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Hours */}
            <div className="bg-[#102222] border border-[#234848] p-4 text-center">
              <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.hours)}</div>
              <div className="text-xs text-white mt-1">HOURS</div>
            </div>

            {/* Minutes */}
            <div className="bg-[#102222] border border-[#234848] p-4 text-center">
              <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.minutes)}</div>
              <div className="text-xs text-white mt-1">MINUTES</div>
            </div>

            {/* Seconds */}
            <div className="bg-[#102222] border border-[#234848] p-4 text-center">
              <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.seconds)}</div>
              <div className="text-xs text-white mt-1">SECONDS</div>
            </div>

            {/* Urgent indicator */}
            <div className="bg-[#13ecec] p-4 text-center flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-[#112222] mb-1"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <div className="text-xs font-bold text-[#112222] uppercase">URGENT</div>
            </div>
          </div>

          <p className="text-[#568888] text-xs">
            Voting closes at {endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} EST
          </p>
        </div>
      </div>
    </div>
  );
}

