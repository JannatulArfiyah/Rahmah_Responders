import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Video, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExaminerBookingManagementProps {
  onBack: () => void;
}

interface BookedSlot {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'no-show';
  examiner: string;
}

const ExaminerBookingManagement = ({ onBack }: ExaminerBookingManagementProps) => {
  const { toast } = useToast();
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([
    {
      id: "BS001",
      studentName: "Muhammad Omar",
      studentEmail: "muhammad.omar@email.com",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "09:00",
      status: "scheduled",
      examiner: "Dr. Smith"
    },
    {
      id: "BS002",
      studentName: "Bilal Wilson",
      studentEmail: "bilal.wilson@email.com",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "11:00",
      status: "scheduled",
      examiner: "Dr. Rosa"
    },
    {
      id: "BS003",
      studentName: "Siti Fatimah",
      studentEmail: "siti.faftimah@email.com",
      date: new Date().toISOString().split('T')[0],
      time: "15:00",
      status: "completed",
      examiner: "Dr. Smitchz"
    },
    {
      id: "BS004",
      studentName: "Daud Brown",
      studentEmail: "daud.brown@email.com",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "13:00",
      status: "scheduled",
      examiner: "Dr. Johnson"
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'in-progress': return 'secondary';
      case 'completed': return 'outline';
      case 'no-show': return 'destructive';
      default: return 'default';
    }
  };

  const handleStartSession = (slotId: string) => {
    setBookedSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, status: 'in-progress' }
        : slot
    ));
    toast({
      title: "Session Started",
      description: "Video call session has been initiated.",
    });
  };

  const handleCompleteSession = (slotId: string, passed: boolean) => {
    setBookedSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, status: 'completed' }
        : slot
    ));
    toast({
      title: passed ? "Student Passed" : "Session Completed",
      description: passed 
        ? "Student has successfully completed the practical test." 
        : "Practical test session has been marked as complete.",
      variant: passed ? 'default' : 'destructive'
    });
  };

  const handleMarkNoShow = (slotId: string) => {
    setBookedSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, status: 'no-show' }
        : slot
    ));
    toast({
      title: "Marked as No-Show",
      description: "Student did not attend the scheduled session.",
      variant: "destructive"
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingSlots = bookedSlots.filter(slot => 
    (slot.date === today && slot.status === 'scheduled') || 
    (slot.date > today && slot.status === 'scheduled')
  );
  const todaysSlots = bookedSlots.filter(slot => slot.date === today);
  const completedSlots = bookedSlots.filter(slot => slot.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Practical Test Bookings</CardTitle>
              <CardDescription>
                Manage student practical test sessions and video call assessments
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{upcomingSlots.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming Sessions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{todaysSlots.length}</div>
              <div className="text-sm text-muted-foreground">Today's Sessions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{completedSlots.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">
                {bookedSlots.filter(s => s.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Sessions</CardTitle>
              <CardDescription>Practical tests scheduled for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysSlots.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No sessions scheduled for today
                </p>
              ) : (
                todaysSlots.map((slot) => (
                  <Card key={slot.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="h-4 w-4" />
                            <span className="font-semibold">{slot.studentName}</span>
                            <Badge variant={getStatusColor(slot.status)}>
                              {slot.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {slot.studentEmail}
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{slot.time} - {
                              String(Number(slot.time.split(':')[0]) + 2).padStart(2, '0')
                            }:00</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {slot.status === 'scheduled' && (
                          <>
                            <Button size="sm" onClick={() => handleStartSession(slot.id)}>
                              <Video className="h-3 w-3 mr-1" />
                              Start Session
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleMarkNoShow(slot.id)}
                            >
                              No Show
                            </Button>
                          </>
                        )}
                        {slot.status === 'in-progress' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleCompleteSession(slot.id, true)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Pass
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCompleteSession(slot.id, false)}
                            >
                              Fail
                            </Button>
                          </>
                        )}
                        {slot.status === 'completed' && (
                          <Badge variant="outline" className="text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Future practical test bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSlots.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No upcoming sessions scheduled
                </p>
              ) : (
                upcomingSlots
                  .filter(slot => slot.date !== today)
                  .map((slot) => (
                    <Card key={slot.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="h-4 w-4" />
                              <span className="font-semibold">{slot.studentName}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {slot.studentEmail}
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(slot.date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{slot.time}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {slot.examiner}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Completed Sessions</CardTitle>
            <CardDescription>Recently completed practical assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedSlots.slice(0, 5).map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <div>
                      <span className="font-medium">{slot.studentName}</span>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(slot.date)} at {slot.time}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-success border-success">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExaminerBookingManagement;