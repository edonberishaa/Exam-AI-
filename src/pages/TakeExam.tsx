
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import { Exam, Question } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const TakeExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [examStarted, setExamStarted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  useEffect(() => {
    // Mock exam data
    const mockExam: Exam = {
      id: examId || '1',
      title: 'Data Structures Final Exam',
      description: 'Comprehensive exam covering all data structures topics',
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T12:00:00Z',
      duration: 120,
      maxAttempts: 1,
      passingScore: 70,
      isPublished: true,
      createdById: 'prof1',
      createdAt: '2024-01-01T00:00:00Z',
      questions: [
        {
          id: '1',
          examId: examId || '1',
          type: 'MCQ',
          question: 'What is the time complexity of binary search?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correctAnswer: 'O(log n)',
          points: 2,
          order: 1
        },
        {
          id: '2',
          examId: examId || '1',
          type: 'SHORT_ANSWER',
          question: 'Explain the difference between a stack and a queue.',
          points: 5,
          order: 2
        },
        {
          id: '3',
          examId: examId || '1',
          type: 'CODE',
          question: 'Write a function to reverse a linked list in Python.',
          points: 10,
          order: 3
        }
      ]
    };

    setExam(mockExam);
    setTimeRemaining(mockExam.duration * 60); // Convert to seconds
  }, [examId]);

  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining]);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(true);
      // Store stream reference for cleanup
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast({
        title: "Camera Required",
        description: "Please enable camera access to take the exam",
        variant: "destructive"
      });
    }
  };

  const startExam = async () => {
    if (!cameraEnabled) {
      await enableCamera();
      return;
    }
    setExamStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitExam = async () => {
    const unansweredQuestions = exam?.questions.filter(q => !answers[q.id]);
    
    if (unansweredQuestions && unansweredQuestions.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    console.log('Submitting exam:', { examId, answers });
    
    toast({
      title: "Exam Submitted",
      description: "Your exam has been submitted successfully!"
    });
    
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id] || '';

    switch (question.type) {
      case 'MCQ':
        return (
          <div className="space-y-4">
            <RadioGroup 
              value={answer} 
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'SHORT_ANSWER':
        return (
          <Input
            value={answer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer"
          />
        );

      case 'LONG_ANSWER':
      case 'CODE':
        return (
          <Textarea
            value={answer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.type === 'CODE' ? 'Write your code here...' : 'Enter your answer'}
            className="min-h-[200px] font-mono"
          />
        );

      case 'TRUE_FALSE':
        return (
          <RadioGroup 
            value={answer} 
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`}>True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-false`} />
              <Label htmlFor={`${question.id}-false`}>False</Label>
            </div>
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <span>Exam Setup</span>
            </CardTitle>
            <CardDescription>
              {exam.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Duration: {exam.duration} minutes</p>
              <p className="text-sm text-muted-foreground">Questions: {exam.questions.length}</p>
              <p className="text-sm text-muted-foreground">Passing Score: {exam.passingScore}%</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span className="text-sm">Camera access required</span>
                {cameraEnabled && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
              
              {!cameraEnabled && (
                <Button onClick={enableCamera} variant="outline" className="w-full">
                  Enable Camera
                </Button>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-medium text-yellow-800 mb-2">Important Instructions:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Do not switch tabs or leave the exam window</li>
                <li>• Keep your camera enabled throughout the exam</li>
                <li>• Ensure you have a stable internet connection</li>
                <li>• The exam will auto-submit when time expires</li>
              </ul>
            </div>

            <Button 
              onClick={startExam} 
              className="w-full" 
              disabled={!cameraEnabled}
            >
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={`font-mono ${timeRemaining < 300 ? 'text-red-500' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button onClick={handleSubmitExam} variant="outline">
                Submit Exam
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      </div>

      {/* Camera indicator */}
      <div className="fixed top-20 right-4 z-40">
        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
          <Camera className="h-3 w-3" />
          <span>REC</span>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question {currentQuestionIndex + 1}</span>
              <Badge variant="secondary">{currentQuestion.points} points</Badge>
            </CardTitle>
            <CardDescription>{currentQuestion.type.replace('_', ' ')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-base whitespace-pre-wrap">
              {currentQuestion.question}
            </div>
            
            {renderQuestion(currentQuestion)}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {exam.questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 ${answers[exam.questions[index].id] ? 'bg-green-100 border-green-300' : ''}`}
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === exam.questions.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
