"use client";
import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

interface LeaderboardProps {
  topN?: number;
  showTitle?: boolean;
  compact?: boolean;
}

interface Review {
  id: string;
  necName: string;
  teacherName: string;
  rating: number;
  review: string;
  timestamp: { seconds: number; nanoseconds: number };
}

interface TeacherStats {
  teacherName: string;
  avgRating: number;
  reviewCount: number;
}

const rankBadge = [
  "bg-yellow-400 text-yellow-900", // 1st
  "bg-gray-300 text-gray-800",    // 2nd
  "bg-amber-700 text-amber-100",  // 3rd
];

export default function Leaderboard({ topN = 5, showTitle = true, compact = false }: LeaderboardProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "necReviews"));
      const data: Review[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  // Group by teacherName and calculate stats
  const leaderboard: TeacherStats[] = useMemo(() => {
    const stats: Record<string, { sum: number; count: number }> = {};
    reviews.forEach((r) => {
      if (!stats[r.teacherName]) stats[r.teacherName] = { sum: 0, count: 0 };
      stats[r.teacherName].sum += r.rating;
      stats[r.teacherName].count += 1;
    });
    return Object.entries(stats)
      .map(([teacherName, { sum, count }]) => ({
        teacherName,
        avgRating: sum / count,
        reviewCount: count,
      }))
      .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
      .slice(0, topN);
  }, [reviews, topN]);

  return (
    <div className={`w-full ${compact ? "max-w-md" : "max-w-xl"} mx-auto bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col gap-4 animate-fade-in`}>
      {showTitle && (
        <h2 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-2">Teacher Leaderboard</h2>
      )}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading leaderboard...</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No reviews yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {leaderboard.map((t, i) => (
            <div
              key={t.teacherName}
              className={`flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/80 dark:bg-gray-800/80 shadow hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-[1.025] ${i < 3 ? rankBadge[i] : ""}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold px-3 py-1 rounded-full mr-2 ${i < 3 ? rankBadge[i] : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}>
                  {i + 1}
                  {i === 0 ? <span className="ml-1">🥇</span> : i === 1 ? <span className="ml-1">🥈</span> : i === 2 ? <span className="ml-1">🥉</span> : null}
                </span>
                <span className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-gray-100">{t.teacherName}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="flex items-center gap-1 text-lg font-bold text-yellow-500">
                  {t.avgRating.toFixed(2)}
                  <span className="text-yellow-400 text-xl">★</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t.reviewCount} review{t.reviewCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 