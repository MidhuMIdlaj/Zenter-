// // components/InvoiceGenerator.tsx
// import React from 'react';
// import { TaskData } from '../../pages/mechanic/TaskManagement';

// interface InvoiceGeneratorProps {
//   task: TaskData;
//   completionData: {
//     description: string;
//     photos: string[]; // Assuming photos are URLs
//   };
//   onClose: () => void;
// }

// const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ task, completionData, onClose }) => {
//   const downloadInvoice = () => {
//     // In a real implementation, this would generate a PDF invoice
//     console.log('Generating invoice for task:', task.id);
//     // For now, we'll just show an alert
//     alert('Invoice generation would be implemented here. In a real app, this would download a PDF.');
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Service Invoice</h2>
//           <p className="text-gray-600">#{task.id.slice(0, 8).toUpperCase()}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
//           <p className="text-gray-600">Status: Completed</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="font-semibold text-lg mb-3 text-gray-800">Customer Details</h3>
//           <p className="font-medium">{task.customerName}</p>
//           <p className="text-gray-600">{task.customerPhone}</p>
//           {task.customerEmail && <p className="text-gray-600">{task.customerEmail}</p>}
//           <p className="text-gray-600 mt-2">{task.location}</p>
//         </div>

//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="font-semibold text-lg mb-3 text-gray-800">Vehicle Details</h3>
//           <p className="font-medium">
//             {task.vehicleDetails.make} {task.vehicleDetails.model} ({task.vehicleDetails.year})
//           </p>
//           {task.vehicleDetails.licensePlate && (
//             <p className="bg-gray-200 inline-block px-2 py-1 rounded text-sm font-mono mt-1">
//               {task.vehicleDetails.licensePlate}
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="mb-8">
//         <h3 className="font-semibold text-lg mb-3 text-gray-800">Service Summary</h3>
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
//             <span className="font-medium">Service Type</span>
//             <span>{task.serviceType}</span>
//           </div>
//           <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
//             <span className="font-medium">Priority</span>
//             <span className="capitalize">{task.priority}</span>
//           </div>
//           <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
//             <span className="font-medium">Estimated Time</span>
//             <span>{task.estimatedTime}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-medium">Completion Notes</span>
//             <span>{completionData.description}</span>
//           </div>
//         </div>
//       </div>

//       {completionData.photos.length > 0 && (
//         <div className="mb-8">
//           <h3 className="font-semibold text-lg mb-3 text-gray-800">Service Photos</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {completionData.photos.map((photo, index) => (
//               <div key={index} className="border rounded-lg overflow-hidden">
//                 <img 
//                   src={photo} 
//                   alt={`Service photo ${index + 1}`}
//                   className="w-full h-32 object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex justify-end space-x-4 mt-6">
//         <button
//           onClick={onClose}
//           className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
//         >
//           Close
//         </button>
//         <button
//           onClick={downloadInvoice}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Download Invoice
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InvoiceGenerator;