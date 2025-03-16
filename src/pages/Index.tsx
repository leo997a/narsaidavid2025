
import { useEffect } from "react";
import { useTournamentStore } from "@/store/tournamentStore";
import Layout from "@/components/Layout";
import MatchCard from "@/components/MatchCard";
import KnockoutBracket from "@/components/KnockoutBracket";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { matches, calculateStandings } = useTournamentStore();
  
  useEffect(() => {
    calculateStandings();
  }, [calculateStandings]);
  
  // الحصول على المباريات القادمة (أول 3 مباريات)
  const upcomingMatches = matches
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // الحصول على آخر النتائج (آخر 3 مباريات مكتملة)
  const recentResults = matches
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  const initTeamLogos = () => {
    toast.info("مرحبًا بك في تطبيق بطولة نرسي 2025! قم بتحديث نتائج المباريات من صفحة المباريات");
  };
  
  useEffect(() => {
    initTeamLogos();
  }, []);

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center relative">
            <span className="text-tournament-pink">بطولة </span>
            <span className="relative">نرسي 2025</span>
            <div className="absolute w-full h-0.5 bottom-0 left-0 bg-gradient-to-r from-transparent via-tournament-pink to-transparent"></div>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-4 glassmorphism p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-tournament-pink" />
                المباريات القادمة
              </h2>
              <Link to="/matches">
                <Button variant="ghost" size="sm" className="text-tournament-accent hover:text-tournament-pink hover:bg-transparent">
                  عرض الكل
                  <ArrowLeft className="mr-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} editable={false} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                لا توجد مباريات قادمة
              </div>
            )}
          </div>

          <div className="space-y-4 glassmorphism p-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-tournament-pink" />
                آخر النتائج
              </h2>
              <Link to="/matches">
                <Button variant="ghost" size="sm" className="text-tournament-accent hover:text-tournament-pink hover:bg-transparent">
                  عرض الكل
                  <ArrowLeft className="mr-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {recentResults.length > 0 ? (
              recentResults.map(match => (
                <MatchCard key={match.id} match={match} editable={false} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                لا توجد نتائج بعد
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 glassmorphism p-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-tournament-pink" />
              مسار البطولة
            </h2>
            <Link to="/bracket">
              <Button variant="ghost" size="sm" className="text-tournament-accent hover:text-tournament-pink hover:bg-transparent">
                عرض التفاصيل
                <ArrowLeft className="mr-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <KnockoutBracket />
          </div>
        </div>

        <div className="glassmorphism p-4 animate-slide-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Users className="mr-2 h-5 w-5 text-tournament-pink" />
              المجموعات
            </h2>
            <Link to="/groups">
              <Button variant="ghost" size="sm" className="text-tournament-accent hover:text-tournament-pink hover:bg-transparent">
                عرض التفاصيل
                <ArrowLeft className="mr-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Link to="/groups" className="bg-tournament-navy rounded-lg p-4 text-center hover:bg-tournament-blue/50 transition-colors">
              <h3 className="font-bold mb-2">المجموعة A</h3>
              <p className="text-sm text-gray-400">اضغط لعرض تفاصيل المجموعة</p>
            </Link>
            <Link to="/groups" className="bg-tournament-navy rounded-lg p-4 text-center hover:bg-tournament-blue/50 transition-colors">
              <h3 className="font-bold mb-2">المجموعة B</h3>
              <p className="text-sm text-gray-400">اضغط لعرض تفاصيل المجموعة</p>
            </Link>
            <Link to="/groups" className="bg-tournament-navy rounded-lg p-4 text-center hover:bg-tournament-blue/50 transition-colors">
              <h3 className="font-bold mb-2">المجموعة C</h3>
              <p className="text-sm text-gray-400">اضغط لعرض تفاصيل المجموعة</p>
            </Link>
            <Link to="/groups" className="bg-tournament-navy rounded-lg p-4 text-center hover:bg-tournament-blue/50 transition-colors">
              <h3 className="font-bold mb-2">المجموعة D</h3>
              <p className="text-sm text-gray-400">اضغط لعرض تفاصيل المجموعة</p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
