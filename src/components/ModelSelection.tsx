"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiService } from '@/lib/api';

interface Model {
  id: string;
  name: string;
  image: string;
  category: 'female' | 'male' | 'diverse';
}

interface ModelSelectionProps {
  onModelSelect: (model: Model | null) => void;
  selectedModel: Model | null;
}

export function ModelSelection({ onModelSelect, selectedModel }: ModelSelectionProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedModel, setUploadedModel] = useState<Model | null>(null);
  const [fetchedModels, setFetchedModels] = useState<Model[]>([]);
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingUserModels, setLoadingUserModels] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'you'>('global');
  const [fetchError, setFetchError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is authenticated
  const isAuthenticated = apiService.isAuthenticated();

  // Check if the selected model is an uploaded one
  const isUploadedModelSelected = selectedModel && uploadedModel && selectedModel.id === uploadedModel.id;
  // Check if a predefined model is selected (not uploaded)
  const isPredefinedModelSelected = selectedModel && (!uploadedModel || selectedModel.id !== uploadedModel.id);

  // Fetch public models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await apiService.getPublicImages({ type: 'model' });
        const models: Model[] = response.images.map(img => ({
          id: img.id,
          name: img.name || 'Model',
          image: img.url,
          category: 'diverse' // default category, could be derived from tags if needed
        }));
        setFetchedModels(models);
        setFetchError(false);
      } catch (error) {
        console.error('Failed to fetch public models:', error);
        setFetchError(true);
        // Keep empty, no fallback
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  // Fetch user's models when "You" tab is active and authenticated
  useEffect(() => {
    if (activeTab === 'you' && isAuthenticated) {
      const fetchUserModels = async () => {
        setLoadingUserModels(true);
        try {
          const response = await apiService.getOutfits({ type: 'model' });
          const models: Model[] = response.outfits.map((outfit: any) => ({
            id: outfit.id,
            name: outfit.metadata?.originalName || outfit.metadata?.filename || 'Your Model',
            image: outfit.url,
            category: 'diverse'
          }));
          setUserModels(models);
        } catch (error) {
          console.error('Failed to fetch user models:', error);
        } finally {
          setLoadingUserModels(false);
        }
      };
      fetchUserModels();
    }
  }, [activeTab, isAuthenticated]);

  // Determine which models to display based on active tab
  const modelsToShow = activeTab === 'global'
    ? fetchedModels
    : userModels;
  const isLoading = activeTab === 'global' ? loadingModels : loadingUserModels;

  const handleButtonClick = () => {
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
        const data = await apiService.uploadFile(file, 'model');
        
        // Create model object with the uploaded image
        const newUploadedModel: Model = {
          id: data.imageAsset.id,
          name: 'Your Model',
          image: data.imageAsset.url,
          category: 'diverse'
        };
        
        setUploadedModel(newUploadedModel);
        onModelSelect(newUploadedModel);
        
      } catch (error) {
        console.error('Upload failed:', error);
        // Fallback to simulation if API fails
        const newUploadedModel: Model = {
          id: `uploaded-${Date.now()}`,
          name: 'Your Model',
          image: URL.createObjectURL(file),
          category: 'diverse'
        };
        setUploadedModel(newUploadedModel);
        onModelSelect(newUploadedModel);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSelectUploadedModel = () => {
    if (uploadedModel) {
      onModelSelect(uploadedModel);
    }
  };

  const handleRemoveUploadedModel = () => {
    setUploadedModel(null);
    onModelSelect(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold bg-linear-to-r from-pink-400 to-coral-500 bg-clip-text text-transparent">
          Choose Your Model
        </h2>
        <p className="text-muted-foreground">
          Select a model or upload your own photo to get started
        </p>
      </div>

      {/* Upload Option or Preview */}
      {uploadedModel ? (
        <Card className="border-2 border-pink-300 transition-colors p-4 bg-linear-to-br from-pink-50 to-purple-50">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-medium text-gray-900 text-sm mb-2">Your Uploaded Model</h3>
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden mx-auto max-w-32">
                <ImageWithFallback
                  src={uploadedModel.image}
                  alt={uploadedModel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2 mt-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-pink-300 text-pink-600 hover:bg-pink-50 text-xs ${
                    isUploadedModelSelected ? 'bg-pink-100' : ''
                  }`}
                  onClick={handleSelectUploadedModel}
                >
                  {isUploadedModelSelected ? 'Selected ✓' : 'Select'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                  onClick={handleRemoveUploadedModel}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : isPredefinedModelSelected ? (
        <Card className="border-2 border-pink-300 transition-colors p-4 bg-linear-to-br from-pink-50 to-purple-50">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-medium text-gray-900 text-sm mb-2">Selected Model</h3>
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden mx-auto max-w-32">
                <ImageWithFallback
                  src={selectedModel.image}
                  alt={selectedModel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2 mt-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-pink-300 text-pink-600 hover:bg-pink-50 text-xs"
                  onClick={() => onModelSelect(null)}
                >
                  Deselect
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
                <div className="animate-spin w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full" />
              ) : (
                <Upload className="w-4 h-4 text-pink-500" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 text-sm">Upload Your Photo</h3>
              <p className="text-xs text-muted-foreground">
                {isUploading ? 'Processing...' : 'JPG, PNG up to 10MB'}
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                className="border-pink-300 text-pink-600 hover:bg-pink-50 text-xs cursor-pointer"
                disabled={isUploading}
                onClick={handleButtonClick}
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input
                ref={fileInputRef}
                id="model-upload"
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

      {/* Tabs for Global vs You */}
      <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'global' | 'you')} className="space-y-4">
        <TabsList className="bg-pink-50">
          <TabsTrigger value="global" className="data-[state=active]:bg-pink-200">
            Global
          </TabsTrigger>
          <TabsTrigger value="you" className="data-[state=active]:bg-pink-200" disabled={!isAuthenticated}>
            You
          </TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="space-y-4">
          <h3 className="font-medium text-gray-900">Select a model from global collection:</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full" />
            </div>
          ) : fetchError ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Failed to load models. Please try again later.</p>
              <Button onClick={() => window.location.reload()} className="bg-pink-500 hover:bg-pink-600">
                Retry
              </Button>
            </div>
          ) : modelsToShow.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No models available.</p>
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-2 px-2">
              {modelsToShow.map((model) => (
                <Card
                  key={model.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden flex-shrink-0 w-32 ${
                    selectedModel?.id === model.id
                      ? 'ring-2 ring-pink-400 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => onModelSelect(model)}
                >
                  <div className="aspect-[3/4] relative">
                    <ImageWithFallback
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 text-white" />
                        <span className="text-white font-medium text-xs">{model.name}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="you" className="space-y-4">
          <h3 className="font-medium text-gray-900">Your uploaded models:</h3>
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Please log in to see your uploaded models.</p>
              <Button onClick={() => router.push('/login')} className="bg-pink-500 hover:bg-pink-600">
                Log In
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full" />
            </div>
          ) : modelsToShow.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven't uploaded any models yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Upload a model using the upload card above.</p>
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-2 px-2">
              {modelsToShow.map((model) => (
                <Card
                  key={model.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden flex-shrink-0 w-32 ${
                    selectedModel?.id === model.id
                      ? 'ring-2 ring-pink-400 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => onModelSelect(model)}
                >
                  <div className="aspect-[3/4] relative">
                    <ImageWithFallback
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 text-white" />
                        <span className="text-white font-medium text-xs">{model.name}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}