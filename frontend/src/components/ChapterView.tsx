import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ChapterState {
  title: string;
  content: string;
  questions: string[];
}

const ChapterView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, content, questions } = location.state as ChapterState || {
    title: '',
    content: '',
    questions: []
  };

  const [answers, setAnswers] = React.useState<string[]>([]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    console.log("Answers submitted:", answers);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button 
            onClick={() => navigate('/news')} 
            variant="outline"
          >
            ← Back to Chapters
          </Button>
          <Button variant="default">
            Complete Lesson
          </Button>
        </div>

        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        
        <div className="prose prose-lg max-w-none mb-12">
          {content && content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">{paragraph}</p>
          ))}
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-8">Practice Questions</h3>
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={index} className="border-b pb-6">
                <p className="mb-4 font-medium">{question}</p>
                <textarea
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full p-3 rounded border focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  placeholder="Type your answer here..."
                  rows={4}
                />
              </div>
            ))}
          </div>

          <Button 
            onClick={handleSubmit} 
            className="mt-8"
          >
            Submit Answers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterView; 