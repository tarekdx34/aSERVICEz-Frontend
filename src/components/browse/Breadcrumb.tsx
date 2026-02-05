import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  isRTL?: boolean;
}

export function Breadcrumb({ items, isRTL = true }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 py-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-teal-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight 
              className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} 
            />
          )}
        </div>
      ))}
    </nav>
  );
}
