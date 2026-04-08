import SignUpForm from '@/app/ui/sign-up-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    
    <main className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      

      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-300">
        

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join us to start shopping today
          </p>
        </div>


        <div className="mb-6">
          <SignUpForm />
        </div>


        <div className="text-center text-sm border-t border-gray-100 pt-6">
          <span className="text-gray-500">Already have an account? </span>
          <Link
            href="/login"
            className="font-medium text-red-700 hover:text-red-600 hover:underline transition-colors"
          >
            Log in here
          </Link>
        </div>

      </div>
    </main>
  );
}