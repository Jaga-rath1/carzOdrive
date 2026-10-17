import React from 'react';
import { Sparkles, Layers, Image as ImageIcon, Upload, Loader2, Plus, Trash2 } from 'lucide-react';

export const VehicleMediaTab = ({
  formData,
  handleChange,
  setFormData,
  primaryFileInputRef,
  galleryFileInputRef,
  handlePrimaryUpload,
  handleGalleryUpload,
  removeGalleryImage,
  uploadingImage,
  uploadingGallery,
  presetImages,
}) => {
  return (
    <div className="space-y-5">
      {/* Primary Image Upload Banner */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Primary Vehicle Photo (Cloudinary CDN)</span>
            </h4>
            <p className="text-[11px] text-zinc-500">Main hero image shown on search cards and catalog</p>
          </div>

          <input
            type="file"
            ref={primaryFileInputRef}
            onChange={handlePrimaryUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => primaryFileInputRef.current?.click()}
            disabled={uploadingImage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-black hover:bg-zinc-800 disabled:opacity-50 cursor-pointer transition-all shadow-sm"
          >
            {uploadingImage ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading to Cloudinary...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Cloudinary</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {formData.image ? (
            <img
              src={formData.image}
              alt="Primary cover preview"
              className="w-24 h-16 object-cover rounded-xl border border-zinc-300 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-24 h-16 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}

          <input
            type="text"
            name="image"
            placeholder="Cloudinary Image URL or select preset below"
            value={formData.image}
            onChange={handleChange}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-900 outline-none focus:border-black"
          />
        </div>

        {presetImages && presetImages.length > 0 && (
          <div className="mt-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Quick Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetImages.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      image: img.url,
                      images: p.images.includes(img.url) ? p.images : [img.url, ...p.images],
                    }))
                  }
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    formData.image === img.url
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-black'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Multiple Photos Upload */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gallery & Interior Photos ({formData.images.length} images)</span>
            </h4>
            <p className="text-[11px] text-zinc-500">
              Upload multiple gallery angles to Cloudinary for the interactive gallery slider
            </p>
          </div>

          <input
            type="file"
            multiple
            ref={galleryFileInputRef}
            onChange={handleGalleryUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => galleryFileInputRef.current?.click()}
            disabled={uploadingGallery}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 disabled:opacity-50 cursor-pointer transition-all"
          >
            {uploadingGallery ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading Gallery...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Gallery Photos</span>
              </>
            )}
          </button>
        </div>

        {formData.images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {formData.images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative aspect-video rounded-xl overflow-hidden bg-zinc-200 border border-zinc-300 shadow-xs"
              >
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                {formData.image === imgUrl && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-black text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeGalleryImage(imgUrl)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                  title="Remove photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 py-3 text-center">No additional gallery photos added yet.</p>
        )}
      </div>
    </div>
  );
};
