import { useState } from "react";
import api from "../lib/axios";

const EducatorRequest = () => {
  const [form, setForm] = useState({
    motivation: "",
    experience: "",
    expertise: "",
    portfolio: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!agreed) return;

    try {
      setLoading(true);
      setMessage("");

      await api.post("/educator/request", form);

      setMessage("Your educator request has been sent for admin review.");
      setForm({
        motivation: "",
        experience: "",
        expertise: "",
        portfolio: "",
      });
      setAgreed(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to send request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6 py-24 relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Become an Educator</h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Join our world-class team of instructors and share your knowledge with millions of students.
          </p>
        </div>

        {/* Motivation */}
        <div className="mb-6 space-y-2">
          <label className="block text-sm font-semibold text-gray-300 ml-1">
            Why do you want to become an educator?
          </label>
          <textarea
            name="motivation"
            value={form.motivation}
            onChange={handleChange}
            rows={4}
            required
            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm bg-black/20 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Share your teaching philosophy and motivation..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Experience */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Teaching Experience
            </label>
            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm bg-black/20 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors [&>option]:bg-[#0f172a]"
            >
              <option value="">Select experience</option>
              <option value="beginner">Beginner (0–1 years)</option>
              <option value="intermediate">Intermediate (1–3 years)</option>
              <option value="advanced">Advanced (3+ years)</option>
            </select>
          </div>

          {/* Expertise */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Areas of Expertise
            </label>
            <input
              type="text"
              name="expertise"
              value={form.expertise}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm bg-black/20 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="e.g. React, UX Design"
            />
          </div>
        </div>

        {/* Portfolio */}
        <div className="mb-8 space-y-2">
          <label className="block text-sm font-semibold text-gray-300 ml-1">
            Portfolio / LinkedIn (Optional)
          </label>
          <input
            type="url"
            name="portfolio"
            value={form.portfolio}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm bg-black/20 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="https://..."
          />
        </div>

        {/* Guidelines Card */}
        <div className="mb-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5">
          <h3 className="font-bold text-white mb-2 text-sm">
            Educator Guidelines
          </h3>
          <ul className="text-sm text-gray-300 space-y-1.5 list-none pl-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Original and high-quality content only
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              No copyrighted material
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Maintain professional standards
            </li>
          </ul>
        </div>

        {/* Agreement */}
        <div className="flex items-center gap-3 mb-8 pl-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-gray-600 bg-black/20 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
          />
          <p className="text-sm text-gray-400">
            I agree to the Terms & Conditions and review process.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!agreed || loading}
          className={`w-full py-4 rounded-xl font-bold transition shadow-lg ${agreed
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-600/25 hover:scale-[1.01] active:scale-[0.99]"
            : "bg-gray-700/50 text-gray-500 cursor-not-allowed border border-white/5"
            }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${message.includes("failed") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorRequest;
