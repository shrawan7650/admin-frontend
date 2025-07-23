'use client';

import { useLiveTime } from '@/utils/useLiveTime';

export default function LiveClock() {
  const time = useLiveTime();

  return (
    <div className=" static top-4 right-4 z-50 px-3 text-center py-1 bg-card/70 text-xs sm:text-sm text-muted-foreground border border-border rounded-md backdrop-blur-sm shadow-sm font-mono">
      🕒 {time}
    </div>
  );
}
