import { useState, useRef, useCallback } from 'react';
import { Upload, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
  selectedVideo: File | null;
  onRemoveVideo: () => void;
}

export const VideoUpload = ({ onVideoSelect, selectedVideo, onRemoveVideo }: VideoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        onVideoSelect(file);
        toast.success('Video uploaded successfully!');
      } else {
        toast.error('Please select a valid video file.');
      }
    }
  }, [onVideoSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        onVideoSelect(file);
        toast.success('Video uploaded successfully!');
      } else {
        toast.error('Please select a valid video file.');
      }
    }
  }, [onVideoSelect]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedVideo) {
    return (
      <div className="glass-strong rounded-xl p-6 border-2 border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{selectedVideo.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onRemoveVideo}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`upload-zone glass-strong rounded-xl p-12 border-2 border-dashed text-center cursor-pointer ${
          isDragOver ? 'border-primary bg-primary/5 scale-105' : 'border-glass-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Upload Your Video
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your video file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports MP4, MOV, AVI, and more
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};