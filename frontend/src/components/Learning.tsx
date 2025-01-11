import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Loader from './LoadingHamster';
import { learnAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '@/store/courseStore';

function News() {
  const [anonAadhaar] = useAnonAadhaar();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
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
    
    const chapterTitle = courseData.syllabus[chapterKey];
    const chapterContent = courseData.chapters[chapterKey];
    const chapterQuestions = courseData.questions[chapterKey];

    navigate(`/learn/${chapterKey.replace('chapter', '')}`, {
      state: { 
        title: chapterTitle,
        content: chapterContent, 
        questions: chapterQuestions?.split('\n').filter(q => q.trim()) || []
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Course Generator</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div className="grid gap-6">
          {/* Input Section */}
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to learn about?"
              className="flex-1 p-2 rounded bg-gray-700 text-white"
            />
            <Button onClick={handleGenerateCourse} disabled={isLoading}>
              Generate Course
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center">
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader />
              </div>
              <p className="mt-4 text-black">Generating course about: {query}</p>
            </div>
          )}

          {/* Course Content */}
          {courseData && !isLoading && (
            <div className="grid gap-4 grid-cols-1">
              {Object.keys(courseData.syllabus).map(chapterKey => (
                <div 
                  key={chapterKey} 
                  className="border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                >
                  <Button 
                    onClick={() => handleChapterClick(chapterKey)} 
                    className="w-full text-left p-6"
                    variant="ghost"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold block mb-2">
                          Chapter {chapterKey.replace('chapter', '')}
                        </span>
                        <p className="text-gray-500">{courseData.syllabus[chapterKey]}</p>
                      </div>
                      <span className="text-blue-400">→</span>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-300">
            Please sign in to access the course generator and learning materials.
          </p>
          <p className="mt-4 text-gray-400">
            Our course generator helps you create personalized learning paths for any topic.
          </p>
        </div>
      )}
    </div>
  );
}

export default News; 