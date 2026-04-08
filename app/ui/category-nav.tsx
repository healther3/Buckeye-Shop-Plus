'use client';

import Link from 'next/link';
import { inter } from './fonts';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navItems = [
  { name: 'All products', href: '/categories', icon: '🛍'},
  { name: 'Clothing', href: '/categories/clothing', icon: '👘' },
  { name: 'Furniture', href: '/categories/furniture', icon: '🛋️'},
  { name: 'Electronic product', href: '/categories/electronics', icon: '💻︎' },
  { name: 'Cosmetics', href: '/categories/beauty', icon: '💄' },
  { name: 'Beverage&snacks', href: '/categories/snacks', icon: '🧃' },
];

export default function CategoryNav() {
    const pathname = usePathname();
  return (
    <nav className={`${inter.className}w-full bg-[#fbfbfd] py-4 overflow-x-auto border-b border-gray-100 no-scrollbar`}
    >
      
      <ul className="flex justify-start md:justify-center items-start space-x-8 md:space-x-10 px-6 min-w-max mx-auto">
        
        {navItems.map((item) => {
            const isActive = pathname === item.href;
          return(
          <li key={item.name}>
            <Link 
                href={item.href} 
                className={clsx(
                  "group flex flex-col items-center min-w-[60px]",
                  { "pointer-events-none": isActive }
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={clsx(
                  "h-[54px] w-full flex items-end justify-center mb-1 transition-all duration-300",
                  isActive ? "-translate-y-1" : "group-hover:-translate-y-1"
                )}>
                  <span className={clsx(
                    "text-4xl transition-all duration-300 cursor-default select-none",
                    isActive ? "filter grayscale-0" : "filter grayscale group-hover:grayscale-0"
                  )}>
                    {item.icon}
                  </span>
                </div>
                
                <span className={clsx(
                  "text-[12px] font-normal tracking-tight transition-colors duration-300 whitespace-nowrap",
                  isActive ? "text-[#0066cc]" : "text-[#1d1d1f] group-hover:text-[#0066cc]"
                )}>
                  {item.name}
                </span>
                <span className="h-[14px] mt-1 block"></span>
              </Link>
          </li>
        );
        })}
      </ul>
    </nav>
  );
}