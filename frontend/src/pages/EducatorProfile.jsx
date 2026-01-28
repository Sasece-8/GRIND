import { BarChart, Users, Star, Plus, Briefcase, User, Settings, CreditCard, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../lib/axios";

const EducatorProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalStudents, setTotalStudents] = useState(0);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get(`/course/educator/${user._id}`);
                setCourses(res.data.courses);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const res = await api.get(`/educator/stats/${user._id}`);
                setTotalStudents(res.data.totalStudents);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };

        if (user?._id) {
            fetchCourses();
            fetchStats();
        }
    }, [user?._id]);

    return (
        <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-900 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="p-1 rounded-full bg-white/20 backdrop-blur-md">
                                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30 text-white">
                                    <span className="text-4xl font-bold">{user?.username?.charAt(0) || "E"}</span>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold text-white font-sans">{user?.username || "Educator"}</h1>
                                <p className="text-emerald-100 mt-1 mb-3">{user?.email}</p>
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/10">
                                    Certified Instructor
                                </span>
                            </div>
                        </div>
                        <Link to="/educator/dashboard">
                            <button className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-all transform hover:-translate-y-1 flex items-center gap-2">
                                <Briefcase size={20} />
                                Dashboard
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { icon: Users, label: "Total Students", value: totalStudents, color: "text-blue-400", bg: "bg-blue-400/10" },
                        { icon: BarChart, label: "Course Views", value: "0", color: "text-purple-400", bg: "bg-purple-400/10" },
                        { icon: Star, label: "Avg Rating", value: "N/A", color: "text-yellow-400", bg: "bg-yellow-400/10" },
                        { icon: Briefcase, label: "Total Courses", value: courses.length, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
                            </div>
                            <p className="text-2xl font-bold text-white pl-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-panel rounded-3xl p-8 border border-white/5">
                            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white">My Courses</h2>
                                <Link to="/create-course" className="text-emerald-400 font-medium hover:text-emerald-300 text-sm flex items-center gap-1 transition-colors">
                                    <Plus size={16} /> Create New
                                </Link>
                            </div>

                            {loading ? (
                                <div className="text-center py-12 text-gray-400">Loading courses...</div>
                            ) : courses.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {courses.map((course) => (
                                        <Link to={`/course/${course._id}`} key={course._id} className="group border border-white/5 bg-white/5 rounded-xl p-4 flex gap-5 hover:bg-white/10 transition-all hover:scale-[1.01]">
                                            <div className="w-32 h-20 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                                <img
                                                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white truncate pr-4 group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                                                <p className="text-sm text-gray-400 line-clamp-1 mt-1 mb-3">{course.subtitle || course.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-emerald-400">
                                                        {course.price === 0 ? "Free" : `₹${course.price}`}
                                                    </span>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${course.isPublished
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                        }`}>
                                                        {course.isPublished ? "Published" : "Draft"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                        <Plus className="text-gray-400" size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Create your first course</h3>
                                    <p className="text-gray-400 max-w-sm mx-auto mt-2 mb-6 text-sm">
                                        Share your knowledge with millions of students around the world.
                                    </p>
                                    <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-600/20">
                                        Create Course
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-panel rounded-3xl p-6 border border-white/5">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Settings size={18} className="text-gray-400" /> Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { icon: Edit, label: "Edit Profile" },
                                    { icon: Settings, label: "Account Settings" },
                                    { icon: CreditCard, label: "Payment Methods" },
                                ].map((action, idx) => (
                                    <button key={idx} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-3 group">
                                        <action.icon size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducatorProfile;
