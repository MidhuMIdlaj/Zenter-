import { useNavigate, useSearchParams } from 'react-router-dom';
import { VideoCall } from '../../components/video-call/VideoCall';
import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import { selectAdminAuthData, selectEmployeeAuthData } from '../../store/selectors';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: '2rem',
  padding: '2rem',
});

const MeetingInfoCard = styled(Paper)({
  padding: '2rem',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '600px',
  textAlign: 'center',
});

export default function VideoCallJoinPage() {
  const [params] = useSearchParams();
  const roomID = params.get('roomID');
  const navigate = useNavigate();
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const { adminData } = useSelector(selectAdminAuthData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const getDashboardPath = () => {
    if (adminData?.id) {
      return '/admin/dashboard';
    }
    if (!employeeData || !employeeData.position) {
      return '/employee-login';
    }
    switch (employeeData.position.toLowerCase()) {
      case 'coordinator':
        return '/coordinator/dashboard';
      case 'mechanic':
        return '/mechanic/dashboard';
      default:
        return '/employee-login';
    }
  };

  useEffect(() => {
    // Simulate loading (replace with actual checks)
    const timer = setTimeout(() => {
      if (!roomID) {
        setError('Invalid meeting link. Please check your invitation.');
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [roomID]);

 const handleCallEnd = () => {
    const dashboardPath = getDashboardPath();
    console.log(`[VideoCallJoinPage] Call ended, redirecting to: ${dashboardPath}`);
    navigate(dashboardPath);
  };

  if (loading) {
    return (
      <StyledContainer>
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Preparing your meeting...
        </Typography>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <MeetingInfoCard elevation={3}>
          <Typography variant="h4" color="error" gutterBottom>
            Unable to join meeting
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            href="/"
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </MeetingInfoCard>
      </StyledContainer>
    );
  }

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <VideoCall 
        appID={1855333231}
        serverSecret="947a8b673c02869dd8f075fcb5435889"
        roomID={roomID || ''}
        onCallEnd={handleCallEnd}
      />
    </Box>
  );
}