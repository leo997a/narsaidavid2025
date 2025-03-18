
import { useState } from "react";
import { Match } from "@/types";
import { useTournamentStore } from "@/store/tournamentStore";
import { useAuthStore } from "@/store/authStore";
import TeamLogo from "./TeamLogo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  editable?: boolean;
  className?: string;
}

const MatchCard = ({ match, editable = false, className }: MatchCardProps) => {
  const { getTeamById, updateMatch } = useTournamentStore();
  const { isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMatch, setEditedMatch] = useState<Match>(match);

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  const handleSave = () => {
    updateMatch({
      ...editedMatch,
      status: editedMatch.homeScore !== null && editedMatch.awayScore !== null ? 'completed' : 'upcoming'
    });
    setIsEditing(false);
    toast.success("تم تحديث المباراة بنجاح");
  };

  return (
    <>
      <div className={cn("match-card p-3 mb-4", className)}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-tournament-pink font-bold">
            {new Date(match.date).toLocaleDateString('ar-SA')} - {match.time}
          </div>
          <div className="text-xs font-medium bg-tournament-pink/20 px-2 py-0.5 rounded">
            {match.status === 'completed' ? 'مكتملة' : match.status === 'ongoing' ? 'جارية' : 'قادمة'}
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <TeamLogo teamId={match.homeTeamId} />
            <span className="font-bold">{homeTeam?.name}</span>
          </div>
          <div className="flex items-center gap-2 mx-2">
            <div className="w-8 h-8 flex items-center justify-center bg-tournament-navy border border-tournament-accent rounded">
              {match.homeScore !== null ? match.homeScore : '-'}
            </div>
            <span className="text-gray-400">:</span>
            <div className="w-8 h-8 flex items-center justify-center bg-tournament-navy border border-tournament-accent rounded">
              {match.awayScore !== null ? match.awayScore : '-'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{awayTeam?.name}</span>
            <TeamLogo teamId={match.awayTeamId} />
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          {editable && isAuthenticated && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-tournament-accent hover:text-tournament-pink hover:bg-transparent" 
              onClick={() => setIsEditing(true)}
            >
              تعديل المباراة
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل نتيجة المباراة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-center">
                <TeamLogo teamId={match.homeTeamId} size="md" />
                <p className="mt-2 font-bold">{homeTeam?.name}</p>
              </div>
              <div className="text-center">
                <TeamLogo teamId={match.awayTeamId} size="md" />
                <p className="mt-2 font-bold">{awayTeam?.name}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="homeScore">أهداف {homeTeam?.name}</Label>
                <Input
                  id="homeScore"
                  type="number"
                  min="0"
                  value={editedMatch.homeScore === null ? '' : editedMatch.homeScore}
                  onChange={(e) => setEditedMatch({ ...editedMatch, homeScore: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="awayScore">أهداف {awayTeam?.name}</Label>
                <Input
                  id="awayScore"
                  type="number"
                  min="0"
                  value={editedMatch.awayScore === null ? '' : editedMatch.awayScore}
                  onChange={(e) => setEditedMatch({ ...editedMatch, awayScore: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeYellow">بطاقات صفراء {homeTeam?.name}</Label>
                <Input
                  id="homeYellow"
                  type="number"
                  min="0"
                  value={editedMatch.yellowCards.homeTeam}
                  onChange={(e) => setEditedMatch({ 
                    ...editedMatch, 
                    yellowCards: { 
                      ...editedMatch.yellowCards, 
                      homeTeam: parseInt(e.target.value) || 0 
                    } 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayYellow">بطاقات صفراء {awayTeam?.name}</Label>
                <Input
                  id="awayYellow"
                  type="number"
                  min="0"
                  value={editedMatch.yellowCards.awayTeam}
                  onChange={(e) => setEditedMatch({ 
                    ...editedMatch, 
                    yellowCards: { 
                      ...editedMatch.yellowCards, 
                      awayTeam: parseInt(e.target.value) || 0 
                    } 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeRed">بطاقات حمراء {homeTeam?.name}</Label>
                <Input
                  id="homeRed"
                  type="number"
                  min="0"
                  value={editedMatch.redCards.homeTeam}
                  onChange={(e) => setEditedMatch({ 
                    ...editedMatch, 
                    redCards: { 
                      ...editedMatch.redCards, 
                      homeTeam: parseInt(e.target.value) || 0 
                    } 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayRed">بطاقات حمراء {awayTeam?.name}</Label>
                <Input
                  id="awayRed"
                  type="number"
                  min="0"
                  value={editedMatch.redCards.awayTeam}
                  onChange={(e) => setEditedMatch({ 
                    ...editedMatch, 
                    redCards: { 
                      ...editedMatch.redCards, 
                      awayTeam: parseInt(e.target.value) || 0 
                    } 
                  })}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="ml-2">
                إلغاء
              </Button>
              <Button type="button" onClick={handleSave}>
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchCard;
