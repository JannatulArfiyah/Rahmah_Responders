import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Video, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PracticalTestBookingProps {
  onBack: () => void;
  onBookingComplete: () => void;
  canBook?: boolean; // Add this prop to control booking ability
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  examiner?: string;
}

const PracticalTestBooking = ({ onBack, onBookingComplete, canBook = true }: PracticalTestBookingProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookedSlot, setBookedSlot] = useState<TimeSlot | null>(null);

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Generate time slots from 9am to 9pm (2-hour intervals)
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots = [];
    const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
    const examiners = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];
    
    times.forEach((time, index) => {
      // Randomly make some slots unavailable
      const available = Math.random() > 0.3;
      slots.push({
        id: `${date}-${time}`,
        time,
        date,
        available,
        examiner: available ? examiners[index % examiners.length] : undefined
      });
    });
    
    return slots;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBookSlot = () => {
    if (!canBook) {
      toast({
        title: "Booking Not Available",
        description: "You must pass the final theory test before booking a practical test.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedDate || !selectedSlot) return;
    
    const slots = generateTimeSlots(selectedDate);
    const slot = slots.find(s => s.id === selectedSlot);
    
    if (slot) {
      setBookedSlot(slot);
      toast({
        title: "Booking Confirmed!",
        description: `Your practical test is booked for ${formatDate(slot.date)} at ${slot.time}`,
      });
    }
  };

  if (bookedSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              <CardDescription>Your practical test has been successfully booked</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Date & Time</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(bookedSlot.date)}
                    </p>
                    <p className="text-lg font-semibold">{bookedSlot.time} - {
                      String(Number(bookedSlot.time.split(':')[0]) + 2).padStart(2, '0')
                    }:00</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Video className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Examiner</span>
                    </div>
                    <p className="text-lg font-semibold">{bookedSlot.examiner}</p>
                    <p className="text-sm text-muted-foreground">Video Call Assessment</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What to Expect:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>2-hour practical assessment via video call</li>
                  <li>Demonstration of first aid techniques</li>
                  <li>Scenario-based practical exercises</li>
                  <li>Real-time feedback from certified examiner</li>
                </ul>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Important Notes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Join the video call 5 minutes before your scheduled time</li>
                  <li>Ensure you have a stable internet connection</li>
                  <li>Have your first aid kit ready for demonstration</li>
                  <li>You will receive a video call link via email 24 hours before the test</li>
                </ul>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={onBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <Button onClick={onBookingComplete}>
                  Continue to Emergency Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const dates = generateDates();
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Book Practical Test</CardTitle>
              <CardDescription>
                {canBook 
                  ? "Select a date and time slot for your practical first aid assessment via video call"
                  : "View available time slots for practical tests. Complete the final theory test to enable booking."
                }
              </CardDescription>
              {!canBook && (
                <div className="bg-warning/10 p-3 rounded-lg mt-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Theory Test Required</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You must pass the final theory test with 80% or higher to book your practical test.
                  </p>
                </div>
              )}
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Select Date</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dates.map((date) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot("");
                    }}
                  >
                    {formatDate(date)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Available Time Slots</span>
              </CardTitle>
              <CardDescription>
                Each session is 2 hours long
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-muted-foreground text-center py-8">
                  Please select a date first
                </p>
              ) : (
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedSlot === slot.id ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => setSelectedSlot(slot.id)}
                      disabled={!slot.available || !canBook}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{slot.time} - {
                          String(Number(slot.time.split(':')[0]) + 2).padStart(2, '0')
                        }:00</span>
                        {slot.available && (
                          <Badge variant="secondary" className="text-xs">
                            {slot.examiner}
                          </Badge>
                        )}
                      </div>
                      {!slot.available ? (
                        <Badge variant="destructive" className="text-xs">
                          Booked
                        </Badge>
                      ) : !canBook ? (
                        <Badge variant="outline" className="text-xs">
                          Theory Test Required
                        </Badge>
                      ) : null}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedDate && selectedSlot && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Selected Slot</h3>
                  <p className="text-muted-foreground">
                    {formatDate(selectedDate)} at {
                      timeSlots.find(s => s.id === selectedSlot)?.time
                    } - {
                      String(Number(timeSlots.find(s => s.id === selectedSlot)?.time.split(':')[0]) + 2).padStart(2, '0')
                    }:00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Examiner: {timeSlots.find(s => s.id === selectedSlot)?.examiner}
                  </p>
                </div>
                <Button onClick={handleBookSlot} size="lg">
                  disabled={!canBook}
                  <Video className="h-4 w-4 mr-2" />
                  {canBook ? 'Book This Slot' : 'Complete Theory Test First'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PracticalTestBooking;