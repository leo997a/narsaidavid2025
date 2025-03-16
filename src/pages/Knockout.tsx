
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import KnockoutBracket from '@/components/KnockoutBracket';
import { useTournamentStore } from '@/store/tournamentStore';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const Knockout = () => {
  const { tournamentName, organizer } = useTournamentStore();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const downloadBracketAsImage = async () => {
    setIsGeneratingImage(true);
    toast.info("جاري تجهيز صورة الأدوار الإقصائية...");
    
    try {
      const element = document.getElementById('knockout-bracket');
      if (element) {
        const canvas = await html2canvas(element, { 
          backgroundColor: '#101935',
          scale: 1.5,
        });
        
        // Add tournament title and organizer
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(`الأدوار الإقصائية - ${tournamentName}`, canvas.width / 2, canvas.height - 20);
          
          if (organizer) {
            ctx.font = '18px Arial';
            ctx.fillText(organizer, canvas.width / 2, canvas.height - 50);
          }
        }
        
        canvas.toBlob(blob => {
          if (blob) {
            saveAs(blob, `الأدوار-الإقصائية-${tournamentName}.png`);
            toast.success("تم تحميل صورة الأدوار الإقصائية بنجاح");
          }
        });
      }
    } catch (error) {
      console.error("Error generating knockout image:", error);
      toast.error("حدث خطأ أثناء تجهيز صورة الأدوار الإقصائية");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-tournament-accent">الأدوار الإقصائية - {tournamentName}</h1>
          <Button 
            variant="outline" 
            onClick={downloadBracketAsImage}
            disabled={isGeneratingImage}
            className="flex items-center gap-1"
          >
            <Download size={16} />
            <span>تحميل صورة الأدوار الإقصائية</span>
          </Button>
        </div>
        
        <div id="knockout-bracket" className="w-full overflow-x-auto bg-tournament-navy/80 p-4 rounded-lg">
          <KnockoutBracket />
        </div>
      </div>
    </Layout>
  );
};

export default Knockout;
