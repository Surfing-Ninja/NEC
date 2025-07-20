"use client";
import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

interface Review {
  id: string;
  necName: string;
  teacherName: string;
  rating: number;
  review: string;
  timestamp: { seconds: number; nanoseconds: number };
}

export default function SearchPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const q = query(collection(db, "necReviews"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Review[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  // Optimize filtering with useMemo
  const filteredReviews = useMemo(() =>
    reviews.filter((r) =>
      r.necName.toLowerCase().includes(search.toLowerCase())
    ), [reviews, search]
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2 sm:px-4">
      <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10 flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-2">
          <h1 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-300 tracking-tight drop-shadow">Search Reviews</h1>
          <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors">← Back to Home</Link>
        </div>
        <input
          type="text"
          placeholder="Search by NEC name..."
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No reviews found for this NEC.</div>
          ) : (
            filteredReviews.map((r) => (
              <div
                key={r.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white/80 dark:bg-gray-800/80 shadow hover:shadow-xl transition-shadow duration-300 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1 sm:gap-0">
                  <span className="font-bold text-lg text-blue-700 dark:text-blue-300">{r.necName}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(r.timestamp?.seconds * 1000).toLocaleString()}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{r.teacherName}</span>
                  <span className="text-yellow-400 text-lg">
                    {"★".repeat(r.rating)}
                    <span className="text-gray-300 dark:text-gray-700">{"★".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                <div className="italic text-gray-700 dark:text-gray-200">{r.review}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 