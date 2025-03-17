
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DateFormat = 'gregorian' | 'hijri';

interface DateFormatState {
  format: DateFormat;
  setFormat: (format: DateFormat) => void;
}

export const useDateFormatStore = create<DateFormatState>()(
  persist(
    (set) => ({
      format: 'gregorian',
      setFormat: (format) => set({ format }),
    }),
    {
      name: 'tournament-date-format',
    }
  )
);
