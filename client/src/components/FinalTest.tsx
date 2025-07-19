import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinalTestProps {
  onBack: () => void;
  onTestPassed: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'open-ended';
  openEndedAnswer?: string;
}

const FinalTest = ({ onBack, onTestPassed }: FinalTestProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | string)[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [openEndedInput, setOpenEndedInput] = useState("");

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the first step in assessing an unconscious casualty?",
      options: ["Check for breathing", "Check for response", "Call for help", "Check pulse"],
      correctAnswer: 1,
      type: 'multiple-choice'
    },
    {
      id: 2,
      question: "How many chest compressions should be given per minute during CPR?",
      options: ["80-100", "100-120", "120-140", "60-80"],
      correctAnswer: 1,
      type: 'multiple-choice'
    },
    {
      id: 3,
      question: "Describe the recovery position and explain when it should be used.",
      options: [],
      correctAnswer: 0,
      type: 'open-ended',
      openEndedAnswer: "The recovery position is used for unconscious casualties who are breathing normally. Place the casualty on their side with the head tilted back and chin lifted to keep the airway open. This prevents the tongue from blocking the airway and allows fluids to drain from the mouth."
    },
    {
      id: 4,
      question: "What is the compression to ventilation ratio for adult CPR?",
      options: ["15:2", "30:2", "5:1", "10:2"],
      correctAnswer: 1,
      type: 'multiple-choice'
    },
    {
      id: 5,
      question: "Explain the steps to treat severe bleeding.",
      options: [],
      correctAnswer: 0,
      type: 'open-ended',
      openEndedAnswer: "Apply direct pressure to the wound using a clean pad or cloth. Raise the injured part above the level of the heart if possible. Apply a bandage firmly over the pad. If bleeding continues, apply another pad over the first and bandage firmly. Call emergency services if bleeding is severe."
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitTest();
    }
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleOpenEndedSubmit = () => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = openEndedInput;
    setSelectedAnswers(newAnswers);
    setOpenEndedInput("");
  };

  const handleNext = () => {
    if (questions[currentQuestion].type === 'open-ended' && !selectedAnswers[currentQuestion]) {
      handleOpenEndedSubmit();
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      if (questions[currentQuestion + 1].type === 'open-ended') {
        setOpenEndedInput(selectedAnswers[currentQuestion + 1] as string || "");
      }
    } else {
      handleSubmitTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      if (questions[currentQuestion - 1].type === 'open-ended') {
        setOpenEndedInput(selectedAnswers[currentQuestion - 1] as string || "");
      }
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (question.type === 'multiple-choice') {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      } else {
        // For open-ended questions, we'll give full marks for any substantial answer
        const answer = selectedAnswers[index] as string;
        if (answer && answer.trim().length > 20) {
          correctAnswers++;
        }
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmitTest = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsCompleted(true);
    
    if (finalScore >= 80) {
      toast({
        title: "Congratulations!",
        description: "You have passed the final theory test. You can now book a practical test.",
      });
      setTimeout(() => onTestPassed(), 3000);
    } else {
      toast({
        title: "Test Not Passed",
        description: "You need at least 80% to pass. Please study more and try again.",
        variant: "destructive",
      });
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Test Results</CardTitle>
              <CardDescription>Final Theory Test Completed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  {score >= 80 ? (
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-2" />
                  ) : (
                    <XCircle className="h-16 w-16 text-destructive mx-auto mb-2" />
                  )}
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {score.toFixed(1)}%
                </h3>
                <Badge variant={score >= 80 ? "default" : "destructive"} className="text-lg px-4 py-2">
                  {score >= 80 ? "PASSED" : "FAILED"}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{questions.length}</div>
                      <div className="text-sm text-muted-foreground">Total Questions</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-success">
                        {Math.round((score / 100) * questions.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Correct Answers</div>
                    </CardContent>
                  </Card>
                </div>
                
                {score >= 80 ? (
                  <div className="text-center space-y-2">
                    <p className="text-lg text-success">
                      Congratulations! You have passed the theory test.
                    </p>
                    <p className="text-muted-foreground">
                      You will now be redirected to book your practical test.
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <p className="text-lg text-destructive">
                      You need at least 80% to pass the theory test.
                    </p>
                    <p className="text-muted-foreground">
                      Please review the materials and try again.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button onClick={onBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Final Theory Test</CardTitle>
                  <CardDescription>
                    Question {currentQuestion + 1} of {questions.length}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
            <Badge variant="outline">
              {currentQ.type === 'multiple-choice' ? 'Multiple Choice' : 'Open Ended'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.type === 'multiple-choice' ? (
              <div className="space-y-2">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={openEndedInput}
                  onChange={(e) => setOpenEndedInput(e.target.value)}
                  placeholder="Write your detailed answer here..."
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Provide a detailed explanation (minimum 20 characters required)
                </p>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={
                  currentQ.type === 'multiple-choice' 
                    ? selectedAnswers[currentQuestion] === undefined
                    : (currentQ.type === 'open-ended' && (!openEndedInput || openEndedInput.trim().length < 20))
                }
              >
                {currentQuestion === questions.length - 1 ? 'Submit Test' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinalTest;