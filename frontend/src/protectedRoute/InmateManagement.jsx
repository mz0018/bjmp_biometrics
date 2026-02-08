import { Link } from "react-router-dom";
import { useEffect } from "react";
import useUserManagement from "../hooks/useUserManagement";
import ButtonUpdate from "../helpers/ButtonUpdate";
import ButtonViewUser from "../helpers/ViewUserInfo";
import NoRecordsFoundFallback from "../fallback/NoRecordsFoundFallback";
import {
  Search,
  Navigation,
  ChevronDown,
} from "lucide-react";

const InmateManagement = () => {
  const {
    isLoading,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredData,
    filterBy,
    setFilterBy,
  } = useUserManagement();

  // lock page to inmates
  useEffect(() => {
    setActiveTab("inmates");
  }, [setActiveTab]);

  const filterOptions = [
    "All",
    "Detained",
    "Released",
    "Transferred",
    "On Trial",
    "Pending",
    "Escaped",
  ];

  return (
    <section className="p-6 min-h-[100dvh] bg-gray-50">
      {/* HEADER */}
      <header className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-2 w-full">
          <div className="relative flex-[4]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search inmates by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md text-sm bg-white shadow-sm focus:outline-none"
            />
          </div>

          <div className="relative flex-[1.5]">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-white w-full pr-10 pl-3 py-2 rounded-md text-sm appearance-none focus:outline-none text-gray-700 shadow-sm"
            >
              {filterOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <Link
          to="/protectedRoute/register-inmate"
          className="
            bg-gray-800 text-white px-6 py-2 text-sm font-semibold
            inline-flex items-center gap-2
            whitespace-nowrap rounded
          "
        >
          <Navigation size={16} />
          <span>Register Inmate</span>
        </Link>

      </header>

      {/* TABLE */}
      <div className="bg-white shadow overflow-x-auto">
        {isLoading ? (
          <NoRecordsFoundFallback activeTab="inmates" />
        ) : filteredData.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Inmate Name</th>
                <th className="px-4 py-2 text-left font-medium">Case Number</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item._id} className={index % 2 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2 capitalize">
                    {item.lastname}, {item.firstname} {item.middleInitial}. ({item.gender})
                  </td>
                  <td className="px-4 py-2">{item.caseNumber}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="inline-flex items-center gap-2 whitespace-nowrap">
                      <ButtonUpdate userType="inmate" inmate={item} />
                      <ButtonViewUser userType="inmate" inmate={item} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No inmates found.
          </div>
        )}
      </div>

    </section>
  );
};

export default InmateManagement;
