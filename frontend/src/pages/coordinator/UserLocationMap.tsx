import { useState, useEffect } from 'react';
import { getAllComplaint } from '../../api/cplaint/complaint';
import { Users, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface Complaint {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  status: {
    workingStatus: string;
  };
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

export default function ComplaintLeadersCard() {
  const [topComplainers, setTopComplainers] = useState<UserComplaintStats[]>([]);
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

        // Group complaints by customer
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
              lastComplaintDate: '',
              statusDistribution: {
                completed: 0,
                processing: 0,
                pending: 0
              }
            });
          }

          const userStats = userComplaintsMap.get(email)!;
          userStats.complaintCount += 1;
          
          // Update last complaint date
          const complaintDate = new Date(complaint.createdAt);
          if (!userStats.lastComplaintDate || complaintDate > new Date(userStats.lastComplaintDate)) {
            userStats.lastComplaintDate = complaint.createdAt;
          }
          
          // Update status distribution
          if (complaint.workingStatus === 'completed') {
            userStats.statusDistribution.completed += 1;
          } else if (complaint.workingStatus === 'processing') {
            userStats.statusDistribution.processing += 1;
          } else {
            userStats.statusDistribution.pending += 1;
          }
        });

        // Convert to array and sort by complaint count
        const userStatsArray = Array.from(userComplaintsMap.values());
        userStatsArray.sort((a, b) => b.complaintCount - a.complaintCount);

        // Get top 3 complainers
        setTopComplainers(userStatsArray.slice(0, 3));
        
        // Get bottom complainers (only those with at least one complaint)
        const filteredBottom = userStatsArray
          .filter(user => user.complaintCount > 0)
          .sort((a, b) => a.complaintCount - b.complaintCount)
          .slice(0, 3);
        
        setBottomComplainers(filteredBottom);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('Failed to load complaint data');
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

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
              <h4 className="font-medium text-gray-700">Most Active Complainers</h4>
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
          <div>
            <div className="flex items-center mb-4">
              <TrendingDown className="text-red-500 mr-2" size={18} />
              <h4 className="font-medium text-gray-700">Least Active Complainers</h4>
            </div>
            
            {bottomComplainers.length > 0 ? (
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
            ) : (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Extracted User Complaint Item component for better reusability
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
              <Award className={`mr-2 ${
                index === 0 ? 'text-yellow-500 fill-yellow-100' : 
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