import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Check, Loader2, Star } from 'lucide-react';
import { uploadsAPI } from '../../../services/api';

export const PackageMediaTab = ({ formData, setFormData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploadError, setUploadError] = useState(null);

  const images = formData.images && formData.images.length > 0
    ? formData.images
    : formData.image
    ? [formData.image]
    : [];

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await uploadsAPI.uploadImages(files, 'tour-packages');
      if (res?.data?.urls && res.data.urls.length > 0) {
        const newUrls = res.data.urls;
        setFormData((prev) => {
          const currentList = prev.images || [];
          const combined = [...currentList, ...newUrls];
          return {
            ...prev,
            images: combined,
            image: prev.image || combined[0],
          };
        });
      }
    } catch (err) {
      console.error('Package media upload error:', err);
      setUploadError(err.message || 'Failed to upload images to Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    setFormData((prev) => {
      const currentList = prev.images || [];
      if (!currentList.includes(url)) {
        const updated = [...currentList, url];
        return {
          ...prev,
          images: updated,
          image: prev.image || updated[0],
        };
      }
      return prev;
    });
    setUrlInput('');
  };

  const handleSetCover = (imgUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imgUrl,
    }));
  };

  const handleRemoveImage = (imgUrl) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((u) => u !== imgUrl);
      return {
        ...prev,
        images: updated,
        image: prev.image === imgUrl ? (updated[0] || '') : prev.image,
      };
    });
  };

  return (
    <div className="space-y-5">
      {/* Cloudinary Multi-Upload Dropzone */}
      <div className="p-5 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100/70 transition-all text-center">
        <input
          type="file"
          id="package-file-upload"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
        />
        <label
          htmlFor="package-file-upload"
          className="cursor-pointer flex flex-col items-center justify-center gap-2"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="text-xs font-bold text-zinc-700">
                Uploading to Cloudinary CDN...
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-900">
                  Click to Upload Odisha Tour Images
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Select multiple high-resolution photos (JPG, PNG, WEBP)
                </p>
              </div>
            </>
          )}
        </label>

        {uploadError && (
          <p className="text-xs text-rose-600 font-bold mt-2">{uploadError}</p>
        )}
      </div>

      {/* Direct URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Or paste external image URL (https://...)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:bg-white focus:border-blue-600"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-all"
        >
          Add URL
        </button>
      </div>

      {/* Uploaded Gallery Preview */}
      <div className="space-y-2 pt-2 border-t border-zinc-200">
        <label className="text-xs font-black text-zinc-900 uppercase tracking-wider block">
          Current Tour Photos ({images.length} Photos)
        </label>

        {images.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No images attached yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const isCover = formData.image === img || (!formData.image && idx === 0);
              return (
                <div
                  key={idx}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 bg-zinc-900 group transition-all ${
                    isCover ? 'border-blue-600 shadow-md ring-2 ring-blue-400/30' : 'border-zinc-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`tour-${idx}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Cover</span>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(img)}
                        className="px-2 py-1 rounded-md bg-white text-zinc-900 text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="p-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
