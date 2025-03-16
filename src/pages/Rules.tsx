
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useTournamentStore } from '@/store/tournamentStore';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText } from 'lucide-react';

// قائمة القوانين والإرشادات النموذجية
const rulesData = [
  {
    id: 'general',
    title: 'القوانين العامة',
    items: [
      'مدة المباراة 90 دقيقة مقسمة على شوطين مدة كل منهما 45 دقيقة',
      'يحق لكل فريق إجراء 5 تبديلات كحد أقصى خلال المباراة',
      'يتكون كل فريق من 11 لاعب أساسي و7 لاعبين احتياط',
      'في حالة التعادل في الأدوار الإقصائية، يتم اللجوء مباشرة إلى ركلات الترجيح',
      'تطبق قوانين الاتحاد الدولي لكرة القدم (فيفا) في جميع المباريات',
    ]
  },
  {
    id: 'groups',
    title: 'مرحلة المجموعات',
    items: [
      'تتكون البطولة من 4 مجموعات، في كل مجموعة 3 فرق',
      'يتأهل الفريقان الأول والثاني من كل مجموعة إلى الدور ربع النهائي',
      'يتم ترتيب الفرق حسب: النقاط، ثم فارق الأهداف، ثم الأهداف المسجلة',
      'في حالة التساوي في كل ما سبق، يتم إجراء قرعة لتحديد المراكز',
    ]
  },
  {
    id: 'knockout',
    title: 'الأدوار الإقصائية',
    items: [
      'تقام مباريات الأدوار الإقصائية بنظام خروج المغلوب من مباراة واحدة',
      'في حالة التعادل يتم اللجوء مباشرة إلى ركلات الترجيح (5 ركلات لكل فريق)',
      'إذا استمر التعادل بعد الركلات الخمس، تستمر ركلات الترجيح بنظام التعادل المفاجئ',
    ]
  },
  {
    id: 'discipline',
    title: 'الانضباط والعقوبات',
    items: [
      'البطاقة الصفراء: إنذار للاعب',
      'البطاقتان الصفراوان: طرد اللاعب من المباراة ويحرم من المشاركة في المباراة التالية',
      'البطاقة الحمراء المباشرة: طرد اللاعب ويحرم من المشاركة في المباراتين التاليتين',
      'اللاعب الذي يحصل على بطاقتين صفراوين في مباريات مختلفة: يحرم من المشاركة في المباراة التالية',
    ]
  },
];

const Rules = () => {
  const { tournamentName, organizer } = useTournamentStore();
  const [activeTab, setActiveTab] = useState('general');

  const handleDownloadRules = () => {
    // إنشاء محتوى ملف النص
    const content = `
قوانين وتعليمات بطولة ${tournamentName}
المنظم: ${organizer}
--------------------------------------------

${rulesData.map(section => {
  return `
${section.title}:
${section.items.map(item => `• ${item}`).join('\n')}
  `;
}).join('\n')}

--------------------------------------------
© ${organizer} - ${new Date().getFullYear()}
    `;
    
    // إنشاء ملف للتنزيل
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // إنشاء رابط وهمي للتنزيل
    const a = document.createElement('a');
    a.href = url;
    a.download = `قوانين-بطولة-${tournamentName}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // تنظيف
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-tournament-accent">قوانين وتعليمات البطولة</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleDownloadRules}>
            <Download size={16} />
            <span>تحميل القوانين</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{tournamentName}</CardTitle>
            <CardDescription>المنظم: {organizer}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                {rulesData.map(section => (
                  <TabsTrigger key={section.id} value={section.id}>
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {rulesData.map(section => (
                <TabsContent key={section.id} value={section.id} className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText size={20} className="text-tournament-accent" />
                    {section.title}
                  </h3>
                  <ul className="space-y-2 list-disc list-inside mr-4">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-gray-200">{item}</li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Rules;
