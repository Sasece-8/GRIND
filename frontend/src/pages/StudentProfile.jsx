import { BookOpen, Clock, Award, User } from "lucide-react";

const StudentProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-6">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-3xl p-8 md:p-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="p-1 rounded-full bg-white/20 backdrop-blur-md">
                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30 text-white">
                                <span className="text-4xl font-bold">{user?.username?.charAt(0) || "S"}</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-bold text-white font-sans">{user?.username || "Student"}</h1>
                            <p className="text-indigo-100 text-lg">{user?.email}</p>
                            <div className="flex justify-center md:justify-start gap-3 pt-2">
                                <span className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/10 backdrop-blur-sm">
                                    {user?.role || "Student"} Account
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: BookOpen, label: "Enrolled Courses", value: "0", color: "text-blue-400", bg: "bg-blue-400/10" },
                        { icon: Clock, label: "Hours Learned", value: "0h", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                        { icon: Award, label: "Certificates", value: "0", color: "text-yellow-400", bg: "bg-yellow-400/10" },
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center gap-5 hover:bg-white/10 transition-colors">
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* My Learning Section */}
                <div className="glass-panel rounded-3xl p-8 md:p-10 min-h-[400px]">
                    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">My Learning</h2>

                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <BookOpen className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No courses yet</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            You haven't enrolled in any courses yet. Explore our catalog to start your learning journey today.
                        </p>
                        <a href="/courses" className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
                            Browse Courses
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
