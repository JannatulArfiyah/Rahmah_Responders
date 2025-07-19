import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  Navigation,
  Clock,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CivilianEmergencyReportProps {
  onBack: () => void;
}

interface EmergencyReport {
  id: string;
  type: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  reporterName: string;
  reporterPhone: string;
  timestamp: string;
  status: 'pending' | 'dispatched' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const CivilianEmergencyReport = ({ onBack }: CivilianEmergencyReportProps) => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<EmergencyReport | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    emergencyType: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
    severity: "medium" as const
  });

  const emergencyTypes = [
    "Cardiac Arrest",
    "Choking",
    "Severe Bleeding",
    "Burns",
    "Fracture/Injury",
    "Allergic Reaction",
    "Unconscious Person",
    "Traffic Accident",
    "Fall Injury",
    "Other Medical Emergency"
  ];

  useEffect(() => {
    // Try to get user's current location on component mount
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(coords);
          
          // Simulate reverse geocoding
          const mockAddress = `${Math.floor(Math.random() * 999) + 1} Emergency Street, City Center`;
          setLocationAddress(mockAddress);
          setIsGettingLocation(false);
          
          toast({
            title: "Location Found",
            description: "Your current location has been detected successfully.",
          });
        },
        (error) => {
          setIsGettingLocation(false);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter your address manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.emergencyType) {
      toast({
        title: "Missing Information",
        description: "Please select the type of emergency.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a description of the emergency.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.reporterName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your name.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.reporterPhone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your phone number.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!currentLocation && !locationAddress.trim()) {
      toast({
        title: "Missing Location",
        description: "Please provide your location or allow GPS access.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmitReport = () => {
    if (!validateForm()) return;

    // Create emergency report
    const newReport: EmergencyReport = {
      id: `ER${Date.now()}`,
      type: formData.emergencyType,
      description: formData.description,
      location: {
        address: locationAddress || "Location coordinates provided",
        coordinates: currentLocation || [51.5074, -0.1278] // Default to London if no location
      },
      reporterName: formData.reporterName,
      reporterPhone: formData.reporterPhone,
      timestamp: new Date().toISOString(),
      status: 'pending',
      severity: formData.severity
    };

    setSubmittedReport(newReport);
    setReportSubmitted(true);

    toast({
      title: "Emergency Report Submitted",
      description: "Your emergency report has been sent to nearby first aid responders. Help is on the way!",
    });

    // Simulate automatic 911 call notification
    setTimeout(() => {
      toast({
        title: "Emergency Services Notified",
        description: "Emergency services (911) have been automatically notified of your report.",
      });
    }, 2000);
  };

  if (reportSubmitted && submittedReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <CardTitle className="text-2xl">Emergency Report Submitted</CardTitle>
              <CardDescription>Your emergency report has been successfully submitted and help is on the way</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-semibold">Emergency Type</span>
                    </div>
                    <p className="text-lg font-semibold">{submittedReport.type}</p>
                    <Badge variant="destructive" className="mt-2">
                      {submittedReport.severity.toUpperCase()} PRIORITY
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Location</span>
                    </div>
                    <p className="text-sm">{submittedReport.location.address}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Navigation className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">
                        GPS: {submittedReport.location.coordinates[0].toFixed(4)}, {submittedReport.location.coordinates[1].toFixed(4)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-secondary-foreground" />
                    <span className="font-semibold">Reporter Information</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{submittedReport.reporterName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <p className="font-medium">{submittedReport.reporterPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  What Happens Next:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Certified first aid responders in your area have been notified</li>
                  <li>Emergency services (911) have been automatically contacted</li>
                  <li>A responder should arrive within 5-10 minutes</li>
                  <li>Keep your phone nearby for updates from responders</li>
                  <li>If the situation worsens, call 911 directly</li>
                </ul>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Report ID: {submittedReport.id}</strong><br />
                  Keep this ID for reference. Emergency responders have been dispatched to your location.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={onBack} variant="outline">
                  Back to Main Menu
                </Button>
                <Button variant="destructive">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 911 Directly
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <Navigation className="h-4 w-4 mr-2" />
            Back to Main Menu
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <span>Report Emergency</span>
              </CardTitle>
              <CardDescription>
                Report a medical emergency and get immediate help from certified first aid responders in your area
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Details</CardTitle>
              <CardDescription>Provide information about the emergency situation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type of Emergency *</label>
                <select
                  value={formData.emergencyType}
                  onChange={(e) => handleInputChange('emergencyType', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select emergency type...</option>
                  {emergencyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Severity Level *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="low">Low - Minor injury, conscious</option>
                  <option value="medium">Medium - Moderate injury, needs attention</option>
                  <option value="high">High - Serious injury, urgent care needed</option>
                  <option value="critical">Critical - Life-threatening, immediate help</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the emergency situation in detail..."
                  className="min-h-20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name *</label>
                  <Input
                    value={formData.reporterName}
                    onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                  <Input
                    value={formData.reporterPhone}
                    onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location Information</span>
              </CardTitle>
              <CardDescription>Your location helps responders find you quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  onClick={getCurrentLocation} 
                  disabled={isGettingLocation}
                  className="w-full"
                  variant="outline"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isGettingLocation ? 'Getting Location...' : 'Use My Current Location'}
                </Button>
                
                {currentLocation && (
                  <div className="bg-success/10 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">Location Found</span>
                    </div>
                    <p className="text-sm">{locationAddress}</p>
                    <p className="text-xs text-muted-foreground">
                      GPS: {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Or Enter Address Manually</label>
                <Textarea
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Enter your current address or describe your location..."
                  className="min-h-16"
                />
              </div>

              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  Accurate location information is crucial for emergency responders to find you quickly.
                  GPS location is preferred for fastest response time.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ready to Submit Emergency Report?</h3>
                <p className="text-sm text-muted-foreground">
                  This will immediately notify certified first aid responders and emergency services
                </p>
              </div>
              <Button 
                onClick={handleSubmitReport}
                size="lg"
                className="bg-destructive hover:bg-destructive/90"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Submit Emergency Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CivilianEmergencyReport;