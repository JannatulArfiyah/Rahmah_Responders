import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Clock, 
  Star, 
  TrendingUp,
  ArrowLeft,
  Play,
  Video
} from "lucide-react";

interface StudentDashboardProps {
  onBack: () => void;
  onNavigate: (section: string) => void;
}

const StudentDashboard = ({ onBack, onNavigate }: StudentDashboardProps) => {
  const [progress] = useState({
    flashcardsStudied: 45,
    totalFlashcards: 120,
    quizzesTaken: 8,
    averageScore: 87,
    streakDays: 5,
    hoursStudied: 12.5,
    videosWatched: 8,
    totalVideos: 15,
    theoryTestPassed: false // Add this to track theory test status
  });

  const studyAreas = [
    {
      id: 'flashcards',
      title: 'Study Flashcards',
      description: 'Learn key first aid concepts with interactive cards',
      icon: BookOpen,
      progress: Math.round((progress.flashcardsStudied / progress.totalFlashcards) * 100),
      color: 'primary',
      stats: `${progress.flashcardsStudied}/${progress.totalFlashcards} cards`
    },
    {
      id: 'revision-guides',
      title: 'Revision Guides',
      description: 'Quick reference guides and step-by-step instructions',
      icon: BookOpen,
      progress: 100, // Always available
      color: 'info',
      stats: '6 guides available'
    },
    {
      id: 'video-library',
      title: 'Video Library',
      description: 'Watch instructional first aid demonstration videos',
      icon: Video,
      progress: Math.round((progress.videosWatched / progress.totalVideos) * 100),
      color: 'accent',
      stats: `${progress.videosWatched}/${progress.totalVideos} videos watched`
    },
    {
      id: 'practice-quiz',
      title: 'Practice Quiz',
      description: 'Test your knowledge with multiple choice questions',
      icon: Brain,
      progress: progress.averageScore,
      color: 'secondary',
      stats: `${progress.quizzesTaken} quizzes taken`
    },
    {
      id: 'practical-test-booking',
      title: 'Practical Test Booking',
      description: 'View and book your practical first aid assessment',
      icon: Trophy,
      progress: 0,
      color: 'info',
      stats: progress.theoryTestPassed ? 'Ready to book' : 'Complete theory test first',
      viewOnly: !progress.theoryTestPassed
    },
    {
      id: 'final-test',
      title: 'Final Theory Test',
      description: 'Complete your final theory examination to unlock practical test',
      icon: Trophy,
      progress: 0,
      color: 'warning',
      stats: 'Not started',
      disabled: progress.flashcardsStudied < 45 // Changed from 100 to 45 to match current progress
    }
  ];

  const achievements = [
    { name: 'Quick Learner', description: '5-day study streak', icon: Star, earned: true },
    { name: 'Quiz Master', description: 'Average score above 85%', icon: TrendingUp, earned: true },
    { name: 'Dedicated Student', description: '10+ hours studied', icon: Clock, earned: true },
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
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Track your first aid learning progress</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="text-sm font-medium">Cards Studied</div>
              </div>
              <div className="text-2xl font-bold mt-2">{progress.flashcardsStudied}</div>
              <div className="text-xs text-muted-foreground">of {progress.totalFlashcards}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-secondary-foreground" />
                <div className="text-sm font-medium">Avg Score</div>
              </div>
              <div className="text-2xl font-bold mt-2">{progress.averageScore}%</div>
              <div className="text-xs text-muted-foreground">{progress.quizzesTaken} quizzes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                <div className="text-sm font-medium">Study Streak</div>
              </div>
              <div className="text-2xl font-bold mt-2">{progress.streakDays}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-info" />
                <div className="text-sm font-medium">Study Time</div>
              </div>
              <div className="text-2xl font-bold mt-2">{progress.hoursStudied}h</div>
              <div className="text-xs text-muted-foreground">total</div>
            </CardContent>
          </Card>
        </div>

        {/* Study Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {studyAreas.map((area) => {
            const Icon = area.icon;
            return (
              <Card key={area.id} className={area.disabled ? 'opacity-60' : 'hover:shadow-md transition-shadow'}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      area.color === 'primary' ? 'bg-primary/10' :
                      area.color === 'secondary' ? 'bg-secondary/10' :
                      area.color === 'accent' ? 'bg-accent/10' :
                      'bg-warning/10'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        area.color === 'primary' ? 'text-primary' :
                        area.color === 'secondary' ? 'text-secondary-foreground' :
                        area.color === 'accent' ? 'text-accent-foreground' :
                        'text-warning'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                      <CardDescription>{area.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{area.progress}%</span>
                    </div>
                    <Progress value={area.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">{area.stats}</div>
                    <Button 
                      onClick={() => onNavigate(area.id)}
                      disabled={area.disabled}
                      variant={area.disabled ? 'outline' : area.viewOnly ? 'secondary' : 'default'}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {area.disabled ? 'Locked' : area.viewOnly ? 'View Only' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Achievements
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      achievement.earned ? 'bg-success/5 border-success/20' : 'bg-muted/50 border-border'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${
                      achievement.earned ? 'text-success' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    {achievement.earned && (
                      <Badge variant="outline" className="text-success border-success">
                        Earned
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;