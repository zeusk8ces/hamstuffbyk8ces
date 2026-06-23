/**
 * Saliency Detection for Smart Image Centering
 * Uses TensorFlow.js with the COCO-SSD model to detect objects
 * and center images on the detected subject
 */

(function() {
  // Select all images across the site
  const imageSelectors = [
    '.photo-slot img',           // Photo strip
    '.photo-tile img',           // Photo gallery
    '.report-body img',          // Field report content images
    '.page-body img',            // Page content images
    '.photo-tiles img',          // Gallery tiles
    '.design-gallery img',       // 3D design gallery
    '.main-col img',             // Any images in main content column
    'figure img'                 // Images in figures (catches design galleries)
  ];
  
  let images = [];
  imageSelectors.forEach(selector => {
    images = images.concat(Array.from(document.querySelectorAll(selector)));
  });
  
  // Remove duplicates (in case an image matches multiple selectors)
  images = [...new Set(images)];
  
  if (images.length === 0) return;

  // Load TensorFlow and COCO-SSD model
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.0.0';
  document.head.appendChild(script);

  script.onload = () => {
    const cocoScript = document.createElement('script');
    cocoScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3';
    document.head.appendChild(cocoScript);

    cocoScript.onload = () => {
      // Load the model
      cocoSsd.load().then(model => {
        // Process each image
        images.forEach(img => {
          // Wait for image to load
          if (img.complete) {
            analyzeImage(img, model);
          } else {
            img.addEventListener('load', () => analyzeImage(img, model));
          }
        });
      }).catch(err => {
        console.warn('Saliency detection failed:', err);
        // Fallback to center position
      });
    };
  };

  /**
   * Analyze a single image and apply smart positioning
   */
  function analyzeImage(imgElement, model) {
    // Create canvas to detect objects
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    
    ctx.drawImage(imgElement, 0, 0);

    // Detect objects in the image
    model.detect(canvas).then(predictions => {
      if (predictions.length === 0) {
        // No objects detected, use center
        setObjectPosition(imgElement, 50, 50);
        return;
      }

      // Find the largest/most prominent object
      const mainObject = predictions.reduce((prev, current) => {
        const prevArea = (prev.bbox[2] * prev.bbox[3]);
        const currentArea = (current.bbox[2] * current.bbox[3]);
        return currentArea > prevArea ? current : prev;
      });

      // Calculate center of the detected object
      const objX = mainObject.bbox[0] + (mainObject.bbox[2] / 2);
      const objY = mainObject.bbox[1] + (mainObject.bbox[3] / 2);

      // Convert to percentage
      const percentX = (objX / canvas.width) * 100;
      const percentY = (objY / canvas.height) * 100;

      // Clamp to reasonable bounds (allow some margin)
      const clampedX = Math.max(20, Math.min(80, percentX));
      const clampedY = Math.max(20, Math.min(80, percentY));

      setObjectPosition(imgElement, clampedX, clampedY);
    }).catch(err => {
      console.warn('Object detection failed for image:', err);
      // Fallback to center
      setObjectPosition(imgElement, 50, 50);
    });
  }

  /**
   * Apply object-position to an image element
   */
  function setObjectPosition(imgElement, x, y) {
    imgElement.style.objectPosition = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
    imgElement.dataset.analyzed = 'true';
  }
})();
