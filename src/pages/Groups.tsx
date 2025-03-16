
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useTournamentStore } from "@/store/tournamentStore";
import GroupTable from "@/components/GroupTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Groups = () => {
  const { calculateStandings, setQualifiedTeams } = useTournamentStore();
  
  useEffect(() => {
    // حساب ترتيب المجموعات عند تحميل الصفحة
    calculateStandings();
  }, [calculateStandings]);
  
  const handleQualifyTeams = () => {
    setQualifiedTeams();
    toast.success("تم تأهيل الفرق إلى الأدوار الإقصائية بنجاح");
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">المجموعات</h1>
        <Button onClick={handleQualifyTeams}>
          تأهيل الفرق للأدوار الإقصائية
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 animate-fade-in">
        <GroupTable group="A" />
        <GroupTable group="B" />
        <GroupTable group="C" />
        <GroupTable group="D" />
      </div>
    </Layout>
  );
};

export default Groups;
