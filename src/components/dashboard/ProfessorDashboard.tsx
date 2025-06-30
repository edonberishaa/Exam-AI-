import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { Exam, ProctoringEvent } from '@/types';

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [proctoringAlerts, setProctoringAlerts] = useState<ProctoringEvent[]>([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    activeExams: 0,
    totalStudents: 0,
    averageScore: 0,
    flaggedEvents: 0
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockExams: Exam[] = [
      {
        id: '1',
        title: 'Data Structures Final',
        description: 'Comprehensive final examination',
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
        title: 'Algorithm Analysis',
        description: 'Midterm examination on algorithms',
        startTime: '2024-01-20T14:00:00Z',
        endTime: '2024-01-20T16:00:00Z',
        duration: 120,
        maxAttempts: 1,
        isPublished: false,
        createdById: 'prof1',
        createdAt: '2024-01-01T00:00:00Z',
        questions: []
      }
    ];

    const mockAlerts: ProctoringEvent[] = [
      {
        id: '1',
        studentExamId: 'se1',
        studentId: 'student1',
        type: 'TAB_SWITCH',
        severity: 'MEDIUM',
        description: 'Student switched tabs during exam',
        timestamp: '2024-01-10T10:30:00Z'
      },
      {
        id: '2',
        studentExamId: 'se2',
        studentId: 'student2',
        type: 'FACE_NOT_DETECTED',
        severity: 'HIGH',
        description: 'Face not detected for 30 seconds',
        timestamp: '2024-01-10T11:15:00Z'
      }
    ];

    setExams(mockExams);
    setProctoringAlerts(mockAlerts);
    setStats({
      totalExams: 5,
      activeExams: 2,
      totalStudents: 45,
      averageScore: 82.3,
      flaggedEvents: 12
    });
  }, []);

  const getSeverityColor = (severity: string) => {
    const colors = {
      'LOW': 'bg-blue-100 text-blue-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'CRITICAL': 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.LOW;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Professor Dashboard</h2>
        <Button onClick={() => navigate('/create-exam')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Exam
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeExams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flaggedEvents}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Exams</CardTitle>
            <CardDescription>Your latest created examinations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{exam.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(exam.startTime)} • {exam.duration} minutes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={exam.isPublished ? "default" : "secondary"}>
                    {exam.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Proctoring Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Proctoring Alerts</CardTitle>
            <CardDescription>Recent suspicious activities detected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proctoringAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Student ID: {alert.studentId}</h4>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</p>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/create-exam')}
            >
              <Plus className="h-6 w-6" />
              <span>Create New Exam</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/manage-students')}
            >
              <Users className="h-6 w-6" />
              <span>Manage Students</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
