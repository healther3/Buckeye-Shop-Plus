export default function Footer(){
    return (
        <footer className = "bg-gray-50 border-t border-gray-100 py-6 mt-auto">
        <div className = "max-w-6xl mx-auto px-6 text-center">
            <p className = "text-gray-500 text-sm">
                © {new Date().getFullYear()} Buckeye Shopping. All rights reserved.
            </p>
            <p className = "text-gray-400 text-xs mt-2">
                Designed for OSU students and faculties.
            </p>
            </div>
        </footer>


    )



}