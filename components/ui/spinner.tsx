// components/ui/spinner.tsx
import { Loader2 } from "lucide-react";

export const Spinner = ({ className = "" }: { className?: string }) => (
  <div className={`animate-spin text-muted-foreground ${className}`}>
    <Loader2 className="w-6 h-6" />
  </div>
);
