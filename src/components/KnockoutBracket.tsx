
import { useTournamentStore } from "@/store/tournamentStore";
import TeamLogo from "./TeamLogo";
import { useState } from "react";
import { KnockoutMatch } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trophy } from "lucide-react";

interface BracketTeamProps {
  teamId: string | null;
  isWinner?: boolean;
  onClick?: () => void;
}

const BracketTeam = ({ teamId, isWinner, onClick }: BracketTeamProps) => {
  const getTeamById = useTournamentStore((state) => state.getTeamById);
  const team = teamId ? getTeamById(teamId) : undefined;

  return (
    <div 
      className={`flex items-center gap-2 p-2 rounded-full ${isWinner ? 'bg-tournament-navy border border-tournament-pink' : 'bg-tournament-navy/50'} ${onClick ? 'cursor-pointer hover:bg-tournament-blue/50' : ''}`}
      onClick={onClick}
    >
      <TeamLogo teamId={teamId} size="sm" />
      <span className="font-medium text-sm">{team?.name || '?'}</span>
    </div>
  );
};

const KnockoutBracket = () => {
  const { knockoutMatches, updateKnockoutMatch } = useTournamentStore();
  const [editingMatch, setEditingMatch] = useState<KnockoutMatch | null>(null);
  const [editedScores, setEditedScores] = useState({ teamAScore: 0, teamBScore: 0 });

  const quarterFinals = knockoutMatches.filter(m => m.stage === 'quarterfinal');
  const semiFinals = knockoutMatches.filter(m => m.stage === 'semifinal');
  const final = knockoutMatches.find(m => m.stage === 'final');

  const handleEditMatch = (match: KnockoutMatch) => {
    // تسمح بالتحرير فقط إذا كان لدى المباراة فريقين
    if (match.teamAId && match.teamBId) {
      setEditingMatch(match);
      setEditedScores({
        teamAScore: match.teamAScore || 0,
        teamBScore: match.teamBScore || 0
      });
    } else {
      toast.error("لا يمكن تحرير مباراة بدون فرق");
    }
  };

  const handleSaveMatch = () => {
    if (!editingMatch) return;

    const winner = editedScores.teamAScore > editedScores.teamBScore 
      ? editingMatch.teamAId 
      : editedScores.teamBScore > editedScores.teamAScore 
        ? editingMatch.teamBId 
        : null;

    if (!winner) {
      toast.error("يجب أن يكون هناك فائز في مباراة الأدوار الإقصائية");
      return;
    }

    const updatedMatch = {
      ...editingMatch,
      teamAScore: editedScores.teamAScore,
      teamBScore: editedScores.teamBScore,
      winner
    };

    updateKnockoutMatch(updatedMatch);
    setEditingMatch(null);
    toast.success("تم تحديث المباراة بنجاح");
  };

  return (
    <div className="relative my-8 py-10">
      {/* الخطوط التقنية التزيينية */}
      <div className="tech-dot top-0 left-4 animate-pulse-slow"></div>
      <div className="tech-dot top-16 right-8 animate-pulse-slow"></div>
      <div className="tech-dot bottom-8 left-1/3 animate-pulse-slow"></div>
      <div className="tech-line"></div>

      <div className="flex justify-center">
        <div className="text-3xl font-bold text-white mb-8 text-center relative">
          <span className="text-tournament-pink">بطولة </span>
          <span className="relative">نرسي 2025</span>
          <div className="absolute w-full h-0.5 bottom-0 left-0 bg-gradient-to-r from-transparent via-tournament-pink to-transparent"></div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center">
          {/* مرحلة ربع النهائي - الجانب الأيسر */}
          <div className="flex justify-between mx-4 gap-12">
            <div className="flex flex-col gap-16">
              <div className="relative">
                <BracketTeam teamId={quarterFinals[0]?.teamAId} isWinner={quarterFinals[0]?.winner === quarterFinals[0]?.teamAId} onClick={() => handleEditMatch(quarterFinals[0])} />
                <div className="h-8 bracket-line-vertical absolute right-0 top-full"></div>
                <BracketTeam teamId={quarterFinals[0]?.teamBId} isWinner={quarterFinals[0]?.winner === quarterFinals[0]?.teamBId} onClick={() => handleEditMatch(quarterFinals[0])} />
                <div className="w-8 bracket-line absolute left-full top-1/2"></div>
              </div>
              
              <div className="relative">
                <BracketTeam teamId={quarterFinals[1]?.teamAId} isWinner={quarterFinals[1]?.winner === quarterFinals[1]?.teamAId} onClick={() => handleEditMatch(quarterFinals[1])} />
                <div className="h-8 bracket-line-vertical absolute right-0 top-full"></div>
                <BracketTeam teamId={quarterFinals[1]?.teamBId} isWinner={quarterFinals[1]?.winner === quarterFinals[1]?.teamBId} onClick={() => handleEditMatch(quarterFinals[1])} />
                <div className="w-8 bracket-line absolute left-full top-1/2"></div>
              </div>
            </div>
            
            {/* مرحلة نصف النهائي - الجانب الأيسر */}
            <div className="relative mt-16">
              <BracketTeam teamId={semiFinals[0]?.teamAId} isWinner={semiFinals[0]?.winner === semiFinals[0]?.teamAId} onClick={() => handleEditMatch(semiFinals[0])} />
              <div className="h-12 bracket-line-vertical absolute right-0 top-full"></div>
              <BracketTeam teamId={semiFinals[0]?.teamBId} isWinner={semiFinals[0]?.winner === semiFinals[0]?.teamBId} onClick={() => handleEditMatch(semiFinals[0])} />
              <div className="w-8 bracket-line absolute left-full top-1/2"></div>
            </div>
          </div>
        </div>
        
        {/* كأس النهائي */}
        <div className="mx-8 flex flex-col items-center">
          <Trophy className="w-12 h-12 text-tournament-pink mb-4" />
          
          {/* النهائي */}
          <div className="relative mt-4 glassmorphism p-4 rounded-xl border border-tournament-pink/30">
            <h3 className="text-tournament-pink text-center mb-2 font-bold">النهائي</h3>
            <p className="text-xs text-center mb-4 text-gray-400">4/4/2025</p>
            
            <BracketTeam teamId={final?.teamAId} isWinner={final?.winner === final?.teamAId} onClick={() => handleEditMatch(final || undefined)} />
            <div className="my-2 border-t border-dashed border-tournament-pink/30"></div>
            <BracketTeam teamId={final?.teamBId} isWinner={final?.winner === final?.teamBId} onClick={() => handleEditMatch(final || undefined)} />
            
            {final?.winner && (
              <div className="mt-4 text-center">
                <div className="text-xs text-tournament-pink font-bold">الفائز</div>
                <div className="flex justify-center mt-2">
                  <TeamLogo teamId={final.winner} size="md" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {/* مرحلة ربع النهائي - الجانب الأيمن */}
          <div className="flex justify-between mx-4 gap-12">
            {/* مرحلة نصف النهائي - الجانب الأيمن */}
            <div className="relative mt-16">
              <div className="w-8 bracket-line absolute right-full top-1/2"></div>
              <BracketTeam teamId={semiFinals[1]?.teamAId} isWinner={semiFinals[1]?.winner === semiFinals[1]?.teamAId} onClick={() => handleEditMatch(semiFinals[1])} />
              <div className="h-12 bracket-line-vertical absolute left-0 top-full"></div>
              <BracketTeam teamId={semiFinals[1]?.teamBId} isWinner={semiFinals[1]?.winner === semiFinals[1]?.teamBId} onClick={() => handleEditMatch(semiFinals[1])} />
            </div>
            
            <div className="flex flex-col gap-16">
              <div className="relative">
                <div className="w-8 bracket-line absolute right-full top-1/2"></div>
                <BracketTeam teamId={quarterFinals[2]?.teamAId} isWinner={quarterFinals[2]?.winner === quarterFinals[2]?.teamAId} onClick={() => handleEditMatch(quarterFinals[2])} />
                <div className="h-8 bracket-line-vertical absolute left-0 top-full"></div>
                <BracketTeam teamId={quarterFinals[2]?.teamBId} isWinner={quarterFinals[2]?.winner === quarterFinals[2]?.teamBId} onClick={() => handleEditMatch(quarterFinals[2])} />
              </div>
              
              <div className="relative">
                <div className="w-8 bracket-line absolute right-full top-1/2"></div>
                <BracketTeam teamId={quarterFinals[3]?.teamAId} isWinner={quarterFinals[3]?.winner === quarterFinals[3]?.teamAId} onClick={() => handleEditMatch(quarterFinals[3])} />
                <div className="h-8 bracket-line-vertical absolute left-0 top-full"></div>
                <BracketTeam teamId={quarterFinals[3]?.teamBId} isWinner={quarterFinals[3]?.winner === quarterFinals[3]?.teamBId} onClick={() => handleEditMatch(quarterFinals[3])} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* مربع حوار تحرير المباراة */}
      <Dialog open={!!editingMatch} onOpenChange={(open) => !open && setEditingMatch(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">تحرير نتيجة المباراة</DialogTitle>
          </DialogHeader>
          
          {editingMatch && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <TeamLogo teamId={editingMatch.teamAId} size="md" />
                  <p className="mt-2 text-sm">{useTournamentStore.getState().getTeamById(editingMatch.teamAId || '')?.name}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="0"
                    className="w-16 text-center"
                    value={editedScores.teamAScore}
                    onChange={(e) => setEditedScores({ ...editedScores, teamAScore: parseInt(e.target.value) || 0 })}
                  />
                  <span className="text-xl">-</span>
                  <Input
                    type="number"
                    min="0"
                    className="w-16 text-center"
                    value={editedScores.teamBScore}
                    onChange={(e) => setEditedScores({ ...editedScores, teamBScore: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="text-center">
                  <TeamLogo teamId={editingMatch.teamBId} size="md" />
                  <p className="mt-2 text-sm">{useTournamentStore.getState().getTeamById(editingMatch.teamBId || '')?.name}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingMatch(null)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveMatch}>
                  حفظ النتيجة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnockoutBracket;
