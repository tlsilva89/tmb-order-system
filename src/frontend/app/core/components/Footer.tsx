import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-800/60 text-center text-slate-500 text-sm">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
        <p className="flex items-center gap-1.5">
          Powered by <span className="font-semibold text-slate-300">Thiago Luciano</span>
          <FaHeart className="text-red-500 text-xs animate-pulse" />
        </p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <a 
            href="https://github.com/tlsilva89" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
          >
            <FaGithub className="text-lg" />
            <span className="hidden md:inline">GitHub</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/tlsilva89/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
          >
            <FaLinkedin className="text-lg" />
            <span className="hidden md:inline">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}