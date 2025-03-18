
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import MatchCard from '@/components/MatchCard';
import { useTournamentStore } from '@/store/tournamentStore';
import { useAuthStore } from '@/store/authStore';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const Matches = () => {
  const { matches, tournamentName, calculateStandings, isLoading, syncData, isSynced, saveAllData } = useTournamentStore();
  const { isAuthenticated } = useAuthStore();
  const isMobile = useIsMobile();

  // تأكد من أن الترتيب محدث دائمًا
  useEffect(() => {
    calculateStandings();
    
    // مزامنة البيانات عند تحميل الصفحة
    if (!isSynced) {
      syncData();
    }
  }, [calculateStandings, syncData, isSynced]);

  // تجميع المباريات حسب التاريخ
  const matchesByDate = matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  // ترتيب التواريخ تصاعديًا
  const sortedDates = Object.keys(matchesByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      // استخدام التنسيق الميلادي فقط
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleRefresh = () => {
    syncData();
    toast.success("جاري مزامنة البيانات...");
  };

  const handleSave = () => {
    saveAllData();
    toast.success("جاري حفظ البيانات...");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-tournament-accent">مباريات {tournamentName}</h1>
          
          <div className="flex items-center gap-2">
            <Badge variant={isSynced ? "default" : "outline"} className="bg-green-600">
              {isSynced ? "متزامن" : "غير متزامن"}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              <span>تحديث</span>
            </Button>
            
            {isAuthenticated && (
              <Button 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save size={16} />
                <span>حفظ التغييرات</span>
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          // عرض هيكل تحميل عند جلب البيانات
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-8">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-40 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          sortedDates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-400">لا توجد مباريات مجدولة حاليًا</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-tournament-accent pb-2 flex items-center gap-2">
                  <div className="bg-tournament-accent py-1 px-2 rounded text-white text-sm">
                    {formatDate(date)}
                  </div>
                </h2>
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {matchesByDate[date].map((match) => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      editable={isAuthenticated} 
                      className={isMobile ? 'w-full' : ''}
                    />
                  ))}
                </div>
              </div>
            ))
          )
        )}

        {!isAuthenticated && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-yellow-700 mb-2">ملاحظة: البيانات متزامنة مع الخادم ويمكن للجميع رؤية أحدث النتائج</p>
            <p className="text-yellow-600 text-sm">
              يمكن للمسؤولين فقط تحديث النتائج والبيانات
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Matches;
