
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useTournamentStore } from "@/store/tournamentStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamLogo from "@/components/TeamLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarIcon, Upload, ImageIcon, LogOut, Save, RefreshCw, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import PlayerStats from "@/components/PlayerStats";
import MatchCard from "@/components/MatchCard";
import ImageUploader from "@/components/ImageUploader";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useDateFormatStore } from "@/store/dateFormatStore";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

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
    copyright,
    updateTournamentInfo,
    updateTeam,
    saveAllData
  } = useTournamentStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingInfo, setEditingInfo] = useState(false);
  const [newTournamentName, setNewTournamentName] = useState(tournamentName);
  const [newOrganizer, setNewOrganizer] = useState(organizer);
  const [newCopyright, setNewCopyright] = useState(copyright || "");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [newTeamLogo, setNewTeamLogo] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { format: dateFormat, setFormat: setDateFormat } = useDateFormatStore();
  
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
    toast.success("تم تحديث ترتيب المجموعات بنجاح");
  };
  
  const handleQualifyTeams = () => {
    setQualifiedTeams();
    toast.success("تم تأهيل الفرق للأدوار الإقصائية بنجاح");
  };

  const handleSaveTournamentInfo = () => {
    updateTournamentInfo(newTournamentName, newOrganizer, newCopyright);
    setEditingInfo(false);
    saveAllData();
    showSaveSuccess();
  };

  const handleEditTeamLogo = (teamId: string) => {
    setEditingTeamId(teamId);
    const team = getTeamById(teamId);
    if (team) {
      setNewTeamLogo(team.logo || "");
    }
  };

  const handleSaveTeamLogo = () => {
    if (editingTeamId) {
      const team = getTeamById(editingTeamId);
      if (team) {
        updateTeam({
          ...team,
          logo: newTeamLogo
        });
        saveAllData();
        showSaveSuccess(`تم تحديث شعار ${team.name} بنجاح`);
        setEditingTeamId(null);
        setNewTeamLogo("");
      }
    }
  };
  
  const handleImageUpload = (base64Image: string) => {
    if (editingTeamId) {
      setNewTeamLogo(base64Image);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  // حفظ كل التغييرات في localStorage وتأكيد ذلك للمستخدم
  const handleSaveAllChanges = () => {
    saveAllData();
    showSaveSuccess('تم حفظ جميع التغييرات بنجاح');
  };
  
  // إظهار رسالة نجاح الحفظ
  const showSaveSuccess = (message = 'تم حفظ جميع التغييرات بنجاح') => {
    setSaveSuccess(true);
    toast.success(message);
    
    // إخفاء رسالة النجاح بعد 3 ثواني
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  // وظيفة العودة إلى الصفحة السابقة
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleGoBack} 
            className="flex items-center gap-1"
            size="sm"
          >
            <ArrowLeft size={16} />
            <span>العودة</span>
          </Button>
          <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        </div>
        <div className="flex gap-2 items-center">
          <Button 
            variant={saveSuccess ? "outline" : "default"}
            onClick={handleSaveAllChanges} 
            className={`flex items-center gap-1 ${saveSuccess ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <Save size={16} />
            <span>{saveSuccess ? 'تم الحفظ!' : 'حفظ التغييرات'}</span>
          </Button>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-1">
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tournament" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
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
                  <div>
                    <Label>نص حقوق الطبع والنشر</Label>
                    <Input 
                      value={newCopyright} 
                      onChange={(e) => setNewCopyright(e.target.value)}
                      className="mt-1"
                      placeholder="مثال: © 2025 جميع الحقوق محفوظة"
                    />
                  </div>
                  <div>
                    <Label>نوع التاريخ المستخدم</Label>
                    <Select
                      value={dateFormat}
                      onValueChange={(value: 'gregorian' | 'hijri') => setDateFormat(value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر نوع التاريخ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gregorian">ميلادي (2025/3/17)</SelectItem>
                        <SelectItem value="hijri">هجري (١٤٤٦/٩/٢٠)</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-tournament-navy rounded-lg">
                    <Label className="text-sm text-gray-400">اسم البطولة</Label>
                    <p className="text-lg font-semibold">{tournamentName}</p>
                  </div>
                  <div className="p-4 bg-tournament-navy rounded-lg">
                    <Label className="text-sm text-gray-400">اسم المنظم / اللجنة</Label>
                    <p className="text-lg font-semibold">{organizer}</p>
                  </div>
                  <div className="p-4 bg-tournament-navy rounded-lg">
                    <Label className="text-sm text-gray-400">نص حقوق الطبع والنشر</Label>
                    <p className="text-lg font-semibold">{copyright || "© 2025 جميع الحقوق محفوظة"}</p>
                  </div>
                  <div className="p-4 bg-tournament-navy rounded-lg">
                    <Label className="text-sm text-gray-400">نوع التاريخ المستخدم</Label>
                    <p className="text-lg font-semibold">
                      {dateFormat === 'gregorian' ? 'ميلادي (2025/3/17)' : 'هجري (١٤٤٦/٩/٢٠)'}
                    </p>
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
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <Input
              placeholder="بحث عن مباراة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleRefreshStandings} 
                className="flex items-center gap-1"
              >
                <RefreshCw size={16} />
                <span>تحديث ترتيب المجموعات</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveAllChanges} 
                className="flex items-center gap-1"
              >
                <Save size={16} />
                <span>حفظ التغييرات</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">المباريات القادمة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} editable={true} />
                ))
              ) : (
                <p>لا توجد مباريات قادمة</p>
              )}
            </div>
            
            <h2 className="text-xl font-semibold mt-8">المباريات المكتملة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedMatches.length > 0 ? (
                completedMatches.map(match => (
                  <MatchCard key={match.id} match={match} editable={true} />
                ))
              ) : (
                <p>لا توجد مباريات مكتملة</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* قسم الفرق واللاعبين */}
        <TabsContent value="teams" className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">إدارة الفرق واللاعبين</h2>
            <div className="flex gap-2">
              <Button onClick={handleQualifyTeams}>تأهيل الفرق للأدوار الإقصائية</Button>
              <Button 
                variant="outline" 
                onClick={handleSaveAllChanges} 
                className="flex items-center gap-1"
              >
                <Save size={16} />
                <span>حفظ التغييرات</span>
              </Button>
            </div>
          </div>
          
          {editingTeamId && (
            <div className="glassmorphism p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-4">
                تعديل شعار {getTeamById(editingTeamId)?.name}
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div>
                    <TeamLogo teamId={editingTeamId} size="lg" />
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="logo-url" className="mb-2 block">رابط شعار الفريق</Label>
                    <Input
                      id="logo-url"
                      value={newTeamLogo}
                      onChange={(e) => setNewTeamLogo(e.target.value)}
                      placeholder="أدخل رابط URL للشعار..."
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-400 mb-2">
                      أدخل رابط URL كامل للصورة أو استخدم زر تحميل الصورة أدناه
                    </p>
                    
                    <div className="mt-2">
                      <ImageUploader 
                        onImageSelect={handleImageUpload} 
                        buttonText="تحميل شعار من جهازك"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingTeamId(null);
                      setNewTeamLogo("");
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleSaveTeamLogo}>
                    حفظ الشعار
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map(team => (
              <div key={team.id} className="glassmorphism p-4 rounded-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TeamLogo teamId={team.id} />
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <span className="bg-tournament-accent/20 text-tournament-accent px-2 py-0.5 rounded text-xs">
                      المجموعة {team.group}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditTeamLogo(team.id)}
                    className="flex items-center gap-1"
                  >
                    <ImageIcon size={16} />
                    <span>تعديل الشعار</span>
                  </Button>
                </div>
                <PlayerStats teamId={team.id} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* قسم الأدوار الإقصائية */}
        <TabsContent value="knockout" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">إدارة الأدوار الإقصائية</h2>
            <Button 
              variant="outline" 
              onClick={handleSaveAllChanges} 
              className="flex items-center gap-1"
            >
              <Save size={16} />
              <span>حفظ التغييرات</span>
            </Button>
          </div>
          
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
                  
                  <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
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
                    <div className="flex flex-wrap gap-2">
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
