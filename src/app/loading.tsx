import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]"> {/* Adjusted min-height to account for header/footer */}
      <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
  );
}
