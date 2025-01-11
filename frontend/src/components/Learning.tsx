import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, PlayCircle, Leaf, Search, Sparkles, GraduationCap, Users, Target } from 'lucide-react';
import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Loader from './LoadingHamster';
import { learnAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '@/store/courseStore';

const lessons = [
  {
    id: 'esg-fundamentals',
    title: "ESG Investment Fundamentals",
    description: "Master the basics of environmental, social, and governance investing",
    duration: "2 hours",
    level: "Beginner",
    students: 1234,
    rating: 4.8,
    icon: Leaf,
    modules: ["ESG Basics", "Risk Assessment", "Portfolio Integration"],
    tags: ["ESG", "Fundamentals", "Investing"],
  },
  {
    id: 'sustainable-portfolio',
    title: "Building a Sustainable Portfolio",
    description: "Learn how to construct and manage a portfolio focused on sustainability",
    duration: "3 hours",
    level: "Intermediate",
    students: 856,
    rating: 4.9,
    icon: Target,
    modules: ["Portfolio Theory", "Risk Management", "Performance Tracking"],
    tags: ["Portfolio", "Management", "Sustainable"],
  },
  {
    id: 'impact-investing',
    title: "Impact Investing Strategies",
    description: "Advanced techniques for investing with environmental and social impact",
    duration: "4 hours",
    level: "Advanced",
    students: 642,
    rating: 4.7,
    icon: Users,
    modules: ["Impact Measurement", "Strategy Development", "Case Studies"],
    tags: ["Impact", "Strategy", "Advanced"],
  },
];

const LessonCard = ({ lesson, index, onClick }: { lesson: any, index: number, onClick?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg hover:shadow-green-500/5 
                 transition-all duration-300 group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-50 text-green-600">
            {lesson.icon && <lesson.icon className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-1">{lesson.title}</h3>
            <p className="text-black/60 font-light">{lesson.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-black/40" />
          <span className="text-sm text-black/60">{lesson.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-black/40" />
          <span className="text-sm text-black/60">{lesson.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-black/40" />
          <span className="text-sm text-black/60">{lesson.students} students</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {lesson.tags.map((tag: string) => (
          <span 
            key={tag}
            className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= Math.floor(lesson.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-black/60">{lesson.rating}</span>
        </div>
        <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors">
          Start Learning
          <PlayCircle className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default function Learning() {
  const [anonAadhaar] = useAnonAadhaar();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const navigate = useNavigate();
  const { courseData, setCourseData } = useCourseStore();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  const handleGenerateCourse = async () => {
    if (!query.trim()) {
      toast.error("Please enter a topic to learn about");
      return;
    }

    try {
      setIsLoading(true);
      const response = await learnAPI.generateCourse(query);
      setCourseData(response);
    } catch (error) {
      toast.error("Failed to generate course");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterClick = (chapterKey: string) => {
    if (!courseData) return;
    
    navigate(`/learn/${chapterKey.replace('chapter', '')}`, {
      state: { 
        title: courseData.syllabus[chapterKey],
        content: courseData.chapters[chapterKey], 
        questions: courseData.questions[chapterKey]?.split('\n').filter(q => q.trim()) || []
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-black mb-4"
          >
            Learn Sustainable Investing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-black/60 font-light"
          >
            Master the art of sustainable investing through our comprehensive courses
          </motion.p>
        </div>

        {selectedLesson ? (
          <>
            {/* Course Generation Section */}
            {anonAadhaar?.status === "logged-in" && (
              <div className="max-w-3xl mx-auto mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-black">Generate Custom Chapter</h3>
                    <Button 
                      onClick={() => setSelectedLesson(null)}
                      variant="outline"
                      className="text-black"
                    >
                      ← Back to Lessons
                    </Button>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What would you like to learn about?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
                                text-black placeholder:text-black/40"
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5" />
                    </div>
                    <Button 
                      onClick={handleGenerateCourse} 
                      disabled={isLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-medium
                              transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
                    >
                      Generate
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Generated Chapters */}
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 mb-16">
                  {courseData && Object.keys(courseData.syllabus).map((chapterKey, index) => (
                    <motion.div
                      key={chapterKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg hover:shadow-green-500/5 
                              transition-all duration-300 cursor-pointer"
                      onClick={() => handleChapterClick(chapterKey)}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-bold text-black">
                          {courseData.syllabus[chapterKey]}
                        </h3>
                      </div>
                      <p className="text-black/60 pl-14">
                        {courseData.chapters[chapterKey].split('\n')[0]}...
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Lessons Grid */
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-8 mb-16">
              {lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  onClick={() => setSelectedLesson(lesson.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Learning Path */}
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-sm border"
          >
            <h3 className="text-2xl font-bold text-black mb-4">Your Learning Path</h3>
            <p className="text-black/60 font-light mb-6">
              Complete all courses to become a certified sustainable investment expert
            </p>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: '55%' }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-black/60">Progress: 55%</span>
              <span className="text-sm font-medium text-green-600">4/8 Courses</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 