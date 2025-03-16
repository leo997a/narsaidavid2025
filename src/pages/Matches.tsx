
import React from 'react';
import Layout from '@/components/Layout';
import MatchCard from '@/components/MatchCard';
import { useStore } from '@/store/tournamentStore';

const Matches = () => {
  const { matches } = useStore();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tournament-accent mb-6">المباريات</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} showDetails />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Matches;
