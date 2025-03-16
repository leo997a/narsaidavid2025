
import { useState } from "react";
import Layout from "@/components/Layout";
import { useTournamentStore } from "@/store/tournamentStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Team, Match, Player } from "@/types";
import PlayerStats from "@/components/PlayerStats";
import MatchCard from "@/components/MatchCard";
import TeamLogo from "@/components/TeamLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Admin = () => {
  const { 
    teams, 
    matches, 
    calculateStandings, 
    setQualifiedTeams,
    getTeamById,
    knockoutMatches,
    updateKnockoutMatch,
    tournamentName,
    organizer,
    updateTournamentInfo
  } = useTournamentStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingInfo, setEditingInfo] = useState(false);
  const [newTournamentName, setNewTournamentName] = useState(tournamentName);
  const [newOrganizer, setNewOrganizer] = useState(organizer);
  
  // تصفية المباريات حسب حالتها
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const completedMatches = matches.filter(match => match.status === 'completed');
  
  // تصفية المباريات حسب البحث
  const filteredMatches = matches.filter(match => {
    const homeTeam = getTeamById(match.homeTeamId)?.name.toLowerCase() || '';
    const awayTeam = getTeamById(match.awayTeamId)?.name.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return homeTeam.includes(query) || awayTeam.includes(query) || match.date.includes(query);
  });
  
  const handleRefreshStandings = () => {
    calculateStandings();
  };
  
  const handleQualifyTeams = () => {
    setQualifiedTeams();
  };

  const handleSaveTournamentInfo = () => {
    updateTournamentInfo(newTournamentName, newOrganizer);
    setEditingInfo(false);
    toast.success("تم تحديث معلومات البطولة بنجاح");
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
      </div>

      <Tabs defaultValue="tournament" className="space-y-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="tournament">معلومات البطولة</TabsTrigger>
          <TabsTrigger value="matches">المباريات</TabsTrigger>
          <TabsTrigger value="teams">الفرق واللاعبين</TabsTrigger>
          <TabsTrigger value="knockout">الأدوار الإقصائية</TabsTrigger>
        </TabsList>
        
        {/* قسم معلومات البطولة */}
        <TabsContent value="tournament" className="space-y-6">
          <div className="glassmorphism p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">معلومات البطولة</h2>
            
            {editingInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>اسم البطولة</Label>
                    <Input 
                      value={newTournamentName} 
                      onChange={(e) => setNewTournamentName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>اسم المنظم / اللجنة</Label>
                    <Input 
                      value={newOrganizer} 
                      onChange={(e) => setNewOrganizer(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditingInfo(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSaveTournamentInfo}>
                    حفظ المعلومات
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-tournament-navy rounded-lg">
                    <Label className="text-sm text-gray-400">اسم البطولة</Label>
                    <p className="text-lg font-semibold">{tournamentName}</p>
                  </div>
                  <div className="p-4 bg-tournament-navy rounded-lg">
                    <Label className="text-sm text-gray-400">اسم المنظم / اللجنة</Label>
                    <p className="text-lg font-semibold">{organizer}</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setEditingInfo(true)}>
                    تعديل المعلومات
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* قسم المباريات */}
        <TabsContent value="matches" className="space-y-6">
          <div className="flex justify-between items-center">
            <Input
              placeholder="بحث عن مباراة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleRefreshStandings}>تحديث ترتيب المجموعات</Button>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">المباريات القادمة</h2>
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <p>لا توجد مباريات قادمة</p>
            )}
            
            <h2 className="text-xl font-semibold mt-8">المباريات المكتملة</h2>
            {completedMatches.length > 0 ? (
              completedMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <p>لا توجد مباريات مكتملة</p>
            )}
          </div>
        </TabsContent>
        
        {/* قسم الفرق واللاعبين */}
        <TabsContent value="teams" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">إدارة الفرق واللاعبين</h2>
            <Button onClick={handleQualifyTeams}>تأهيل الفرق للأدوار الإقصائية</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map(team => (
              <div key={team.id} className="glassmorphism p-4 rounded-lg">
                <div className="mb-4 flex items-center gap-2">
                  <TeamLogo teamId={team.id} />
                  <h3 className="text-lg font-semibold">{team.name}</h3>
                  <span className="bg-tournament-accent/20 text-tournament-accent px-2 py-0.5 rounded text-xs">
                    المجموعة {team.group}
                  </span>
                </div>
                <PlayerStats teamId={team.id} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* قسم الأدوار الإقصائية */}
        <TabsContent value="knockout" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">إدارة الأدوار الإقصائية</h2>
          
          <div className="space-y-6">
            {knockoutMatches.map(match => {
              const teamA = match.teamAId ? getTeamById(match.teamAId) : null;
              const teamB = match.teamBId ? getTeamById(match.teamBId) : null;
              
              return (
                <div key={match.id} className="glassmorphism p-4 rounded-lg">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-semibold text-tournament-pink">
                      {match.stage === 'quarterfinal' ? 'ربع النهائي' : 
                       match.stage === 'semifinal' ? 'نصف النهائي' : 'النهائي'}
                      {' - '}{match.position}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                      <TeamLogo teamId={match.teamAId} />
                      <span className="font-bold">{teamA?.name || 'لم يتحدد بعد'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mx-4">
                      <Input
                        type="number"
                        min="0"
                        value={match.teamAScore === null ? '' : match.teamAScore}
                        onChange={(e) => {
                          const newScore = e.target.value === '' ? null : parseInt(e.target.value);
                          const winner = newScore !== null && match.teamBScore !== null
                            ? newScore > match.teamBScore 
                              ? match.teamAId 
                              : newScore < match.teamBScore 
                                ? match.teamBId 
                                : null
                            : null;
                            
                          updateKnockoutMatch({
                            ...match,
                            teamAScore: newScore,
                            winner: winner
                          });
                        }}
                        className="w-16 h-10 text-center"
                      />
                      <span className="text-xl mx-1">:</span>
                      <Input
                        type="number"
                        min="0"
                        value={match.teamBScore === null ? '' : match.teamBScore}
                        onChange={(e) => {
                          const newScore = e.target.value === '' ? null : parseInt(e.target.value);
                          const winner = newScore !== null && match.teamAScore !== null
                            ? match.teamAScore > newScore 
                              ? match.teamAId 
                              : match.teamAScore < newScore 
                                ? match.teamBId 
                                : null
                            : null;
                            
                          updateKnockoutMatch({
                            ...match,
                            teamBScore: newScore,
                            winner: winner
                          });
                        }}
                        className="w-16 h-10 text-center"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{teamB?.name || 'لم يتحدد بعد'}</span>
                      <TeamLogo teamId={match.teamBId} />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <Label className="mb-1 block">الفريق الفائز:</Label>
                    <div className="flex gap-2">
                      {match.teamAId && (
                        <Button
                          variant={match.winner === match.teamAId ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            updateKnockoutMatch({
                              ...match,
                              winner: match.teamAId
                            });
                          }}
                          disabled={!match.teamAId}
                        >
                          {teamA?.name}
                        </Button>
                      )}
                      
                      {match.teamBId && (
                        <Button
                          variant={match.winner === match.teamBId ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            updateKnockoutMatch({
                              ...match,
                              winner: match.teamBId
                            });
                          }}
                          disabled={!match.teamBId}
                        >
                          {teamB?.name}
                        </Button>
                      )}
                      
                      {match.winner && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateKnockoutMatch({
                              ...match,
                              winner: null
                            });
                          }}
                        >
                          إعادة تعيين
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Admin;
