import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
    return (
        <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Image & Gradient */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                    alt="Abstract Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="max-w-2xl text-white space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-200">New Courses Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight font-sans">
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
                            Creative Skills
                        </span>
                    </h1>

                    <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                        Unlock your potential with expert-led courses in design, coding, and creative arts.
                        Join a community of thousands of learners today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            to="/courses"
                            className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
                        >
                            Start Learning
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>

                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-2 text-white">
                            <Play size={20} className="fill-current" />
                            Watch Demo
                        </button>
                    </div>

                    <div className="pt-8 flex items-center gap-8 text-gray-400 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-950 bg-gray-800"></div>
                                ))}
                            </div>
                            <span>10k+ Students</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★★★★★</span>
                            <span>4.9/5 Rating</span>
                        </div>
                    </div>
                </div>

                {/* Right side floating elements (Glass Cards) */}
                <div className="hidden md:block relative h-[600px]">
                    <div className="absolute top-10 right-10 w-72 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl animate-float" style={{ animationDelay: '0s' }}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl">🎨</div>
                            <div>
                                <h4 className="font-bold">UI/UX Design</h4>
                                <p className="text-xs text-gray-400">12 Lessons • 4h 30m</p>
                            </div>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="w-[70%] h-full bg-indigo-500 rounded-full"></div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 left-0 w-64 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl animate-float" style={{ animationDelay: '2s' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</div>
                            <div>
                                <p className="text-sm text-gray-300">Course Completed</p>
                                <p className="font-bold">Web Development</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-20 right-20 w-80 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl animate-float" style={{ animationDelay: '4s' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold">Weekly Progress</h4>
                            <span className="text-green-400 text-sm">+24%</span>
                        </div>
                        <div className="flex items-end justify-between gap-2 h-24">
                            {[40, 70, 50, 90, 60, 80].map((h, i) => (
                                <div key={i} className="w-full bg-white/10 rounded-t-sm relative group">
                                    <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
