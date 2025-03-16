
import { useTournamentStore } from "@/store/tournamentStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TeamLogoProps {
  teamId: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TeamLogo = ({ teamId, size = "md", className }: TeamLogoProps) => {
  const getTeamById = useTournamentStore((state) => state.getTeamById);
  const team = teamId ? getTeamById(teamId) : undefined;
  const [imageError, setImageError] = useState(false);
  
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (!team) {
    return (
      <div className={cn("bg-gray-700 rounded-full flex items-center justify-center", sizeClass[size], className)}>
        <span className="text-gray-400">؟</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("rounded-full overflow-hidden border-2 border-white/30 bg-tournament-navy flex items-center justify-center", sizeClass[size])}>
        <img
          src={imageError ? "/placeholder.svg" : team.logo}
          alt={team.name}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            setImageError(true);
          }}
        />
      </div>
    </div>
  );
};

export default TeamLogo;
