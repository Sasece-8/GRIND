import { useEffect, useState } from "react";
import api from "../lib/axios.js";
import CourseCard from "../components/CourseCard.jsx";
import { Search, Filter } from "lucide-react";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get("/course");
                setCourses(res.data.courses || []);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#0f172a] min-h-screen pt-28 pb-20 text-white">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="text-center md:text-left mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sans">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">All Courses</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Discover a wide range of courses tailored to help you master new skills and advance your career.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-12">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses by title..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No courses found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
