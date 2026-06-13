import { cn } from '@/lib/utils';
import { getCategoryLabel, getCategoryColor } from '@/utils';

interface CategoryBadgeProps {
  category: string | null;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getCategoryColor(category),
        className
      )}
    >
      {getCategoryLabel(category)}
    </span>
  );
}
