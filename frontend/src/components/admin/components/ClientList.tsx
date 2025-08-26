import React from 'react';
import { Client } from '../../../types/dashboard';

interface ClientsListProps {
  clients: Client[];
}

const ClientsList: React.FC<ClientsListProps> = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {/* <h3 className="font-semibold mb-4">Our Clients</h3> */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <tbody>
            {/* {clients.map((client) => (
              // <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              //   <td className="py-3 flex items-center">
              //     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-3">
              //       {client.name.charAt(0)}
              //     </div>
              //     <div>
              //       <p className="font-medium">{client.name}</p>
              //       <p className="text-xs text-gray-500">{client.email}</p>
              //     </div>
              //   </td>
              //   <td className="py-3">
              //     <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              //       {client.status}
              //     </span>
              //   </td>
              //   <td className="py-3 text-right text-sm">{client.lastLogin}</td>
              // </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsList;
