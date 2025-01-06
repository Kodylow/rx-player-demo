import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlayer } from "@/components/MediaPlayer";
import { UploadForm } from "@/components/UploadForm";
import { useToast } from "@/hooks/use-toast";
import type { MediaSource } from "@/lib/types";

export default function Home() {
  const [mediaSource, setMediaSource] = useState<MediaSource | null>(null);
  const { toast } = useToast();

  const handleError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: error,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">RxPlayer Media Player</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadForm 
              onMediaSelect={setMediaSource} 
              onError={handleError}
            />
          </CardContent>
        </Card>

        {mediaSource && (
          <Card>
            <CardContent className="p-6">
              <MediaPlayer 
                source={mediaSource} 
                onError={handleError}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
