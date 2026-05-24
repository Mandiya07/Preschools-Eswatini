import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X, Download } from 'lucide-react';

export function PWAPrompt() {
  const swRes = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const {
    offlineReady: [offlineReady, setOfflineReady] = [false, () => {}],
    needRefresh: [needUpdate, setNeedUpdate] = [false, () => {}],
    updateServiceWorker,
  } = swRes as any || {
    offlineReady: [false, () => {}],
    needRefresh: [false, () => {}],
    updateServiceWorker: async () => {},
  };

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedUpdate(false);
  };

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  if (!offlineReady && !needUpdate && !installPrompt) return null;

  if (installPrompt && !offlineReady && !needUpdate) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 max-w-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Download className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              Install App
            </h4>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">
              Install StarPrep on your device for quick offline access.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="sm" onClick={handleInstallClick} className="h-8 text-xs font-bold bg-blue-600">
              Install
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setInstallPrompt(null)} className="h-8 w-8 text-slate-400">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 max-w-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <RefreshCw className={`h-6 w-6 ${needUpdate ? 'animate-spin-slow' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {offlineReady ? 'App ready to work offline' : 'New update available!'}
          </h4>
          <p className="text-xs text-slate-500 leading-tight mt-0.5">
            {offlineReady 
              ? 'You can now use this app without an internet connection.' 
              : 'Click reload to get the latest features and school updates.'}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {needUpdate && (
            <Button size="sm" onClick={() => updateServiceWorker(true)} className="h-8 text-xs font-bold bg-blue-600">
              Reload
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={close} className="h-8 w-8 text-slate-400">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
