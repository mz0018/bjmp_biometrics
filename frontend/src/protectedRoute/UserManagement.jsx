import useUserManagement from "../hooks/useUserManagement";
import ButtonUpdate from "../helpers/ButtonUpdate";
import ButtonViewUser from "../helpers/ViewUserInfo";
import NoRecordsFoundFallback from "../fallback/NoRecordsFoundFallback";
import { User, FileText, Phone, Settings, Eye, EyeOff, Search } from "lucide-react";

const UserManagement = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, filteredData } =
    useUserManagement();

  return (
    <section className="p-6 min-h-[100dvh] flex flex-col overflow-hidden">
      <header className="flex flex-col mb-6 gap-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder={`Search ${activeTab} by name...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm w-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-bjmp-yellow"
            aria-label="Search"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-sm text-sm font-medium cursor-pointer flex items-center gap-2 ${
              activeTab === "inmates"
                ? "bg-bjmp-blue text-gray-700 shadow-lg"
                : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => setActiveTab("inmates")}
          >
            {activeTab === "inmates" ? (
              <Eye size={16} />
            ) : (
              <EyeOff size={16} />
            )}
            Inmates
          </button>
          <button
            className={`px-4 py-2 rounded-sm text-sm font-medium cursor-pointer flex items-center gap-2 ${
              activeTab === "visitors"
                ? "bg-bjmp-blue text-gray-700 shadow-lg"
                : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => setActiveTab("visitors")}
          >
            {activeTab === "visitors" ? (
              <Eye size={16} />
            ) : (
              <EyeOff size={16} />
            )}
            Visitors
          </button>
        </div>
      </header>

      <div className="shadow-lg rounded-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "min(800px, 65dvh)",
            }}
          >
            {filteredData.length > 0 ? (
              <table className="min-w-full table-fixed border-collapse bg-white">
                <thead className="bg-white shadow-lg text-sm capitalize">
                  <tr>
                    {activeTab === "inmates" ? (
                      <>
                        <th className="px-4 py-3 text-start font-semibold tracking-wide">
                          <div className="flex items-center gap-2">
                            <User size={16} /> Inmate Name
                          </div>
                        </th>
                        <th className="px-4 py-3 text-start font-semibold tracking-wide">
                          <div className="flex items-center gap-2">
                            <FileText size={16} /> Case Number
                          </div>
                        </th>
                        <th className="px-4 py-3 w-[8%] text-center font-semibold tracking-wide">
                          <div className="flex items-center justify-center gap-2">
                            <Settings size={16} /> Options
                          </div>
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-start font-semibold tracking-wide">
                          <div className="flex items-center gap-2">
                            <User size={16} /> Visitor Name
                          </div>
                        </th>
                        <th className="px-4 py-3 text-start font-semibold tracking-wide">
                          <div className="flex items-center gap-2">
                            <Phone size={16} /> Contact
                          </div>
                        </th>
                        <th className="px-4 py-3 w-[8%] text-center font-semibold tracking-wide">
                          <div className="flex items-center justify-center gap-2">
                            <Settings size={16} /> Options
                          </div>
                        </th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody className="text-gray-700 text-sm leading-relaxed">
                  {activeTab === "inmates"
                    ? filteredData.map((inmate, index) => (
                        <tr
                          key={inmate._id}
                          className={`hover:bg-bjmp-yellow/10 transition ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-2 capitalize truncate">
                            {inmate.lastname}, {inmate.firstname}{" "}
                            {inmate.middleInitial}. ({inmate.gender})
                          </td>
                          <td className="px-4 py-2 truncate">
                            {inmate.caseNumber}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                              <ButtonUpdate userType={"inmate"} inmate={inmate} />
                              <ButtonViewUser userType={"inmate"} inmate={inmate} />
                            </div>
                          </td>
                        </tr>
                      ))
                    : filteredData.map((visitor, index) => (
                        <tr
                          key={visitor._id}
                          className={`hover:bg-bjmp-yellow/10 transition ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-2 capitalize truncate">
                            {visitor.visitor_info.name} ({visitor.visitor_info.gender})
                          </td>
                          <td className="px-4 py-2 truncate">
                            {visitor.visitor_info.contact}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                              <ButtonUpdate userType={"visitor"} visitor={visitor} />
                              <ButtonViewUser userType={"visitor"} visitor={visitor} />
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            ) : (
              <NoRecordsFoundFallback activeTab={activeTab} />
            )}
          </div>
        </div>

        <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
          Showing <span className="font-semibold">{filteredData.length}</span>{" "}
          {filteredData.length === 1 ? "entry" : "entries"}
        </div>
      </div>
    </section>
  );
};

export default UserManagement;
