import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Undo2, 
  Redo2, 
  Save, 
  Download, 
  Share2, 
  Settings, 
  History,
  Heart,
  Star,
  Camera,
  Palette
} from 'lucide-react';

interface ControlsPanelProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function ControlsPanel({ 
  onUndo, 
  onRedo, 
  onSave, 
  onDownload, 
  onShare,
  canUndo = false,
  canRedo = false,
  currentStep = 1,
  totalSteps = 3
}: ControlsPanelProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    if (onSave) {
      await onSave();
    }
    setTimeout(() => setIsSaving(false), 1000);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-pink-500" />
          Quick Actions
        </h3>
        
        <div className="space-y-3">
          {/* History Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex-1 text-gray-600 disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex-1 text-gray-600 disabled:opacity-50"
            >
              <Redo2 className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>

          {/* Save & Export */}
          <div className="space-y-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Look
                </>
              )}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="text-gray-600"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                className="text-gray-600"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}