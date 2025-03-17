
import { useMemo } from "react";
import { useTournamentStore } from "@/store/tournamentStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TeamLogo from "./TeamLogo";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface GroupTableProps {
  group: string;
  showControls?: boolean;
}

const GroupTable = ({ group, showControls = true }: GroupTableProps) => {
  const { teams, standings, tournamentName, organizer } = useTournamentStore();
  
  const groupTeams = useMemo(() => {
    return teams.filter(team => team.group === group);
  }, [teams, group]);
  
  const groupStandings = useMemo(() => {
    return standings[group] || [];
  }, [standings, group]);

  const downloadAsImage = () => {
    const element = document.getElementById(`group-${group}-table`);
    if (element) {
      html2canvas(element, { 
        backgroundColor: '#0f1e45',
        scale: 2,
      }).then(canvas => {
        // Add tournament name and group to the canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'right';
          ctx.fillText(`المجموعة ${group} - ${tournamentName}`, canvas.width - 20, canvas.height - 20);
          
          if (organizer) {
            ctx.font = '16px Arial';
            ctx.fillText(organizer, canvas.width - 20, canvas.height - 40);
          }
        }
        
        canvas.toBlob(blob => {
          if (blob) {
            saveAs(blob, `مجموعة-${group}-${tournamentName}.png`);
          }
        });
      });
    }
  };

  if (groupTeams.length === 0) {
    return <div className="text-center p-4">لا توجد فرق في هذه المجموعة</div>;
  }

  return (
    <div className="space-y-4 glassmorphism p-4 bg-gradient-to-br from-tournament-navy to-tournament-blue/80 rounded-lg shadow-lg border border-tournament-accent/20">
      <div id={`group-${group}-table`} className="rounded-md overflow-hidden">
        {/* Group Header - Styled like reference image */}
        <div className="bg-tournament-darkNavy py-6 px-4 relative">
          <h1 className="text-6xl font-bold text-white text-center">GROUP {group}</h1>
          
          {/* Decorative elements from the reference design */}
          <div className="absolute top-[40%] left-0 w-32 h-1 bg-tournament-pink"></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 rounded-full bg-tournament-accent"></div>
          <div className="absolute bottom-1/4 right-12 w-40 h-1 bg-tournament-accent/60"></div>
        </div>
        
        {/* Teams Header */}
        <div className="bg-tournament-pink text-white text-center py-3">
          <h2 className="text-xl font-bold">TEAMS</h2>
        </div>
        
        {/* Team List */}
        <div>
          {groupTeams.map((team) => {
            const standing = groupStandings.find(s => s.teamId === team.id);
            
            return (
              <div key={team.id} className="flex items-center bg-tournament-navy border-b border-tournament-navy/70">
                {/* Position indicator */}
                <div className="w-16 h-16 bg-tournament-pink flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {standing ? groupStandings.findIndex(s => s.teamId === team.id) + 1 : '-'}
                  </span>
                </div>
                
                {/* Team logo */}
                <div className="w-24 h-24 p-2 flex items-center justify-center">
                  <TeamLogo teamId={team.id} size="lg" className="border-4 border-white/10 rounded-full bg-white/10" />
                </div>
                
                {/* Team name */}
                <div className="flex-1 p-4">
                  <h3 className="text-2xl font-bold text-white">{team.name}</h3>
                </div>
                
                {/* Stats */}
                <div className="text-right p-4 text-white text-sm">
                  {standing && (
                    <div className="space-y-1">
                      <div>PTS: <span className="font-bold text-lg">{standing.points}</span></div>
                      <div>MP: <span className="font-bold">{standing.played}</span></div>
                      <div>W/D/L: <span className="font-bold">{standing.won}/{standing.drawn}/{standing.lost}</span></div>
                      <div>GF/GA: <span className="font-bold">{standing.goalsFor}/{standing.goalsAgainst}</span></div>
                      <div>GD: <span className="font-bold">{standing.goalsFor - standing.goalsAgainst}</span></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Decorative bottom elements */}
        <div className="bg-tournament-darkNavy py-4 px-4 relative">
          <div className="text-right text-tournament-accent/80 text-sm">
            {organizer}
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-1 bg-tournament-accent"></div>
          <div className="absolute bottom-8 left-8 w-40 h-1 bg-tournament-pink"></div>
        </div>
      </div>
      
      {showControls && (
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" onClick={downloadAsImage} className="flex items-center gap-1">
            <Download size={16} />
            <span>تحميل الترتيب</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupTable;
