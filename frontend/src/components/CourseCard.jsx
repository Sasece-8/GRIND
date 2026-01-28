import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
    return (
        <Link
            to={`/course/${course._id}`}
            className="glass-panel rounded-2xl overflow-hidden group hover:no-underline transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-500/20"
        >
            <div className="relative overflow-hidden h-48">
                <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {course.title}
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-white/10 text-white/80 border border-white/5">
                        ⭐ {course.rating || "4.8"}
                    </span>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {course.description || "Master the skills you need to succeed in this comprehensive course designed for all levels."}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                            {course.instructor ? course.instructor.charAt(0) : "G"}
                        </div>
                        <span className="text-slate-400 text-xs">
                            {course.instructor || "Expert"}
                        </span>
                    </div>
                    <span className="text-white font-bold text-lg">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
