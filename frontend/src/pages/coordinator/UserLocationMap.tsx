import { useState, useEffect } from 'react';
import { getAllComplaint } from '../../api/cplaint/complaint';
import { Users, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface Complaint {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  workingStatus: string;
}

interface UserComplaintStats {
  name: string;
  email: string;
  phone: string;
  complaintCount: number;
  lastComplaintDate: string;
  statusDistribution: {
    completed: number;
    processing: number;
    pending: number;
  };
}

interface TopComplainer {
  name: string;
  email: string;
  complaintCount: number;
  lastComplaintDate: string;
  statusDistribution: {
    completed: number;
    processing: number;
    pending: number;
  };
}

interface ComplaintLeadersCardProps {
  setTopComplainers: (complainers: TopComplainer[]) => void;
}

export default function ComplaintLeadersCard({ setTopComplainers }: ComplaintLeadersCardProps) {
  const [topComplainers, setTopComplainersLocal] = useState<UserComplaintStats[]>([]);
  const [bottomComplainers, setBottomComplainers] = useState<UserComplaintStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaints = await getAllComplaint();
        if (!Array.isArray(complaints)) {
          setError('Invalid complaint data format');
          setLoading(false);
          return;
        }

        // Group complaints by customer email (unique identifier)
        const userComplaintsMap = new Map<string, UserComplaintStats>();

        complaints.forEach(complaint => {
          const email = complaint.customerEmail;
          if (!email) return;

          if (!userComplaintsMap.has(email)) {
            userComplaintsMap.set(email, {
              name: complaint.customerName || 'Unknown',
              email,
              phone: complaint.customerPhone || '',
              complaintCount: 0,
              lastComplaintDate: complaint.createdAt,
              statusDistribution: {
                completed: 0,
                processing: 0,
                pending: 0
              }
            });
          }

          const userStats = userComplaintsMap.get(email)!;
          userStats.complaintCount += 1;

          // Update last complaint date if newer
          const complaintDate = new Date(complaint.createdAt);
          const lastDate = new Date(userStats.lastComplaintDate);
          if (complaintDate > lastDate) {
            userStats.lastComplaintDate = complaint.createdAt;
          }

          // Update status distribution
          switch (complaint.workingStatus) {
            case 'completed':
              userStats.statusDistribution.completed += 1;
              break;
            case 'processing':
              userStats.statusDistribution.processing += 1;
              break;
            default:
              userStats.statusDistribution.pending += 1;
          }
        });

        // Convert to array and filter out users with 0 complaints
        let userStatsArray = Array.from(userComplaintsMap.values())
          .filter(user => user.complaintCount > 0);

        // If there are less than 6 unique complainers, we can't show 3 top and 3 bottom without overlap
        if (userStatsArray.length < 6) {
          // Just show all complainers in top section and nothing in bottom
          const sortedDesc = [...userStatsArray].sort((a, b) => b.complaintCount - a.complaintCount);
          setTopComplainersLocal(sortedDesc.slice(0, 3));
          setBottomComplainers([]);

          // Update parent component with top complainers
          if (setTopComplainers) {
            setTopComplainers(sortedDesc.slice(0, 3).map(user => ({
              name: user.name,
              email: user.email,
              complaintCount: user.complaintCount,
              lastComplaintDate: user.lastComplaintDate,
              statusDistribution: user.statusDistribution
            })));
          }
        } else {
          // Sort by complaint count (descending for top, ascending for bottom)
          const sortedDesc = [...userStatsArray].sort((a, b) => b.complaintCount - a.complaintCount);
          const sortedAsc = [...userStatsArray].sort((a, b) => a.complaintCount - b.complaintCount);

          // Get top 3 and bottom 3, ensuring no overlap
          const top3 = sortedDesc.slice(0, 3);
          // Filter out top 3 from the ascending sort to prevent duplicates
          const bottomCandidates = sortedAsc.filter(user =>
            !top3.some(topUser => topUser.email === user.email)
          );
          const bottom3 = bottomCandidates.slice(0, 3);

          setTopComplainersLocal(top3);
          setBottomComplainers(bottom3);

          // Update parent component with top complainers
          if (setTopComplainers) {
            setTopComplainers(top3.map(user => ({
              name: user.name,
              email: user.email,
              complaintCount: user.complaintCount,
              lastComplaintDate: user.lastComplaintDate,
              statusDistribution: user.statusDistribution
            })));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('Failed to load complaint data');
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [setTopComplainers]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusPercentage = (user: UserComplaintStats, status: keyof typeof user.statusDistribution) => {
    if (user.complaintCount === 0) return 0;
    return Math.round((user.statusDistribution[status] / user.complaintCount) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Complaint Leaders</h3>
        <Users className="text-indigo-500" size={20} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Complainers Section */}
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp className="text-green-500 mr-2" size={18} />
              <h4 className="font-medium text-gray-700">Top Complainers (Most Complaints)</h4>
            </div>

            {topComplainers.length > 0 ? (
              <div className="space-y-4">
                {topComplainers.map((user, index) => (
                  <UserComplaintItem
                    key={`top-${user.email}`}
                    user={user}
                    index={index}
                    isTop={true}
                    formatDate={formatDate}
                    getStatusPercentage={getStatusPercentage}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No active complainers found</p>
            )}
          </div>

          {/* Bottom Complainers Section */}
          {bottomComplainers.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <TrendingDown className="text-red-500 mr-2" size={18} />
                <h4 className="font-medium text-gray-700">Bottom Complainers (Least Complaints)</h4>
              </div>
              <div className="space-y-4">
                {bottomComplainers.map((user, index) => (
                  <UserComplaintItem
                    key={`bottom-${user.email}`}
                    user={user}
                    index={index}
                    isTop={false}
                    formatDate={formatDate}
                    getStatusPercentage={getStatusPercentage}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserComplaintItem({ user, index, isTop, formatDate, getStatusPercentage }: {
  user: UserComplaintStats;
  index: number;
  isTop: boolean;
  formatDate: (dateString: string) => string;
  getStatusPercentage: (user: UserComplaintStats, status: keyof typeof user.statusDistribution) => number;
}) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            {isTop && (
              <Award className={`mr-2 ${index === 0 ? 'text-yellow-500 fill-yellow-100' :
                  index === 1 ? 'text-gray-500 fill-gray-100' :
                    'text-amber-700 fill-amber-100'
                }`} size={18} />
            )}
            <h4 className="font-semibold">{user.name}</h4>
          </div>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">Last complaint: {formatDate(user.lastComplaintDate)}</p>
        </div>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
          {user.complaintCount} complaint{user.complaintCount !== 1 ? 's' : ''}
        </span>
      </div>

      {user.complaintCount > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-600">
              Solved: {getStatusPercentage(user, 'completed')}%
            </span>
            <span className="text-blue-600">
              Processing: {getStatusPercentage(user, 'processing')}%
            </span>
            <span className="text-yellow-600">
              Pending: {getStatusPercentage(user, 'pending')}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${getStatusPercentage(user, 'completed')}%`,
                background: 'linear-gradient(90deg, #10B981, #3B82F6, #F59E0B)'
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}