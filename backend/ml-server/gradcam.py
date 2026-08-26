"""
CycloneGems AI - Grad-CAM & Feature Saliency Overlay Generator
Generates visual heatmaps showing neural network & computer vision attention zones.
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image

def generate_gradcam_overlay(pil_img, model=None, class_idx=None) -> str:
    """
    Generate Grad-CAM / Feature Saliency heatmap overlay on the gemstone image.
    Returns base64 JPEG data URL: data:image/jpeg;base64,...
    """
    try:
        # Standardize size
        img = pil_img.convert('RGB')
        img_np = np.array(img)
        h, w, _ = img_np.shape

        heatmap = None

        # ── 1. Try Keras Grad-CAM if model has conv layers ──
        if model is not None and hasattr(model, 'layers'):
            try:
                import tensorflow as tf
                # Find last conv layer
                conv_layer = None
                for layer in reversed(model.layers):
                    if 'conv' in layer.name.lower() or 'drop' in layer.name.lower() or isinstance(layer, tf.keras.layers.Conv2D):
                        conv_layer = layer
                        break

                if conv_layer is not None and class_idx is not None:
                    grad_model = tf.keras.models.Model(
                        inputs=[model.inputs],
                        outputs=[conv_layer.output, model.output]
                    )

                    inp = cv2.resize(img_np, (224, 224)).astype(np.float32)
                    inp = np.expand_dims(inp, axis=0)

                    with tf.GradientTape() as tape:
                        conv_outputs, predictions = grad_model(inp)
                        loss = predictions[:, class_idx]

                    grads = tape.gradient(loss, conv_outputs)
                    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

                    conv_outputs = conv_outputs[0]
                    heatmap_tensor = conv_outputs @ pooled_grads[..., tf.newaxis]
                    heatmap_tensor = tf.squeeze(heatmap_tensor)
                    heatmap_tensor = tf.maximum(heatmap_tensor, 0) / (tf.math.reduce_max(heatmap_tensor) + 1e-10)
                    heatmap = heatmap_tensor.numpy()
            except Exception as grad_err:
                print(f"[Grad-CAM] Keras gradient computation fallback: {grad_err}")
                heatmap = None

        # ── 2. Robust Multi-Feature Computer Vision Saliency Fallback ──
        if heatmap is None or heatmap.max() == 0:
            # LAB Color Saturation Map
            lab = cv2.cvtColor(img_np, cv2.COLOR_RGB2LAB)
            l_chan, a_chan, b_chan = cv2.split(lab)
            chroma = np.sqrt(a_chan.astype(np.float32)**2 + b_chan.astype(np.float32)**2)

            # Canny Facet Edge Intensity
            gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
            edges = cv2.Canny(gray, 50, 150).astype(np.float32)

            # Combine Chroma + Edges with Center Gaussian Weighting
            y, x = np.ogrid[:h, :w]
            cy, cx = h / 2.0, w / 2.0
            gaussian = np.exp(-((x - cx)**2 + (y - cy)**2) / (2 * (min(h, w) / 3.0)**2))

            sal = (chroma * 0.6 + edges * 0.4) * gaussian
            heatmap = (sal - sal.min()) / (sal.max() - sal.min() + 1e-10)

        # ── 3. Apply Jet Colormap and Blend ──
        heatmap_resized = cv2.resize(heatmap, (w, h))
        heatmap_uint8 = np.uint8(255 * heatmap_resized)
        color_heatmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
        color_heatmap = cv2.cvtColor(color_heatmap, cv2.COLOR_BGR2RGB)

        # Alpha blend (60% original image + 40% heatmap)
        blended = cv2.addWeighted(img_np, 0.6, color_heatmap, 0.4, 0)

        # Convert to Base64 JPEG URL
        result_pil = Image.fromarray(blended)
        buffer = io.BytesIO()
        result_pil.save(buffer, format='JPEG', quality=88)
        encoded = base64.b64encode(buffer.getvalue()).decode('utf-8')

        return f"data:image/jpeg;base64,{encoded}"

    except Exception as e:
        print(f"[Grad-CAM Error] {e}")
        return ""
