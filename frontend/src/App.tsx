import { useEffect, useState } from 'react';
import { FlowVisualization } from './components/FlowVisualization';
import { ToolkitPanel } from './components/ToolkitPanel';
import { StageDetails } from './components/StageDetails';
import { ActionPanel } from './components/ActionPanel';
import { fetchDashboard, type DashboardData } from './lib/api';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isGAWorkflow, setIsGAWorkflow] = useState(false);
  const [hasCompletedEvolution, setHasCompletedEvolution] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard().then(setDashboard).catch(() => null);
  }, []);

  useEffect(() => {
    const maxStep = isGAWorkflow ? 6 : 10;
    if (isPlaying && currentStep < maxStep) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (currentStep >= maxStep) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, isGAWorkflow]);

  const handleStartWorkflow = () => {
    setCurrentStep(1);
    setIsPlaying(true);
  };

  const handleInitiateEvolution = (proceed: boolean) => {
    if (!proceed) {
      return;
    }
    setIsGAWorkflow(true);
    setCurrentStep(0);
    setTimeout(() => {
      setCurrentStep(1);
      setIsPlaying(true);
    }, 500);
  };

  const handleGoBackToMainPage = () => {
    setIsGAWorkflow(false);
    setHasCompletedEvolution(true);
    setCurrentStep(10);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <FlowVisualization
              currentStep={currentStep}
              isManualMode={isChatExpanded}
              onStartWorkflow={handleStartWorkflow}
              isGAWorkflow={isGAWorkflow}
              onInitiateEvolution={handleInitiateEvolution}
              onGoBackToMainPage={handleGoBackToMainPage}
              hasCompletedEvolution={hasCompletedEvolution}
              promptEvolution={dashboard?.promptEvolution}
              gaEvolution={dashboard?.gaEvolution}
              queryDetails={dashboard?.queryDetails}
            />
            <StageDetails currentStep={currentStep} />
          </div>

          <div className="space-y-6">
            <ToolkitPanel
              currentStep={currentStep}
              isChatExpanded={isChatExpanded}
              onChatToggle={() => setIsChatExpanded(!isChatExpanded)}
              onStartWorkflow={handleStartWorkflow}
              isGAWorkflow={isGAWorkflow}
            />
            <ActionPanel llms={dashboard?.llms ?? []} agents={dashboard?.agents ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
