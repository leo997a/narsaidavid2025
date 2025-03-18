
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // ابدأ بافتراض أنه ليس جهازًا محمولًا، ثم تحقق بعد تحميل الصفحة
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

  return isMobile
}
