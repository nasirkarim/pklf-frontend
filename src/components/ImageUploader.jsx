import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const ImageUploader = ({
  images = [],
  onImagesChange,
  maxFiles = 5,
  maxSizeMB = 5,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const allowedExts = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.jfif',
    '.pjpeg',
    '.pjp',
    '.avif',
    '.heic',
    '.heif',
    '.bmp',
    '.gif',
    '.svg',
  ];

  const validateAndAddFiles = (fileList) => {
    setError('');
    const newFiles = Array.from(fileList);

    if (images.length + newFiles.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} photos.`);
      return;
    }

    const validNewImages = [];

    for (const file of newFiles) {
      const ext = (file.name.substring(file.name.lastIndexOf('.')) || '').toLowerCase();
      const isImage = file.type?.startsWith('image/') || allowedExts.includes(ext);

      if (!isImage) {
        setError(`"${file.name}" is not a supported image format.`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the ${maxSizeMB}MB file size limit.`);
        return;
      }

      validNewImages.push({
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      });
    }

    onImagesChange([...images, ...validNewImages]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // Reset file input so user can re-add same file name if desired
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      {images.length < maxFiles && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer relative
            ${
              dragActive
                ? 'border-emerald-600 bg-emerald-50/40'
                : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.jpg,.jpeg,.png,.webp,.jfif,.avif,.heic,.heif,.bmp,.gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-2xs border border-slate-200 flex items-center justify-center text-slate-400">
              <UploadCloud className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700">
              <span className="font-semibold text-emerald-800">Click to upload photos</span> or drag &amp; drop
            </div>
            <p className="text-[11px] text-slate-400">
              JPG, PNG, WEBP, or other images up to {maxSizeMB}MB each ({images.length}/{maxFiles} uploaded)
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Thumbnails Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {images.map((img, index) => {
            const url = img.previewUrl || (typeof img === 'string' ? img : '');
            return (
              <div
                key={index}
                className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square shadow-2xs"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-lg transition shadow-xs cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-1 left-1 bg-slate-900/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  #{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
