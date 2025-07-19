import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Play,
  Clock,
  CheckCircle,
  PlayCircle
} from "lucide-react";

interface VideoLibraryProps {
  onBack: () => void;
}

const VideoLibrary = ({ onBack }: VideoLibraryProps) => {
  const [watchedVideos, setWatchedVideos] = useState<number[]>([1, 3, 5]);

  const videos = [
    {
      id: 1,
      title: "Basic CPR Techniques",
      description: "Learn the fundamentals of cardiopulmonary resuscitation",
      duration: "8 min",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
      category: "CPR"
    },
    {
      id: 2,
      title: "Heimlich Maneuver",
      description: "How to help someone who is choking",
      duration: "5 min",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=225&fit=crop",
      category: "Choking"
    },
    {
      id: 3,
      title: "Treating Burns and Scalds",
      description: "First aid for different types of burns",
      duration: "6 min",
      thumbnail: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=225&fit=crop",
      category: "Burns"
    },
    {
      id: 4,
      title: "Wound Care and Bandaging",
      description: "Proper techniques for cleaning and dressing wounds",
      duration: "7 min",
      thumbnail: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=225&fit=crop",
      category: "Wounds"
    },
    {
      id: 5,
      title: "Managing Shock",
      description: "Recognizing and treating medical shock",
      duration: "6 min",
      thumbnail: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&h=225&fit=crop",
      category: "Emergency"
    },
    {
      id: 6,
      title: "Fracture Support",
      description: "How to stabilize suspected fractures",
      duration: "9 min",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop",
      category: "Fractures"
    }
  ];

  const categories = [...new Set(videos.map(video => video.category))];
  const totalVideos = videos.length;
  const watchedCount = watchedVideos.length;
  const progressPercentage = Math.round((watchedCount / totalVideos) * 100);

  const handleVideoClick = (videoId: number) => {
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos([...watchedVideos, videoId]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Video Library</h1>
            <p className="text-muted-foreground">Learn first aid through instructional videos</p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-accent-foreground" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Videos Watched</span>
                <span>{watchedCount}/{totalVideos} ({progressPercentage}%)</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => {
                  const categoryVideos = videos.filter(v => v.category === category);
                  const categoryWatched = categoryVideos.filter(v => watchedVideos.includes(v.id)).length;
                  return (
                    <Badge key={category} variant="outline">
                      {category}: {categoryWatched}/{categoryVideos.length}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const isWatched = watchedVideos.includes(video.id);
            return (
              <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-t-lg">
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={() => handleVideoClick(video.id)}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  {isWatched && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-6 w-6 text-success bg-background rounded-full" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{video.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration}</span>
                    {isWatched && (
                      <Badge variant="outline" className="ml-auto text-success border-success">
                        Watched
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoLibrary;