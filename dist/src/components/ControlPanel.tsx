import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card } from './ui/card';

interface ControlPanelProps {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
}

export function ControlPanel({
  currentStep,
  isPlaying,
  speed,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
}: ControlPanelProps) {
  const speedLabel = speed <= 1000 ? 'Fast' : speed <= 2000 ? 'Normal' : 'Slow';

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="mb-4">Controls</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Progress:</span>
          <span className="text-blue-600">{currentStep} / 10</span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onStepBackward}
            disabled={currentStep === 0}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <SkipBack size={16} />
          </Button>
          
          <Button
            onClick={onPlayPause}
            variant={isPlaying ? "destructive" : "default"}
            size="sm"
            className="flex-1"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          
          <Button
            onClick={onStepForward}
            disabled={currentStep >= 10}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <SkipForward size={16} />
          </Button>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          <RotateCcw size={16} />
          <span className="ml-2">Reset</span>
        </Button>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600">Speed:</span>
            <span className="text-blue-600">{speedLabel}</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={500}
            max={3000}
            step={500}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}
