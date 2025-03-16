
import React from 'react';
import Layout from '@/components/Layout';
import TopScorers from '@/components/TopScorers';
import PlayerStats from '@/components/PlayerStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Stats = () => {
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
            <PlayerStats />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Stats;
