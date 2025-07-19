import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Eye,
  Calendar
} from "lucide-react";

interface ExaminerDashboardProps {
  onBack: () => void;
  onNavigate: (section: string) => void;
}

const ExaminerDashboard = ({ onBack, onNavigate }: ExaminerDashboardProps) => {
  const [stats] = useState({
    totalStudents: 24,
    activeStudents: 18,
    totalQuestions: 156,
    totalFlashcards: 89,
    avgScore: 82,
    completedTests: 12
  });

  const managementAreas = [
    {
      id: 'create-flashcard',
      title: 'Create Flashcards',
      description: 'Add new first aid concept cards for students',
      icon: BookOpen,
      count: stats.totalFlashcards,
      color: 'primary',
      action: 'Create New'
    },
    {
      id: 'create-mcq',
      title: 'Multiple Choice Questions',
      description: 'Create and manage quiz questions',
      icon: HelpCircle,
      count: stats.totalQuestions,
      color: 'secondary',
      action: 'Add Question'
    },
    {
      id: 'create-openended',
      title: 'Open-Ended Questions',
      description: 'Create essay-style assessment questions',
      icon: MessageSquare,
      count: 24,
      color: 'accent',
      action: 'Create Question'
    },
    {
      id: 'practical-bookings',
      title: 'Practical Test Bookings',
      description: 'Manage student practical test sessions',
      icon: Calendar,
      count: 8,
      color: 'warning',
      action: 'Manage Bookings'
    },
    {
      id: 'view-results',
      title: 'Student Results',
      description: 'View and grade student submissions',
      icon: BarChart3,
      count: stats.completedTests,
      color: 'info',
      action: 'View Results'
    }
  ];

  const recentActivity = [
    { student: 'Muhammad Omar', action: 'Completed Final Test', score: 94, time: '2 hours ago' },
    { student: 'Bilal Wilson', action: 'Submitted Quiz 3', score: 87, time: '4 hours ago' },
    { student: 'Siti Fatimah', action: 'Started Flashcard Study', score: null, time: '6 hours ago' },
    { student: 'Daud Brown', action: 'Completed Quiz 2', score: 92, time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Examiner Dashboard</h1>
            <p className="text-muted-foreground">Manage content and track student progress</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-sm font-medium">Total Students</div>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.totalStudents}</div>
              <div className="text-xs text-muted-foreground">{stats.activeStudents} active</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
                <div className="text-sm font-medium">Content Items</div>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.totalQuestions + stats.totalFlashcards}</div>
              <div className="text-xs text-muted-foreground">questions & cards</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-success" />
                <div className="text-sm font-medium">Avg Score</div>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.avgScore}%</div>
              <div className="text-xs text-muted-foreground">class average</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-info" />
                <div className="text-sm font-medium">Completed Tests</div>
              </div>
              <div className="text-2xl font-bold mt-2">{stats.completedTests}</div>
              <div className="text-xs text-muted-foreground">to review</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {managementAreas.map((area) => {
            const Icon = area.icon;
            return (
              <Card key={area.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      area.color === 'primary' ? 'bg-primary/10' :
                      area.color === 'secondary' ? 'bg-secondary/10' :
                      area.color === 'accent' ? 'bg-accent/10' :
                      'bg-info/10'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        area.color === 'primary' ? 'text-primary' :
                        area.color === 'secondary' ? 'text-secondary-foreground' :
                        area.color === 'accent' ? 'text-accent-foreground' :
                        'text-info'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{area.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {area.count} items
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs mb-3">
                    {area.description}
                  </CardDescription>
                  <Button 
                    onClick={() => onNavigate(area.id)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {area.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Student Activity</CardTitle>
                <CardDescription>Latest submissions and progress updates</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate('all-students')}>
                <Users className="h-4 w-4 mr-2" />
                View All Students
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.student}</div>
                    <div className="text-xs text-muted-foreground">{activity.action}</div>
                  </div>
                  <div className="text-center">
                    {activity.score && (
                      <Badge 
                        variant={activity.score >= 90 ? 'default' : activity.score >= 80 ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground text-right min-w-20">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExaminerDashboard;