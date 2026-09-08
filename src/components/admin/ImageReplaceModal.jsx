import { useEffect, useMemo, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImageBlob, formatBytes } from '../../lib/cropImage';

const ASPECT_OPTIONS = [
  { label: 'Free', value: null },
  { label: '1:1 (Square)', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '2:1', value: 2 / 1 },
];

/**
 * Full-screen crop/zoom/preview modal, used two ways by ImageUploadField:
 *  - "Preview": opened with the currently-saved image (a URL, no `file`) so an admin
 *    can review or re-crop it without picking a new one first.
 *  - "Replace": opened with a freshly-picked `file`, before it's uploaded.
 * A "Change" button inside the modal lets you swap between the two at any time.
 */
export default function ImageReplaceModal({ file: initialFile, currentUrl, fallbackUrl, recommendedAspect, onCancel, onConfirm, confirming }) {
  const [file, setFile] = useState(initialFile ?? null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(recommendedAspect ?? null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const changeInputRef = useRef(null);

  const sourceUrl = currentUrl || fallbackUrl;
  const isPreviewingExisting = !file;

  useEffect(() => {
    if (!file) {
      setImageSrc(sourceUrl || null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (!imageSrc || !croppedAreaPixels) return;
    let cancelled = false;
    getCroppedImageBlob(imageSrc, croppedAreaPixels).then((blob) => {
      if (cancelled || !blob) return;
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [imageSrc, croppedAreaPixels]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(recommendedAspect ?? null);
  };

  const handlePickNewFile = (event) => {
    const picked = event.target.files?.[0];
    event.target.value = '';
    if (!picked) return;
    setFile(picked);
    handleReset();
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const mimeType = file?.type?.startsWith('image/png') ? 'image/png' : 'image/jpeg';
    const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, mimeType);
    onConfirm(blob);
  };

  const finalSize = useMemo(() => {
    if (!croppedAreaPixels) return null;
    return `${Math.round(croppedAreaPixels.width)} × ${Math.round(croppedAreaPixels.height)} px`;
  }, [croppedAreaPixels]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#e7ece9] px-6 py-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#101828]">
              {isPreviewingExisting ? 'Preview Image' : 'Replace Image'}
            </h2>
            <p className="mt-0.5 font-body text-sm text-[#667085]">
              {isPreviewingExisting
                ? 'Review the current image, or pick a new one to replace it.'
                : 'Select a new image and adjust the preview before replacing it.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-transparent p-0 text-[#98a2b3] hover:bg-[#f7f9f8] hover:text-[#344054]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-[#e7ece9] px-6 py-3">
          <div className="h-10 w-10 flex-none overflow-hidden rounded-md bg-[#f7f9f8]">
            {imageSrc && <img src={imageSrc} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-sm font-medium text-[#344054]">{file ? file.name : 'Current image'}</p>
            <p className="font-body text-xs text-[#98a2b3]">{file ? formatBytes(file.size) : 'Saved on this section'}</p>
          </div>
          <button
            type="button"
            onClick={() => changeInputRef.current?.click()}
            className="flex-none rounded-[8px] border border-[#dce4e0] bg-white px-3 py-1.5 font-heading text-xs font-semibold text-[#344054] hover:bg-[#f7f9f8]"
          >
            Change
          </button>
          <input ref={changeInputRef} type="file" accept="image/*" className="hidden" onChange={handlePickNewFile} />
        </div>

        <div className="grid flex-1 grid-cols-2 gap-6 overflow-y-auto px-6 py-5 max-[700px]:grid-cols-1">
          {/* Crop & Adjust */}
          <div className="flex flex-col gap-3">
            <p className="font-heading text-sm font-semibold text-[#101828]">Crop &amp; Adjust</p>

            <div className="relative h-[260px] w-full overflow-hidden rounded-lg bg-[#1a1a1a]">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect ?? undefined}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_area, pixels) => setCroppedAreaPixels(pixels)}
                  restrictPosition={!!aspect}
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-semibold text-[#344054]">Aspect Ratio</label>
              <select
                value={aspect ?? ''}
                onChange={(event) => setAspect(event.target.value ? Number(event.target.value) : null)}
                className="h-10 rounded-[9px] border border-[#dce4e0] bg-white px-3 font-body text-sm text-[#344054] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
              >
                {ASPECT_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value ?? ''}>
                    {opt.label}
                    {recommendedAspect != null && opt.value === recommendedAspect ? ' (Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-body text-xs font-semibold text-[#344054]">Zoom</label>
                <span className="font-body text-xs text-[#98a2b3]">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-[9px] border border-[#dce4e0] bg-white px-4 py-2.5 font-heading text-sm font-semibold text-[#344054] hover:bg-[#f7f9f8]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-[9px] border border-[#dce4e0] bg-white px-4 py-2.5 font-heading text-sm font-semibold text-[#344054] hover:bg-[#f7f9f8]"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-3">
            <p className="font-heading text-sm font-semibold text-[#101828]">Preview</p>
            <p className="-mt-2 font-body text-xs text-[#98a2b3]">This is how the image will appear on your website.</p>

            <div className="flex h-[180px] w-full items-center justify-center overflow-hidden rounded-lg border border-[#e4eae7] bg-[#f7f9f8]">
              {previewUrl ? (
                <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <p className="font-body text-xs text-[#98a2b3]">Adjust the crop to preview</p>
              )}
            </div>

            {finalSize && (
              <p className="rounded-[8px] bg-[#eef7f3] px-3 py-2 font-body text-xs text-[#14733e]">
                Final image size: {finalSize}
              </p>
            )}

            <div className="mt-1 border-t border-[#e7ece9] pt-3">
              <p className="mb-2 font-heading text-sm font-semibold text-[#101828]">
                {isPreviewingExisting ? 'Current image' : 'Original image'}
              </p>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 flex-none overflow-hidden rounded-md bg-[#f7f9f8]">
                  {imageSrc && <img src={imageSrc} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0">
                  {file && <p className="font-body text-xs text-[#667085]">{formatBytes(file.size)}</p>}
                  {imageSrc && (
                    <a href={imageSrc} target="_blank" rel="noreferrer" className="font-body text-xs font-semibold text-[#0b6b45] hover:underline">
                      View full image
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#e7ece9] px-6 py-4">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!croppedAreaPixels || confirming}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#df2759] px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-[0_6px_14px_-4px_rgba(224,38,89,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirming ? 'Uploading…' : isPreviewingExisting ? 'Save Changes' : 'Replace Image'}
          </button>
        </div>
      </div>
    </div>
  );
}
