import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, GraduationCap, Stethoscope, BookOpen, AlertTriangle, Truck } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: 'student' | 'examiner' | 'civilian' | 'emergency-responder') => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'examiner' | 'civilian' | 'emergency-responder' | null>(null);

  const roles = [
    {
      id: 'student' as const,
      title: 'Student',
      description: 'Learn first aid through interactive flashcards and practice tests',
      icon: GraduationCap,
      features: ['Study Flashcards', 'Practice Quizzes', 'Track Progress', 'Take Final Test'],
      color: 'primary'
    },
    {
      id: 'examiner' as const,
      title: 'Examiner',
      description: 'Create content and manage student assessments',
      icon: UserCheck,
      features: ['Create Questions', 'Manage Content', 'View Results', 'Grade Tests'],
      color: 'secondary'
    },
    {
      id: 'civilian' as const,
      title: 'Emergency Reporter',
      description: 'Report medical emergencies and get immediate first aid help',
      icon: AlertTriangle,
      features: ['Report Emergencies', 'Share GPS Location', 'Get Immediate Help', 'Connect with Responders'],
      color: 'destructive'
    },
    {
      id: 'emergency-responder' as const,
      title: 'Emergency Responder',
      description: 'Monitor and respond to emergency cases on the map',
      icon: Truck,
      features: ['View Emergency Map', 'See Case Details', 'Respond to Emergencies', 'Track Active Cases'],
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/Rahmah Responders Logo.jpg" 
              alt="Rahmah Responders Logo" 
              className="h-32 w-32 object-contain rounded-lg shadow-lg"
            />
          </div>
          <p className="text-xl font-[Poppins] text-muted-foreground">
            First Aid Training Platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${
                      role.id === 'student' ? 'bg-primary/10' : 
                      role.id === 'examiner' ? 'bg-secondary/10' : 
                      role.id === 'civilian' ? 'bg-destructive/10' : 'bg-blue-500/10'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        role.id === 'student' ? 'text-primary' : 
                        role.id === 'examiner' ? 'text-secondary-foreground' : 
                        role.id === 'civilian' ? 'text-destructive' : 'text-blue-500'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedRole && (
          <div className="text-center">
            <Button 
              onClick={() => onRoleSelect(selectedRole)}
              variant="medical"
              size="lg"
              className="text-lg px-8 py-3"
            >
              Continue as {
                selectedRole === 'student' ? 'Student' : 
                selectedRole === 'examiner' ? 'Examiner' : 
                selectedRole === 'civilian' ? 'Emergency Reporter' : 'Emergency Responder'
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;