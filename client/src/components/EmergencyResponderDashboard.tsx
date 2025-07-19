import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MapPin, 
  Phone, 
  Clock,
  AlertTriangle,
  Truck,
  User,
  ArrowLeft,
  RefreshCw,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { EmergencyCase } from "@shared/schema";

interface EmergencyResponderDashboardProps {
  onBack: () => void;
}



const EmergencyResponderDashboard = ({ onBack }: EmergencyResponderDashboardProps) => {
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const queryClient = useQueryClient();

  // Fetch emergency cases from API
  const { 
    data: emergencyCases = [], 
    isLoading, 
    refetch 
  } = useQuery<EmergencyCase[]>({
    queryKey: ['/api/emergency-cases'],
    staleTime: 30000, // Refresh every 30 seconds for real-time updates
  });

  // Mutation for updating case status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ caseId, status }: { caseId: number; status: string }) => {
      return apiRequest(`/api/emergency-cases/${caseId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-cases'] });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-500';
      case 'dispatched': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCaseResponse = (caseId: number, action: 'respond' | 'resolve') => {
    const newStatus = action === 'respond' ? 'dispatched' : 'resolved';
    
    updateStatusMutation.mutate(
      { caseId, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: action === 'respond' ? "Response Dispatched" : "Case Resolved",
            description: action === 'respond' 
              ? "Emergency responders are on their way to the location."
              : "The emergency case has been marked as resolved.",
          });
          setSelectedCase(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update case status. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const refreshCases = () => {
    refetch();
    toast({
      title: "Cases Refreshed",
      description: "Emergency cases list has been updated."
    });
  };

  const getTimeAgo = (timestamp: string | Date) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}h ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-500" />
              <h1 className="text-3xl font-bold">Emergency Response Center</h1>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={refreshCases}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold">{emergencyCases.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-red-500">
                    {emergencyCases.filter(c => c.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dispatched</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {emergencyCases.filter(c => c.status === 'dispatched').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {emergencyCases.filter(c => c.severity === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Map */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Emergency Cases Map
              </CardTitle>
              <CardDescription>
                Click on red markers to view case details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simple SVG map representation */}
              <div className="relative w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  {/* Background */}
                  <rect width="400" height="300" fill="#f3f4f6" />
                  
                  {/* Simple road network */}
                  <path d="M0 150 L400 150" stroke="#9ca3af" strokeWidth="3" />
                  <path d="M200 0 L200 300" stroke="#9ca3af" strokeWidth="3" />
                  <path d="M0 100 L400 100" stroke="#9ca3af" strokeWidth="2" />
                  <path d="M0 200 L400 200" stroke="#9ca3af" strokeWidth="2" />
                  <path d="M100 0 L100 300" stroke="#9ca3af" strokeWidth="2" />
                  <path d="M300 0 L300 300" stroke="#9ca3af" strokeWidth="2" />
                  
                  {/* Emergency case markers */}
                  {emergencyCases.map((case_, index) => {
                    const x = 50 + (index * 70) % 300;
                    const y = 50 + Math.floor(index / 4) * 80;
                    const isActive = case_.status === 'pending';
                    
                    return (
                      <g key={case_.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill={isActive ? "#ef4444" : case_.status === 'dispatched' ? "#f59e0b" : "#10b981"}
                          stroke="white"
                          strokeWidth="2"
                          className="cursor-pointer hover:r-10 transition-all"
                          onClick={() => setSelectedCase(case_)}
                        />
                        {isActive && (
                          <circle
                            cx={x}
                            cy={y}
                            r="12"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                            opacity="0.6"
                            className="animate-ping"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
                
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Dispatched</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Cases List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Emergency Cases</CardTitle>
              <CardDescription>
                {isLoading ? "Loading cases..." : `${emergencyCases.filter(c => c.status !== 'resolved').length} active cases`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                emergencyCases
                  .filter(case_ => case_.status !== 'resolved')
                  .sort((a, b) => {
                    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                    return severityOrder[a.severity] - severityOrder[b.severity];
                  })
                  .map((case_) => (
                    <Dialog key={case_.id}>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4" style={{borderLeftColor: getSeverityColor(case_.severity).replace('bg-', '#')}}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{case_.type}</h3>
                                  <Badge className={`${getSeverityColor(case_.severity)} text-white`}>
                                    {case_.severity}
                                  </Badge>
                                  <Badge className={`${getStatusColor(case_.status)} text-white`}>
                                    {case_.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {case_.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {case_.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getTimeAgo(case_.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Emergency Case #{case_.id}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Type</label>
                              <p className="text-lg">{case_.type}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Severity</label>
                              <Badge className={`${getSeverityColor(case_.severity)} text-white`}>
                                {case_.severity}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <p className="mt-1">{case_.description}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Location</label>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{case_.location}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Coordinates: {case_.latitude}, {case_.longitude}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Reporter</label>
                              <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{case_.reporterName}</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Contact</label>
                              <div className="flex items-center gap-2 mt-1">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{case_.reporterPhone}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Reported</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{getTimeAgo(case_.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            {case_.status === 'pending' && (
                              <Button
                                onClick={() => handleCaseResponse(case_.id, 'respond')}
                                className="flex items-center gap-2"
                              >
                                <Truck className="h-4 w-4" />
                                Dispatch Response Team
                              </Button>
                            )}
                            {case_.status === 'dispatched' && (
                              <Button
                                onClick={() => handleCaseResponse(case_.id, 'resolve')}
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <Navigation className="h-4 w-4" />
                                Mark as Resolved
                              </Button>
                            )}
                            <Button variant="outline" asChild>
                              <a
                                href={`https://maps.google.com/?q=${case_.latitude},${case_.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <MapPin className="h-4 w-4" />
                                Open in Maps
                              </a>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponderDashboard;