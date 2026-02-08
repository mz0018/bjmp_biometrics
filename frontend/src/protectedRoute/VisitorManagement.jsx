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

const VisitorManagement = () => {
  const {
    isLoading,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredData,
    filterBy,
    setFilterBy,
  } = useUserManagement();

  useEffect(() => {
    setActiveTab("visitors");
  }, [setActiveTab]);

  const uniqueVisitors = filteredData.filter(
    (item, index, self) =>
      index === self.findIndex(v => v.visitor_id === item.visitor_id)
  );

  const filterOptions = ["All", "Male", "Female"];

  return (
    <section className="p-6 min-h-[100dvh] bg-gray-50">
      <header className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-2 w-full">
          <div className="relative flex-[4]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search visitors by name..."
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
          to="/protectedRoute/register-face"
          className="
            bg-gray-800 text-white px-6 py-2 text-sm font-semibold
            inline-flex items-center gap-2
            whitespace-nowrap rounded
          "
        >
          <Navigation size={16} className="inline mr-1" />
          Register Visitor
        </Link>
      </header>

      <div className="bg-white shadow overflow-x-auto">
        {isLoading ? (
          <NoRecordsFoundFallback activeTab="visitors" />
        ) : uniqueVisitors.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Visitor Name</th>
                <th className="px-4 py-2 text-left font-medium">Contact</th>
                <th className="px-4 py-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {uniqueVisitors.map((item, index) => (
                <tr key={item._id} className={index % 2 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2 capitalize">
                    {item.visitor_info.name} ({item.visitor_info.gender})
                  </td>
                  <td className="px-4 py-2">
                    {item.visitor_info.contact}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="inline-flex items-center gap-2 whitespace-nowrap">
                      <ButtonUpdate userType="visitor" visitor={item} />
                      <ButtonViewUser userType="visitor" visitor={item} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No visitors found.
          </div>
        )}
      </div>

    </section>
  );
};

export default VisitorManagement;
