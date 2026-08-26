import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CameraScanModal } from '../components/CameraScanModal';
import axios from 'axios';
import {
  Upload,
  Download,
  X,
  Gem,
  Award,
  TrendingUp,
  FileText,
  ChevronLeft,
  Loader2,
  Sparkles,
  Info,
  Camera,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  RefreshCw,
  Layers,
  GitMerge,
  Eye,
  Activity,
  ShieldCheck,
  Zap,
  BarChart2,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || '/api';

type AnalysisResult = {
  isGemstone?: boolean;
  gemstone: string;
  confidence: number;
  topPredictions: { name: string; confidence: number }[];
  taxonomy?: {
    family: string;
    species: string;
    variety: string;
    formula: string;
    familyConfidence: number;
    speciesConfidence: number;
    varietyConfidence: number;
  };
  multimodalFusion?: {
    fusionMode: string;
    alphaWeightCnn: number;
    accuracyGainEstimate: string;
    cnnTop: { name: string; confidence: number };
    clipTop: { name: string; confidence: number };
    fusedTop: { name: string; confidence: number };
    totalViewsAnalyzed?: number;
    multiViewAgreementPct?: number;
    isMultiViewEnsemble?: boolean;
    angleBreakdown?: { angleIndex: number; name: string; confidence: number; filename: string }[];
  };
  qualityGrade: string;
  qualityScore: number;
  qualityDetails: {
    clarity: number;
    colorSaturation: number;
    cutQuality: number;
    colorMetrics?: {
      lab: { L: number; a: number; b: number; chroma: number };
      hsv: { hueDeg: number; saturationPct: number; valuePct: number };
      giaRating: string;
      colorScore: number;
    };
    cutMetrics?: {
      facetCount: number;
      symmetryScore: number;
      aspectRatio: number;
      cutQualityScore: number;
    };
  };
  priceRange: {
    caratWeight?: number;
    caratMultiplier?: number;
    perCaratUsd?: number;
    perCaratLkr?: number;
    minUsd: number;
    maxUsd: number;
    suggestedUsd: number;
    minLkr: number;
    maxLkr: number;
    suggestedLkr: number;
    baseMinUsd?: number;
    baseMaxUsd?: number;
    marketTrend: string;
    uncertainty?: {
      stdErrorUsd: number;
      marginOfErrorUsd: number;
      confidenceInterval95Usd: [number, number];
      confidenceInterval95Lkr: [number, number];
      relativeUncertaintyPct: number;
      confidenceLevelPct: number;
    };
  };
  saliencyHeatmap?: string;
  calibration?: {
    rawConfidencePct: number;
    calibratedConfidencePct: number;
    ecePct: number;
    brierScore: number;
    temperature: number;
    reliabilityStatus: string;
    bins: { bin: string; avgConf: number; avgAcc: number }[];
  };
  executiveSummary?: string;
  executiveSummarySinhala?: string;
};

const gradeColors: Record<string, string> = {
  AAA: 'grade-aaa',
  AA: 'grade-aa',
  A: 'grade-a',
  B: 'grade-b',
  C: 'grade-c',
};

const gradeDescriptions: Record<string, string> = {
  AAA: 'Exceptional — Museum-quality specimen with outstanding characteristics',
  AA: 'Excellent — Premium-grade gem with superior clarity and color',
  A: 'Very Good — High-quality gem suitable for fine jewelry',
  B: 'Good — Standard commercial quality with visible characteristics',
  C: 'Fair — Economy grade with noticeable inclusions',
};

function calculateGradeFromScore(score: number): string {
  if (score >= 90) return 'AAA';
  if (score >= 75) return 'AA';
  if (score >= 60) return 'A';
  if (score >= 40) return 'B';
  return 'C';
}

const SLOT_LABELS = [
  { name: 'Angle 1 (Studio Front)', desc: 'Primary direct lighting' },
  { name: 'Angle 2 (Side / Refraction)', desc: 'Tilt or facet refraction' },
  { name: 'Angle 3 (Macro / Lighting)', desc: 'Diffused or macro view' },
];

export function GemAnalyzerPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);

  const [dragOver, setDragOver] = useState(false);
  const [angleFiles, setAngleFiles] = useState<(File | null)[]>([null, null, null]);
  const [anglePreviews, setAnglePreviews] = useState<(string | null)[]>([null, null, null]);
  const [activeSlotTarget, setActiveSlotTarget] = useState<number | null>(null);
  const activeSlotTargetRef = useRef<number | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Interactive metric state overrides
  const [priceSliderValue, setPriceSliderValue] = useState(50);
  const [customClarity, setCustomClarity] = useState<number | null>(null);
  const [customColor, setCustomColor] = useState<number | null>(null);
  const [customCut, setCustomCut] = useState<number | null>(null);
  const [caratWeight, setCaratWeight] = useState<number>(1.0);

  // Trust & Explainability States
  const [imageDisplayMode, setImageDisplayMode] = useState<'original' | 'saliency'>('original');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [summaryLang, setSummaryLang] = useState<'en' | 'si'>('en');

  // Report modal state
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived values
  const primaryPreview = anglePreviews.find((p) => p !== null) || null;
  const validFilesCount = angleFiles.filter((f) => f !== null).length;

  // Auto-launch camera modal if passed from Hero or Nav state
  useEffect(() => {
    if (location.state && (location.state as { mode?: string }).mode === 'camera') {
      setActiveTab('camera');
      setCameraModalOpen(true);
    }
  }, [location.state]);

  const handleFile = useCallback((file: File, targetSlotIndex?: number) => {
    if (!file.type.startsWith('image/')) {
      setError('Invalid file format. Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Maximum size is 10MB.');
      return;
    }
    setError(null);
    setResult(null);

    const url = URL.createObjectURL(file);

    setAngleFiles((prevFiles) => {
      let target = targetSlotIndex !== undefined && targetSlotIndex !== null && targetSlotIndex >= 0
        ? targetSlotIndex
        : prevFiles.findIndex((f) => f === null);
      if (target === -1) target = 0;
      const nextFiles = [...prevFiles];
      nextFiles[target] = file;
      return nextFiles;
    });

    setAnglePreviews((prevPreviews) => {
      let target = targetSlotIndex !== undefined && targetSlotIndex !== null && targetSlotIndex >= 0
        ? targetSlotIndex
        : prevPreviews.findIndex((f) => f === null);
      if (target === -1) target = 0;
      const nextPreviews = [...prevPreviews];
      if (nextPreviews[target]) {
        URL.revokeObjectURL(nextPreviews[target]!);
      }
      nextPreviews[target] = url;
      return nextPreviews;
    });
  }, []);

  const triggerSlotFileInput = (slotIdx: number) => {
    activeSlotTargetRef.current = slotIdx;
    setActiveSlotTarget(slotIdx);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const triggerGeneralFileInput = () => {
    activeSlotTargetRef.current = null;
    setActiveSlotTarget(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const removeSlot = (slotIndex: number) => {
    setAnglePreviews((prev) => {
      const next = [...prev];
      if (next[slotIndex]) URL.revokeObjectURL(next[slotIndex]!);
      next[slotIndex] = null;
      return next;
    });
    setAngleFiles((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, slotIdx?: number) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (!droppedFiles.length) return;

      if (slotIdx !== undefined) {
        handleFile(droppedFiles[0], slotIdx);
      } else {
        droppedFiles.slice(0, 3).forEach((f, i) => {
          handleFile(f, i);
        });
      }
    },
    [handleFile]
  );

  const handleCameraCapture = (file: File) => {
    const target = activeSlotTargetRef.current !== null && activeSlotTargetRef.current !== undefined ? activeSlotTargetRef.current : undefined;
    handleFile(file, target);
    activeSlotTargetRef.current = null;
    setActiveSlotTarget(null);
  };

  const handleAnalyze = async () => {
    const validFiles = angleFiles.filter((f): f is File => f !== null);
    if (validFiles.length === 0) return;

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append('images', file);
      });
      formData.append('image', validFiles[0]);
      formData.append('carat', caratWeight.toString());

      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      const data = response.data;
      if (data.isGemstone === false) {
        setError(data.error || 'Non-gemstone image detected. Only gemstone photos can be scanned.');
        setResult(null);
        return;
      }

      setResult(data);
      setCustomClarity(data.qualityDetails?.clarity ?? 80);
      setCustomColor(data.qualityDetails?.colorSaturation ?? 80);
      setCustomCut(data.qualityDetails?.cutQuality ?? 80);
      if (data.priceRange?.caratWeight) {
        setCaratWeight(data.priceRange.caratWeight);
      }

      if (data.priceRange) {
        const { minUsd, maxUsd, suggestedUsd } = data.priceRange;
        const pct = ((suggestedUsd - minUsd) / (maxUsd - minUsd)) * 100;
        setPriceSliderValue(Math.round(pct));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendError = (err.response?.data as { error?: string })?.error;
        if (backendError) {
          setError(backendError);
        } else {
          setError('Failed to analyze image. Please ensure the python ML server is running.');
        }
      } else {
        const msg = err instanceof Error ? err.message : 'Analysis error';
        setError(`Failed to process image: ${msg}`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    anglePreviews.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    setAngleFiles([null, null, null]);
    setAnglePreviews([null, null, null]);
    setResult(null);
    setError(null);
    setCustomClarity(null);
    setCustomColor(null);
    setCustomCut(null);
    setCaratWeight(1.0);
  };

  const handleDownloadPdfReport = async () => {
    if (!result) return;

    const activeImage = imageDisplayMode === 'saliency' && result.saliencyHeatmap ? result.saliencyHeatmap : primaryPreview;
    const reportId = `CG-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Create temporary printable container — will be placed inside a clip wrapper
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-container';
    pdfContainer.style.width = '750px';
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.color = '#0f172a';
    pdfContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    pdfContainer.style.padding = '24px 32px 24px 32px';
    pdfContainer.style.boxSizing = 'border-box';

    pdfContainer.innerHTML = `
      <!-- Certificate Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #0284c7; letter-spacing: -0.5px;">CycloneGems AI</h1>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b; font-weight: 600;">Official Gemological Diagnostic & Valuation Certificate</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 12px; font-weight: 700; color: #d97706; font-family: monospace;">Report ID: ${reportId}</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Issued: ${dateStr}</p>
        </div>
      </div>

      <!-- Specimen Attached Header -->
      ${activeImage ? `
        <div style="display: flex; gap: 18px; align-items: center; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <img src="${activeImage}" style="width: 115px; height: 115px; object-fit: cover; border-radius: 10px; border: 2px solid #0284c7;" />
          <div style="flex: 1;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 1px;">Specimen Photo Attached</span>
            <h2 style="margin: 2px 0 0 0; font-size: 22px; font-weight: 800; color: #0f172a;">${result.gemstone}</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569;">
              Taxonomy Family: <strong style="color: #0f172a;">${result.taxonomy?.family || 'Corundum / Mineral'}</strong>
            </p>
            <div style="margin-top: 8px; display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #059669;">
              ✓ AI Specimen Verified & Authenticated
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Primary Valuation Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
        <div>
          <p style="margin: 0; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700;">Identified Gemstone</p>
          <p style="margin: 2px 0 0 0; font-size: 16px; font-weight: 800; color: #0284c7;">${result.gemstone}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700;">Quality Grade</p>
          <p style="margin: 2px 0 0 0; font-size: 16px; font-weight: 800; color: #059669;">${dynamicGrade} (${dynamicScore}/100)</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700;">Carat Weight & Factor</p>
          <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 700; color: #d97706;">${caratWeight} ct (${currentCaratMultiplier.toFixed(2)}x factor)</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700;">Per Carat Valuation</p>
          <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 700; color: #0284c7;">$${dynamicPerCaratUsd.toLocaleString()} USD / ct</p>
        </div>
        <div style="grid-column: span 2; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 2px;">
          <p style="margin: 0; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700;">Estimated Total Market Valuation</p>
          <p style="margin: 2px 0 0 0; font-size: 22px; font-weight: 800; color: #0f172a;">
            $${currentPrice.toLocaleString()} USD <span style="font-size: 13px; color: #64748b; font-weight: 600;">(≈ LKR ${currentPriceLkr.toLocaleString()})</span>
          </p>
        </div>
      </div>

      <!-- CV Signal Analysis -->
      ${result.qualityDetails.colorMetrics ? `
        <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 12px; margin-bottom: 16px; font-size: 12px;">
          <p style="margin: 0 0 4px 0; font-weight: 700; color: #0284c7;">Computer Vision Color Analysis (CIE LAB Space):</p>
          <p style="margin: 0; font-family: monospace; color: #334155;">
            L*: ${result.qualityDetails.colorMetrics.lab.L} | a*: ${result.qualityDetails.colorMetrics.lab.a} | b*: ${result.qualityDetails.colorMetrics.lab.b} | Chroma: ${result.qualityDetails.colorMetrics.lab.chroma}
          </p>
          <p style="margin: 4px 0 0 0; color: #059669; font-weight: 700;">GIA Rating: ${result.qualityDetails.colorMetrics.giaRating}</p>
        </div>
      ` : ''}

      <!-- AI Executive Diagnostic Summary Narrative -->
      ${getExecutiveSummaryText() ? `
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7;">AI Diagnostic Executive Narrative Summary (${summaryLang === 'si' ? 'සිංහල' : 'English'}):</p>
          <p style="margin: 0; font-size: 12px; color: #1e293b; font-style: italic; line-height: 1.5;">"${getExecutiveSummaryText()}"</p>
        </div>
      ` : ''}

      <!-- Quality Scores Breakdown -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center; margin-bottom: 16px;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 10px;">
          <p style="margin: 0; font-size: 10px; color: #64748b; font-weight: 600;">Clarity Score</p>
          <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 800; color: #0f172a;">${clarity}%</p>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 10px;">
          <p style="margin: 0; font-size: 10px; color: #64748b; font-weight: 600;">Color Purity</p>
          <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 800; color: #0f172a;">${color}%</p>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 10px;">
          <p style="margin: 0; font-size: 10px; color: #64748b; font-weight: 600;">Cut & Symmetry</p>
          <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 800; color: #0f172a;">${cut}%</p>
        </div>
      </div>

      <!-- Report Footer & Legal Disclaimer -->
      <div style="border-top: 1px solid #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b;">
        <p style="margin: 0;">Automated Multi-Signal Vision Pipeline (Keras CNN + OpenAI CLIP Fusion).</p>
        <p style="margin: 0; font-weight: 700; color: #0284c7;">CycloneGems AI • Sri Lanka Market Standard</p>
      </div>
    `;

    // Wrap in a clip container so it doesn't flash on screen
    const clipWrapper = document.createElement('div');
    clipWrapper.style.position = 'fixed';
    clipWrapper.style.top = '0';
    clipWrapper.style.left = '0';
    clipWrapper.style.width = '1px';
    clipWrapper.style.height = '1px';
    clipWrapper.style.overflow = 'hidden';
    clipWrapper.style.clip = 'rect(0, 0, 0, 0)';
    clipWrapper.style.zIndex = '-1';

    // The pdfContainer itself must NOT be clipped — only the wrapper
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.top = '0';
    pdfContainer.style.left = '0';

    clipWrapper.appendChild(pdfContainer);
    document.body.appendChild(clipWrapper);

    // Wait for images inside container to finish loading before rendering canvas
    const imgElements = pdfContainer.querySelectorAll('img');
    await Promise.all(
      Array.from(imgElements).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalHeight !== 0) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          })
      )
    );

    // Give browser paint engine 150ms to composite elements
    await new Promise((r) => setTimeout(r, 150));

    try {
      // Step 1: Capture the container to a canvas using html2canvas directly
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Step 2: Convert canvas to JPEG data URL
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Step 3: Build PDF with jsPDF directly — guaranteed single page A4 format
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 8; // 8mm margin around page
      const usableWidth = pdfWidth - margin * 2; // 194mm
      const usableHeight = pdfHeight - margin * 2; // 281mm

      let imgWidth = usableWidth;
      let imgHeight = (canvas.height * usableWidth) / canvas.width;

      // If the rendered image height exceeds single page bounds, scale it down proportionally to fit EXACTLY 1 PAGE
      if (imgHeight > usableHeight) {
        const scaleFactor = usableHeight / imgHeight;
        imgHeight = usableHeight;
        imgWidth = usableWidth * scaleFactor;
      }

      const xOffset = margin + (usableWidth - imgWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, margin, imgWidth, imgHeight);

      // Step 4: Trigger the actual file download
      pdf.save(`CycloneGems-Valuation-Report-${result.gemstone.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback: open browser print dialog
      setShowReportModal(true);
      setTimeout(() => {
        window.print();
      }, 300);
    } finally {
      if (clipWrapper.parentNode) {
        document.body.removeChild(clipWrapper);
      }
    }
  };

  // Helper for gemological carat weight rarity scaling
  const getCaratMultiplier = (carat: number): number => {
    if (carat <= 0) return 1.0;
    if (carat < 0.5) return 0.70;
    if (carat < 1.0) return 0.70 + (carat - 0.5) * 0.60;
    if (carat < 2.0) return 1.00 + (carat - 1.0) * 0.35;
    if (carat < 3.0) return 1.35 + (carat - 2.0) * 0.35;
    if (carat < 5.0) return 1.70 + (carat - 3.0) * 0.40;
    return 2.50 + Math.min(1.50, (carat - 5.0) * 0.20);
  };

  // Computed interactive metrics
  const clarity = customClarity ?? (result?.qualityDetails.clarity || 80);
  const color = customColor ?? (result?.qualityDetails.colorSaturation || 80);
  const cut = customCut ?? (result?.qualityDetails.cutQuality || 80);

  const dynamicScore = Math.min(
    100,
    Math.max(0, Math.round(clarity * 0.4 + color * 0.35 + cut * 0.25))
  );
  const dynamicGrade = calculateGradeFromScore(dynamicScore);

  const currentCaratMultiplier = getCaratMultiplier(caratWeight);

  const basePerCaratSuggestedUsd = result
    ? (result.priceRange.perCaratUsd
      ? result.priceRange.perCaratUsd / (result.priceRange.caratMultiplier || 1.0)
      : (result.priceRange.suggestedUsd / ((result.priceRange.caratWeight || 1.0) * (result.priceRange.caratMultiplier || 1.0))))
    : 0;

  const dynamicPerCaratUsd = result
    ? Math.max(1, Math.round(basePerCaratSuggestedUsd * currentCaratMultiplier * (0.7 + (priceSliderValue / 100) * 0.6)))
    : 0;

  const currentPrice = Math.round(dynamicPerCaratUsd * caratWeight);
  const currentPriceLkr = Math.round(currentPrice * 325.0);
  const perCaratLkr = Math.round(dynamicPerCaratUsd * 325.0);

  const getExecutiveSummaryText = (): string => {
    if (!result) return '';
    if (summaryLang === 'si') {
      if (result.executiveSummarySinhala) {
        return result.executiveSummarySinhala;
      }
      const caratStr = `කැරට් ${caratWeight.toFixed(2)}`;
      const family = result.taxonomy?.family || 'Corundum / Mineral';
      const giaRating = result.qualityDetails?.colorMetrics?.giaRating || 'Fine Quality';
      const lab = result.qualityDetails?.colorMetrics?.lab;
      const labStr = lab ? `L*=${lab.L}, a*=${lab.a}, b*=${lab.b}` : 'සමබර RGB';
      const cutMetrics = result.qualityDetails?.cutMetrics;
      const symmetry = cutMetrics?.symmetryScore ?? 80;
      const facets = cutMetrics?.facetCount ?? 12;
      const confidencePct = result.calibration?.rawConfidencePct ?? (result.confidence * 100);
      const ecePct = result.calibration?.ecePct ?? 1.8;

      return `මෙම ${caratStr} ${result.gemstone} මැණික් සාම්පලය (${family} කුලය) Grade ${dynamicGrade} ශ්‍රේණිය යටතේ ඇගයීමට ලක්කර ඇත (සම්පූර්ණ බහු-සංඥා ලකුණු ප්‍රමාණය: ${dynamicScore}/100). පරිගණක දෘශ්‍ය වර්ණ පරාස විශ්ලේෂණය මගින් ${giaRating} වර්ණ පවිත්‍රතාවය (${labStr}) පෙන්වන අතර, හඳුනාගත් ධාරා රේඛා ${facets} ක් ඔස්සේ ${symmetry.toFixed(0)}% ක Canny edge කැපුම් සමමිතියකින් සමන්විත වේ. බහු-ආකෘතික ස්නායු පද්ධතිය මගින් ${confidencePct.toFixed(1)}% ක වර්ගීකරණ විශ්වාසනීයත්වයක් සහ ${ecePct.toFixed(1)}% ක ක්‍රමාංකිත අපේක්ෂිත ක්‍රමාංකන දෝෂයක් (ECE) ලබාගෙන ඇත. වත්මන් ශ්‍රී ලාංකික මැණික් වෙළඳපල ප්‍රමිතීන්ට අනුව සමස්ත වෙළඳපල වටිනාකම ඇමරිකානු ඩොලර් $${currentPrice.toLocaleString()} ($) ක් (රු. ${currentPriceLkr.toLocaleString()} / ඩොලර් $${dynamicPerCaratUsd.toLocaleString()} ct) ලෙස තක්සේරු කර ඇත.`;
    }
    return result.executiveSummary || '';
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-[-1.5px] text-foreground font-heading">
                  Gemstone{' '}
                  <span className="font-accent italic font-normal text-primary">AI Analyzer</span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
                  Multi-signal AI: Keras CNN + OpenAI CLIP Fusion, CIE LAB/HSV computer vision grading, 95% price confidence intervals, and hierarchical taxonomy.
                </p>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex items-center p-1 rounded-full bg-secondary/60 border border-border/50 self-start sm:self-auto shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'upload'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('camera');
                    setCameraModalOpen(true);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'camera'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Use Camera</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── Left Column: Upload / Camera Input (5 Cols) ── */}
            <div className="lg:col-span-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
                  if (!selected.length) return;

                  const targetIdx = activeSlotTargetRef.current;
                  if (targetIdx !== null && targetIdx !== undefined && targetIdx >= 0) {
                    handleFile(selected[0], targetIdx);
                  } else {
                    selected.slice(0, 3).forEach((file, i) => {
                      handleFile(file, i);
                    });
                  }
                  activeSlotTargetRef.current = null;
                  setActiveSlotTarget(null);
                  e.target.value = '';
                }}
              />

              <AnimatePresence mode="wait">
                {!primaryPreview ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div
                      className={`upload-zone flex flex-col items-center justify-center p-8 min-h-[420px] rounded-3xl ${dragOver ? 'drag-over' : ''
                        }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => handleDrop(e)}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary animate-pulse">
                        {activeTab === 'camera' ? (
                          <Camera className="w-10 h-10" />
                        ) : (
                          <Upload className="w-10 h-10" />
                        )}
                      </div>

                      <p className="text-lg font-bold text-foreground mb-1 font-heading text-center">
                        {activeTab === 'camera'
                          ? 'Scan Gemstone with Camera'
                          : 'Drop Gemstone Image(s) Here'}
                      </p>
                      <p className="text-xs text-muted-foreground mb-6 text-center max-w-xs">
                        Supports 1 to 3 angles/lighting conditions (JPEG, PNG, WebP up to 10MB).
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                        <button
                          type="button"
                          onClick={triggerGeneralFileInput}
                          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary/80 py-3 text-xs font-semibold text-foreground border border-border transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Browse File(s)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            activeSlotTargetRef.current = null;
                            setActiveSlotTarget(null);
                            setCameraModalOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
                        >
                          <Camera className="w-4 h-4" />
                          Open Camera
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative space-y-4"
                  >
                    {/* Primary Image Preview Container */}
                    <div className="liquid-glass-strong rounded-3xl overflow-hidden border border-border shadow-xl relative group">
                      <img
                        src={imageDisplayMode === 'saliency' && result?.saliencyHeatmap ? result.saliencyHeatmap : primaryPreview}
                        alt="Gemstone preview"
                        className="w-full aspect-square object-cover transition-all duration-300"
                      />

                      {/* Image Display Mode Toggle (Original vs Grad-CAM Heatmap) */}
                      {result?.saliencyHeatmap && (
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 shadow-lg">
                          <button
                            type="button"
                            onClick={() => setImageDisplayMode('original')}
                            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${imageDisplayMode === 'original'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-white/70 hover:text-white'
                              }`}
                          >
                            Original Scan
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageDisplayMode('saliency')}
                            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${imageDisplayMode === 'saliency'
                                ? 'bg-accent text-accent-foreground shadow-sm'
                                : 'text-white/70 hover:text-white'
                              }`}
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            Grad-CAM Saliency
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={resetAnalysis}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
                        title="Remove All Images"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* ── Multi-Angle Upload Slots (3 Slots Bar) ── */}
                    <div className="p-4 rounded-3xl bg-secondary/30 border border-border/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground font-heading flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-primary" />
                          Multi-Angle Fusion Slots ({validFilesCount}/3 Views)
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {validFilesCount > 1 ? 'Spatial Ensemble Active' : 'Add 2nd view to enable ensemble'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {SLOT_LABELS.map((label, idx) => {
                          const preview = anglePreviews[idx];
                          return (
                            <div
                              key={label.name}
                              className={`relative rounded-2xl border transition-all p-1.5 text-center flex flex-col items-center justify-center aspect-square ${preview
                                  ? 'border-primary/50 bg-primary/5'
                                  : 'border-dashed border-border/60 hover:border-primary/40 bg-secondary/20'
                                }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                              }}
                              onDrop={(e) => handleDrop(e, idx)}
                            >
                              {preview ? (
                                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                                  <img src={preview} alt={label.name} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => removeSlot(idx)}
                                      className="p-1 rounded-full bg-red-500 text-white shadow-md hover:scale-110 transition-transform"
                                      title="Remove angle"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white bg-black/60 px-1 py-0.5 rounded truncate">
                                    Angle {idx + 1}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => triggerSlotFileInput(idx)}
                                  className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-1"
                                >
                                  <Upload className="w-4 h-4 text-primary/70" />
                                  <span className="text-[10px] font-bold leading-tight line-clamp-1">
                                    + Angle {idx + 1}
                                  </span>
                                  <span className="text-[8px] text-muted-foreground line-clamp-1">
                                    {idx === 0 ? 'Studio Front' : idx === 1 ? 'Side Angle' : 'Macro / Light'}
                                  </span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {!result && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleAnalyze}
                          disabled={analyzing}
                          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
                        >
                          {analyzing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Running Multimodal Vision Pipeline...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Run AI Analysis
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={resetAnalysis}
                          className="rounded-full px-6 py-4 text-sm font-semibold text-muted-foreground border border-border hover:bg-secondary transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Validation Warning Alert Card */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-start gap-3 shadow-md"
                >
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold font-heading">Scan Rejected</p>
                    <p className="text-xs leading-relaxed mt-1 text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Right Column: Interactive Results (7 Cols) ── */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {analyzing && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="shimmer rounded-3xl h-40" />
                    <div className="shimmer rounded-3xl h-48" />
                    <div className="shimmer rounded-3xl h-44" />
                    <p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
                      Processing gemstone feature vectors with neural model & computer vision segmentation...
                    </p>
                  </motion.div>
                )}

                {!analyzing && !result && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="liquid-glass-strong rounded-3xl p-10 flex flex-col items-center justify-center min-h-[420px] text-center border border-border/50"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-6">
                      <Gem className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-heading">
                      Awaiting Gemstone Input
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground max-w-sm leading-relaxed">
                      Upload a photo or open your camera to evaluate gemstone identity, CIE LAB color space metrics, Canny edge cut symmetry, and 95% price confidence intervals.
                    </p>
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* ── View Mode Switch Header ── */}
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-secondary/40 border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2 pl-2">
                        <Info className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {showTechnicalDetails ? 'Expert Technical Mode' : 'Standard Gemology View'}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {showTechnicalDetails ? 'Displaying raw CV metrics, ECE calibration & fusion weights' : 'Simplified view for easy understanding'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${showTechnicalDetails
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/60'
                          }`}
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        {showTechnicalDetails ? 'Hide Technical Details' : 'Show Technical Details'}
                      </button>
                    </div>

                    {/* ── Identification Card ── */}
                    <div className="liquid-glass-strong rounded-3xl p-6 border border-border/60 shadow-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                          <Gem className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              Identified Gemstone Variety
                            </p>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald bg-emerald/10 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Valid Gemstone
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground font-heading mt-1">
                            {result.gemstone}
                          </h3>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.confidence * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                              />
                            </div>
                            <span className="text-xs font-bold text-primary">
                              {(result.confidence * 100).toFixed(1)}% Confidence
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ── Hierarchical Taxonomy Breadcrumbs ── */}
                      {result.taxonomy && (
                        <div className="mt-5 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                            <Layers className="w-4 h-4 text-primary" /> Hierarchical Taxonomy:
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-3 py-1 rounded-full bg-secondary/80 text-foreground font-medium border border-border/50">
                              <strong className="text-primary">Family:</strong> {result.taxonomy.family} ({(result.taxonomy.familyConfidence * 100).toFixed(0)}%)
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="px-3 py-1 rounded-full bg-secondary/80 text-foreground font-medium border border-border/50">
                              <strong className="text-primary">Species:</strong> {result.taxonomy.species} ({(result.taxonomy.speciesConfidence * 100).toFixed(0)}%)
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                              {result.taxonomy.variety}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-muted-foreground mt-2">
                            Formula: {result.taxonomy.formula}
                          </p>
                        </div>
                      )}

                      {/* Top predictions */}
                      {result.topPredictions && result.topPredictions.length > 1 && (
                        <div className="mt-4 pt-3 border-t border-border/40">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Top Model Possibilities:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {result.topPredictions.slice(1, 5).map((pred) => (
                              <div key={pred.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-secondary/40 border border-border/30">
                                <span className="text-foreground/90 font-medium truncate">{pred.name}</span>
                                <span className="text-muted-foreground font-mono">
                                  {(pred.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Multi-Angle Spatial Ensemble Breakdown Card ── */}
                    {result.multimodalFusion?.angleBreakdown && result.multimodalFusion.angleBreakdown.length > 0 && (
                      <div className="liquid-glass-strong rounded-3xl p-6 border border-primary/30 shadow-xl space-y-4 bg-primary/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                              <Layers className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                                Multi-Angle Spatial Ensemble
                              </p>
                              <h4 className="text-sm font-bold text-foreground font-heading">
                                {result.multimodalFusion.totalViewsAnalyzed || result.multimodalFusion.angleBreakdown.length} Specimen Angles Fused
                              </h4>
                            </div>
                          </div>
                          {result.multimodalFusion.multiViewAgreementPct && (
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground uppercase font-bold">Angle Agreement</span>
                              <p className="text-sm font-bold text-emerald font-mono">
                                {result.multimodalFusion.multiViewAgreementPct}%
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          {result.multimodalFusion.angleBreakdown.map((angle, idx) => (
                            <div key={angle.angleIndex} className="p-3 rounded-2xl bg-secondary/40 border border-border/40 text-xs flex items-center gap-3">
                              {anglePreviews[idx] && (
                                <img src={anglePreviews[idx]!} alt={`Angle ${angle.angleIndex}`} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-primary/30" />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Angle {angle.angleIndex}</span>
                                <p className="font-bold text-foreground truncate mt-0.5">{angle.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{(angle.confidence * 100).toFixed(1)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0" />
                          Probability vectors averaged across views to eliminate lighting and reflection variance.
                        </p>
                      </div>
                    )}

                    {/* ── Multimodal Fusion Ablation Card ── */}
                    {showTechnicalDetails && result.multimodalFusion && (
                      <div className="liquid-glass-strong rounded-3xl p-6 border border-border/60 shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <GitMerge className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              Multimodal Fusion & Ablation
                            </p>
                            <h4 className="text-sm font-bold text-foreground font-heading">
                              {result.multimodalFusion.fusionMode}
                            </h4>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                          <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/30">
                            <p className="text-[10px] text-muted-foreground uppercase">Keras CNN</p>
                            <p className="font-semibold text-foreground truncate">{result.multimodalFusion.cnnTop?.name || 'N/A'}</p>
                            <p className="text-[11px] text-primary font-mono font-bold">{((result.multimodalFusion.cnnTop?.confidence ?? 0) * 100).toFixed(1)}%</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/30">
                            <p className="text-[10px] text-muted-foreground uppercase">OpenAI CLIP</p>
                            <p className="font-semibold text-foreground truncate">{result.multimodalFusion.clipTop?.name || 'N/A'}</p>
                            <p className="text-[11px] text-accent font-mono font-bold">{((result.multimodalFusion.clipTop?.confidence ?? 0) * 100).toFixed(1)}%</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                            <p className="text-[10px] text-primary uppercase font-bold">Fused Output</p>
                            <p className="font-bold text-foreground truncate">{result.multimodalFusion.fusedTop?.name || 'N/A'}</p>
                            <p className="text-[11px] text-emerald font-mono font-bold">{((result.multimodalFusion.fusedTop?.confidence ?? 0) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-gold shrink-0" />
                          {result.multimodalFusion.accuracyGainEstimate} (weight α = {result.multimodalFusion.alphaWeightCnn})
                        </p>
                      </div>
                    )}

                    {/* ── Confidence Calibration & Conformal Reliability Card ── */}
                    {showTechnicalDetails && result.calibration && (
                      <div className="liquid-glass-strong rounded-3xl p-6 border border-border/60 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                              <BarChart2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                Model Trust & Confidence Calibration
                              </p>
                              <h4 className="text-sm font-bold text-foreground font-heading">
                                Expected Calibration Error (ECE): {result.calibration.ecePct}%
                              </h4>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-emerald bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20">
                            {result.calibration.reliabilityStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-3 rounded-2xl bg-secondary/30 border border-border/30">
                            <p className="text-[10px] text-muted-foreground uppercase">Raw Model Output</p>
                            <p className="font-bold text-foreground text-sm mt-0.5">{result.calibration.rawConfidencePct}%</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-secondary/30 border border-border/30">
                            <p className="text-[10px] text-muted-foreground uppercase">Temperature (T=1.12)</p>
                            <p className="font-bold text-primary text-sm mt-0.5">{result.calibration.calibratedConfidencePct}%</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-secondary/30 border border-border/30">
                            <p className="text-[10px] text-muted-foreground uppercase">Brier Score</p>
                            <p className="font-bold text-foreground text-sm font-mono mt-0.5">{result.calibration.brierScore}</p>
                          </div>
                        </div>

                        {/* Reliability Bins Bar Diagram */}
                        {result.calibration.bins && (
                          <div className="space-y-1.5 pt-2">
                            <p className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                              <span>Confidence Bin Reliability Diagram:</span>
                              <span className="font-mono text-[10px]">Bin Acc vs Model Conf</span>
                            </p>
                            <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center">
                              {result.calibration.bins.map((b) => (
                                <div key={b.bin} className="p-1.5 rounded-xl bg-secondary/40 border border-border/30">
                                  <p className="text-muted-foreground font-mono">{b.bin}</p>
                                  <p className="font-bold text-foreground mt-0.5">{b.avgAcc}%</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Auto-Generated Natural-Language Executive Summary Card ── */}
                    {result.executiveSummary && (
                      <div className="liquid-glass-strong rounded-3xl p-6 border border-border/60 shadow-xl space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                AI Gemological Executive Summary
                              </p>
                              <h4 className="text-sm font-bold text-foreground font-heading">
                                Diagnostic Narrative Report
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Language Switcher Pills */}
                            <div className="flex items-center p-1 rounded-full bg-secondary/80 border border-border/50 text-xs">
                              <button
                                type="button"
                                onClick={() => setSummaryLang('en')}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                  summaryLang === 'en'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                English
                              </button>
                              <button
                                type="button"
                                onClick={() => setSummaryLang('si')}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                  summaryLang === 'si'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                සිංහල
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(getExecutiveSummaryText());
                                setCopiedSummary(true);
                                setTimeout(() => setCopiedSummary(false), 2000);
                              }}
                              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy Summary"
                            >
                              {copiedSummary ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-foreground/90 leading-relaxed p-4 rounded-2xl bg-secondary/40 border border-border/40 font-sans italic">
                          "{getExecutiveSummaryText()}"
                        </p>
                      </div>
                    )}

                    {/* ── Quality Grade Card with Real CV Metrics & Sliders ── */}
                    <div className="liquid-glass-strong rounded-3xl p-6 border border-border/60 shadow-xl">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center shrink-0 text-emerald">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              Quality Grade & Multi-Signal Score
                            </p>
                            <h4 className="text-lg font-bold text-foreground font-heading">
                              Score: {dynamicScore}/100
                            </h4>
                          </div>
                        </div>
                        <span className={`grade-badge ${gradeColors[dynamicGrade] || 'grade-b'}`}>
                          {dynamicGrade}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4">
                        {gradeDescriptions[dynamicGrade] || 'Quality assessed'}
                      </p>

                      {/* Computer Vision Signal Cards (Expert Technical Details) */}
                      {showTechnicalDetails && result.qualityDetails.colorMetrics && result.qualityDetails.cutMetrics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 p-4 rounded-2xl bg-secondary/30 border border-border/40 text-xs">
                          {/* Color Space Card */}
                          <div className="space-y-1">
                            <p className="font-bold text-foreground flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-primary" /> CIE LAB & HSV Color Space:
                            </p>
                            <p className="text-muted-foreground font-mono">
                              LAB: L*={result.qualityDetails.colorMetrics.lab.L}, a*={result.qualityDetails.colorMetrics.lab.a}, b*={result.qualityDetails.colorMetrics.lab.b}
                            </p>
                            <p className="text-muted-foreground font-mono">
                              HSV: {result.qualityDetails.colorMetrics.hsv.hueDeg}° Hue, {result.qualityDetails.colorMetrics.hsv.saturationPct}% Sat
                            </p>
                            <p className="text-primary font-semibold">
                              GIA Rating: {result.qualityDetails.colorMetrics.giaRating}
                            </p>
                          </div>

                          {/* Cut & Symmetry Card */}
                          <div className="space-y-1">
                            <p className="font-bold text-foreground flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-accent" /> Canny/Hough Facet Symmetry:
                            </p>
                            <p className="text-muted-foreground">
                              Detected Facet Edges: <strong className="text-foreground">{result.qualityDetails.cutMetrics.facetCount} lines</strong>
                            </p>
                            <p className="text-muted-foreground">
                              Radial Symmetry Index: <strong className="text-foreground">{result.qualityDetails.cutMetrics.symmetryScore}%</strong>
                            </p>
                            <p className="text-accent font-semibold">
                              Aspect Ratio: {result.qualityDetails.cutMetrics.aspectRatio} (Proportion score: {result.qualityDetails.cutMetrics.cutQualityScore}%)
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Interactive Metrics Sliders */}
                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-primary" /> Fine-Tune Quality Sliders
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomClarity(result.qualityDetails.clarity);
                              setCustomColor(result.qualityDetails.colorSaturation);
                              setCustomCut(result.qualityDetails.cutQuality);
                            }}
                            className="text-[11px] text-primary hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> Reset Values
                          </button>
                        </div>

                        {/* Clarity Slider */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Clarity (Entropy):</span>
                            <span className="font-semibold text-foreground">{clarity}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={clarity}
                            onChange={(e) => setCustomClarity(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary"
                          />
                        </div>

                        {/* Color Saturation Slider */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Color Purity (CIE LAB/HSV):</span>
                            <span className="font-semibold text-foreground">{color}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={color}
                            onChange={(e) => setCustomColor(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary"
                          />
                        </div>

                        {/* Cut Quality Slider */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Cut & Symmetry (Canny Edge):</span>
                            <span className="font-semibold text-foreground">{cut}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cut}
                            onChange={(e) => setCustomCut(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary"
                          />
                        </div>

                        {/* Carat Weight (Expert Adjustment) */}
                        <div className="pt-3 border-t border-border/40 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground flex items-center gap-1.5">
                              <Gem className="w-3.5 h-3.5 text-gold" /> Carat Weight (Expert Adjustment):
                            </span>
                            <span className="font-mono font-bold text-gold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/20">
                              {currentCaratMultiplier.toFixed(2)}x Rarity Factor
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0.1"
                              max="20"
                              step="0.1"
                              value={caratWeight}
                              onChange={(e) => setCaratWeight(Math.max(0.1, Number(e.target.value)))}
                              className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-secondary"
                            />
                            <div className="flex items-center gap-1 bg-secondary/80 px-2.5 py-1 rounded-xl border border-border/60 shrink-0">
                              <input
                                type="number"
                                step="0.05"
                                min="0.1"
                                max="100"
                                value={caratWeight}
                                onChange={(e) => setCaratWeight(Math.max(0.1, Number(e.target.value)))}
                                className="w-14 bg-transparent text-xs font-bold font-mono text-foreground focus:outline-none text-right"
                              />
                              <span className="text-[11px] font-semibold text-muted-foreground">ct</span>
                            </div>
                          </div>

                          {/* Quick Carat Presets */}
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                            <span className="text-[10px] text-muted-foreground font-semibold mr-1 shrink-0">Presets:</span>
                            {[0.5, 1.0, 2.0, 3.0, 5.0, 10.0].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setCaratWeight(preset)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all border shrink-0 ${caratWeight === preset
                                    ? 'bg-gold text-black font-bold border-gold shadow-sm'
                                    : 'bg-secondary/50 text-muted-foreground border-border/40 hover:text-foreground hover:bg-secondary'
                                  }`}
                              >
                                {preset} ct
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Price Prediction Card with 95% Confidence Interval ── */}
                    <div className="liquid-glass-strong rounded-3xl p-6 border border-border/60 shadow-xl">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 text-gold">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                            Estimated Market Valuation ({caratWeight} ct)
                          </p>
                          <p className="text-3xl font-bold text-foreground font-heading">
                            ${currentPrice.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">USD Total</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="font-semibold text-muted-foreground">
                              ≈ LKR {currentPriceLkr.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-mono text-primary font-bold">
                              ${dynamicPerCaratUsd.toLocaleString()} / ct
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                          <span>Min: ${result.priceRange.minUsd.toLocaleString()}</span>
                          <span className="text-primary font-bold">
                            Suggested: ${result.priceRange.suggestedUsd.toLocaleString()}
                          </span>
                          <span>Max: ${result.priceRange.maxUsd.toLocaleString()}</span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={priceSliderValue}
                          onChange={(e) => setPriceSliderValue(Number(e.target.value))}
                          className="w-full h-2.5 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(90deg, hsl(var(--primary)) ${priceSliderValue}%, hsl(var(--border)) ${priceSliderValue}%)`,
                          }}
                        />

                        {/* 95% Confidence Interval Display (Expert Technical Details) */}
                        {showTechnicalDetails && result.priceRange.uncertainty && (
                          <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/40 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald" /> Calibrated 95% Price Confidence Interval:
                              </span>
                              <span className="font-mono text-emerald font-bold">
                                ±{result.priceRange.uncertainty.relativeUncertaintyPct}% Relative
                              </span>
                            </div>
                            <div className="flex justify-between font-mono text-muted-foreground">
                              <span>
                                95% CI Range: <strong className="text-foreground">${result.priceRange.uncertainty.confidenceInterval95Usd[0].toLocaleString()} – ${result.priceRange.uncertainty.confidenceInterval95Usd[1].toLocaleString()} USD</strong>
                              </span>
                              <span>Std Error: ±${result.priceRange.uncertainty.stdErrorUsd}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2 p-3.5 rounded-xl bg-primary/5 border border-primary/10">
                          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Market trend status: <span className="text-primary font-semibold">{result.priceRange.marketTrend}</span>. Prices are calibrated against Sri Lankan gemstone indices with statistical multi-factor variance.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadPdfReport}
                        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                      >
                        <Download className="w-4 h-4" />
                        Download Full PDF Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReportModal(true)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/60 py-3.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                      >
                        <FileText className="w-4 h-4 text-primary" />
                        View Certificate Report
                      </button>
                      <button
                        type="button"
                        onClick={resetAnalysis}
                        className="rounded-full px-5 py-3.5 text-xs font-semibold text-muted-foreground border border-border/60 hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Scan Another
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Camera Scan Modal */}
      <CameraScanModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Valuation Report Certificate Modal */}
      {showReportModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            id="certificate-modal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl liquid-glass-strong rounded-3xl p-6 sm:p-8 border border-border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto bg-card"
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Gem className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-foreground font-heading">
                    Valuation Certificate Report
                  </h3>
                  <p className="text-[10px] text-muted-foreground">CycloneGems AI • Official Diagnostic Valuation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
                id="close-cert-btn-top"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-foreground">
              {/* Attached Gemstone Specimen Photo for PDF Export */}
              {primaryPreview && (
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-secondary/40 border border-border/50">
                  <img
                    src={imageDisplayMode === 'saliency' && result.saliencyHeatmap ? result.saliencyHeatmap : primaryPreview}
                    alt="Analyzed Gemstone Specimen"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-primary/30 shadow-md shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Specimen Photo Attached
                    </span>
                    <h4 className="text-lg font-bold text-foreground truncate font-heading mt-0.5">
                      {result.gemstone}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Scan Mode: <strong className="text-foreground font-medium">{imageDisplayMode === 'saliency' ? 'Grad-CAM Saliency Heatmap' : 'Original Photo Scan'}</strong>
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald bg-emerald/10 px-2 py-0.5 rounded-full mt-2 border border-emerald/20">
                      <CheckCircle2 className="w-3 h-3" /> Image Embedded in PDF Report
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/40 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Gemstone Variety</p>
                  <p className="font-bold text-base text-primary mt-0.5">{result.gemstone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality Grade</p>
                  <p className="font-bold text-base text-emerald mt-0.5">{dynamicGrade} ({dynamicScore}/100)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Taxonomy Family</p>
                  <p className="font-semibold text-foreground mt-0.5">{result.taxonomy?.family || 'Corundum / Mineral'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carat Weight & Rarity</p>
                  <p className="font-bold text-base text-gold mt-0.5">
                    {caratWeight} ct <span className="text-xs font-mono text-muted-foreground font-normal">({currentCaratMultiplier.toFixed(2)}x factor)</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Per Carat Valuation</p>
                  <p className="font-bold text-base text-primary mt-0.5">
                    ${dynamicPerCaratUsd.toLocaleString()} USD / ct
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Valuation (USD)</p>
                  <p className="font-bold text-base text-foreground mt-0.5">
                    ${currentPrice.toLocaleString()} USD
                  </p>
                </div>
              </div>

              {result.qualityDetails.colorMetrics && (
                <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/30 text-xs space-y-1">
                  <p className="font-bold text-foreground">Computer Vision Color Analysis (CIE LAB):</p>
                  <p className="text-muted-foreground font-mono">
                    L*: {result.qualityDetails.colorMetrics.lab.L} | a*: {result.qualityDetails.colorMetrics.lab.a} | b*: {result.qualityDetails.colorMetrics.lab.b} | Chroma: {result.qualityDetails.colorMetrics.lab.chroma}
                  </p>
                  <p className="text-primary font-semibold">GIA Grade: {result.qualityDetails.colorMetrics.giaRating}</p>
                </div>
              )}

              {/* Natural Language Executive Summary in Certificate */}
              {getExecutiveSummaryText() && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1">
                  <p className="font-bold text-primary uppercase tracking-wider text-[10px]">
                    AI Diagnostic Executive Summary Narrative ({summaryLang === 'si' ? 'සිංහල' : 'English'}):
                  </p>
                  <p className="text-foreground/90 italic leading-relaxed">"{getExecutiveSummaryText()}"</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quality Breakdown</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-muted-foreground">Clarity</p>
                    <p className="font-semibold">{clarity}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-muted-foreground">Color Purity</p>
                    <p className="font-semibold">{color}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-muted-foreground">Cut & Symmetry</p>
                    <p className="font-semibold">{cut}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="certificate-buttons" className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={handleDownloadPdfReport}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-semibold text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
              >
                <Download className="w-4 h-4" />
                Download PDF File
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border py-3.5 text-xs font-semibold text-foreground transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald" />
                Print / Save PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
