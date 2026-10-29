import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Film, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EvidenceUploader({ media = { images: [], videos: [] }, onChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (files) => {
    setUploadError('');
    const newImages = [...media.images];
    const newVideos = [...media.videos];

    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds maximum allowed size (15MB).`);
        continue;
      }

      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newImages.push(previewUrl);
      } else if (file.type.startsWith('video/')) {
        const previewUrl = URL.createObjectURL(file);
        newVideos.push(previewUrl);
      }
    }

    onChange({ images: newImages, videos: newVideos });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index) => {
    const updated = media.images.filter((_, i) => i !== index);
    onChange({ ...media, images: updated });
  };

  const removeVideo = (index) => {
    const updated = media.videos.filter((_, i) => i !== index);
    onChange({ ...media, videos: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Upload Evidence Photos or Videos</h4>
          <p className="text-xs text-slate-400 mt-0.5">Evidence helps municipal authorities understand the issue faster.</p>
        </div>
        <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          Max 15MB per file • JPG, PNG, WEBP, MP4
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`p-6 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer relative ${
          dragActive
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-slate-700 hover:border-slate-500 bg-brand-deepCharcoal/60'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <UploadCloud className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-pulse" />
        <h5 className="text-xs font-bold text-slate-200">Drag & drop evidence files here, or browse</h5>
        <p className="text-[11px] text-slate-400 mt-1">Supports high-resolution photos and video clips up to 15MB</p>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Evidence Gallery */}
      {(media.images.length > 0 || media.videos.length > 0) && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Uploaded Media Preview ({media.images.length + media.videos.length})</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {media.images.map((img, idx) => (
              <div key={idx} className="relative rounded-xl bg-slate-50 dark:bg-brand-charcoal border border-slate-200 dark:border-slate-700 overflow-hidden group h-24 shadow-sm">
                <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900/80 text-amber-400 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> PHOTO
                </span>
              </div>
            ))}

            {media.videos.map((vid, idx) => (
              <div key={idx} className="relative rounded-xl bg-slate-50 dark:bg-brand-charcoal border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col items-center justify-center h-24 group shadow-sm">
                <Film className="w-8 h-8 text-amber-400" />
                <span className="text-[10px] font-mono text-slate-300 mt-1">Video Clip #{idx + 1}</span>
                <button
                  onClick={() => removeVideo(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
