
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import MatchCard from '@/components/MatchCard';
import { useTournamentStore } from '@/store/tournamentStore';
import { useAuthStore } from '@/store/authStore';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const Matches = () => {
  const { matches, tournamentName, calculateStandings } = useTournamentStore();
  const { isAuthenticated } = useAuthStore();
  const isMobile = useIsMobile();

  // تأكد من أن الترتيب محدث دائمًا
  useEffect(() => {
    calculateStandings();
  }, [calculateStandings]);

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

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-tournament-accent mb-6">مباريات {tournamentName}</h1>
        
        {sortedDates.length === 0 ? (
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
        )}

        {!isAuthenticated && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-yellow-700 mb-2">ملاحظة: يتم عرض النتائج الحالية من المخزن المحلي للمتصفح الخاص بك</p>
            <p className="text-yellow-600 text-sm">
              يمكن للمسؤولين فقط تحديث النتائج والبيانات بشكل دائم
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Matches;
