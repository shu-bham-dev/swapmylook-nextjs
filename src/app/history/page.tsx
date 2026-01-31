"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  Download,
  Trash2,
  Star,
  Image as ImageIcon,
  User,
  Shirt,
  Sparkles,
  Grid,
  List,
  Repeat,
  Loader2
} from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { apiService } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Outfit {
  id: string;
  type: 'model' | 'outfit' | 'output';
  url: string;
  sizeBytes: number;
  createdAt: string;
  favorite: boolean;
  tags: string[];
  metadata: any;
}

interface OutfitsStats {
  total: number;
  byType: {
    model: number;
    outfit: number;
    output: number;
  };
  favorites: number;
  generationAttempts: number;
}

export default function HistoryPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [stats, setStats] = useState<OutfitsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    loadOutfits();
    loadStats();
  }, [activeTab, favoritesOnly]);

  const loadOutfits = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOutfits({
        type: activeTab === 'all' ? 'all' : activeTab as 'model' | 'outfit' | 'output' | 'all',
        favorite: favoritesOnly || undefined,
      });
      setOutfits(response.outfits);
      setError(null);
    } catch (err) {
      console.error('Failed to load outfits:', err);
      setError('Failed to load your outfits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getOutfitsStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleFavoriteToggle = async (outfitId: string, currentFavorite: boolean) => {
    try {
      await apiService.toggleOutfitFavorite(outfitId, !currentFavorite);
      setOutfits(prev => prev.map(outfit =>
        outfit.id === outfitId
          ? { ...outfit, favorite: !currentFavorite }
          : outfit
      ));
      loadStats();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      toast.error('Failed to update favorite status');
    }
  };

  const handleDeleteOutfit = async (outfitId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await apiService.deleteOutfit(outfitId);
      setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
      loadStats();
      toast.success('Image deleted successfully');
    } catch (err) {
      console.error('Failed to delete outfit:', err);
      toast.error('Failed to delete image. Please try again.');
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'model': return <User className="w-4 h-4" />;
      case 'outfit': return <Shirt className="w-4 h-4" />;
      case 'output': return <Sparkles className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'model': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'outfit': return 'bg-green-100 text-green-700 border-green-200';
      case 'output': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && outfits.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My History</h1>
          <p className="text-muted-foreground">
            Manage your uploaded models, outfits, and AI-generated images
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                </div>
                <div className="text-sm text-muted-foreground">Total Images</div>
              </div>
                
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{stats.byType.model}</div>
                </div>
                <div className="text-sm text-muted-foreground">Models</div>
              </div>
                
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shirt className="w-5 h-5 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{stats.byType.outfit}</div>
                </div>
                <div className="text-sm text-muted-foreground">Outfits</div>
              </div>
                
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{stats.byType.output}</div>
                </div>
                <div className="text-sm text-muted-foreground">AI Generated</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Repeat className="w-5 h-5 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">{stats.generationAttempts}</div>
                </div>
                <div className="text-sm text-muted-foreground">Generation Attempts</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{stats.favorites}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </div>
              <Button
                variant={favoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={favoritesOnly ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
              >
                <Star className={`w-4 h-4 mr-2 ${favoritesOnly ? 'fill-white' : ''}`} />
                {favoritesOnly ? 'Show All' : 'Show Favorites'}
              </Button>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-pink-50">
              <TabsTrigger value="all" className="data-[state=active]:bg-pink-200">
                <ImageIcon className="w-4 h-4 mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger value="model" className="data-[state=active]:bg-pink-200">
                <User className="w-4 h-4 mr-2" />
                Models
              </TabsTrigger>
              <TabsTrigger value="outfit" className="data-[state=active]:bg-pink-200">
                <Shirt className="w-4 h-4 mr-2" />
                Outfits
              </TabsTrigger>
              <TabsTrigger value="output" className="data-[state=active]:bg-pink-200">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generated
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <div className="text-red-700 text-center">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={loadOutfits}
                className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Outfits Grid */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
              </div>
            </div>
          )}
          {outfits.length === 0 ? (
            <Card className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No outfits found</h3>
              <p className="text-muted-foreground mb-4">
                {favoritesOnly
                  ? "You haven't marked any images as favorites yet."
                  : activeTab === 'all'
                  ? "You haven't uploaded any models, outfits, or generated any AI images yet."
                  : `You haven't uploaded any ${activeTab}s yet.`
                }
              </p>
              {activeTab === 'model' || activeTab === 'outfit' ? (
                <Button
                  onClick={() => router.push('/')}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Go to Style Studio
                </Button>
              ) : null}
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {outfits.map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="aspect-[3/4] relative">
                    <ImageWithFallback
                      src={outfit.url}
                      alt={`${outfit.type} image`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(outfit.url)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleFavoriteToggle(outfit.id, outfit.favorite)}
                        >
                          <Heart className={`w-4 h-4 ${outfit.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDeleteOutfit(outfit.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <Badge
                      variant="outline"
                      className={`absolute top-2 left-2 ${getTypeColor(outfit.type)}`}
                    >
                      {getTypeIcon(outfit.type)}
                      <span className="ml-1 capitalize">{outfit.type}</span>
                    </Badge>

                    {/* Favorite Heart */}
                    {outfit.favorite && (
                      <Heart className="absolute top-2 right-2 w-5 h-5 text-red-500 fill-red-500" />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium truncate">
                        {outfit.metadata?.originalName  || outfit.metadata?.filename || `Image ${outfit.id.slice(-6)}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(outfit.sizeBytes)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {formatDate(outfit.createdAt)}
                      </div>
                      {outfit.tags.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {outfit.tags[0]}
                          {outfit.tags.length > 1 && ` +${outfit.tags.length - 1}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
