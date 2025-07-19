import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, MapPin, Phone, Clock, AlertTriangle, Navigation, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyResponseProps {
  onBack: () => void;
  hasPassedPracticalTest?: boolean;
}

interface EmergencyCase {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    address: string;
    coordinates: [number, number];
  };
  description: string;
  reportedTime: string;
  distance: string;
  estimatedTime: string;
  casualties: number;
}

const EmergencyResponse = ({ onBack, hasPassedPracticalTest = true }: EmergencyResponseProps) => {
  const { toast } = useToast();
  const [activeCase, setActiveCase] = useState<EmergencyCase | null>(null);
  const [availableCases, setAvailableCases] = useState<EmergencyCase[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Mock emergency cases
  const mockCases: EmergencyCase[] = [
    {
      id: "EC001",
      type: "Cardiac Arrest",
      severity: "critical",
      location: {
        address: "123 Main Street, Downtown",
        coordinates: [51.5074, -0.1278]
      },
      description: "Adult male, 45 years old, unresponsive, no pulse detected",
      reportedTime: new Date(Date.now() - 5 * 60000).toISOString(),
      distance: "0.8 km",
      estimatedTime: "3 min",
      casualties: 1
    },
    {
      id: "EC002",
      type: "Traffic Accident",
      severity: "high",
      location: {
        address: "Highway A1, Junction 15",
        coordinates: [51.5090, -0.1300]
      },
      description: "Multi-vehicle collision, 2 casualties with suspected injuries",
      reportedTime: new Date(Date.now() - 12 * 60000).toISOString(),
      distance: "2.1 km",
      estimatedTime: "7 min",
      casualties: 2
    },
    {
      id: "EC003",
      type: "Choking Incident",
      severity: "medium",
      location: {
        address: "Oak Restaurant, 456 Oak Avenue",
        coordinates: [51.5060, -0.1250]
      },
      description: "Child choking on food, conscious but distressed",
      reportedTime: new Date(Date.now() - 3 * 60000).toISOString(),
      distance: "1.2 km",
      estimatedTime: "4 min",
      casualties: 1
    }
  ];

  useEffect(() => {
    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Default to London coordinates if geolocation fails
          setUserLocation([51.5074, -0.1278]);
        }
      );
    } else {
      setUserLocation([51.5074, -0.1278]);
    }

    // Set available cases
    setAvailableCases(mockCases);

    // Simulate new emergency notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newCase: EmergencyCase = {
          id: `EC${Math.random().toString(36).substr(2, 9)}`,
          type: ["Heart Attack", "Allergic Reaction", "Fall Injury", "Burn Injury"][Math.floor(Math.random() * 4)],
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          location: {
            address: `${Math.floor(Math.random() * 999)} Random Street`,
            coordinates: [51.5074 + (Math.random() - 0.5) * 0.01, -0.1278 + (Math.random() - 0.5) * 0.01]
          },
          description: "New emergency case reported",
          reportedTime: new Date().toISOString(),
          distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
          estimatedTime: `${Math.floor(Math.random() * 10 + 2)} min`,
          casualties: Math.floor(Math.random() * 3 + 1)
        };

        setAvailableCases(prev => [newCase, ...prev]);
        
        toast({
          title: "New Emergency Alert!",
          description: `${newCase.type} reported at ${newCase.location.address}`,
          variant: newCase.severity === 'critical' ? 'destructive' : 'default'
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [toast]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleAcceptCase = (emergencyCase: EmergencyCase) => {
    setActiveCase(emergencyCase);
    setAvailableCases(prev => prev.filter(c => c.id !== emergencyCase.id));
    toast({
      title: "Case Accepted",
      description: `You are now responding to ${emergencyCase.type} at ${emergencyCase.location.address}`,
    });
  };

  const handleCompleteCase = () => {
    if (activeCase) {
      toast({
        title: "Case Completed",
        description: `Emergency response for ${activeCase.type} has been marked as complete.`,
      });
      setActiveCase(null);
    }
  };

  const formatTimeAgo = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  // Check if user is qualified to respond
  if (!hasPassedPracticalTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-4" />
              <CardTitle className="text-2xl">Access Restricted</CardTitle>
              <CardDescription>
                You must complete both the theory and practical tests to access emergency response cases
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-warning/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Requirements to Respond to Emergencies:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Pass the Final Theory Test (80% or higher)</li>
                  <li>Complete the Practical Test with a certified examiner</li>
                  <li>Receive first aid certification</li>
                </ul>
              </div>
              
              <p className="text-muted-foreground">
                Complete your training to help save lives in your community.
              </p>
              
              <Button onClick={onBack} variant="outline">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
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
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <span>Emergency Response Center</span>
              </CardTitle>
              <CardDescription>
                Real-time emergency cases requiring first aid response
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {activeCase && (
          <Card className="mb-6 border-destructive">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-destructive">Active Response</CardTitle>
                  <CardDescription>You are currently responding to this emergency</CardDescription>
                </div>
                <Badge variant="destructive">ACTIVE</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-semibold">{activeCase.type}</span>
                    <Badge variant={getSeverityColor(activeCase.severity)}>
                      {activeCase.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activeCase.description}</p>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{activeCase.location.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Navigation className="h-4 w-4" />
                      <span className="text-sm">{activeCase.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">ETA: {activeCase.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{activeCase.casualties} casualt{activeCase.casualties !== 1 ? 'ies' : 'y'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold mb-2">GPS Navigation</h4>
                    <div className="bg-primary/10 p-2 rounded text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        Interactive map would be displayed here
                      </p>
                      <p className="text-xs font-mono">
                        {activeCase.location.coordinates[0].toFixed(4)}, {activeCase.location.coordinates[1].toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-1" />
                      Call 911
                    </Button>
                    <Button size="sm" onClick={handleCompleteCase} className="flex-1">
                      Complete Case
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Emergency Cases</CardTitle>
              <CardDescription>
                {availableCases.length} active cases in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableCases.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No emergency cases available at the moment
                </p>
              ) : (
                availableCases.map((emergencyCase) => (
                  <Card key={emergencyCase.id} className="border-l-4 border-l-destructive">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{emergencyCase.type}</span>
                          <Badge variant={getSeverityColor(emergencyCase.severity)}>
                            {emergencyCase.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(emergencyCase.reportedTime)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {emergencyCase.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{emergencyCase.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">ETA: {emergencyCase.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span className="text-xs">{emergencyCase.casualties} casualt{emergencyCase.casualties !== 1 ? 'ies' : 'y'}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {emergencyCase.location.address}
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptCase(emergencyCase)}
                          disabled={!!activeCase}
                        >
                          Accept Case
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Statistics</CardTitle>
              <CardDescription>Your emergency response performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-xs text-muted-foreground">Cases Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">4.8</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-warning">3:45</div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-destructive">12</div>
                    <div className="text-xs text-muted-foreground">Lives Saved</div>
                  </CardContent>
                </Card>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You are certified and ready to respond to emergency cases in your area.
                  Stay alert for incoming notifications.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Recent Activity</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cardiac Arrest - Downtown</span>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Choking Incident - Mall</span>
                    <span className="text-muted-foreground">5 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fall Injury - Park</span>
                    <span className="text-muted-foreground">1 day ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;