
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useTournamentStore } from "@/store/tournamentStore";
import GroupTable from "@/components/GroupTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

const Groups = () => {
  const { calculateStandings, setQualifiedTeams, tournamentName, organizer } = useTournamentStore();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  useEffect(() => {
    // حساب ترتيب المجموعات عند تحميل الصفحة
    calculateStandings();
  }, [calculateStandings]);
  
  const handleQualifyTeams = () => {
    setQualifiedTeams();
    toast.success("تم تأهيل الفرق إلى الأدوار الإقصائية بنجاح");
  };

  const downloadAllGroups = async () => {
    setIsGeneratingImage(true);
    toast.info("جاري تجهيز صورة جميع المجموعات...");
    
    try {
      // Create a container for all groups
      const container = document.createElement('div');
      container.style.width = '1200px';
      container.style.padding = '20px';
      container.style.backgroundColor = '#0f1e45';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '20px';
      
      // Add title
      const title = document.createElement('h1');
      title.innerText = `ترتيب المجموعات - ${tournamentName}`;
      title.style.color = 'white';
      title.style.textAlign = 'center';
      title.style.margin = '10px 0';
      title.style.fontWeight = 'bold';
      title.style.fontSize = '32px';
      container.appendChild(title);
      
      // Create a grid for groups
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      grid.style.gap = '20px';
      container.appendChild(grid);

      // Get all group tables
      const groups = ['A', 'B', 'C', 'D'];
      for (const group of groups) {
        const groupElement = document.getElementById(`group-${group}-table`);
        if (groupElement) {
          const clone = groupElement.cloneNode(true) as HTMLElement;
          
          // Create a wrapper for each group
          const wrapper = document.createElement('div');
          wrapper.style.backgroundColor = '#0f1e45';
          wrapper.style.borderRadius = '8px';
          wrapper.style.overflow = 'hidden';
          wrapper.appendChild(clone);
          
          grid.appendChild(wrapper);
        }
      }
      
      // Add organizer footer
      if (organizer) {
        const footer = document.createElement('div');
        footer.innerText = organizer;
        footer.style.color = 'white';
        footer.style.textAlign = 'center';
        footer.style.marginTop = '10px';
        container.appendChild(footer);
      }
      
      // Add decorative elements
      const decorElement1 = document.createElement('div');
      decorElement1.style.position = 'absolute';
      decorElement1.style.bottom = '20px';
      decorElement1.style.right = '20px';
      decorElement1.style.width = '100px';
      decorElement1.style.height = '4px';
      decorElement1.style.backgroundColor = '#ff4081';
      container.appendChild(decorElement1);
      
      // Temporarily add to document to render
      document.body.appendChild(container);
      
      // Generate image
      const canvas = await html2canvas(container, {
        backgroundColor: '#0f1e45',
        scale: 1.5,
        logging: true,
        useCORS: true,
        allowTaint: true,
      });
      
      // Remove temporary container
      document.body.removeChild(container);
      
      // Save image
      canvas.toBlob(blob => {
        if (blob) {
          saveAs(blob, `ترتيب-جميع-المجموعات-${tournamentName}.png`);
          toast.success("تم تحميل صورة جميع المجموعات بنجاح");
        }
      });
    } catch (error) {
      console.error("Error generating groups image:", error);
      toast.error("حدث خطأ أثناء تجهيز صورة المجموعات");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap gap-2 justify-between items-center">
        <h1 className="text-2xl font-bold">المجموعات</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            onClick={downloadAllGroups}
            disabled={isGeneratingImage}
            className="flex items-center gap-1"
          >
            <Download size={16} />
            <span>تحميل جميع المجموعات</span>
          </Button>
          <Button onClick={handleQualifyTeams}>
            تأهيل الفرق للأدوار الإقصائية
          </Button>
        </div>
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
