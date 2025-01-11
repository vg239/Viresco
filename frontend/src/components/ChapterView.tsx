import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { BookOpen, Clock, Award, CheckCircle2, XCircle } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';
import { elevenLabsAPI } from '@/lib/elevenlabs';
import { useEffect, useRef } from 'react';

interface ChapterState {
  title: string;
  content: string;
  questions: string[];
}

const ChapterView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { title, content, questions } = location.state as ChapterState || {
    title: '',
    content: '',
    questions: []
  };

  const [answers, setAnswers] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<'content' | 'quiz'>('content');

  const { getCurrentCourse } = useCourseStore();
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const currentCourse = getCurrentCourse();

  useEffect(() => {
    if (currentCourse?.agentId && widgetContainerRef.current) {
      widgetContainerRef.current.innerHTML = elevenLabsAPI.getAgentWidget(currentCourse.agentId);
    }
  }, [currentCourse?.agentId]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you would typically validate answers against correct ones
    console.log("Answers submitted:", answers);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-sm border mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <Button 
                onClick={() => navigate(`/learning/${courseId}`)} 
                variant="outline"
                className="text-black"
              >
                ← Back to Course
              </Button>
              <div className="flex gap-4">
                <Button
                  variant={activeSection === 'content' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('content')}
                  className={activeSection === 'content' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Content
                </Button>
                <Button
                  variant={activeSection === 'quiz' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('quiz')}
                  className={activeSection === 'quiz' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Quiz
                </Button>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-black mb-4">{title}</h1>
            <div className="flex items-center gap-6 text-black/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>15 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>10 points</span>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          {activeSection === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border"
            >
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Customize other markdown elements
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="text-black/80 leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote 
                        className="border-l-4 border-green-500 pl-4 italic my-4 text-black/70"
                        {...props}
                      />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}

          {/* Quiz Section */}
          {activeSection === 'quiz' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {questions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-4">{question}</h3>
                      <textarea
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 
                                focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
                                text-black placeholder:text-black/40
                                min-h-[120px] resize-none"
                        placeholder="Type your answer here..."
                      />
                      {submitted && (
                        <div className="mt-4 flex items-center gap-2">
                          {answers[index] ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className={answers[index] ? "text-green-500" : "text-red-500"}>
                            {answers[index] ? "Answer submitted" : "Please provide an answer"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-medium
                           transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
                >
                  Submit Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Tutor Widget */}
      {currentCourse?.agentId && (
        <div 
          ref={widgetContainerRef}
          className="fixed bottom-8 right-8 z-50"
        />
      )}
    </div>
  );
};

export default ChapterView; 