// src/components/video-call/VideoCall.tsx
import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

interface VideoCallProps {
  appID: number;
  serverSecret: string;
  roomID: string;
  onCallEnd: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ 
  appID, 
  serverSecret,
  roomID,
  onCallEnd
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {1
    if (!containerRef.current) return;

    const generateToken = () => {
      return ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date.now().toString(),
        'Host'
      );
    };

    const zp = ZegoUIKitPrebuilt.create(generateToken());
    
   zp.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      onLeaveRoom: () => {
        console.log('[VideoCall] User left the room');
        if (onCallEnd) {
          onCallEnd();
        }
      },
      onUserLeave: (users) => {
        console.log('[VideoCall] Users left:', users);
      },
    });

    return () => {
      zp.destroy();
    };
  }, [appID, serverSecret, roomID]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100vw', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    />
  );
};