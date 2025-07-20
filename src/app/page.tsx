"use client";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";

interface Review {
  id: string;
  necName: string;
  teacherName: string;
  rating: number;
  review: string;
  timestamp: { seconds: number; nanoseconds: number };
}

export default function Home() {
  const [necName, setNecName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const necNames = [
    "3D Printing",
    "Robotics",
    "Animation",
    "National Service Scheme - III",
    "National Cadet Corps - III",
    "Games & Sports - III",
    "Preliminary Journalism Skills",
    "Software Development - III",
    "SPSS For Data Analysis",
    "Imbalance Learning",
    "Technical Report Writing for Engineers",
    "LT Spice Tutorial for Circuit Simulation",
    "MATLAB Simulink",
    "Computational Methods for Engineers using MATLAB",
    "Basics of Campus Recruitment Training",
    "Professional Networking & CSR",
    "Craft practices in India",
    "Electronics for Inventors",
    "Computational Thinking for Problem Solving",
    "Technical writing",
    "Innovation: From Creativity to Entrepreneurship - III",
    "Control System Design using MATLAB",
    "Scientific Research Writing",
    "Solving Problems Using Modelling and Simulation",
    "Block Chain Technology",
    "Internet of Things",
    "Computer Vision AR/VR",
    "Real Time Model Making",
    "Hadoop Ecosystem",
    "Basics of AutoCAD and Ansys Software",
    "Managerial Aspect in Engineering",
    "Indian Knowledge System",
    "An Insight of Indian Thinker: Ancient to Modern",
  ];

  const teacherNames = [
    "Gavendra Norkey",
    "Karuna Markam",
    "Amit Manjhvar",
    "Surendra K. Chaurasia",
    "B.P.S. Bhadoria",
    "Anish P. Jacob",
    "Atul Chauhan",
    "Prachi Singh",
    "Bhagat Singh Raghuwanshi",
    "Minakshi",
    "Vikas Mahor",
    "Deepak Batham",
    "Nitin Upadhyay",
    "Trilok Pratap Singh",
    "Monica Chauhan Bhadoriya",
    "Gautam Bhadoriya",
    "Madhav Singh",
    "Sanjiv Sharma",
    "Nidhi Saxena",
    "Ankit Tiwari",
    "Vikram Saini",
    "Divya Chaturvedi",
    "Kuldeep Narayan Tripathi",
    "Vikram Rajpoot",
    "Nookala Venu",
    "Pawan Dubey",
    "Hemant Shrivastava",
    "Devesh Kumar Lal",
    "Sharad Agrawal",
    "Jyoti Vimal",
    "Smita Parte",
    "Tej Singh",
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const q = query(
        collection(db, "necReviews"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data: Review[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!necName || !teacherName || !rating || !review) return;
    setSubmitting(true);
    await addDoc(collection(db, "necReviews"), {
      necName,
      teacherName,
      rating,
      review,
      timestamp: Timestamp.now(),
    });
    setNecName("");
    setTeacherName("");
    setRating(0);
    setReview("");
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2 sm:px-4">
      <div className="w-full max-w-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10 flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-700 dark:text-indigo-300 tracking-tight drop-shadow">NEC Rating</h1>
          <Link href="/search" className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">🔍 Search Reviews</Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="necName" className="font-semibold text-gray-700 dark:text-gray-200">NEC Name</label>
            <select
              id="necName"
              name="necName"
              value={necName}
              onChange={e => setNecName(e.target.value)}
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-all"
            >
              <option value="">Select NEC Name</option>
              {necNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="teacherName" className="font-semibold text-gray-700 dark:text-gray-200">Teacher Name</label>
            <select
              id="teacherName"
              name="teacherName"
              value={teacherName}
              onChange={e => setTeacherName(e.target.value)}
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-all"
            >
              <option value="">Select Teacher</option>
              {teacherNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-colors duration-200 ${
                  rating >= star ? "text-yellow-400 scale-110" : "text-gray-300 dark:text-gray-700"
                } hover:text-yellow-500 focus:outline-none`}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                id={`rating-${star}`}
                name="rating"
              >
                ★
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="review" className="font-semibold text-gray-700 dark:text-gray-200">Review</label>
            <textarea
              id="review"
              name="review"
              placeholder="Write your review..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px] dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-all"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 text-white rounded-lg px-6 py-2 font-bold shadow hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-900 transition-all duration-200 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          {success && (
            <div className="text-green-600 dark:text-green-400 text-center font-semibold animate-fade-in">Review submitted!</div>
          )}
        </form>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Latest Reviews</h2>
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No reviews yet.</div>
          ) : (
            reviews.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white/80 dark:bg-gray-800/80 shadow hover:shadow-xl transition-shadow duration-300 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1 sm:gap-0">
                  <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">{r.necName}</span>
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
