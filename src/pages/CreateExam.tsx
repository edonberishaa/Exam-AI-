
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'MCQ' | 'SHORT_ANSWER' | 'LONG_ANSWER' | 'CODE' | 'TRUE_FALSE';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 60,
    maxAttempts: 1,
    passingScore: 70
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'MCQ',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSaveExam = async () => {
    if (!examData.title || questions.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in exam title and add at least one question",
        variant: "destructive"
      });
      return;
    }

    // Mock save - in real app, this would be an API call
    console.log('Saving exam:', { examData, questions });
    
    toast({
      title: "Success",
      description: "Exam created successfully!"
    });
    
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Create New Exam</h2>
          <Button onClick={handleSaveExam}>
            <Save className="mr-2 h-4 w-4" />
            Save Exam
          </Button>
        </div>

        {/* Exam Details */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>Basic information about the exam</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title</Label>
                <Input
                  id="title"
                  value={examData.title}
                  onChange={(e) => setExamData({...examData, title: e.target.value})}
                  placeholder="Enter exam title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={examData.duration}
                  onChange={(e) => setExamData({...examData, duration: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={examData.description}
                onChange={(e) => setExamData({...examData, description: e.target.value})}
                placeholder="Enter exam description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={examData.startTime}
                  onChange={(e) => setExamData({...examData, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={examData.maxAttempts}
                  onChange={(e) => setExamData({...examData, maxAttempts: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={examData.passingScore}
                  onChange={(e) => setExamData({...examData, passingScore: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add questions to your exam</CardDescription>
              </div>
              <Button onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select 
                      value={question.type} 
                      onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCQ">Multiple Choice</SelectItem>
                        <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                        <SelectItem value="LONG_ANSWER">Long Answer</SelectItem>
                        <SelectItem value="CODE">Code</SelectItem>
                        <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Points</Label>
                    <Input
                      type="number"
                      value={question.points}
                      onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    placeholder="Enter your question"
                  />
                </div>

                {question.type === 'MCQ' && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {question.options?.map((option, optIndex) => (
                      <Input
                        key={optIndex}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(question.id, 'options', newOptions);
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    ))}
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Input
                        value={question.correctAnswer || ''}
                        onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                        placeholder="Enter the correct answer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
