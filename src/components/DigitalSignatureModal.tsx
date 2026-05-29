import React, { useRef, useState } from 'react';
import { X, PenTool, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import SignatureCanvas from 'react-signature-canvas';
import { jsPDF } from 'jspdf';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  consentType: string;
  onSave: (pdfDataUri: string) => void;
}

export function DigitalSignatureModal({ isOpen, onClose, studentName, consentType, onSave }: DigitalSignatureModalProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [date] = useState(new Date().toLocaleDateString());
  const [hasSigned, setHasSigned] = useState(false);

  if (!isOpen) return null;

  const getConsentText = () => {
    switch (consentType) {
      case 'medical':
        return `I hereby give my medical consent for ${studentName} to receive emergency medical treatment if required during school hours.`;
      case 'outing':
        return `I hereby grant permission for ${studentName} to participate in off-campus school outings and educational trips.`;
      case 'policy':
        return `I acknowledge that I have read and agree to the updated school policies regarding the enrollment of ${studentName}.`;
      default:
        return `I hereby provide consent for ${studentName} for the requested activity.`;
    }
  };

  const handleClear = () => {
    sigCanvas.current?.clear();
    setHasSigned(false);
  };

  const handleSave = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert('Please provide a signature before saving.');
      return;
    }
    
    // Generate PDF
    const pdf = new jsPDF('p', 'pt', 'a4');
    
    // Add text content
    pdf.setFontSize(22);
    pdf.text('School Authorization & Consent', 40, 60);
    
    pdf.setFontSize(14);
    pdf.text(`Student: ${studentName}`, 40, 100);
    pdf.text(`Date: ${date}`, 40, 130);
    pdf.text(`Type: ${consentType.toUpperCase()} CONSENT`, 40, 160);
    
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(getConsentText(), 500);
    pdf.text(lines, 40, 210);
    
    // Add signature image
    const signatureImage = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    pdf.text('Signature of Parent/Guardian:', 40, 320);
    pdf.addImage(signatureImage, 'PNG', 40, 340, 200, 60);
    pdf.setLineWidth(1);
    pdf.line(40, 410, 250, 410);

    const pdfDataUri = pdf.output('datauristring');
    onSave(pdfDataUri);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-xl w-full text-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-none">Digital Signature</h2>
              <p className="text-xs font-medium text-slate-500 mt-1">{consentType.toUpperCase()} CONSENT</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">
            <h3 className="font-bold text-slate-900 mb-2">Consent Agreement</h3>
            <p>{getConsentText()}</p>
            <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date: {date}</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              Please sign below
              {hasSigned && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            </label>
            <div className="border border-slate-300 rounded-2xl bg-white overflow-hidden shadow-inner relative h-48 w-full cursor-crosshair">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: 'w-full h-full' }}
                onEnd={() => setHasSigned(true)}
              />
              {!hasSigned && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 select-none">
                  <span className="text-slate-400 font-medium text-lg">Sign here</span>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleClear}
                className="text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                Clear Signature
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4 shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl border-slate-300 font-bold text-slate-700">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasSigned}
            className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
          >
            Save as PDF & Sign
          </Button>
        </div>
      </div>
    </div>
  );
}
