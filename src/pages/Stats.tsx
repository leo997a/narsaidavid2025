
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TopScorers from '@/components/TopScorers';
import PlayerStats from '@/components/PlayerStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTournamentStore } from '@/store/tournamentStore';

const Stats = () => {
  const { teams } = useTournamentStore();
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tournament-accent mb-6">الإحصائيات</h1>
        
        <Tabs defaultValue="scorers" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 w-full max-w-md mx-auto">
            <TabsTrigger value="scorers">الهدافين</TabsTrigger>
            <TabsTrigger value="players">إحصائيات اللاعبين</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scorers">
            <TopScorers />
          </TabsContent>
          
          <TabsContent value="players">
            {selectedTeamId && <PlayerStats teamId={selectedTeamId} />}
            
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`px-3 py-1 rounded ${selectedTeamId === team.id ? 'bg-tournament-accent text-white' : 'bg-tournament-navy'}`}
                >
                  {team.name}
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Stats;
