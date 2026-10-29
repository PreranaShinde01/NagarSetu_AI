import React, { useState } from 'react';
import { Camera, CheckCircle2, MapPin, UploadCloud, ShieldCheck } from 'lucide-react';

export default function ResolutionEvidenceUploader({ onComplete, onCancel }) {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [gpsVerified, setGpsVerified] = useState(true);

  const handleSimulateUpload = (type) => {
    const mockUrl =
      type === 'before'
        ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=500&auto=format&fit=crop&q=60';

    if (type === 'before') setBeforeImage(mockUrl);
    else setAfterImage(mockUrl);
  };

  const handleSubmit = () => {
    onComplete({
      beforeImage: beforeImage || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
      afterImage: afterImage || 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=500',
      notes: notes || 'Repairs completed and site tested.',
      gpsVerified,
    });
  };

  return (
    <div className="bg-white dark:bg-brand-charcoal p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-w-lg w-full transition-colors text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono uppercase">FIELD COMPLETION EVIDENCE MANIFEST</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* BEFORE IMAGE */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">BEFORE REPAIR</label>
          <div className="h-28 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
            {beforeImage ? (
              <div className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Image Attached
              </div>
            ) : (
              <button onClick={() => handleSimulateUpload('before')} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex flex-col items-center gap-1 text-[11px] font-mono">
                <Camera className="w-5 h-5 text-amber-500" />
                Upload Before Photo
              </button>
            )}
          </div>
        </div>

        {/* AFTER IMAGE */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">AFTER REPAIR</label>
          <div className="h-28 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
            {afterImage ? (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Image Attached
              </div>
            ) : (
              <button onClick={() => handleSimulateUpload('after')} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex flex-col items-center gap-1 text-[11px] font-mono">
                <UploadCloud className="w-5 h-5 text-emerald-500" />
                Upload After Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block mb-1">FIELD RESTORATION NOTES</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Details of materials used, equipment deployed..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-200 outline-none h-16"
        />
      </div>

      <div className="flex items-center justify-between text-xs font-mono bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-500" /> GPS Tag: 16.6992° N, 74.4578° E
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">MATCH (0.02km)</span>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-lg shadow-sm">Submit For Verification</button>
      </div>
    </div>
  );
}
