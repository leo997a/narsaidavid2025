
import { useState, useEffect } from "react";
import { useTournamentStore } from "@/store/tournamentStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TeamLogo from "./TeamLogo";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const TopScorers = () => {
  const { getTopScorers, getTeamById } = useTournamentStore();
  const [topScorers, setTopScorers] = useState(getTopScorers(10));

  useEffect(() => {
    setTopScorers(getTopScorers(10));
  }, [getTopScorers]);

  const downloadAsImage = () => {
    const element = document.getElementById("top-scorers-table");
    if (element) {
      html2canvas(element, { 
        backgroundColor: '#101935',
        scale: 2,
      }).then(canvas => {
        canvas.toBlob(blob => {
          if (blob) {
            saveAs(blob, "هدافي-البطولة.png");
          }
        });
      });
    }
  };

  return (
    <div className="space-y-4 glassmorphism p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-tournament-pink">
          هدافي البطولة
        </h3>
        <Button variant="outline" size="sm" onClick={downloadAsImage}>
          تحميل الإحصائيات
        </Button>
      </div>
      
      <div id="top-scorers-table" className="rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-tournament-navy">
            <TableRow>
              <TableHead className="w-12 text-right">المركز</TableHead>
              <TableHead className="text-right">اللاعب</TableHead>
              <TableHead className="text-right">الفريق</TableHead>
              <TableHead className="text-center">أهداف</TableHead>
              <TableHead className="text-center">تمريرات حاسمة</TableHead>
              <TableHead className="text-center">بطاقات صفراء</TableHead>
              <TableHead className="text-center">بطاقات حمراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topScorers.map((player, index) => {
              const team = getTeamById(player.teamId);
              
              return (
                <TableRow key={player.id} className={index < 3 ? "bg-tournament-blue/50" : ""}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TeamLogo teamId={player.teamId} size="sm" />
                      <span>{team?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold">{player.goals}</TableCell>
                  <TableCell className="text-center">{player.assists}</TableCell>
                  <TableCell className="text-center">{player.yellowCards}</TableCell>
                  <TableCell className="text-center">{player.redCards}</TableCell>
                </TableRow>
              );
            })}

            {/* إضافة صفوف فارغة إذا كان عدد اللاعبين أقل من 10 */}
            {Array.from({ length: Math.max(0, 10 - topScorers.length) }).map((_, index) => (
              <TableRow key={`empty-${index}`}>
                <TableCell>{topScorers.length + index + 1}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
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

export default TopScorers;
