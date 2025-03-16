
import React from 'react';
import Layout from '@/components/Layout';
import KnockoutBracket from '@/components/KnockoutBracket';
import { useTournamentStore } from '@/store/tournamentStore';

const Knockout = () => {
  const { knockoutMatches, tournamentName } = useTournamentStore();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tournament-accent mb-6">الأدوار الإقصائية - {tournamentName}</h1>
        
        <div className="w-full overflow-x-auto">
          <KnockoutBracket />
        </div>
      </div>
    </Layout>
  );
};

export default Knockout;
