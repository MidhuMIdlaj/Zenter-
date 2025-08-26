import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { VideoCallService } from '../../api/VideoCall/videoCallService';
import { useSelector } from 'react-redux';
import { selectAdminAuthData, selectEmployeeAuthData } from '../../store/selectors';

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
  onCallEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { employeeData } = useSelector(selectEmployeeAuthData);
  const { adminData } = useSelector(selectAdminAuthData);
  useEffect(() => {
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
      onLeaveRoom: async () => {
        console.log('[VideoCall] User left the room');

        try {
          if (employeeData?.id) {
            await VideoCallService.updateParticipants(roomID, [
              {
                employeeId: employeeData.id,
                employeeName: employeeData.employeeName || 'Unknown Employee',
                leftAt: new Date().toISOString(),
              },
            ]);
            console.log(`[VideoCall] Updated leftAt for ${employeeData.id}`);
          }
        } catch (error) {
          console.error('Failed to update participant leftAt:', error);
        }

      try {
    if (adminData?.id) {
      await VideoCallService.endCall(roomID);
       }
        } catch (error) {
          console.error('Failed to end call history:', error);
        }

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
  }, [appID, serverSecret, roomID, onCallEnd, employeeData]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    />
  );
};
