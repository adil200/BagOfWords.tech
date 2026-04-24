'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BUCKET_ID, PROJECT_ID } from '@/lib/file-mapping';
import { Copy, Search, Upload, Trash2, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { uploadImage, getAllImages } from './actions';

export default function MediaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ filename: string; fileId: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch images on mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const result = await getAllImages();
      console.log('getAllImages result:', result);
      if (result.success) {
        setImages(result.images);
        console.log('Loaded images:', result.images.length);
      } else {
        console.error('Failed to load images:', result.message);
        toast({
          title: 'Error Loading Images',
          description: result.message || 'Failed to fetch images from storage',
          variant: 'destructive',
        });
        setImages([]);
      }
    } catch (error: any) {
      console.error('Error in loadImages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media library',
        variant: 'destructive',
      });
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = images.filter(img =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImage(formData);

      if (result.success) {
        // Copy file ID to clipboard
        navigator.clipboard.writeText(result.fileId || '');
        
        toast({
          title: 'Success!',
          description: `Image "${result.filename}" uploaded successfully. File ID copied to clipboard.`,
          duration: 5000,
        });

        // Reload images to show the new one
        await loadImages();
      } else {
        toast({
          title: 'Upload Failed',
          description: result.message,
          variant: 'destructive',
        });
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your article images and media files
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={loadImages}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            className="bg-accent hover:bg-accent/90" 
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total: {images.length} images</span>
        <span>•</span>
        <span>Filtered: {filteredImages.length} images</span>
      </div>

      {/* Image Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold text-lg mb-2">No images found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try a different search term' : 'No images available'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card
              key={image.fileId}
              className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-sm truncate mb-2">{image.filename}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(image.filename, 'Filename');
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Name
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Detail Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedImage.filename}</DialogTitle>
              <DialogDescription>Image details and actions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Preview */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Filename</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={selectedImage.filename} readOnly />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedImage.filename, 'Filename')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">File ID</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={selectedImage.fileId} readOnly />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedImage.fileId, 'File ID')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Preview URL</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={selectedImage.url} readOnly />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedImage.url, 'URL')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Usage in Article</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={`coverImage: '${selectedImage.filename}'`}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(`coverImage: '${selectedImage.filename}'`, 'Usage code')
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Close
                </Button>
                <Button variant="destructive" disabled>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete (Coming Soon)
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
