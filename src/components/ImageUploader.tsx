import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { X, Upload, Check, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  onClose: () => void;
}

export function ImageUploader({ currentImageUrl, onUploadSuccess, onClose }: ImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    try {
      setIsUploading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileName = `thumbnail_${Date.now()}.jpg`;
      const storageRef = ref(storage, `invitations/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, croppedImageBlob);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadSuccess(downloadURL);
          setIsUploading(false);
        }
      );
    } catch (e) {
      console.error(e);
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans" dir="rtl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif text-gray-800">تعديل صورة الدعوة المصغرة</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        {!imageSrc ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <ImageIcon size={40} />
            </div>
            <p className="text-gray-500 mb-6 text-center font-medium">اختر صورة لعرضها كواجهة رئيسية في الدعوة</p>
            <label className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-md flex items-center gap-2">
              <Upload size={20} />
              <span>اختيار صورة</span>
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
            {currentImageUrl && (
              <div className="mt-8 pt-8 border-t border-stone-200 w-full flex flex-col items-center">
                <p className="text-gray-400 text-sm mb-4">الصورة الحالية:</p>
                <img src={currentImageUrl} alt="Current" className="w-32 h-40 object-cover" style={{ borderRadius: '50% 50% 0 0' }} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-[400px]">
            <div className="relative flex-1 bg-stone-900 rounded-2xl overflow-hidden min-h-[300px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4} // Standard portrait aspect ratio
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{
                  containerClassName: 'rounded-2xl',
                  cropAreaClassName: 'crop-area-arch'
                }}
              />
              <style>{`
                .crop-area-arch {
                  border-radius: 50% 50% 0 0 !important;
                  border: 2px solid white !important;
                  box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.5) !important;
                }
              `}</style>
            </div>
            
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">تكبير / تصغير</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                dir="ltr"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setImageSrc(null)}
                disabled={isUploading}
                className="flex-1 px-6 py-3 border border-stone-300 text-gray-700 rounded-xl font-bold hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                تغيير الصورة
              </button>
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-[2] px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>جاري الحفظ {Math.round(uploadProgress)}%</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>قص وحفظ الصورة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}
