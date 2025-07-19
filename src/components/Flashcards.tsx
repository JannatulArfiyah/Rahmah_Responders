import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  X, 
  Brain,
  ChevronLeft,
  ChevronRight,
  Shuffle
} from "lucide-react";

interface FlashcardsProps {
  onBack: () => void;
}

const Flashcards = ({ onBack }: FlashcardsProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [difficultCards, setDifficultCards] = useState<Set<number>>(new Set());
  
  const flashcards = [
    {
      id: 0,
      front: "What is the first step when approaching an unconscious person?",
      back: "Check for responsiveness by tapping their shoulders and shouting 'Are you okay?' while ensuring your own safety first.",
      category: "Basic Assessment",
      difficulty: "Basic"
    },
    {
      id: 1,
      front: "What does CPR stand for and when should it be used?",
      back: "Cardiopulmonary Resuscitation. Used when someone is unresponsive and not breathing normally or at all.",
      category: "CPR",
      difficulty: "Basic"
    },
    {
      id: 2,
      front: "What is the correct hand position for chest compressions in adults?",
      back: "Place the heel of one hand on the center of the chest between the nipples, place the other hand on top with fingers interlaced.",
      category: "CPR",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      front: "How do you treat a severe bleeding wound?",
      back: "Apply direct pressure with a clean cloth, elevate the wound above heart level if possible, and call emergency services.",
      category: "Bleeding Control",
      difficulty: "Basic"
    },
    {
      id: 4,
      front: "What are the signs of shock in a casualty?",
      back: "Pale, cold, clammy skin; rapid weak pulse; shallow breathing; restlessness or confusion; thirst; nausea.",
      category: "Shock",
      difficulty: "Intermediate"
    }
  ];

  const currentFlashcard = flashcards[currentCard];
  const progress = ((currentCard + 1) / flashcards.length) * 100;

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const markAsMastered = () => {
    setMasteredCards(prev => new Set([...prev, currentCard]));
    difficultCards.delete(currentCard);
    setDifficultCards(new Set(difficultCards));
    nextCard();
  };

  const markAsDifficult = () => {
    setDifficultCards(prev => new Set([...prev, currentCard]));
    masteredCards.delete(currentCard);
    setMasteredCards(new Set(masteredCards));
    nextCard();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return 'bg-success/10 text-success';
      case 'Intermediate': return 'bg-warning/10 text-warning';
      case 'Advanced': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

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
                Study Flashcards
              </h1>
              <p className="text-muted-foreground">Master first aid concepts</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-lg font-semibold">{currentCard + 1} / {flashcards.length}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Started</span>
            <span>{Math.round(progress)}% Complete</span>
            <span>Finished</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{masteredCards.size}</div>
              <div className="text-sm text-muted-foreground">Mastered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{difficultCards.size}</div>
              <div className="text-sm text-muted-foreground">Difficult</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {flashcards.length - masteredCards.size - difficultCards.size}
              </div>
              <div className="text-sm text-muted-foreground">Studying</div>
            </CardContent>
          </Card>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <Card className="h-80 cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <CardContent className="p-8 h-full flex flex-col justify-center relative">
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentFlashcard.category}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(currentFlashcard.difficulty)}`}>
                  {currentFlashcard.difficulty}
                </Badge>
              </div>
              
              <div className="text-center">
                {!isFlipped ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Question</h3>
                    <p className="text-lg leading-relaxed">{currentFlashcard.front}</p>
                    <div className="mt-6 text-sm text-muted-foreground">
                      Click to reveal answer
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">Answer</h3>
                    <p className="text-lg leading-relaxed">{currentFlashcard.back}</p>
                    <div className="mt-6 text-sm text-muted-foreground">
                      How well did you know this?
                    </div>
                  </div>
                )}
              </div>

              {masteredCards.has(currentCard) && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-success text-success-foreground">
                    <Check className="h-3 w-3 mr-1" />
                    Mastered
                  </Badge>
                </div>
              )}

              {difficultCards.has(currentCard) && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-warning text-warning-foreground">
                    <X className="h-3 w-3 mr-1" />
                    Difficult
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={prevCard} 
            disabled={currentCard === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsFlipped(!isFlipped)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Flip Card
            </Button>
          </div>

          <Button 
            variant="outline" 
            onClick={nextCard} 
            disabled={currentCard === flashcards.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Action Buttons (only show when flipped) */}
        {isFlipped && (
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={markAsDifficult} className="border-warning text-warning">
              <X className="h-4 w-4 mr-2" />
              Still Learning
            </Button>
            <Button variant="default" onClick={markAsMastered} className="bg-success hover:bg-success/90">
              <Check className="h-4 w-4 mr-2" />
              Got It!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;