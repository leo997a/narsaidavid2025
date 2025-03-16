
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
        backgroundColor: '#101935',
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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-tournament-pink">
          المجموعة {group}
        </h3>
        {showControls && (
          <Button variant="outline" size="sm" onClick={downloadAsImage} className="flex items-center gap-1">
            <Download size={16} />
            <span>تحميل الترتيب</span>
          </Button>
        )}
      </div>
      
      <div id={`group-${group}-table`} className="rounded-md overflow-hidden bg-tournament-navy/80 p-2">
        <div className="text-xl font-bold text-center text-white mb-2">ترتيب المجموعة {group}</div>
        <Table>
          <TableHeader className="bg-tournament-blue/50">
            <TableRow>
              <TableHead className="w-12 text-right">المركز</TableHead>
              <TableHead className="text-right">الفريق</TableHead>
              <TableHead className="text-center">لعب</TableHead>
              <TableHead className="text-center">فوز</TableHead>
              <TableHead className="text-center">تعادل</TableHead>
              <TableHead className="text-center">خسارة</TableHead>
              <TableHead className="text-center">له</TableHead>
              <TableHead className="text-center">عليه</TableHead>
              <TableHead className="text-center">+/-</TableHead>
              <TableHead className="text-center">نقاط</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupStandings.map((standing, index) => {
              const team = teams.find(t => t.id === standing.teamId);
              const isQualified = index < 2;
              
              return (
                <TableRow 
                  key={standing.teamId}
                  className={
                    isQualified 
                      ? "bg-tournament-blue/50 hover:bg-tournament-blue/70" 
                      : "hover:bg-tournament-navy/50"
                  }
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TeamLogo teamId={standing.teamId} size="sm" />
                      <span>{team?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{standing.played}</TableCell>
                  <TableCell className="text-center">{standing.won}</TableCell>
                  <TableCell className="text-center">{standing.drawn}</TableCell>
                  <TableCell className="text-center">{standing.lost}</TableCell>
                  <TableCell className="text-center">{standing.goalsFor}</TableCell>
                  <TableCell className="text-center">{standing.goalsAgainst}</TableCell>
                  <TableCell className="text-center">{standing.goalsFor - standing.goalsAgainst}</TableCell>
                  <TableCell className="text-center font-bold">{standing.points}</TableCell>
                </TableRow>
              );
            })}
            
            {/* إضافة صفوف فارغة إذا كان عدد الفرق أقل من 3 */}
            {Array.from({ length: Math.max(0, 3 - groupStandings.length) }).map((_, index) => (
              <TableRow key={`empty-${index}`}>
                <TableCell>{groupStandings.length + index + 1}</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center">0</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GroupTable;
