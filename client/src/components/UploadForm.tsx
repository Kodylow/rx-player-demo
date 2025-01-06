import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link } from 'lucide-react';
import type { MediaSource } from '@/lib/types';

interface UploadFormProps {
  onMediaSelect: (source: MediaSource) => void;
  onError: (error: string) => void;
}

export function UploadForm({ onMediaSelect, onError }: UploadFormProps) {
  const [url, setUrl] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      onError('File size exceeds 100MB limit');
      return;
    }

    // Check supported formats
    const supportedTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'audio/mpeg',
      'audio/ogg',
      'audio/wav'
    ];

    if (!supportedTypes.includes(file.type)) {
      onError('Unsupported file format');
      return;
    }

    onMediaSelect({
      type: 'file',
      content: file,
      transport: 'directfile'
    });
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      onError('Please enter a valid URL');
      return;
    }

    try {
      new URL(url);
      
      // Determine transport type based on URL
      let transport: 'dash' | 'smooth' | 'directfile' = 'directfile';
      if (url.endsWith('.mpd')) {
        transport = 'dash';
      } else if (url.includes('/Manifest')) {
        transport = 'smooth';
      }

      onMediaSelect({
        type: 'url',
        content: url,
        transport
      });
    } catch {
      onError('Please enter a valid URL');
    }
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">File Upload</TabsTrigger>
        <TabsTrigger value="url">URL Input</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-4">
        <div className="space-y-4">
          <Label htmlFor="file">Upload Media File</Label>
          <Input
            id="file"
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground">
            Supported formats: MP4, WebM, OGG, MP3, WAV (max 100MB)
          </p>
        </div>
      </TabsContent>

      <TabsContent value="url" className="mt-4">
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Media URL</Label>
            <Input
              id="url"
              type="text"
              placeholder="Enter media URL (DASH, Smooth Streaming, or direct file)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="submit">
            <Link className="mr-2 h-4 w-4" />
            Load URL
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
