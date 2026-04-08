import Link from 'next/link';

export default function CreateSuccess()
{
   return (
  <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
    
    <div className="text-9xl mb-6 animate-bounce">
      🎉
    </div>

    <h1 className="text-4xl font-bold text-gray-900 mb-8">
      Create Success!
    </h1>

    <div className="flex flex-col sm:flex-row gap-6 text-sm font-medium text-gray-500">
      <Link 
        href="./" 
        className="hover:text-red-700 transition-colors flex items-center justify-center gap-1"
      >
        <span>&larr;</span> Keep creating products?
      </Link>
      
      <Link 
        href="/" 
        className="hover:text-red-700 transition-colors flex items-center justify-center gap-1"
      >
        <span>&larr;</span> Back to Homepage
      </Link>
    </div>

  </div>
);

}