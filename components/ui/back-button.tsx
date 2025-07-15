import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './button';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`back-button ${className}`}
      size="sm"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}