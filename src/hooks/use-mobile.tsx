
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // ضبط القيمة الأولية
    handleResize()
    
    // إضافة مستمع للأحداث
    window.addEventListener("resize", handleResize)
    
    // التنظيف
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // إذا كنا على الخادم أو لم يتم تحميل الصفحة بعد، نفترض أنه ليس جهاز محمول
  if (!isClient) return false
  
  return isMobile
}
