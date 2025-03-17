
import { useTournamentStore } from "@/store/tournamentStore";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TeamLogoProps {
  teamId: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TeamLogo = ({ teamId, size = "md", className }: TeamLogoProps) => {
  const getTeamById = useTournamentStore((state) => state.getTeamById);
  const team = teamId ? getTeamById(teamId) : undefined;
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sizeClass = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Reset error state when teamId changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [teamId]);

  if (!team) {
    return (
      <div className={cn("bg-gray-700 rounded-full flex items-center justify-center", sizeClass[size], className)}>
        <span className="text-gray-400">؟</span>
      </div>
    );
  }

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image for team: ${team.name}, URL: ${team.logo}`);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("rounded-full overflow-hidden border-2 border-white/30 bg-tournament-navy flex items-center justify-center", sizeClass[size])}>
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-tournament-navy text-xs text-white p-1">
            {team.name.substring(0, 2)}
          </div>
        ) : (
          <img
            src={team.logo || "/placeholder.svg"}
            alt={team.name}
            className={cn(
              "w-full h-full object-contain p-1",
              !imageLoaded && "hidden"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        {!imageLoaded && !imageError && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamLogo;
