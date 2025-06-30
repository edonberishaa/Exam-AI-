import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, TrendingUp, Play } from 'lucide-react';
import { Exam, StudentExam } from '@/types';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [recentExams, setRecentExams] = useState<StudentExam[]>([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    completedExams: 0,
    upcomingExams: 0
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockUpcomingExams: Exam[] = [
      {
        id: '1',
        title: 'Data Structures Final',
        description: 'Comprehensive exam covering all data structures topics',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T12:00:00Z',
        duration: 120,
        maxAttempts: 1,
        passingScore: 70,
        isPublished: true,
        createdById: 'prof1',
        createdAt: '2024-01-01T00:00:00Z',
        questions: []
      },
      {
        id: '2',
        title: 'Algorithm Analysis Quiz',
        description: 'Quick quiz on time complexity analysis',
        startTime: '2024-01-12T14:00:00Z',
        endTime: '2024-01-12T15:00:00Z',
        duration: 60,
        maxAttempts: 2,
        isPublished: true,
        createdById: 'prof1',
        createdAt: '2024-01-01T00:00:00Z',
        questions: []
      }
    ];

    const mockRecentExams: StudentExam[] = [
      {
        id: '1',
        studentId: 'student1',
        examId: '3',
        startedAt: '2024-01-05T10:00:00Z',
        submittedAt: '2024-01-05T11:30:00Z',
        score: 85,
        status: 'GRADED',
        attemptNumber: 1,
        answers: []
      },
      {
        id: '2',
        studentId: 'student1',
        examId: '4',
        startedAt: '2024-01-03T14:00:00Z',
        submittedAt: '2024-01-03T14:45:00Z',
        score: 92,
        status: 'GRADED',
        attemptNumber: 1,
        answers: []
      }
    ];

    setUpcomingExams(mockUpcomingExams);
    setRecentExams(mockRecentExams);
    setStats({
      totalExams: 8,
      averageScore: 88.5,
      completedExams: 6,
      upcomingExams: 2
    });
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      'NOT_STARTED': 'secondary',
      'IN_PROGRESS': 'default',
      'SUBMITTED': 'outline',
      'GRADED': 'default',
      'EXPIRED': 'destructive'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStartExam = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedExams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingExams}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Your scheduled examinations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{exam.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(exam.startTime)} • {exam.duration} minutes
                  </p>
                </div>
                <Button size="sm" onClick={() => handleStartExam(exam.id)}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Exam
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Your latest exam scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Exam #{exam.id}</h4>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {exam.submittedAt ? formatDate(exam.submittedAt) : 'N/A'}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-2xl font-bold">{exam.score}%</div>
                  {getStatusBadge(exam.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>Your academic performance overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Data Structures</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Algorithms</span>
              <span>92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Database Systems</span>
              <span>78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
