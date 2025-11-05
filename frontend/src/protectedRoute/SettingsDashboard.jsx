import { useState, useEffect, lazy } from "react";
import { Shield, BookUser } from "lucide-react";

const PasswordSecurity = lazy(() => import("../helpers/PasswordSecurity"));
const PersonalDetails = lazy(() => import("../helpers/PersonalDetails"));

const SettingsDashboard = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const tabs = [
    {
      title: "Password and security",
      subtitle:
        "Manage your passwords, login preferences and recovery methods.",
      content: <PasswordSecurity admin={admin} />,
      icon: <Shield size={28} className="text-[#002868]" />,
    },
    {
      title: "Personal details",
      subtitle:
        "Our System uses this information to verify your identity and to keep our community safe.",
      content: <PersonalDetails />,
      icon: <BookUser size={28} className="text-[#002868]" />,
    },
  ];

  return (
    <section className="p-6 min-h-[100dvh] flex flex-col gap-8 overflow-hidden">
      {admin &&
        tabs.map((tab) => (
          <div key={tab.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">{tab.icon}</div>

              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-[#002868] leading-none">
                  {tab.title}
                </h2>
                <span className="text-xs text-gray-600">
                  {tab.subtitle}
                </span>
              </div>
            </div>

            <div className="pl-8">{tab.content}</div>
          </div>
        ))}
    </section>
  );
};

export default SettingsDashboard;
