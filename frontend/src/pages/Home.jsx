import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/axios.js";
import HeroSection from "../components/HeroSection.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import CourseCard from "../components/CourseCard.jsx";

/* ---------------- DUMMY REVIEWS ---------------- */

const REVIEWS = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "UX Designer",
    rating: 5,
    comment: "The UI/UX design course completely changed my perspective on product design. The instructor's insights were invaluable!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Full Stack Developer",
    rating: 4,
    comment: "GRIND's web development path is very well-structured. I went from knowing basic HTML to building full-scale MERN apps.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Data Scientist",
    rating: 5,
    comment: "The machine learning modules were challenging but rewarding. Highly recommend for anyone looking to break into AI.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    id: 4,
    name: "Sarah Williams",
    role: "Project Manager",
    rating: 5,
    comment: "Found the project management course extremely practical. I'm already applying the techniques at my current job.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  }
];

/* ---------------- HOME PAGE ---------------- */

const Home = () => {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/course");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  const topCourses = courses.slice(0, 4);

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Top Courses */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-sans">Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Courses</span></h2>
            <p className="text-gray-400">Explore our most popular learning paths</p>
          </div>
          <Link to="/courses" className="text-indigo-400 hover:text-indigo-300 font-medium transition flex items-center gap-1">
            View All →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {topCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
          {/* Fallback if no courses */}
          {topCourses.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-10">Loading courses...</p>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Students", value: "15,000+" },
            { label: "Total Courses", value: "120+" },
            { label: "Expert Instructors", value: "50+" },
            { label: "Satisfaction Rate", value: "99%" },
          ].map((stat, idx) => (
            <div key={idx} className="p-6">
              <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-indigo-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* User Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-sans">
            What Our <span className="text-indigo-400">Students</span> Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their careers with GRIND.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 z-0"></div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
          alt="Team"
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50"
        />

        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-sans">
            Become an Educator
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Share your knowledge, inspire thousands of students, and earn by teaching what you love.
          </p>
          <Link
            to={
              !user
                ? "/login"
                : user.role === "educator"
                  ? "/educator/profile"
                  : "/educatorVerify"
            }
            className="inline-block bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl hover:scale-105 active:scale-95"
          >
            {user && user.role === "educator"
              ? "Go to Educator Profile"
              : "Start Teaching Today"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
