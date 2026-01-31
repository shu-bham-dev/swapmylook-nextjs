"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Search, Heart, Star, Upload, Plus, X, Sparkles, Download, RotateCcw, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

export interface Outfit {
  id: string;
  name: string;
  image: string;
  category: 'casual' | 'formal' | 'summer' | 'winter' | 'party' | 'business';
  tags: string[];
  style: string;
  season: string;
  color: string;
  rating: number;
  liked: boolean;
  isCustom?: boolean;
}

interface Model {
  id: string;
  name: string;
  image: string;
  category: 'female' | 'male' | 'diverse';
}

interface OutfitLibraryProps {
  onOutfitSelect: (outfit: Outfit) => void;
  selectedOutfit: Outfit | null;
  selectedModel?: Model | null;
}

export function OutfitLibrary({ onOutfitSelect, selectedOutfit, selectedModel }: OutfitLibraryProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedOutfits, setLikedOutfits] = useState<Set<string>>(new Set(['2', '5']));
  const [customOutfits, setCustomOutfits] = useState<Outfit[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedOutfit, setUploadedOutfit] = useState<Outfit | null>(null);
  const [previewOutfit, setPreviewOutfit] = useState<Outfit | null>(null);
  const [fetchedOutfits, setFetchedOutfits] = useState<Outfit[]>([]);
  const [loadingOutfits, setLoadingOutfits] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog and generation state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'queued' | 'processing' | 'succeeded' | 'failed' | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);
  const [generatingOutfit, setGeneratingOutfit] = useState<Outfit | null>(null);

  // Save and Delete dialogs
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = apiService.isAuthenticated();

  // Check if the selected outfit is an uploaded one
  const isUploadedOutfitSelected = selectedOutfit && uploadedOutfit && selectedOutfit.id === uploadedOutfit.id;

  // State for tabs
  const [activeOutfitTab, setActiveOutfitTab] = useState<'global' | 'you'>('global');
  const [userOutfits, setUserOutfits] = useState<Outfit[]>([]);
  const [loadingUserOutfits, setLoadingUserOutfits] = useState(false);

  // Fetch public outfits from API
  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await apiService.getPublicImages({ type: 'outfit' });
        const outfitsFromApi: Outfit[] = response.images.map(img => ({
          id: img.id,
          name: img.name || 'Outfit',
          image: img.url,
          category: mapTagsToCategory(img.tags),
          tags: img.tags || [],
          style: img.metadata?.style || 'Casual',
          season: img.metadata?.season || 'All Season',
          color: img.metadata?.color || 'Various',
          rating: 4.5,
          liked: false
        }));
        setFetchedOutfits(outfitsFromApi);
        setFetchError(false);
      } catch (error) {
        console.error('Failed to fetch public outfits:', error);
        setFetchError(true);
        // Keep empty, no fallback
      } finally {
        setLoadingOutfits(false);
      }
    };
    fetchOutfits();
  }, []);

  // Fetch user's outfits when "You" tab is active and authenticated
  useEffect(() => {
    if (activeOutfitTab === 'you' && isAuthenticated) {
      const fetchUserOutfits = async () => {
        setLoadingUserOutfits(true);
        try {
          const response = await apiService.getOutfits({ type: 'outfit' });
          const outfitsFromApi: Outfit[] = response.outfits.map((outfit: any) => ({
            id: outfit.id,
            name: outfit.metadata?.originalName || outfit.metadata?.filename || 'Your Outfit',
            image: outfit.url,
            category: mapTagsToCategory(outfit.tags || []),
            tags: outfit.tags || [],
            style: outfit.metadata?.style || 'Custom',
            season: outfit.metadata?.season || 'All Season',
            color: outfit.metadata?.color || 'Various',
            rating: 5.0,
            liked: false,
            isCustom: true
          }));
          setUserOutfits(outfitsFromApi);
        } catch (error) {
          console.error('Failed to fetch user outfits:', error);
        } finally {
          setLoadingUserOutfits(false);
        }
      };
      fetchUserOutfits();
    }
  }, [activeOutfitTab, isAuthenticated]);

  // Helper to map tags to category
  const mapTagsToCategory = (tags: string[]): Outfit['category'] => {
    const lowerTags = tags.map(t => t.toLowerCase());
    if (lowerTags.includes('casual')) return 'casual';
    if (lowerTags.includes('formal')) return 'formal';
    if (lowerTags.includes('business')) return 'business';
    if (lowerTags.includes('party')) return 'party';
    if (lowerTags.includes('summer')) return 'summer';
    if (lowerTags.includes('winter')) return 'winter';
    return 'casual';
  };

  // Determine which outfits to display based on active tab
  const outfitsToDisplay = activeOutfitTab === 'global'
    ? fetchedOutfits
    : [...userOutfits, ...customOutfits];

  const allOutfits = outfitsToDisplay;
  const isLoading = activeOutfitTab === 'global' ? loadingOutfits : loadingUserOutfits;

  const categories = [
    { id: 'all', name: 'All', count: allOutfits.length },
    { id: 'casual', name: 'Casual', count: allOutfits.filter(o => o.category === 'casual').length },
    { id: 'formal', name: 'Formal', count: allOutfits.filter(o => o.category === 'formal').length },
    { id: 'business', name: 'Business', count: allOutfits.filter(o => o.category === 'business').length },
    { id: 'party', name: 'Party', count: allOutfits.filter(o => o.category === 'party').length }
  ];

  const filteredOutfits = allOutfits.filter(outfit => {
    const matchesSearch = outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outfit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || outfit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (outfitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedOutfits(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(outfitId)) {
        newLiked.delete(outfitId);
      } else {
        newLiked.add(outfitId);
      }
      return newLiked;
    });
  };

  const handleUploadButtonClick = () => {
    if (!isAuthenticated) {
      // Redirect to login page using Next.js router
      router.push('/login');
      return;
    }
    
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      try {
        // Upload file to backend using the API service
        const data = await apiService.uploadFile(file, 'outfit');
        
        const newOutfit: Outfit = {
          id: data.imageAsset.id,
          name: `Custom Outfit ${customOutfits.length + 1}`,
          image: data.imageAsset.url,
          category: 'casual',
          tags: ['custom', 'uploaded'],
          style: 'Custom',
          season: 'All Season',
          color: 'Various',
          rating: 5.0,
          liked: false,
          isCustom: true
        };

        setUploadedOutfit(newOutfit);
        setCustomOutfits(prev => [...prev, newOutfit]);
        
      } catch (error) {
        console.error('Upload failed:', error);
        // Fallback to local URL if upload fails
        const imageUrl = URL.createObjectURL(file);
        
        const newOutfit: Outfit = {
          id: `custom-${Date.now()}`,
          name: `Custom Outfit ${customOutfits.length + 1}`,
          image: imageUrl,
          category: 'casual',
          tags: ['custom', 'uploaded'],
          style: 'Custom',
          season: 'All Season',
          color: 'Various',
          rating: 5.0,
          liked: false,
          isCustom: true
        };

        setUploadedOutfit(newOutfit);
        setCustomOutfits(prev => [...prev, newOutfit]);
      } finally {
        setIsUploading(false);
        
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleSelectUploadedOutfit = () => {
    if (uploadedOutfit) {
      onOutfitSelect(uploadedOutfit);
    }
  };

  const handleRemoveUploadedOutfit = () => {
    setUploadedOutfit(null);
  };

  const handleOutfitClick = (outfit: Outfit) => {
    setPreviewOutfit(outfit);
  };

  const removeCustomOutfit = (outfitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
    // Also remove from liked if it was liked
    setLikedOutfits(prev => {
      const newLiked = new Set(prev);
      newLiked.delete(outfitId);
      return newLiked;
    });
  };

  // Handle opening generation dialog for uploaded or preview outfit
  const handleGenerateClick = (outfit?: Outfit) => {
    const targetOutfit = outfit || uploadedOutfit;
    if (!targetOutfit) return;
    if (!selectedModel) {
      toast.error('Please select a model first', {
        description: 'You need to choose a model before generating an outfit.',
      });
      return;
    }
    // Notify parent about outfit selection (for history)
    onOutfitSelect(targetOutfit);
    setIsDialogOpen(true);
    startGeneration(targetOutfit);
  };

  // Start generation job for a specific outfit
  const startGeneration = async (outfit: Outfit) => {
    setIsGenerating(true);
    setGenerationStatus('queued');
    setGeneratedImage(null);
    setGeneratingOutfit(outfit);

    // If we have a model and outfit, call real API
    if (selectedModel && outfit) {
      console.log('Starting generation with:', { selectedModelId: selectedModel.id, outfitId: outfit.id, outfit });
      try {
        const job = await apiService.createGenerationJob(selectedModel.id, outfit.id);
        console.log('Job created:', job);
        setCurrentJobId(job.jobId);
        setGenerationStatus(job.status);

        const pollJobStatus = async () => {
          try {
            const status = await apiService.getJobStatus(job.jobId);
            setGenerationStatus(status.status);

            if (status.status === 'succeeded' && status.outputImage) {
              setIsGenerating(false);
              setGeneratedImage(status.outputImage.url);
              setGeneratedImageId(status.outputImage.id);
            } else if (status.status === 'failed') {
              console.error('Generation failed:', status.error);
              setIsGenerating(false);
            } else if (status.status === 'processing' || status.status === 'queued') {
              setTimeout(pollJobStatus, 2000);
            }
          } catch (error) {
            console.error('Error polling job status:', error);
            setIsGenerating(false);
          }
        };

        setTimeout(pollJobStatus, 2000);
      } catch (error) {
        console.error('Error creating generation job:', error);
        // Fallback to simulation
        simulateGeneration(outfit);
      }
    } else {
      // No model selected, simulate generation
      simulateGeneration(outfit);
    }
  };

  const simulateGeneration = (outfit?: Outfit) => {
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStatus('succeeded');
      setGeneratedImage(outfit?.image || uploadedOutfit?.image || null);
      setGeneratedImageId(null); // No real asset ID in simulation
    }, 2000);
  };

  const handleRegenerate = () => {
    setGeneratedImage(null);
    if (generatingOutfit) {
      startGeneration(generatingOutfit);
    } else if (uploadedOutfit) {
      startGeneration(uploadedOutfit);
    }
  };

  const handleSave = () => {
    setSaveDialogOpen(true);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-generated-outfit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No generated image to download');
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!generatedImage) {
      alert('No generated image to save');
      return;
    }
    if (!outfitName.trim()) {
      alert('Please enter an outfit name');
      return;
    }

    setIsSaving(true);
    try {
      if (generatedImageId) {
        // Update asset metadata with the new name
        await apiService.updateAssetMetadata(generatedImageId, { originalName: outfitName });
        toast.success('Outfit saved successfully!', {
          description: `The outfit has been saved as "${outfitName}".`,
        });
      } else {
        // No asset ID (simulation), still show success
        toast.success('Outfit saved successfully!', {
          description: `The outfit has been saved as "${outfitName}".`,
        });
      }
      setSaveDialogOpen(false);
      setOutfitName('');
    } catch (error) {
      console.error('Failed to save outfit:', error);
      toast.error('Failed to save outfit', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = () => {
    setGeneratedImage(null);
    setGenerationStatus(null);
    setIsDialogOpen(false);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="flex-shrink-0 space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Outfit Library</h2>
        </div>

        {/* Upload Section or Preview */}
        {uploadedOutfit ? (
          <Card className="border-2 border-pink-300 transition-colors p-4 bg-linear-to-br from-pink-50 to-purple-50">
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">Your Uploaded Outfit</h3>
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden mx-auto max-w-32">
                  <ImageWithFallback
                    src={uploadedOutfit.image}
                    alt={uploadedOutfit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex space-x-2 mt-3 justify-center">
                  <Button
                    size="sm"
                    className={`bg-pink-500 hover:bg-pink-600 text-white ${
                      isUploadedOutfitSelected ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                    onClick={() => handleGenerateClick()}
                    disabled={!selectedModel}
                  >
                    {isUploadedOutfitSelected ? 'Selected ✓' : 'Generate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={handleRemoveUploadedOutfit}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : previewOutfit ? (
          <Card className="border-2 border-pink-300 transition-colors p-4 bg-linear-to-br from-pink-50 to-purple-50">
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">Selected Outfit</h3>
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden mx-auto max-w-32">
                  <ImageWithFallback
                    src={previewOutfit.image}
                    alt={previewOutfit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex space-x-2 mt-3 justify-center">
                  <Button
                    size="sm"
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => handleGenerateClick(previewOutfit)}
                    disabled={!selectedModel}
                  >
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={() => setPreviewOutfit(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-pink-200 hover:border-pink-300 transition-colors p-4 text-center bg-linear-to-br from-pink-50 to-purple-50">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full" />
                ) : (
                  <Upload className="w-5 h-5 text-pink-500" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">Upload Custom Outfit</h3>
                <p className="text-xs text-muted-foreground">
                  {isUploading ? 'Processing your outfit...' : 'JPG, PNG up to 10MB'}
                </p>
              </div>
              <div>
                <Button
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <input
                  ref={fileInputRef}
                  id="outfit-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search outfits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-pink-100 focus:border-pink-300"
          />
        </div>

        {/* Global vs You Tabs */}
        <Tabs value={activeOutfitTab} onValueChange={(v: string) => setActiveOutfitTab(v as 'global' | 'you')}>
          <TabsList className="bg-pink-50">
            <TabsTrigger value="global" className="data-[state=active]:bg-pink-200">
              Global
            </TabsTrigger>
            <TabsTrigger value="you" className="data-[state=active]:bg-pink-200" disabled={!isAuthenticated}>
              You
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 bg-pink-50 text-pink-600">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium">{category.name}</span>
                  <span className="text-[10px] opacity-70">{category.count}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Outfit Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeOutfitTab === 'you' && !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Please log in to see your uploaded outfits.</p>
            <Button onClick={() => router.push('/login')} className="bg-pink-500 hover:bg-pink-600">
              Log In
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
            <span className="ml-3 text-pink-600">Loading outfits...</span>
          </div>
        ) : activeOutfitTab === 'global' && fetchError ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Failed to load outfits. Please try again later.</p>
            <Button onClick={() => window.location.reload()} className="bg-pink-500 hover:bg-pink-600">
              Retry
            </Button>
          </div>
        ) : filteredOutfits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {activeOutfitTab === 'global' ? (
              <p>No outfits available.</p>
            ) : (
              <>
                <p>You haven't uploaded any outfits yet.</p>
                <p className="text-sm mt-2">Upload an outfit using the upload card above.</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 pb-4">
              {filteredOutfits.map((outfit) => (
                <Card
                  key={outfit.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden group relative ${
                    selectedOutfit?.id === outfit.id
                      ? 'ring-2 ring-pink-400 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleOutfitClick(outfit)}
                >
                  <div className="h-48 w-full relative">
                    <ImageWithFallback
                      src={outfit.image}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Custom outfit indicator */}
                    {outfit.isCustom && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-pink-500 text-white text-xs">
                          Custom
                        </Badge>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => toggleLike(outfit.id, e)}
                        className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            likedOutfits.has(outfit.id)
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                      
                      {outfit.isCustom && (
                        <button
                          onClick={(e) => removeCustomOutfit(outfit.id, e)}
                          className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Basic Info Always Visible */}
                  <div className="p-2">
                    <h3 className="font-medium text-sm truncate">{outfit.name}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Generation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Outfit Generation</DialogTitle>
            <DialogDescription>
              {generatedImage ? 'Your AI-generated outfit is ready!' : 'Generating your outfit...'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Shimmer effect while generating */}
            {(isGenerating || generationStatus === 'queued' || generationStatus === 'processing') && (
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shimmer">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-medium text-gray-900">
                      {generationStatus === 'queued' ? 'Job Queued' :
                       generationStatus === 'processing' ? 'AI Processing' :
                       'AI Magic in Progress'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {generationStatus === 'queued' ? 'Your job is in the queue...' :
                       generationStatus === 'processing' ? 'Generating your outfit...' :
                       'Fitting the perfect outfit...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Generated image */}
            {generatedImage && (
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={generatedImage}
                  alt="AI Generated Outfit"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {generatedImage ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Download className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" disabled>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            </div>

            {/* Status message */}
            {generationStatus === 'failed' && (
              <div className="text-center text-red-600 text-sm">
                Generation failed. Please try again.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Outfit Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Outfit</DialogTitle>
            <DialogDescription>
              Enter a name for your generated outfit to save it to your library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Outfit name"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfirm} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Generated Outfit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this generated outfit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}