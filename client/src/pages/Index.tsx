import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import StudentDashboard from "@/components/StudentDashboard";
import ExaminerDashboard from "@/components/ExaminerDashboard";
import Flashcards from "@/components/Flashcards";
import PracticeQuiz from "@/components/PracticeQuiz";
import VideoLibrary from "@/components/VideoLibrary";
import FinalTest from "@/components/FinalTest";
import PracticalTestBooking from "@/components/PracticalTestBooking";
import EmergencyResponse from "@/components/EmergencyResponse";
import ExaminerBookingManagement from "@/components/ExaminerBookingManagement";
import CivilianEmergencyReport from "@/components/CivilianEmergencyReport";
import EmergencyResponderDashboard from "@/components/EmergencyResponderDashboard";
import RevisionGuides from "@/components/RevisionGuides";

type AppState = 'role-selection' | 'student-dashboard' | 'examiner-dashboard' | 'emergency-responder-dashboard' | 'flashcards' | 'revision-guides' | 'video-library' | 'practice-quiz' | 'final-test' | 'practical-test-booking' | 'emergency-response' | 'practical-bookings' | 'create-flashcard' | 'create-mcq' | 'create-openended' | 'view-results' | 'civilian-emergency-report';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('role-selection');
  const [userRole, setUserRole] = useState<'student' | 'examiner' | 'civilian' | 'emergency-responder' | null>(null);
  const [hasPassedTheoryTest, setHasPassedTheoryTest] = useState(false);
  const [hasPassedPracticalTest, setHasPassedPracticalTest] = useState(false);

  const handleRoleSelect = (role: 'student' | 'examiner' | 'civilian' | 'emergency-responder') => {
    setUserRole(role);
    if (role === 'student') {
      setCurrentState('student-dashboard');
    } else if (role === 'examiner') {
      setCurrentState('examiner-dashboard');
    } else if (role === 'civilian') {
      setCurrentState('civilian-emergency-report');
    } else if (role === 'emergency-responder') {
      setCurrentState('emergency-responder-dashboard');
    }
  };

  const handleNavigation = (section: string) => {
    setCurrentState(section as AppState);
  };

  const handleTheoryTestPassed = () => {
    setHasPassedTheoryTest(true);
    setCurrentState('practical-test-booking');
  };

  const handlePracticalTestPassed = () => {
    setHasPassedPracticalTest(true);
    setCurrentState('emergency-response');
  };

  const handleBack = () => {
    if (currentState === 'student-dashboard' || currentState === 'examiner-dashboard' || currentState === 'civilian-emergency-report' || currentState === 'emergency-responder-dashboard') {
      setCurrentState('role-selection');
      setUserRole(null);
    } else if (userRole === 'student') {
      setCurrentState('student-dashboard');
    } else if (userRole === 'examiner') {
      setCurrentState('examiner-dashboard');
    } else if (userRole === 'civilian') {
      setCurrentState('civilian-emergency-report');
    } else if (userRole === 'emergency-responder') {
      setCurrentState('emergency-responder-dashboard');
    }
  };

  const renderCurrentView = () => {
    switch (currentState) {
      case 'role-selection':
        return <RoleSelector onRoleSelect={handleRoleSelect} />;
      
      case 'student-dashboard':
        return <StudentDashboard onBack={handleBack} onNavigate={handleNavigation} />;
      
      case 'examiner-dashboard':
        return <ExaminerDashboard onBack={handleBack} onNavigate={handleNavigation} />;
      
      case 'emergency-responder-dashboard':
        return <EmergencyResponderDashboard onBack={handleBack} />;
      
      case 'flashcards':
        return <Flashcards onBack={handleBack} />;
      
      case 'revision-guides':
        return <RevisionGuides onBack={handleBack} />;
      
      case 'video-library':
        return <VideoLibrary onBack={handleBack} />;
      
      case 'practice-quiz':
        return <PracticeQuiz onBack={handleBack} />;
      
      case 'final-test':
        return <FinalTest onBack={handleBack} onTestPassed={handleTheoryTestPassed} />;
      
      case 'practical-test-booking':
        return <PracticalTestBooking 
          onBack={handleBack} 
          onBookingComplete={handlePracticalTestPassed}
          canBook={hasPassedTheoryTest}
        />;
      
      case 'emergency-response':
        return <EmergencyResponse onBack={handleBack} hasPassedPracticalTest={hasPassedPracticalTest} />;
      
      case 'practical-bookings':
        return <ExaminerBookingManagement onBack={handleBack} />;
      
      case 'civilian-emergency-report':
        return <CivilianEmergencyReport onBack={handleBack} />;
      
      // Placeholder components for other states
      default:
        return <RoleSelector onRoleSelect={handleRoleSelect} />;
    }
  };

  return renderCurrentView();
};

export default Index;
