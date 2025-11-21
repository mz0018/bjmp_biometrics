import { Link } from "react-router-dom";
import useUserManagement from "../hooks/useUserManagement";
import ButtonUpdate from "../helpers/ButtonUpdate";
import ButtonViewUser from "../helpers/ViewUserInfo";
import NoRecordsFoundFallback from "../fallback/NoRecordsFoundFallback";
import { Search, Navigation, Settings, Eye, EyeOff, ChevronDown } from "lucide-react";

const UserManagement = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, filteredData, filterBy, setFilterBy } =
    useUserManagement();

  const filterOptions = activeTab === "inmates"
    ? ["All", "Detained", "Released", "Transferred", "On Trial", "Pending", "Escaped"]
    : ["All", "Male", "Female"];

  const tabs = [
    { id: "inmates", label: "Inmates", icon: Eye, iconInactive: EyeOff, link: "/protectedRoute/register-inmate", addText: "Add a new inmate" },
    { id: "visitors", label: "Visitors", icon: Eye, iconInactive: EyeOff, link: "/protectedRoute/register-face", addText: "Add a new visitor" },
  ];

  const tableHeaders = activeTab === "inmates"
    ? [
        { label: "Inmate Name", align: "start" },
        { label: "Case Number", align: "start" },
        { label: "Status", align: "start" },
        { label: "Options", align: "center", icon: <Settings size={16} /> },
      ]
    : [
        { label: "Visitor Name", align: "start" },
        { label: "Contact", align: "start" },
        { label: "Options", align: "center", icon: <Settings size={16} /> },
      ];

  const renderRow = (item, index) => {
    const isInmate = activeTab === "inmates";
    const name = isInmate
      ? `${item.lastname}, ${item.firstname} ${item.middleInitial}. (${item.gender})`
      : `${item.visitor_info.name} (${item.visitor_info.gender})`;
    const extra = isInmate ? item.caseNumber : item.visitor_info.contact;
    const status = isInmate ? item.status : null;

    return (
      <tr key={item._id} className={`hover:bg-gray-100 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
        <td className="border-b border-gray-300 px-4 py-2 capitalize truncate">{name}</td>
        <td className="border-b border-gray-300 px-4 py-2 truncate tracking-widest">{extra}</td>
        {isInmate && <td className="border-b border-gray-300 px-4 py-2 truncate">{status}</td>}
        <td className="border-b border-gray-300 px-4 py-2 text-center">
          <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <ButtonUpdate userType={activeTab.slice(0, -1)} {...{ [activeTab.slice(0, -1)]: item }} />
            <ButtonViewUser userType={activeTab.slice(0, -1)} {...{ [activeTab.slice(0, -1)]: item }} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <section className="p-6 min-h-[100dvh] flex flex-col overflow-hidden bg-gray-50">
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex gap-2">
            <div className="relative flex-[4]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500">
                <Search className="w-4 h-4" />
                <span className="mx-2 h-5 w-px bg-gray-300"></span>
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab} by name...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
                className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-400 placeholder:tracking-wider text-gray-700 transition"
              />
            </div>
            <div className="relative flex-[1.5]">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full pr-10 pl-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 cursor-pointer transition hover:border-gray-400"
                aria-label="Filter By"
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-2">
            {tabs.map(tab =>
              activeTab === tab.id && (
                <div key={tab.id} className="relative group">
                  <Link
                    to={tab.link}
                    className="bg-gray-800 inline-flex items-center gap-1 px-6 py-2 rounded-sm text-white transition cursor-pointer text-sm tracking-wider border border-gray-300 font-semibold"
                  >
                    <Navigation size={16} />
                    Go to {tab.label} Registration
                  </Link>
                  <span className="absolute bottom-full mb-1 right-0 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tab.addText}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200 -mb-px">
          {tabs.map(tab => {
            const active = activeTab === tab.id;
            const Icon = active ? tab.icon : tab.iconInactive;
            return (
              <button
                key={tab.id}
                className={`px-4 py-2 -mb-px text-sm font-medium cursor-pointer flex items-center gap-2 border-t border-l border-r rounded-t-sm ${
                  active ? "bg-white border-gray-200 text-gray-700 shadow" : "bg-gray-100 border-gray-200 text-gray-500"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="shadow-lg rounded-sm border border-gray-200 overflow-hidden mt-0 bg-white">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-[65dvh]">
            {filteredData.length > 0 ? (
              <table className="min-w-full table-fixed border-collapse border border-gray-300 text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    {tableHeaders.map((h) => (
                      <th key={h.label} className={`border-b border-gray-300 px-4 py-2 text-${h.align} font-medium tracking-wide`}>
                        {h.icon ? <div className="flex items-center justify-center gap-1">{h.icon} {h.label}</div> : h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(renderRow)}
                </tbody>
              </table>
            ) : <NoRecordsFoundFallback activeTab={activeTab} />}
          </div>
        </div>
        <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
          Showing <span className="font-semibold">{filteredData.length}</span> {filteredData.length === 1 ? "entry" : "entries"}
        </div>
      </div>
    </section>
  );
};

export default UserManagement;
