export interface MediaSource {
  type: 'url' | 'file';
  content: string | File;
  transport?: 'dash' | 'smooth' | 'directfile';
}

export interface PlayerError {
  code?: string;
  message: string;
}
