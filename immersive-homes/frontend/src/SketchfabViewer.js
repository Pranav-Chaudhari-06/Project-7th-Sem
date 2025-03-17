import React, { useEffect } from 'react';

function SketchfabViewer({ modelId, title }) {
  useEffect(() => {
    let script;
    let viewerClient;
    let isMounted = true;

    const initializeViewer = () => {
      const iframe = document.getElementById(`sketchfab-${modelId}`);
      if (!iframe) return;

      viewerClient = new window.Sketchfab('1.12.1', iframe);

      viewerClient.init(modelId, {
        success: (api) => {
          if (!isMounted) return;
          api.start();
          api.addEventListener('viewerready', () => {
            console.log('Viewer is ready');
          });
        },
        error: () => {
          console.error('Error initializing Sketchfab viewer');
        },
      });
    };

    if (typeof window.Sketchfab === 'function') {
      initializeViewer();
    } else {
      script = document.createElement('script');
      script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
      script.async = true;
      script.onload = () => {
        if (isMounted) initializeViewer();
      };
      script.onerror = () => {
        console.error('Failed to load Sketchfab SDK');
      };
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      // Cleanup iframe and viewer client
      if (viewerClient) {
        viewerClient.destroy();
      }
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [modelId]);

  return (
    <div className="text-center">
      <h5>{title}</h5>
      <iframe
        id={`sketchfab-${modelId}`}
        title={title}
        width="100%"
        height="300"
        frameBorder="0"
        allow="autoplay; fullscreen; vr"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default SketchfabViewer;