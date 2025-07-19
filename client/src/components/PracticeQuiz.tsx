import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Brain,
  Trophy,
  Target
} from "lucide-react";

interface PracticeQuizProps {
  onBack: () => void;
}

const PracticeQuiz = ({ onBack }: PracticeQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes

  const questions = [
    {
      id: 0,
      question: "What is the normal rate for chest compressions during CPR?",
      options: [
        "60-80 compressions per minute",
        "100-120 compressions per minute", 
        "140-160 compressions per minute",
        "180-200 compressions per minute"
      ],
      correct: 1,
      explanation: "The recommended rate is 100-120 compressions per minute for effective CPR."
    },
    {
      id: 1,
      question: "How deep should chest compressions be for an adult?",
      options: [
        "1-2 inches (2.5-5 cm)",
        "2-2.4 inches (5-6 cm)",
        "3-4 inches (7.5-10 cm)",
        "As deep as possible"
      ],
      correct: 1,
      explanation: "Compressions should be at least 2 inches (5 cm) but no more than 2.4 inches (6 cm) deep."
    },
    {
      id: 2,
      question: "What should you do if someone is choking but can still cough and speak?",
      options: [
        "Immediately perform the Heimlich maneuver",
        "Encourage them to keep coughing",
        "Give back blows immediately",
        "Call emergency services first"
      ],
      correct: 1,
      explanation: "If they can cough and speak, the airway isn't completely blocked. Encourage continued coughing."
    },
    {
      id: 3,
      question: "What is the primary treatment for severe external bleeding?",
      options: [
        "Apply a tourniquet immediately",
        "Rinse the wound with water",
        "Apply direct pressure to the wound",
        "Elevate the affected area only"
      ],
      correct: 2,
      explanation: "Direct pressure is the most effective first step to control severe bleeding."
    },
    {
      id: 4,
      question: "When checking for consciousness, what should you do?",
      options: [
        "Shake the person vigorously",
        "Tap shoulders and shout 'Are you okay?'",
        "Check for a pulse first",
        "Pour water on their face"
      ],
      correct: 1,
      explanation: "Tap shoulders firmly and shout to check responsiveness without causing potential harm."
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1] || "");
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || "");
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (parseInt(answer) === questions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    const correctCount = answers.filter((answer, index) => 
      parseInt(answer) === questions[index].correct
    ).length;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="text-center mb-8">
            <div className="mb-4">
              <Trophy className="h-16 w-16 mx-auto text-warning" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground">Here are your results</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold mb-4 text-primary">{score}%</div>
              <div className="text-xl mb-2">
                {correctCount} out of {questions.length} correct
              </div>
              <Badge 
                className={`text-lg px-4 py-2 ${
                  score >= 90 ? 'bg-success text-success-foreground' :
                  score >= 80 ? 'bg-warning text-warning-foreground' :
                  'bg-destructive text-destructive-foreground'
                }`}
              >
                {score >= 90 ? 'Excellent!' : score >= 80 ? 'Good Work!' : 'Keep Studying!'}
              </Badge>
            </CardContent>
          </Card>

          {/* Answer Review */}
          <div className="space-y-4 mb-6">
            {questions.map((question, index) => {
              const userAnswer = parseInt(answers[index]);
              const isCorrect = userAnswer === question.correct;
              
              return (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-success mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive mt-1" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-sm mb-2">
                          Question {index + 1}
                        </CardTitle>
                        <p className="text-sm">{question.question}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Your answer:</span>
                        <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                          {question.options[userAnswer]}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Correct answer:</span>
                          <span className="text-success">
                            {question.options[question.correct]}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground text-xs bg-muted p-2 rounded">
                        {question.explanation}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer("");
              setAnswers([]);
              setShowResults(false);
            }}>
              <Target className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Practice Quiz
              </h1>
              <p className="text-muted-foreground">Test your first aid knowledge</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} / {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Question {currentQuestion + 1}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Question {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{currentQ.question}</p>
            
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-sm"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!selectedAnswer}
            variant={currentQuestion === questions.length - 1 ? "default" : "outline"}
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuiz;