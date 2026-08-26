import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, X, Check, ShieldAlert, SwitchCamera } from 'lucide-react';

interface CameraScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraScanModal({ isOpen, onClose, onCapture }: CameraScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setIsInitializing(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access camera.';
      setCameraError(`Camera Error: ${msg}. Please ensure camera permissions are granted.`);
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, startCamera, stopCamera]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip horizontally if front camera
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `gemstone-camera-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          const url = URL.createObjectURL(blob);
          setCapturedImage(url);
          setCapturedFile(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setCapturedFile(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedFile) {
      onCapture(capturedFile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg liquid-glass-strong rounded-3xl overflow-hidden border border-border shadow-2xl flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/60">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground font-heading">
                {capturedImage ? 'Review Photo' : 'Gemstone Camera Scanner'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewport */}
          <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
            {!capturedImage ? (
              <>
                {cameraError ? (
                  <div className="p-6 text-center text-red-400 space-y-3">
                    <ShieldAlert className="w-12 h-12 mx-auto text-red-400 opacity-80" />
                    <p className="text-sm font-medium">{cameraError}</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 rounded-full bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                      playsInline
                      muted
                    />

                    {/* Target Framing Guide Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl border-2 border-dashed border-primary/80 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex flex-col items-center justify-between p-4">
                        <div className="w-full flex justify-between">
                          <div className="w-4 h-4 border-t-2 border-l-2 border-primary" />
                          <div className="w-4 h-4 border-t-2 border-r-2 border-primary" />
                        </div>
                        <span className="text-[11px] font-medium text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm shadow">
                          Center Gemstone Here
                        </span>
                        <div className="w-full flex justify-between">
                          <div className="w-b-4 h-4 border-b-2 border-l-2 border-primary" />
                          <div className="w-b-4 h-4 border-b-2 border-r-2 border-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Switch Camera Button (Mobile) */}
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="absolute top-4 right-4 p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors shadow-md"
                      title="Switch Camera"
                    >
                      <SwitchCamera className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured Gemstone Preview"
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls Footer */}
          <div className="p-5 bg-background/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-between">
            {!capturedImage ? (
              <div className="w-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  disabled={!!cameraError || isInitializing}
                  className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  aria-label="Capture Photo"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-primary-foreground flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white" />
                  </div>
                </button>

                <div className="w-16" />
              </div>
            ) : (
              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-secondary py-3 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake Photo
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
                >
                  <Check className="w-4 h-4" />
                  Use Photo for Scan
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
