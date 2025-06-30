
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { ProfessorDashboard } from '@/components/dashboard/ProfessorDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout>
      {user.role === 'STUDENT' ? <StudentDashboard /> : <ProfessorDashboard />}
    </DashboardLayout>
  );
};
