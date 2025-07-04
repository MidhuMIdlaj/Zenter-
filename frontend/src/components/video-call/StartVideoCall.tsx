import { useState } from 'react';
import { VideoCallService } from '../../api/VideoCall/videoCallService';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectAdminAuthData } from '../../store/selectors';
export const StartVideoCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { adminData } = useSelector(selectAdminAuthData);
  const user = adminData
  
  const handleStartCall = async () => {
    try {
      setLoading(true);
      const roomId = generateRoomId();
      const callLink = `${window.location.origin}/video-call?roomID=${roomId}`;

      // Send invitations (optional)
      const response = await VideoCallService.sendInvitations(callLink);
      const newSocket = io('http://localhost:5000', {
      auth: { token: user?.token},
      transports: ['websocket'],
       });

      if (response.success && newSocket) {
        // Emit event to notify all recipients
        newSocket.emit('video_call_created', {
          callLink,
          roomId,
          createdBy: response.adminName // Assuming this comes from the response
        });
      }
      // Force redirect to public call page
      window.location.href = callLink; // Full page reload ensures public route
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start call');
      setLoading(false);
    }
  };

  const generateRoomId = () => Math.random().toString(36).substring(2, 10);

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <button 
        onClick={handleStartCall}
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          width: '100%'
        }}
      >
        {loading ? 'Creating Room...' : 'Start Video Call with Team'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};