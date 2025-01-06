export interface MediaSource {
  type: 'url' | 'file';
  content: string | File;
  transport?: 'dash' | 'smooth' | 'directfile';
  id?: string;
  title?: string;
}

export interface PlayerError {
  code?: string;
  message: string;
}

export interface PlaylistItem extends MediaSource {
  id: string;
  title: string;
  addedAt: string;
}