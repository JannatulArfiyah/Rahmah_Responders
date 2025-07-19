import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  BookOpen,
  Heart,
  Zap,
  Thermometer,
  Bandage,
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle
} from "lucide-react";

interface RevisionGuidesProps {
  onBack: () => void;
}

const RevisionGuides = ({ onBack }: RevisionGuidesProps) => {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = [
    {
      id: 'cpr',
      title: 'CPR (Cardiopulmonary Resuscitation)',
      icon: Heart,
      category: 'Critical',
      description: 'Life-saving technique for cardiac arrest',
      steps: [
        'Check for responsiveness - tap shoulders and shout "Are you okay?"',
        'Call 911 immediately or have someone else do it',
        'Position the person on their back on a firm surface',
        'Tilt head back slightly and lift chin to open airway',
        'Place heel of one hand on center of chest between nipples',
        'Place other hand on top, interlacing fingers',
        'Push hard and fast at least 2 inches deep',
        'Compress at 100-120 beats per minute',
        'Allow complete chest recoil between compressions',
        'Give 30 compressions, then 2 rescue breaths',
        'Continue cycles until emergency services arrive'
      ],
      keyPoints: [
        'Rate: 100-120 compressions per minute',
        'Depth: At least 2 inches (5cm) for adults',
        'Ratio: 30 compressions to 2 breaths',
        'Minimize interruptions'
      ]
    },
    {
      id: 'choking',
      title: 'Choking (Heimlich Maneuver)',
      icon: Zap,
      category: 'Emergency',
      description: 'Clear airway obstruction in conscious adults',
      steps: [
        'Ask "Are you choking?" - if they can speak/cough, encourage coughing',
        'If unable to speak/cough, stand behind the person',
        'Place arms around their waist',
        'Make a fist with one hand, place thumb side against abdomen',
        'Position fist just above navel, below ribcage',
        'Grasp fist with other hand',
        'Give quick upward thrusts into abdomen',
        'Continue until object is expelled or person becomes unconscious',
        'If unconscious, begin CPR'
      ],
      keyPoints: [
        'Only use if person cannot speak, cough, or breathe',
        'Thrust upward and inward',
        'Each thrust should be separate and distinct',
        'For pregnant/obese: chest thrusts instead'
      ]
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding Control',
      icon: Bandage,
      category: 'Trauma',
      description: 'Stop life-threatening bleeding',
      steps: [
        'Ensure scene safety and use personal protective equipment',
        'Apply direct pressure to wound with clean cloth/gauze',
        'Maintain firm, steady pressure',
        'Elevate injured area above heart level if possible',
        'If blood soaks through, add more layers (don\'t remove original)',
        'Apply pressure bandage to maintain pressure',
        'If bleeding continues, apply pressure to pressure points',
        'Monitor for signs of shock',
        'Call 911 for severe bleeding'
      ],
      keyPoints: [
        'Direct pressure is most effective',
        'Don\'t remove embedded objects',
        'Elevate if no fracture suspected',
        'Watch for shock symptoms'
      ]
    },
    {
      id: 'burns',
      title: 'Burn Treatment',
      icon: Thermometer,
      category: 'Injury',
      description: 'First aid for thermal burns',
      steps: [
        'Remove person from heat source safely',
        'Cool the burn with cool (not cold) running water for 10-20 minutes',
        'Remove jewelry/clothing from burned area before swelling',
        'Cover burn with sterile, non-adhesive bandage',
        'Do not break blisters',
        'Give over-the-counter pain medication if needed',
        'Seek medical attention for serious burns'
      ],
      keyPoints: [
        'Cool water, not ice',
        'Don\'t use butter, oil, or home remedies',
        'Cover with clean, dry cloth',
        'Seek help for burns larger than palm size'
      ]
    },
    {
      id: 'shock',
      title: 'Shock Management',
      icon: AlertTriangle,
      category: 'Critical',
      description: 'Recognize and treat medical shock',
      steps: [
        'Recognize signs: pale/clammy skin, rapid weak pulse, confusion',
        'Call 911 immediately',
        'Have person lie down and elevate legs 8-12 inches',
        'Keep person warm with blanket',
        'Loosen tight clothing',
        'Do not give food or water',
        'Monitor breathing and pulse',
        'Be prepared to perform CPR if needed'
      ],
      keyPoints: [
        'Early recognition is crucial',
        'Elevate legs unless spinal injury suspected',
        'Keep warm but don\'t overheat',
        'Nothing by mouth'
      ]
    },
    {
      id: 'recovery-position',
      title: 'Recovery Position',
      icon: BookOpen,
      category: 'Basic',
      description: 'Safe position for unconscious breathing person',
      steps: [
        'Kneel beside the person',
        'Place arm nearest to you at right angle to body',
        'Bring far arm across chest, place back of hand against near cheek',
        'Bend far leg at knee, keeping foot flat on ground',
        'Pull on far leg to roll person toward you onto their side',
        'Tilt head back slightly to keep airway open',
        'Monitor breathing continuously'
      ],
      keyPoints: [
        'Only use if person is unconscious but breathing',
        'Keeps airway clear',
        'Allows fluids to drain from mouth',
        'Check breathing every 2 minutes'
      ]
    }
  ];

  const emergencyNumbers = [
    { service: 'Emergency Services', number: '911', description: 'Police, Fire, Ambulance' },
    { service: 'Poison Control', number: '1-800-222-1222', description: 'Poisoning emergencies' },
    { service: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Mental health crisis' }
  ];

  const quickChecklist = [
    'Check scene safety',
    'Check responsiveness',
    'Call 911 if needed',
    'Check breathing',
    'Control bleeding',
    'Treat for shock',
    'Monitor vital signs'
  ];

  if (selectedGuide) {
    const guide = guides.find(g => g.id === selectedGuide);
    if (!guide) return null;

    const Icon = guide.icon;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => setSelectedGuide(null)}>
              <ArrowLeft className="h-4 w-4" />
              Back to Guides
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon className="h-6 w-6 text-primary" />
                {guide.title}
              </h1>
              <p className="text-muted-foreground">{guide.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Step-by-Step Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guide.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={
                    guide.category === 'Critical' ? 'destructive' :
                    guide.category === 'Emergency' ? 'default' :
                    guide.category === 'Trauma' ? 'secondary' :
                    'outline'
                  }>
                    {guide.category}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Revision Guides
            </h1>
            <p className="text-muted-foreground">Quick reference guides and step-by-step instructions</p>
          </div>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guides">Quick Guides</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
            <TabsTrigger value="checklist">Quick Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Card 
                    key={guide.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedGuide(guide.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          guide.category === 'Critical' ? 'bg-destructive/10' :
                          guide.category === 'Emergency' ? 'bg-primary/10' :
                          guide.category === 'Trauma' ? 'bg-secondary/10' :
                          'bg-muted/10'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            guide.category === 'Critical' ? 'text-destructive' :
                            guide.category === 'Emergency' ? 'text-primary' :
                            guide.category === 'Trauma' ? 'text-secondary-foreground' :
                            'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">
                            {guide.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm">
                        {guide.description}
                      </CardDescription>
                      <div className="mt-3 text-xs text-muted-foreground">
                        {guide.steps.length} steps
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-destructive" />
                    Emergency Numbers
                  </CardTitle>
                  <CardDescription>Important numbers to remember</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencyNumbers.map((contact, index) => (
                      <div key={index} className="border-l-4 border-l-destructive pl-4">
                        <div className="font-semibold text-lg">{contact.number}</div>
                        <div className="font-medium">{contact.service}</div>
                        <div className="text-sm text-muted-foreground">{contact.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-warning" />
                    When to Call 911
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Person is unconscious or unresponsive</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Severe bleeding that won't stop</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Signs of heart attack or stroke</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Difficulty breathing or choking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Severe burns or electrical injury</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Suspected spinal injury</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Response Checklist</CardTitle>
                <CardDescription>Follow this sequence in any emergency situation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {quickChecklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-destructive/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-destructive mb-2">Remember: ABC</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>A</strong>irway - Keep it clear</div>
                        <div><strong>B</strong>reathing - Check and assist</div>
                        <div><strong>C</strong>irculation - Control bleeding</div>
                      </div>
                    </div>
                    
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Stay Calm</h4>
                      <p className="text-sm">Your calm demeanor helps the victim and allows you to think clearly and act effectively.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RevisionGuides;