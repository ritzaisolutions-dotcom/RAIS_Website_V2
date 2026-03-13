import { PlusIcon } from 'lucide-react';

interface CornerAccentProps {
  className?: string;
}

export function CornerAccent({ className = '' }: CornerAccentProps) {
  return (
    <>
      <PlusIcon className={`absolute -top-[1px] -left-[1px] w-3 h-3 text-industrial-orange ${className}`} />
      <PlusIcon className={`absolute -top-[1px] -right-[1px] w-3 h-3 text-industrial-orange ${className}`} />
      <PlusIcon className={`absolute -bottom-[1px] -left-[1px] w-3 h-3 text-industrial-orange ${className}`} />
      <PlusIcon className={`absolute -bottom-[1px] -right-[1px] w-3 h-3 text-industrial-orange ${className}`} />
    </>
  );
}
