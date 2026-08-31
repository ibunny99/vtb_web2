'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  Move,
  Check,
  RotateCcw,
  Crop,
  Sliders,
  Sparkles,
  Loader2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface ImageAdjusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onApply: (croppedBlob: Blob) => Promise<void> | void;
  isSaving?: boolean;
}

type AspectRatioType = '3:4' | '9:16' | '1:1' | 'free';

export default function ImageAdjusterModal({
  isOpen,
  onClose,
  imageUrl,
  onApply,
  isSaving = false,
}: ImageAdjusterModalProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  // Transformation states
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('3:4');

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load Image when imageUrl changes or modal opens
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    setLoadingImage(true);
    setImageError(null);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setIsFlippedH(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setImage(img);
      setLoadingImage(false);
    };

    img.onerror = () => {
      // Retry without crossOrigin if external domain blocked CORS
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setImage(fallbackImg);
        setLoadingImage(false);
      };
      fallbackImg.onerror = () => {
        setImageError('Không thể tải ảnh này do chính sách bảo mật CORS hoặc URL không hợp lệ.');
        setLoadingImage(false);
      };
      fallbackImg.src = imageUrl;
    };

    img.src = imageUrl;
  }, [isOpen, imageUrl]);

  // Calculate crop box aspect ratio dimensions in the preview viewport
  const getCropBoxDimensions = useCallback(
    (containerW: number, containerH: number) => {
      let targetRatio = 3 / 4; // default
      if (aspectRatio === '9:16') targetRatio = 9 / 16;
      else if (aspectRatio === '1:1') targetRatio = 1 / 1;
      else if (aspectRatio === 'free') {
        if (image) {
          targetRatio = image.width / image.height;
        } else {
          targetRatio = 3 / 4;
        }
      }

      const padding = 32;
      const maxW = containerW - padding * 2;
      const maxH = containerH - padding * 2;

      let boxW = maxW;
      let boxH = boxW / targetRatio;

      if (boxH > maxH) {
        boxH = maxH;
        boxW = boxH * targetRatio;
      }

      return {
        boxW,
        boxH,
        boxX: (containerW - boxW) / 2,
        boxY: (containerH - boxH) / 2,
      };
    },
    [aspectRatio, image]
  );

  // Draw Interactive Preview Canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !image) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Dark grid background
    ctx.fillStyle = '#090B0E';
    ctx.fillRect(0, 0, width, height);

    const { boxW, boxH, boxX, boxY } = getCropBoxDimensions(width, height);

    // Save state for drawing transformed image
    ctx.save();

    // Center coordinates for transformations
    const centerX = width / 2 + panX;
    const centerY = height / 2 + panY;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(isFlippedH ? -1 : 1, 1);

    // Calculate base draw size to cover the crop box nicely
    const imgAspect = image.width / image.height;
    const boxAspect = boxW / boxH;

    let baseW = boxW;
    let baseH = boxH;

    if (imgAspect > boxAspect) {
      baseH = boxH;
      baseW = baseH * imgAspect;
    } else {
      baseW = boxW;
      baseH = baseW / imgAspect;
    }

    const drawW = baseW * zoom;
    const drawH = baseH * zoom;

    ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // ----------------------------------------------------
    // Draw Dark Overlay outside of the Crop Box
    // ----------------------------------------------------
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

    // Top
    ctx.fillRect(0, 0, width, boxY);
    // Bottom
    ctx.fillRect(0, boxY + boxH, width, height - (boxY + boxH));
    // Left
    ctx.fillRect(0, boxY, boxX, boxH);
    // Right
    ctx.fillRect(boxX + boxW, boxY, width - (boxX + boxW), boxH);

    // ----------------------------------------------------
    // Draw Crop Box Border & Rule of Thirds Guides
    // ----------------------------------------------------
    ctx.strokeStyle = '#00DCFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Rule of Thirds lines
    ctx.strokeStyle = 'rgba(213, 254, 152, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(boxX + boxW / 3, boxY);
    ctx.lineTo(boxX + boxW / 3, boxY + boxH);
    ctx.moveTo(boxX + (boxW * 2) / 3, boxY);
    ctx.lineTo(boxX + (boxW * 2) / 3, boxY + boxH);

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + boxH / 3);
    ctx.lineTo(boxX + boxW, boxY + boxH / 3);
    ctx.moveTo(boxX, boxY + (boxH * 2) / 3);
    ctx.lineTo(boxX + boxW, boxY + (boxH * 2) / 3);
    ctx.stroke();
    ctx.setLineDash([]);

    // Corner Accents
    const cornerSize = 14;
    ctx.strokeStyle = '#00DCFF';
    ctx.lineWidth = 3;

    // Top Left
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + cornerSize);
    ctx.lineTo(boxX, boxY);
    ctx.lineTo(boxX + cornerSize, boxY);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(boxX + boxW - cornerSize, boxY);
    ctx.lineTo(boxX + boxW, boxY);
    ctx.lineTo(boxX + boxW, boxY + cornerSize);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + boxH - cornerSize);
    ctx.lineTo(boxX, boxY + boxH);
    ctx.lineTo(boxX + cornerSize, boxY + boxH);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(boxX + boxW - cornerSize, boxY + boxH);
    ctx.lineTo(boxX + boxW, boxY + boxH);
    ctx.lineTo(boxX + boxW, boxY + boxH - cornerSize);
    ctx.stroke();
  }, [image, zoom, panX, panY, rotation, isFlippedH, getCropBoxDimensions]);

  // Redraw preview whenever any state changes
  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(Number((prev + zoomDelta).toFixed(2)), 0.4), 3.5));
  };

  // Touch support for Mobile / Tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panX,
        y: e.touches[0].clientY - panY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - dragStart.x);
    setPanY(e.touches[0].clientY - dragStart.y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick Action Buttons
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setIsFlippedH(false);
  };

  const handleCenter = () => {
    setPanX(0);
    setPanY(0);
  };

  // Generate Cropped High-Resolution Image & Trigger Apply
  const handleApplyCrop = async () => {
    if (!image) return;

    const container = containerRef.current;
    const containerW = container?.clientWidth || 500;
    const containerH = container?.clientHeight || 450;
    const { boxW, boxH } = getCropBoxDimensions(containerW, containerH);

    // Export resolution (High-Def 1080 width for crisp render)
    const exportWidth = 1080;
    const exportHeight = Math.round((exportWidth * boxH) / boxW);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Scale factor from preview box to export canvas
    const scaleFactor = exportWidth / boxW;

    ctx.save();
    // Translate to center of export canvas + scaled pan
    ctx.translate(exportWidth / 2 + panX * scaleFactor, exportHeight / 2 + panY * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(isFlippedH ? -1 : 1, 1);

    const imgAspect = image.width / image.height;
    const boxAspect = boxW / boxH;

    let baseW = boxW;
    let baseH = boxH;

    if (imgAspect > boxAspect) {
      baseH = boxH;
      baseW = baseH * imgAspect;
    } else {
      baseW = boxW;
      baseH = baseW / imgAspect;
    }

    const drawW = baseW * zoom * scaleFactor;
    const drawH = baseH * zoom * scaleFactor;

    ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Export to Blob
    exportCanvas.toBlob(
      async (blob) => {
        if (blob) {
          await onApply(blob);
        } else {
          alert('Không thể tạo file ảnh sau khi crop.');
        }
      },
      'image/png',
      0.95
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#121620] border border-white/20 rounded-[2rem] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col max-h-[95vh]">
        {/* Top Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#00DCFF] to-transparent" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00DCFF]/15 border border-[#00DCFF]/40 flex items-center justify-center text-[#00DCFF]">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-extrabold text-white">
                Bộ Tinh Chỉnh Vị Trí, Zoom & Crop Ảnh Khách Mời
              </h3>
              <p className="text-xs text-white/60">
                Kéo thả để di chuyển, lăn chuột hoặc kéo thanh trượt để Zoom, xoay và cắt theo khung chuẩn.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          {/* Left Canvas Preview Area */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div
              ref={containerRef}
              className="relative w-full h-[340px] sm:h-[420px] rounded-2xl bg-[#090B0E] border border-white/15 overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
            >
              {loadingImage ? (
                <div className="flex flex-col items-center gap-2 text-[#00DCFF] font-mono text-xs">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Đang tải ảnh...</span>
                </div>
              ) : imageError ? (
                <div className="p-6 text-center text-red-400 text-xs">
                  <p>{imageError}</p>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="w-full h-full block touch-none"
                />
              )}

              {/* Pan Guide Indicator */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-white/70 pointer-events-none flex items-center gap-1.5">
                <Move className="w-3 h-3 text-[#00DCFF]" />
                <span>Kéo ảnh để di chuyển</span>
              </div>
            </div>

            {/* Quick action bar below canvas */}
            <div className="flex items-center justify-between text-xs font-mono text-white/60">
              <div className="flex items-center gap-2">
                <span>Tọa độ:</span>
                <span className="text-[#00DCFF]">
                  X: {Math.round(panX)}px | Y: {Math.round(panY)}px
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>Phóng đại:</span>
                <span className="text-[#00DCFF] font-bold">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#0D1017] p-5 rounded-2xl border border-white/10">
            <div className="space-y-5">
              {/* Aspect Ratio Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Crop className="w-3.5 h-3.5 text-[#00DCFF]" />
                  Tỷ lệ khung cắt (Aspect Ratio)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('3:4')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                      aspectRatio === '3:4'
                        ? 'bg-[#00DCFF] text-black border-[#00DCFF]'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    3:4 Nhân vật
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                      aspectRatio === '9:16'
                        ? 'bg-[#00DCFF] text-black border-[#00DCFF]'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    9:16 Story
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                      aspectRatio === '1:1'
                        ? 'bg-[#00DCFF] text-black border-[#00DCFF]'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    1:1 Vuông
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('free')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                      aspectRatio === 'free'
                        ? 'bg-[#00DCFF] text-black border-[#00DCFF]'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Tự do
                  </button>
                </div>
              </div>

              {/* Zoom Control Slider */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-[#00DCFF]" />
                    Phóng to / Thu nhỏ (Zoom)
                  </label>
                  <span className="text-xs font-mono text-[#00DCFF] font-bold">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(Number((z - 0.1).toFixed(2)), 0.4))}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors"
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <input
                    type="range"
                    min="0.4"
                    max="3.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[#00DCFF] cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(Number((z + 0.1).toFixed(2)), 3.5))}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors"
                    title="Phóng to"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fine-Tuning Precision Sliders: Pan X & Pan Y */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#00DCFF]" />
                  Tinh chỉnh vị trí (Pan X / Y)
                </label>

                {/* Pan X Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span>Trục ngang (X):</span>
                    <span className="text-white">{Math.round(panX)} px</span>
                  </div>
                  <input
                    type="range"
                    min="-250"
                    max="250"
                    step="1"
                    value={panX}
                    onChange={(e) => setPanX(parseInt(e.target.value))}
                    className="w-full accent-[#00DCFF] cursor-pointer"
                  />
                </div>

                {/* Pan Y Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span>Trục dọc (Y):</span>
                    <span className="text-white">{Math.round(panY)} px</span>
                  </div>
                  <input
                    type="range"
                    min="-250"
                    max="250"
                    step="1"
                    value={panY}
                    onChange={(e) => setPanY(parseInt(e.target.value))}
                    className="w-full accent-[#00DCFF] cursor-pointer"
                  />
                </div>
              </div>

              {/* Rotate, Flip & Quick Actions */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-heading font-bold text-white uppercase tracking-wider">
                  Công cụ xoay & Lật
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#00DCFF]" />
                    <span>Xoay 90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFlippedH(!isFlippedH)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isFlippedH
                        ? 'bg-[#00DCFF]/20 border-[#00DCFF]/50 text-[#00DCFF]'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Lật Ngang</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCenter}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Căn Giữa</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Khôi phục trạng thái ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={isSaving || loadingImage || !image}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00DCFF] text-black font-heading font-extrabold text-xs uppercase tracking-wide hover:bg-[#c3f27f] transition-all shadow-[0_0_20px_rgba(213,254,152,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý & Lưu ảnh...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Áp Dụng & Lưu Ảnh Mới</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
