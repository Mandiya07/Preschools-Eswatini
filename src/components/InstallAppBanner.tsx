import React, { useEffect, useState } from 'react';
import { Download, X, Share, PlusSquare, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InstallAppBanner() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();

    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  if (isStandalone || dismissed) return null;

  // We show instructions if it's iOS (since iOS doesn't support beforeinstallprompt natively)
  // Or if it's not iOS but we don't have the prompt yet (fallback on manual browser instructions)
  const showNativeInstall = !!installPrompt;

  return (
    <div className="install-app-features bg-blue-600 text-white relative z-50 overflow-hidden shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 md:py-2 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden md:flex h-8 w-8 rounded-full bg-white/20 items-center justify-center shrink-0">
            <Download className="h-4 w-4 text-white" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
            <h4 className="text-sm font-semibold whitespace-nowrap">Install App</h4>
            
            {showNativeInstall ? (
              <p className="text-xs text-blue-100 hidden sm:block">
                Get the Preschools Eswatini native experience.
              </p>
            ) : isIos ? (
              <div className="text-xs text-blue-100 flex items-center flex-wrap gap-1">
                <span>Tap</span>
                <Share className="h-3.5 w-3.5 inline text-white mx-0.5" />
                <span>then</span>
                <span className="font-semibold text-white whitespace-nowrap">"Add to Home Screen"</span>
              </div>
            ) : (
              <div className="text-xs text-blue-100 flex items-center flex-wrap gap-1">
                <span>Click the</span>
                <span className="font-semibold text-white">install icon</span>
                <span>in your browser's address bar to install.</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showNativeInstall && (
            <Button 
              size="sm" 
              onClick={handleInstallClick} 
              className="h-8 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs"
            >
              Install Now
            </Button>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setDismissed(true)} 
            className="h-8 w-8 text-blue-100 hover:text-white hover:bg-white/20"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
