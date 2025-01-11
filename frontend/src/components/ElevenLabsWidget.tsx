import { useEffect, useRef } from 'react';

interface ElevenLabsWidgetProps {
  agentId: string;
}

export function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Create the widget elements
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', agentId);
      
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      
      // Clear previous content and add new elements
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(widget);
      containerRef.current.appendChild(script);

      // Cleanup function
      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }
  }, [agentId]);

  return (
    <div ref={containerRef} className="elevenlabs-widget-container bg-white p-4 rounded-lg" />
  );
} 