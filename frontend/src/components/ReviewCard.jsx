import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/20">
                    <img
                        src={review.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name}`}
                        alt={review.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wider text-sm">
                        {review.name}
                    </h4>
                    <p className="text-xs text-gray-400">{review.role || "Student"}</p>
                </div>
            </div>

            <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={`${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                ))}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed italic">
                "{review.comment}"
            </p>
        </div>
    );
};

export default ReviewCard;
