'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function SearchBar({ placeholder }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // activate when user input change
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    
    // update page to 1 when search
    params.set('page', '1');

    if (term) {
      params.set('query', term); // set search term
    } else {
      params.delete('query');
    }

    // replace current url
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative w-full max-w-xl mb-8">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <span className="text-gray-400 text-xl">🔍</span>
      </div>

      {/* Input field */}
      <input
        type="text"
        className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all outline-none shadow-sm"
        placeholder={placeholder || "Search products..."}
        
        // default value from URL
        defaultValue={searchParams.get('query')?.toString()}
        
        // change url when input change
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Clear button
      */}
    </div>
  );
}