import React, { useEffect } from 'react';

function SketchfabViewer({ modelId, title }) {
  useEffect(() => {
    const iframe = document.getElementById(`sketchfab-${modelId}`);
    const client = new window.Sketchfab('1.0.0', iframe);

    client.init(modelId, {
      success: function(api) {
        api.start();
        api.addEventListener('viewerready', function() {
          console.log('Viewer is ready');
        });
      },
      error: function() {
        console.error('Error initializing Sketchfab viewer');
      },
    });
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
