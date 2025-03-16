
import { useState } from "react";
import { useTournamentStore } from "@/store/tournamentStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Player } from "@/types";
import { toast } from "sonner";
import TeamLogo from "./TeamLogo";

interface PlayerStatsProps {
  teamId: string;
}

const PlayerStats = ({ teamId }: PlayerStatsProps) => {
  const { getTeamById, getPlayersByTeam, updatePlayer, addPlayer } = useTournamentStore();
  const team = getTeamById(teamId);
  const players = getPlayersByTeam(teamId);
  
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<Omit<Player, "id">>({
    name: "",
    teamId,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0
  });

  const handleAddPlayer = () => {
    if (!newPlayer.name.trim()) {
      toast.error("يرجى إدخال اسم اللاعب");
      return;
    }

    const player: Player = {
      ...newPlayer,
      id: `player-${Date.now()}`
    };

    addPlayer(player);
    setNewPlayer({
      name: "",
      teamId,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    });
    setIsAddingPlayer(false);
    toast.success("تمت إضافة اللاعب بنجاح");
  };

  const handleUpdatePlayer = () => {
    if (!editingPlayer) return;
    
    updatePlayer(editingPlayer);
    setEditingPlayer(null);
    toast.success("تم تحديث بيانات اللاعب بنجاح");
  };

  if (!team) {
    return <div>الفريق غير موجود</div>;
  }

  return (
    <div className="space-y-4 glassmorphism p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TeamLogo teamId={teamId} />
          <h3 className="text-xl font-bold">{team.name}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsAddingPlayer(true)}>
          إضافة لاعب
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-tournament-navy">
          <TableRow>
            <TableHead className="text-right">اللاعب</TableHead>
            <TableHead className="text-center">أهداف</TableHead>
            <TableHead className="text-center">تمريرات حاسمة</TableHead>
            <TableHead className="text-center">بطاقات صفراء</TableHead>
            <TableHead className="text-center">بطاقات حمراء</TableHead>
            <TableHead className="text-center w-20">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.length > 0 ? (
            players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell className="text-center">{player.goals}</TableCell>
                <TableCell className="text-center">{player.assists}</TableCell>
                <TableCell className="text-center">{player.yellowCards}</TableCell>
                <TableCell className="text-center">{player.redCards}</TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-tournament-accent hover:text-tournament-pink hover:bg-transparent"
                    onClick={() => setEditingPlayer(player)}
                  >
                    تعديل
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                لا يوجد لاعبين مسجلين لهذا الفريق
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* مربع حوار إضافة لاعب جديد */}
      <Dialog open={isAddingPlayer} onOpenChange={setIsAddingPlayer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">إضافة لاعب جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playerName">اسم اللاعب</Label>
              <Input
                id="playerName"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goals">الأهداف</Label>
                <Input
                  id="goals"
                  type="number"
                  min="0"
                  value={newPlayer.goals}
                  onChange={(e) => setNewPlayer({ ...newPlayer, goals: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">التمريرات الحاسمة</Label>
                <Input
                  id="assists"
                  type="number"
                  min="0"
                  value={newPlayer.assists}
                  onChange={(e) => setNewPlayer({ ...newPlayer, assists: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yellowCards">البطاقات الصفراء</Label>
                <Input
                  id="yellowCards"
                  type="number"
                  min="0"
                  value={newPlayer.yellowCards}
                  onChange={(e) => setNewPlayer({ ...newPlayer, yellowCards: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redCards">البطاقات الحمراء</Label>
                <Input
                  id="redCards"
                  type="number"
                  min="0"
                  value={newPlayer.redCards}
                  onChange={(e) => setNewPlayer({ ...newPlayer, redCards: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setIsAddingPlayer(false)} className="ml-2">
                إلغاء
              </Button>
              <Button onClick={handleAddPlayer}>
                إضافة اللاعب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* مربع حوار تعديل بيانات اللاعب */}
      <Dialog open={!!editingPlayer} onOpenChange={(open) => !open && setEditingPlayer(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل بيانات اللاعب</DialogTitle>
          </DialogHeader>
          {editingPlayer && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPlayerName">اسم اللاعب</Label>
                <Input
                  id="editPlayerName"
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editGoals">الأهداف</Label>
                  <Input
                    id="editGoals"
                    type="number"
                    min="0"
                    value={editingPlayer.goals}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, goals: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAssists">التمريرات الحاسمة</Label>
                  <Input
                    id="editAssists"
                    type="number"
                    min="0"
                    value={editingPlayer.assists}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, assists: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editYellowCards">البطاقات الصفراء</Label>
                  <Input
                    id="editYellowCards"
                    type="number"
                    min="0"
                    value={editingPlayer.yellowCards}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, yellowCards: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRedCards">البطاقات الحمراء</Label>
                  <Input
                    id="editRedCards"
                    type="number"
                    min="0"
                    value={editingPlayer.redCards}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, redCards: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setEditingPlayer(null)} className="ml-2">
                  إلغاء
                </Button>
                <Button onClick={handleUpdatePlayer}>
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerStats;
