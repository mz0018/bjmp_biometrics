import { Link } from "react-router-dom";
import { LogIn, Camera } from "lucide-react";

export default function AppContent() {
  const buttons = [
    {
      to: "/verify",
      label: "Open Verification Camera",
      icon: Camera,
      bg: "bg-[#002868] hover:bg-[#001F4F]",
    },
    {
      to: "/admin",
      label: "Admin Sign In",
      icon: LogIn,
      bg: "bg-[#BF0A30] hover:bg-[#990820]",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center grayscale blur-sm"
        style={{ backgroundImage: "url('/img/main-bg.webp')" }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex flex-col items-center max-w-3xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <img
            src="/img/BJMP-icon.png"
            alt="BJMP Logo"
            className="w-24 h-24 object-contain drop-shadow-lg"
          />
          <h1 className="text-2xl md:text-4xl font-bold leading-snug text-white text-center md:text-left">
            Bureau of Jail Management and Penology
          </h1>
        </div>

        <p className="mb-8 text-gray-300 text-sm md:text-lg italic leading-relaxed">
          An automated visitor log monitoring system for the BJMP, powered by
          facial recognition.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {buttons.map(({ to, label, icon: Icon, bg }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center justify-center gap-2 min-w-[240px] h-12 rounded-sm font-medium shadow-md transition-all duration-200 text-white ${bg}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>

        <footer className="mt-6 pt-4 border-t border-white/20 text-sm text-gray-300 flex flex-col md:flex-row items-center justify-center gap-2">
          <span>
            © {new Date().getFullYear()} BJMP | Secure Facial Recognition System
          </span>
          <a
            href="https://bjmp.gov.ph/bjmp-profile/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-300 hover:underline"
          >
            Official BJMP Profile
          </a>
        </footer>
      </div>
    </main>
  );
}
