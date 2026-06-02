import React from 'react';
import { SEO } from '@/components/SEO';
import { Smartphone, MonitorPlay, Download, Share, PlusSquare, Chrome } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function InstallGuidePage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-10">
      <SEO title="How to Install the App | Preschools Eswatini" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Install on Your Device
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            You can install the Preschools Eswatini app directly on your mobile phone, tablet, or desktop computer. Follow the simple steps for your device below.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 bg-slate-100 rounded-t-xl pb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">iOS (iPhone & iPad)</CardTitle>
                <CardDescription>Install via Safari</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="list-decimal list-inside space-y-4 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">1.</span>
                  <div>Open the <span className="font-bold text-slate-900">Safari</span> browser and navigate to this website. (Google Chrome on iOS does not support installation).</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">2.</span>
                  <div>Tap the <span className="font-bold text-slate-900">Share icon</span> <Share className="inline w-4 h-4 mx-1" /> located at the bottom of the screen (or top for iPad).</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">3.</span>
                  <div>Scroll down in the share menu and tap <span className="font-bold text-slate-900">Add to Home Screen</span> <PlusSquare className="inline w-4 h-4 mx-1" />.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">4.</span>
                  <div>Tap <span className="font-bold text-slate-900">Add</span> in the top right corner. The app will now appear on your home screen!</div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4 bg-slate-100 rounded-t-xl pb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Chrome className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">Android</CardTitle>
                <CardDescription>Install via Google Chrome</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="list-decimal list-inside space-y-4 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">1.</span>
                  <div>Open <span className="font-bold text-slate-900">Google Chrome</span> and navigate to this website.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">2.</span>
                  <div>You may see a prompt at the bottom of the screen asking to <span className="font-bold text-slate-900">Add to Home Screen</span>. If so, simply tap it.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">3.</span>
                  <div>If you don't see the prompt, tap the <span className="font-bold text-slate-900">three dots menu (⋮)</span> in the top right corner.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">4.</span>
                  <div>Tap <span className="font-bold text-slate-900">Install App</span> or <span className="font-bold text-slate-900">Add to Home Screen</span>. Follow the on-screen instructions to confirm.</div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4 bg-slate-100 rounded-t-xl pb-6">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">Desktop (Windows, Mac, ChromeOS)</CardTitle>
                <CardDescription>Install via Google Chrome or Microsoft Edge</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="list-decimal list-inside space-y-4 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">1.</span>
                  <div>Open <span className="font-bold text-slate-900">Google Chrome</span> or <span className="font-bold text-slate-900">Microsoft Edge</span> and navigate to this website.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">2.</span>
                  <div>
                    Look for the <span className="font-bold text-slate-900">Install icon</span> <Download className="inline w-4 h-4 mx-1" /> inside your address bar, on the right side.
                    <div className="text-sm mt-1.5 text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Not seeing the icon?</span> Click the three dots menu <span className="font-bold text-slate-700">⋮</span> (Chrome) or <span className="font-bold text-slate-700">⋯</span> (Edge) in the top-right corner, then select <span className="font-bold text-slate-700">Install Preschools Eswatini</span> (or <span className="font-bold text-slate-700">Apps {">"} Install this site as an app</span>).
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">3.</span>
                  <div>Click the icon and select <span className="font-bold text-slate-900">Install</span>.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold mt-1">4.</span>
                  <div>The app will install as a standalone desktop application and you can pin it to your taskbar or dock.</div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
