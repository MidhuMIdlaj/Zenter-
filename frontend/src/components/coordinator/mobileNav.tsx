import { Home, Users, MessageSquare, Bell, Send } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-around z-50">
      <button 
        className={`p-2 rounded-full ${activeTab === 'Dashboard' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveTab('Dashboard')}
      >
        <Home className="w-6 h-6" />
      </button>
      <button 
        className={`p-2 rounded-full ${activeTab === 'User Management' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveTab('User Management')}
      >
        <Users className="w-6 h-6" />
      </button>
      <button 
        className={`p-2 rounded-full ${activeTab === 'Complaint Management' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveTab('Complaint Management')}
      >
        <MessageSquare className="w-6 h-6" />
      </button>
      <button 
        className={`p-2 rounded-full ${activeTab === 'Notification' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveTab('Notification')}
      >
        <Bell className="w-6 h-6" />
      </button>
      <button 
        className={`p-2 rounded-full ${activeTab === 'Chat' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        onClick={() => setActiveTab('Chat')}
      >
        <Send className="w-6 h-6" />
      </button>
    </div>
  );
}