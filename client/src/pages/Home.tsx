import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPlayer } from "@/components/MediaPlayer";
import { UploadForm } from "@/components/UploadForm";
import { PlaylistManager } from "@/components/PlaylistManager";
import { useToast } from "@/hooks/use-toast";
import type { MediaSource, PlaylistItem } from "@/lib/types";

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function Home() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentItem, setCurrentItem] = useState<PlaylistItem | null>(null);
  const { toast } = useToast();

  const handleError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: error,
    });
  };

  const handleMediaSelect = useCallback((source: MediaSource) => {
    const newItem: PlaylistItem = {
      ...source,
      id: generateId(),
      title: source.type === 'file' 
        ? (source.content as File).name 
        : source.content as string,
      addedAt: new Date().toISOString(),
    };

    setPlaylist(prev => [...prev, newItem]);
    if (!currentItem) {
      setCurrentItem(newItem);
    }
  }, [currentItem]);

  const handleReorder = useCallback((sourceIndex: number, destinationIndex: number) => {
    setPlaylist(prev => {
      const items = [...prev];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, removed);
      return items;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPlaylist(prev => prev.filter(item => item.id !== id));
    if (currentItem?.id === id) {
      setCurrentItem(null);
    }
  }, [currentItem]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">RxPlayer Media Player</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadForm 
              onMediaSelect={handleMediaSelect} 
              onError={handleError}
            />
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-[1fr,300px]">
          {currentItem && (
            <Card>
              <CardContent className="p-6">
                <MediaPlayer 
                  source={currentItem} 
                  onError={handleError}
                />
              </CardContent>
            </Card>
          )}

          <PlaylistManager
            playlist={playlist}
            currentItem={currentItem}
            onReorder={handleReorder}
            onSelect={setCurrentItem}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  );
}