import { useEffect, useState } from "react";
import api from "../lib/axios";
import { Check, X, User, Search, Filter, Shield } from "lucide-react";

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get("/educator/requests");
                setRequests(data);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleStatusUpdate = async (requestId, status) => {
        try {
            await api.put(`/educator/request/${requestId}`, { status });
            // Update local state
            setRequests((prev) =>
                prev.map((req) =>
                    req._id === requestId ? { ...req, status } : req
                )
            );
        } catch (error) {
            console.error(`Failed to ${status} request`, error);
            alert(`Failed to ${status} request`);
        }
    };

    const filteredRequests = requests.filter(req =>
        req.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.status.includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] p-6 pt-24">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Shield className="text-indigo-500" /> Admin Dashboard
                        </h1>
                        <p className="text-gray-400">Manage educator requests and platform activity</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Educator Requests <span className="text-sm font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded-md">{requests.filter(r => r.status === 'pending').length} Pending</span>
                        </h2>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Motivation</th>
                                    <th className="px-6 py-4">Experience</th>
                                    <th className="px-6 py-4">Expertise</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No requests found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr
                                            key={request._id}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                                        {request.user?.email?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{request.user?.email || "Unknown"}</p>
                                                        <p className="text-xs text-gray-500">ID: {request.user?._id?.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="truncate text-gray-300" title={request.motivation}>
                                                    {request.motivation}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="capitalize text-gray-300 bg-white/5 px-2 py-1 rounded text-sm border border-white/5">
                                                    {request.experience}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{request.expertise}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${request.status === "approved"
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                            : request.status === "rejected"
                                                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                        }`}
                                                >
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {request.status === "pending" ? (
                                                    <div className="flex items-center justify-center gap-2 opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleStatusUpdate(request._id, "approved")}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/30 rounded-lg transition-colors text-xs font-bold"
                                                        >
                                                            <Check size={14} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request._id, "rejected")}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 rounded-lg transition-colors text-xs font-bold"
                                                        >
                                                            <X size={14} /> Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-gray-600">-</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
