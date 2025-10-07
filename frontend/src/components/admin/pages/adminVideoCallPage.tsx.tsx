import { useState, useEffect } from 'react';
import { Video } from 'lucide-react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
} from '@mui/material';
import { VideoCallService } from '../../../api/VideoCall/videoCallService';
import { StartVideoCall } from '../../video-call/StartVideoCall';

interface Participant {
  employeeId: string;
  employeeName: string;
  position: string;
  joinedAt?: string;
  leftAt?: string;
}

interface CallRecord {
  _id: string;
  roomId: string;
  callLink: string;
  initiatorId: string;
  initiatorName?: string;
  participants: Participant[];
  startedAt: string;
  endedAt?: string;
  duration?: number;
  status?: string;
}

export default function AdminVideoCallPage() {
  const [history, setHistory] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter states
  const [initiatorFilter, setInitiatorFilter] = useState('');
  const [participantFilter, setParticipantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await VideoCallService.getCallHistory();
        setHistory(response.data);
      } catch (err) {
        console.error('Error fetching call history:', err);
        setError('Failed to load call history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateStr?: string) => {
    return dateStr
      ? new Date(dateStr).toLocaleString('en-IN', { hour12: true })
      : 'N/A';
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDuration = (durationInSeconds?: number) => {
    if (!durationInSeconds || durationInSeconds < 1) return '-';
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    const parts = [];
    if (hours) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds && hours === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    return parts.join(' ');
  };

  // Filtering logic
  const filteredHistory = history.filter(call => {
    const initiatorMatch = initiatorFilter
      ? (call.initiatorName || call.initiatorId)
          .toLowerCase()
          .includes(initiatorFilter.toLowerCase())
      : true;
    const participantMatch = participantFilter
      ? call.participants?.some(
          p => p.employeeName.toLowerCase().includes(participantFilter.toLowerCase())
        )
      : true;
    const statusMatch = statusFilter
      ? (call.status || '').toLowerCase() === statusFilter.toLowerCase()
      : true;
    const dateFromMatch = dateFrom
      ? new Date(call.startedAt) >= new Date(dateFrom)
      : true;
    const dateToMatch = dateTo
      ? new Date(call.startedAt) <= new Date(dateTo)
      : true;
    return initiatorMatch && participantMatch && statusMatch && dateFromMatch && dateToMatch;
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredHistory.length) : 0;

  // Clear filters handler
  const handleClearFilters = () => {
    setInitiatorFilter('');
    setParticipantFilter('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
            <Video className="text-blue-600" size={26} />
            <span>Team Video Call</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and initiate meetings with your team in real-time.
          </p>
        </div>
      </div>

      {/* Start Call */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Start a New Call</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click the button below to create a video call session and share it with team members.
        </p>
        <StartVideoCall />
      </div>

      {/* Call History */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Video Call History</h2>

        {/* Filters */}
        <Box className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Filter by initiator"
            value={initiatorFilter}
            onChange={(e) => setInitiatorFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by participant"
            value={participantFilter}
            onChange={(e) => setParticipantFilter(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Ended">Ended</option>
            <option value="ongoing">Ongoing</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
          <button
            onClick={handleClearFilters}
            style={{ marginLeft: 8, padding: '6px 12px', background: '#e0e0e0', borderRadius: 4 }}
          >
            Clear Filters
          </button>
        </Box>

        {loading ? (
          <Typography variant="h6">Loading call history...</Typography>
        ) : error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : filteredHistory.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No call history available.
          </Typography>
        ) : (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room ID</TableCell>
                    <TableCell>Initiator</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Participants</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((call) => (
                      <TableRow key={call._id}>
                        <TableCell>{call.roomId}</TableCell>
                        <TableCell>{call.initiatorName || call.initiatorId}</TableCell>
                        <TableCell>{formatDate(call.startedAt)}</TableCell>
                        <TableCell>{call.endedAt ? formatDate(call.endedAt) : 'Ongoing'}</TableCell>
                        <TableCell>{formatDuration(call.duration)}</TableCell>
                        <TableCell>{formatStatus(call.status)}</TableCell>
                        <TableCell>
                          {call.participants?.length > 0
                            ? call.participants.map((p) => p.employeeName).join(', ')
                            : 'No participants'}
                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}
      </div>
    </div>
  );
}
