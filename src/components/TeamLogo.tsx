
import { useTournamentStore } from "@/store/tournamentStore";
import { cn } from "@/lib/utils";

interface TeamLogoProps {
  teamId: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TeamLogo = ({ teamId, size = "md", className }: TeamLogoProps) => {
  const getTeamById = useTournamentStore((state) => state.getTeamById);
  const team = teamId ? getTeamById(teamId) : undefined;
  
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
          src={team.logo}
          alt={team.name}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
    </div>
  );
};

export default TeamLogo;
