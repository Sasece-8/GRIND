import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, Users, Award, BookOpen, Video, FileText, CheckCircle, Star, Play, Lock, Plus } from "lucide-react";
import api from "../lib/axios.js";
import VideoPlayer from "../components/VideoPlayer";
import AddLectureModal from "../components/AddLectureModal"; // Added import
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEducator, setIsEducator] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showAddLectureModal, setShowAddLectureModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState(null);

  const fetchCourseData = async () => {
    try {
      const courseRes = await api.get(`/course/${courseId}`);
      const courseData = courseRes.data.course;
      setCourse(courseData);

      // Check if user is the educator
      if (user && courseData.educator._id === user._id) {
        setIsEducator(true);
      }

      // Check if user is enrolled
      if (user) {
        try {
          const enrollmentRes = await api.get(`/enrollment/check/${courseId}`);
          setIsEnrolled(enrollmentRes.data.isEnrolled);
        } catch (err) {
          console.error("Failed to check enrollment status");
        }
      }

      const sectionRes = await api.get(`/section/${courseId}`);
      console.log(sectionRes.data.sections)
      const sectionsData = sectionRes.data.sections || [];

      // Fetch lectures for each section
      const sectionsWithLectures = await Promise.all(
        sectionsData.map(async (section) => {
          try {
            const lectureRes = await api.get(`/lecture/${section._id}`);
            return {
              ...section,
              lectures: lectureRes.data.lectures || []
            };
          } catch (err) {
            console.error(`Failed to fetch lectures for section ${section._id}`);
            return {
              ...section,
              lectures: []
            };
          }
        })
      );

      setSections(sectionsWithLectures);
    } catch (err) {
      setError("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);


  const [clientSecret, setClientSecret] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ... (previous useEffect)

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // If free course, enroll directly
    if (course.price === 0) {
      try {
        await api.post(`/enrollment/${courseId}`);
        alert("Enrolled successfully!");
        setIsEnrolled(true);
      } catch (err) {
        alert(err.response?.data?.error || "Enrollment failed");
      }
      return;
    }

    // If paid course, start payment flow
    try {
      const res = await api.post('/payment/create-payment-intent', {
        courseId: courseId
      });
      setClientSecret(res.data.clientSecret);
      setShowPaymentModal(true);
    } catch (err) {
      console.error("Error creating payment intent:", err);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  const onPaymentSuccess = async (paymentIntentId) => {
    try {
      await api.post(`/enrollment/${courseId}`, {
        paymentIntentId
      });
      alert("Payment successful! You are now enrolled.");
      setIsEnrolled(true);
      setShowPaymentModal(false);
    } catch (err) {
      alert("Payment succeeded but enrollment failed. Please contact support.");
    }
  };

  const handleLectureClick = (lecture) => {
    // Only allow playing if user is enrolled, is educator, or lecture is free preview
    if (isEnrolled || isEducator || lecture.isPreviewFree) {
      setSelectedLecture(lecture);
    } else {
      alert("Please enroll in the course to access this lecture.");
    }
  };

  // Calculate course stats
  const totalLectures = sections.reduce(
    (acc, section) => acc + (section.lectures?.length || 0),
    0
  );

  const totalDuration = sections.reduce(
    (acc, section) =>
      acc + (section.lectures?.reduce((sum, lec) => sum + (lec.duration || 0), 0) || 0),
    0
  );

  // Format duration (in seconds) to readable format
  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/courses")}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-24 pb-20">
      {/* Video Player Modal */}
      {selectedLecture && (
        <VideoPlayer
          lecture={selectedLecture}
          onClose={() => setSelectedLecture(null)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && clientSecret && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Secure Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              {/* Note: CheckoutForm might need its own styling updates if it has internal styles */}
              <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
            </Elements>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex gap-3">
                <Link to="/courses" className="text-gray-400 hover:text-white transition-colors text-sm">Courses</Link>
                <span className="text-gray-600">/</span>
                <span className="text-indigo-400 text-sm font-medium">{course.category || "General"}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-sans">
                {course.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                {course.subtitle}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-400">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-white">{course.rating || 0} Rating</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-white">1,234 students</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                  <BookOpen className="w-4 h-4 text-fuchsia-400" />
                  <span className="text-white">{totalLectures} lectures</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-white capitalize">{course.level}</span>
                </div>
              </div>
            </div>

            {/* Mobile Thumbnail */}
            <div className="lg:hidden">
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"}
                alt={course.title}
                className="rounded-xl shadow-2xl w-full object-cover aspect-video border border-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="border-b border-white/10 px-2 pt-2">
                <nav className="flex space-x-2">
                  {["overview", "curriculum", "instructor"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${activeTab === tab
                        ? "bg-white/10 text-white border-b-2 border-indigo-500"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 md:p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">About this course</h2>
                      <p className="text-gray-300 leading-relaxed">
                        {course.description || "No description available."}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {sections.slice(0, 6).map((section, idx) => (
                          <div key={section._id || idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{section.title}</span>
                          </div>
                        ))}
                        {sections.length === 0 && (
                          <p className="text-gray-500 col-span-2">Content will be added soon.</p>
                        )}
                      </div>
                    </div>

                    {/* Course Requirements */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Requirements</h3>
                      <ul className="space-y-3 text-gray-400">
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></span>
                          <span>Basic understanding of the subject is helpful but not required</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></span>
                          <span>A computer with internet connection</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></span>
                          <span>Willingness to learn and practice</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div>
                    <div className="flex justify-between items-end mb-6">
                      <h2 className="text-2xl font-bold">Course Content</h2>
                      <div className="text-sm text-gray-400">
                        {sections.length} sections • {totalLectures} lectures
                        {totalDuration > 0 && ` • ${formatDuration(totalDuration)} total`}
                      </div>
                    </div>

                    {sections.length === 0 ? (
                      <p className="text-gray-500 text-center py-10 bg-white/5 rounded-xl border border-white/5">
                        No content available yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {sections
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((section, idx) => {
                            const sectionDuration = section.lectures?.reduce(
                              (sum, lec) => sum + (lec.duration || 0),
                              0
                            ) || 0;

                            return (
                              <details
                                key={section._id}
                                className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden open:bg-white/10 transition-colors"
                              >
                                <summary className="flex justify-between items-center cursor-pointer p-4 select-none hover:bg-white/5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">
                                      {idx + 1}
                                    </div>
                                    <span className="font-semibold text-white">
                                      {section.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                    {isEducator && (
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setTargetSectionId(section._id);
                                          setShowAddLectureModal(true);
                                        }}
                                        className="flex items-center gap-1 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded transition"
                                      >
                                        <Plus size={12} /> Add
                                      </button>
                                    )}
                                    <span>{section.lectures?.length || 0} lectures</span>
                                    {sectionDuration > 0 && (
                                      <span>{formatDuration(sectionDuration)}</span>
                                    )}
                                  </div>
                                </summary>

                                <div className="px-4 pb-4 pt-2 space-y-2 border-t border-white/5 mx-4">
                                  {section.lectures?.length > 0 ? (
                                    section.lectures
                                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                                      .map((lec, lecIdx) => {
                                        const canAccess = isEnrolled || isEducator || lec.isPreviewFree;

                                        return (
                                          <div
                                            key={lec._id}
                                            onClick={() => canAccess && handleLectureClick(lec)}
                                            className={`flex items-center justify-between py-3 px-3 rounded-lg transition group/lecture ${canAccess
                                              ? "hover:bg-white/10 cursor-pointer"
                                              : "opacity-50 cursor-not-allowed"
                                              }`}
                                          >
                                            <div className="flex items-center gap-3 flex-1">
                                              {canAccess ? (
                                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/lecture:bg-indigo-500 transition-colors">
                                                  <Play className="w-3 h-3 text-white ml-0.5" />
                                                </div>
                                              ) : (
                                                <Lock className="w-4 h-4 text-gray-500" />
                                              )}
                                              <span className="text-sm text-gray-300 group-hover/lecture:text-white transition-colors">
                                                {lec.order || lecIdx + 1}. {lec.title}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                              {lec.duration && (
                                                <span className="text-xs text-gray-500 group-hover/lecture:text-gray-400">
                                                  {formatDuration(lec.duration)}
                                                </span>
                                              )}
                                              {lec.isPreviewFree && (
                                                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                                  Free
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })
                                  ) : (
                                    <p className="text-gray-500 text-sm py-2 pl-2">
                                      No lectures added yet.
                                    </p>
                                  )}
                                </div>
                              </details>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-8">Your Instructor</h2>
                    <div className="bg-white/5 rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row gap-8 items-start">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                        <span className="text-3xl font-bold">
                          {course.educator?.username?.charAt(0) || "I"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl mb-1">
                          {course.educator?.username || 'Course Educator'}
                        </h3>
                        <p className="text-indigo-400 text-sm mb-4">
                          {course.educator?.email} • Expert Instructor
                        </p>

                        <div className="flex gap-6 mb-6 text-sm">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-lg">{course.rating || "4.9"}</span>
                            <span className="text-gray-500">Rating</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-lg">1,200+</span>
                            <span className="text-gray-500">Students</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-lg">5</span>
                            <span className="text-gray-500">Courses</span>
                          </div>
                        </div>

                        <h4 className="font-semibold mb-2 text-white">About the Instructor</h4>
                        <p className="text-gray-400 leading-relaxed text-sm">
                          Passionate about technology and education. With over 10 years of industry experience,
                          I strive to create high-quality, accessible learning content for students around the world.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Desktop Thumbnail */}
              <div className="hidden lg:block rounded-xl overflow-hidden shadow-2xl border border-white/10 group relative">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                  <Play className="w-12 h-12 text-white fill-current opacity-80" />
                </div>
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"}
                  alt={course.title}
                  className="w-full object-cover aspect-video transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Price Card */}
              <div className="glass-panel rounded-2xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Award size={100} className="text-indigo-500 transform rotate-12 translate-x-4 -translate-y-4" />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">Total Price</p>
                    <p className="text-4xl font-bold text-white">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </p>
                  </div>
                  {course.price > 0 && (
                    <div className="text-right">
                      <p className="text-lg text-gray-500 line-through decoration-red-500/50">
                        ₹{Math.round(course.price * 1.5)}
                      </p>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">33% OFF</span>
                    </div>
                  )}
                </div>

                {isEnrolled || isEducator ? (
                  <button
                    disabled
                    className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 py-4 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    {isEducator ? "You're the Educator" : "Already Enrolled"}
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Enroll Now
                  </button>
                )}

                <div className="space-y-4 pt-6 border-t border-white/10 text-sm">
                  <p className="font-semibold text-white mb-2">This course includes:</p>
                  {[
                    { icon: Video, text: `${totalLectures} video lectures` },
                    { icon: Clock, text: "Lifetime access" },
                    { icon: Users, text: "Access on mobile & desktop" },
                    { icon: Award, text: "Certificate of completion" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                      <item.icon className="w-5 h-5 text-indigo-400" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddLectureModal
        isOpen={showAddLectureModal}
        onClose={() => setShowAddLectureModal(false)}
        sectionId={targetSectionId}
        onSuccess={() => {
          fetchCourseData();
        }}
      />
    </div>
  );
};

export default CourseDetails;