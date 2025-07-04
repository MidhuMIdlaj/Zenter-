import { StartVideoCall } from '../../video-call/StartVideoCall';
import { Video } from 'lucide-react';

export default function AdminVideoCallPage() {
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
        {/* Optional: Add a button or settings here */}
      </div>

      {/* Call section */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Start a New Call</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click the button below to create a video call session and share it with team members.
        </p>
        <StartVideoCall />
      </div>
    </div>
  );
}
