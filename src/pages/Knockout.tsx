
import React from 'react';
import Layout from '@/components/Layout';
import KnockoutBracket from '@/components/KnockoutBracket';
import { useStore } from '@/store/tournamentStore';

const Knockout = () => {
  const { knockoutMatches } = useStore();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tournament-accent mb-6">الأدوار الإقصائية</h1>
        
        <div className="w-full overflow-x-auto">
          <KnockoutBracket matches={knockoutMatches} />
        </div>
      </div>
    </Layout>
  );
};

export default Knockout;
