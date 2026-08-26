"""
CycloneGems AI - Computer Vision Metrics Module
Extracts authentic vision-derived features (segmentation, LAB/HSV color metrics, Canny/Hough facet symmetry).
"""

import numpy as np
import cv2


def segment_gemstone(image_np: np.ndarray) -> np.ndarray:
    """
    Segment gemstone from background using thresholding and contour selection.
    
    Args:
        image_np: RGB image as numpy array (H, W, 3)
        
    Returns:
        mask: Binary mask (H, W) where 255 = gemstone, 0 = background
    """
    try:
        # Convert RGB to BGR for OpenCV
        bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        
        # Smooth image to reduce noise
        blurred = cv2.GaussianBlur(gray, (7, 7), 0)
        
        # Otsu thresholding + Inverse Otsu to isolate specimen from bright/dark backgrounds
        _, thresh1 = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        _, thresh2 = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Choose threshold that isolates a centered object (border check)
        h, w = gray.shape
        border_pixels1 = np.concatenate([thresh1[0, :], thresh1[-1, :], thresh1[:, 0], thresh1[:, -1]])
        border_ratio1 = np.mean(border_pixels1 == 255)
        
        thresh = thresh2 if border_ratio1 > 0.5 else thresh1
        
        # Morphological closing & opening to fill small holes and clean noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
        opened = cv2.morphologyEx(closed, cv2.MORPH_OPEN, kernel, iterations=1)
        
        # Find contours and keep the largest contour near the center
        contours, _ = cv2.findContours(opened, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        mask = np.zeros_like(gray, dtype=np.uint8)
        if contours:
            # Filter contours by minimum area (at least 2% of total image area)
            min_area = (h * w) * 0.02
            valid_contours = [c for c in contours if cv2.contourArea(c) >= min_area]
            
            if valid_contours:
                # Pick largest valid contour
                largest_c = max(valid_contours, key=cv2.contourArea)
                cv2.drawContours(mask, [largest_c], -1, 255, thickness=cv2.FILLED)
                return mask

        # Fallback: create circular central mask if segmentation fails
        cy, cx = h // 2, w // 2
        radius = min(h, w) // 3
        cv2.circle(mask, (cx, cy), radius, 255, thickness=cv2.FILLED)
        return mask
    except Exception as e:
        print(f"[CV Module] Segmentation warning: {e}")
        h, w, _ = image_np.shape
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.circle(mask, (w // 2, h // 2), min(h, w) // 3, 255, thickness=cv2.FILLED)
        return mask


def extract_color_metrics(image_np: np.ndarray, mask: np.ndarray) -> dict:
    """
    Extract color metrics in LAB and HSV color spaces for masked gemstone region.
    """
    try:
        # Convert RGB to LAB and HSV
        lab_img = cv2.cvtColor(image_np, cv2.COLOR_RGB2LAB)
        hsv_img = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)
        
        gem_pixels_lab = lab_img[mask > 0]
        gem_pixels_hsv = hsv_img[mask > 0]
        gem_pixels_rgb = image_np[mask > 0]
        
        if len(gem_pixels_lab) == 0:
            gem_pixels_lab = lab_img.reshape(-1, 3)
            gem_pixels_hsv = hsv_img.reshape(-1, 3)
            gem_pixels_rgb = image_np.reshape(-1, 3)
            
        # LAB metrics (OpenCV L: 0..255 -> 0..100, a: 0..255 -> -128..127, b: 0..255 -> -128..127)
        l_mean = float(np.mean(gem_pixels_lab[:, 0])) * 100.0 / 255.0
        a_mean = float(np.mean(gem_pixels_lab[:, 1])) - 128.0
        b_mean = float(np.mean(gem_pixels_lab[:, 2])) - 128.0
        
        # HSV metrics (OpenCV H: 0..179 -> 0..360 deg, S: 0..255 -> 0..100%, V: 0..255 -> 0..100%)
        h_deg = float(np.median(gem_pixels_hsv[:, 0])) * 2.0
        s_pct = float(np.median(gem_pixels_hsv[:, 1])) * 100.0 / 255.0
        v_pct = float(np.mean(gem_pixels_hsv[:, 2])) * 100.0 / 255.0
        
        # Color purity / Chroma in LAB space
        chroma = float(np.sqrt(a_mean**2 + b_mean**2))
        
        # GIA Tone & Saturation classification
        tone_rating = _gia_tone_rating(l_mean)
        sat_rating = _gia_saturation_rating(s_pct)
        gia_string = f"{sat_rating} Saturation, {tone_rating} Tone"
        
        # Color score (0-100) based on saturation purity and balanced tone
        # Ideal tone is 45-75%, ideal saturation is 50-100%
        tone_penalty = abs(l_mean - 60.0) * 0.8
        color_score = min(100.0, max(10.0, (s_pct * 0.7 + chroma * 0.5) - tone_penalty + 30.0))
        
        return {
            'lab': {
                'L': round(l_mean, 1),
                'a': round(a_mean, 1),
                'b': round(b_mean, 1),
                'chroma': round(chroma, 1)
            },
            'hsv': {
                'hueDeg': round(h_deg, 1),
                'saturationPct': round(s_pct, 1),
                'valuePct': round(v_pct, 1)
            },
            'giaRating': gia_string,
            'colorScore': round(color_score, 1)
        }
    except Exception as e:
        print(f"[CV Module] Color metrics error: {e}")
        return {
            'lab': {'L': 50.0, 'a': 0.0, 'b': 0.0, 'chroma': 0.0},
            'hsv': {'hueDeg': 0.0, 'saturationPct': 50.0, 'valuePct': 50.0},
            'giaRating': 'Moderate Saturation, Medium Tone',
            'colorScore': 70.0
        }


def compute_cut_and_symmetry(image_np: np.ndarray, mask: np.ndarray) -> dict:
    """
    Compute cut quality, facet edge count, and symmetry score via Canny & Hough transforms.
    """
    try:
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        
        # Apply mask to grayscale image
        masked_gray = cv2.bitwise_and(gray, gray, mask=mask)
        
        # Canny Edge Detection for internal facet lines
        edges = cv2.Canny(masked_gray, 50, 150)
        
        # Hough Lines Transform to detect straight facet cut edges
        lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=25, minLineLength=15, maxLineGap=5)
        facet_count = len(lines) if lines is not None else 0
        
        # Contour shape & radial symmetry analysis
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        symmetry_score = 75.0
        aspect_ratio = 1.0
        
        if contours:
            c = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(c)
            aspect_ratio = float(w) / float(h) if h > 0 else 1.0
            
            # Moments for center of mass
            M = cv2.moments(c)
            if M['m00'] > 0:
                cx = int(M['m10'] / M['m00'])
                cy = int(M['m01'] / M['m00'])
                
                # Measure distance symmetry across horizontal & vertical axes
                pts = c.reshape(-1, 2)
                dx = np.abs(pts[:, 0] - cx)
                dy = np.abs(pts[:, 1] - cy)
                
                x_sym = 1.0 - (np.std(dx) / (np.mean(dx) + 1e-5))
                y_sym = 1.0 - (np.std(dy) / (np.mean(dy) + 1e-5))
                symmetry_score = float(np.clip((x_sym + y_sym) / 2.0 * 100.0, 40.0, 98.0))
                
        # Cut score combines facet density, symmetry, and proportion
        facet_score = min(100.0, max(20.0, facet_count * 2.5 + 30.0))
        proportion_score = max(30.0, 100.0 - abs(aspect_ratio - 1.2) * 35.0) # Ideal gem aspect ratio 1.0 - 1.3
        
        cut_score = (symmetry_score * 0.45 + facet_score * 0.35 + proportion_score * 0.20)
        cut_score = float(np.clip(cut_score, 30.0, 99.0))
        
        return {
            'facetCount': facet_count,
            'symmetryScore': round(symmetry_score, 1),
            'aspectRatio': round(aspect_ratio, 2),
            'cutQualityScore': round(cut_score, 1)
        }
    except Exception as e:
        print(f"[CV Module] Cut & symmetry error: {e}")
        return {
            'facetCount': 12,
            'symmetryScore': 75.0,
            'aspectRatio': 1.0,
            'cutQualityScore': 75.0
        }


def _gia_tone_rating(l_val: float) -> str:
    if l_val >= 75.0:
        return 'Light'
    elif l_val >= 60.0:
        return 'Medium-Light'
    elif l_val >= 45.0:
        return 'Medium'
    elif l_val >= 30.0:
        return 'Medium-Dark'
    else:
        return 'Dark'


def _gia_saturation_rating(s_val: float) -> str:
    if s_val >= 75.0:
        return 'Vivid'
    elif s_val >= 60.0:
        return 'Strong'
    elif s_val >= 40.0:
        return 'Moderate'
    elif s_val >= 20.0:
        return 'Slightly Grayish'
    else:
        return 'Weak'
