
import React from 'react';
import Layout from '@/components/Layout';
import MatchCard from '@/components/MatchCard';
import { useTournamentStore } from '@/store/tournamentStore';
import { format, parseISO } from 'date-fns';

const Matches = () => {
  const { matches, tournamentName } = useTournamentStore();

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
      // تغيير تنسيق التاريخ إلى الشكل المطلوب: DD/MM/YYYY
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tournament-accent mb-6">مباريات {tournamentName}</h1>
        
        {sortedDates.map((date) => (
          <div key={date} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b border-tournament-accent pb-2">
              {formatDate(date)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchesByDate[date].map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Matches;
