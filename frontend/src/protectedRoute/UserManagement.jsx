import useUserManagement from "../hooks/useUserManagement";
import ButtonUpdate from "../helpers/ButtonUpdate";

const UserManagement = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, filteredData } = useUserManagement();

  return (
    <section className="p-6 min-h-[100dvh] flex flex-col overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 text-start">User Management</h2>
      <p className="text-gray-500 mb-4">
        Access and manage records of registered inmates and visitors.
      </p>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-sm ${activeTab === "inmates" ? "bg-[#002868] text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("inmates")}
        >
          Inmates
        </button>
        <button
          className={`px-4 py-2 rounded-sm ${activeTab === "visitors" ? "bg-[#002868] text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("visitors")}
        >
          Visitors
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={`Search ${activeTab}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-[#002868]"
      />

      {/* Separate Tables */}
      <div className="overflow-auto">
        {activeTab === "inmates" ? (
          filteredData.length > 0 ? (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Case Number</th>
                  <th className="p-2 border">Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((inmate) => (
                  <tr key={inmate._id} className="hover:bg-gray-50">
                    <td className="p-2 border capitalize">{inmate.lastname}, {inmate.firstname} {inmate.middleInitial}.</td>
                    <td className="p-2 border">{inmate.caseNumber}</td>
                    <td className="p-2 border"><ButtonUpdate id={inmate._id} userType={"inmate"} inmate={inmate} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No inmates found.</p>
          )
        ) : (
          filteredData.length > 0 ? (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((visitor) => (
                  <tr key={visitor._id} className="hover:bg-gray-50">
                    <td className="p-2 border capitalize">{visitor.visitor_info.name}</td>
                    <td className="p-2 border">{visitor.visitor_info.contact}</td>
                    <td className="p-2 border"><ButtonUpdate id={visitor._id} userType={"visitor"} visitor={visitor} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No visitors found.</p>
          )
        )}
      </div>
    </section>
  );
};

export default UserManagement;
