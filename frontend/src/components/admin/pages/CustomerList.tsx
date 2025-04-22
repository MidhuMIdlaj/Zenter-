import React, { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Calendar,
  Package,
  Hash,
  Tag,
  Shield,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { ClientListApi, ClientApi } from "../../../api/admin/Client";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  place: string;
  district: string;
  status: "active" | "inactive";
  avatar?: string;
}

interface Client {
  email: string;
  clientName: string;
  attendedDate: string;
  contactNumber: string;
  address: string;
  productName: string;
  quantity: string;
  version: string;
  brand: string;
  model: string;
  warrantyDate: string;
  guaranteeDate: string;
}

interface ClientListResponse {
  clients: Client[];
}



const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    clientName: "",
    attendedDate: "",
    contactNumber: "",
    address: "",
    productName: "",
    quantity: "",
    version: "",
    brand: "",
    model: "",
    warrantyDate: "",
    guaranteeDate: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response: ClientListResponse = await ClientListApi(); 
        if (response && Array.isArray(response.clients)) {
          const mappedClients = response.clients.map((client) => ({
            name: client.clientName,
            email: client.email,
            phone: client.contactNumber,
            place: client.address?.split(',')[0]?.trim() || 'N/A',
            district: client.address?.split(',')[1]?.trim() || 'N/A',
            status: "active",
          }));
          setCustomers(mappedClients);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClients();
  }, []);
  
  

  const sortedCustomers = [...customers].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter((customer) =>{
   return customer 
  })

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const requestSort = (key: keyof Customer) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleStatus = (id: string) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status: customer.status === "active" ? "inactive" : "active",
            }
          : customer
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ClientApi(formData);
      const response = await ClientListApi();
      const mappedClients = response.clients.map((client: any) => ({
        id: client._id,
        name: client.clientName,
        email: client.email,
        phone: client.contactNumber,
        place: client.address?.split(',')[0]?.trim() || 'N/A',
        district: client.address?.split(',')[1]?.trim() || 'N/A',
        status: "active",
        avatar: client.clientName?.charAt(0) || 'U',
      }));
      setCustomers(mappedClients);
      setShowModal(false);
      setFormData({
        email: "",
        clientName: "",
        attendedDate: "",
        contactNumber: "",
        address: "",
        productName: "",
        quantity: "",
        version: "",
        brand: "",
        model: "",
        warrantyDate: "",
        guaranteeDate: "",
      });
    } catch (error) {
      console.error("Failed to add client:", error);
    }
  };

  const resetField = () => {
    setShowModal(false);
    setFormData({
      email: "",
      clientName: "",
      attendedDate: "",
      contactNumber: "",
      address: "",
      productName: "",
      quantity: "",
      version: "",
      brand: "",
      model: "",
      warrantyDate: "",
      guaranteeDate: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden font-poppins">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Customer Management
        </h2>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th
                className="p-4 font-medium cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center gap-1">
                  <span>Customer</span>
                  {sortConfig?.key === "name" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th className="p-4 font-medium hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Mail size={16} /> <span>Email</span>
                </div>
              </th>
              <th className="p-4 font-medium hidden sm:table-cell">
                <div className="flex items-center gap-1">
                  <Phone size={16} /> <span>Phone</span>
                </div>
              </th>
              <th className="p-4 font-medium hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <MapPin size={16} /> <span>Location</span>
                </div>
              </th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {customer.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500 md:hidden">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-gray-700">{customer.email}</p>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <p className="text-gray-700">{customer.phone}</p>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div>
                      <p className="text-gray-700">{customer.place}</p>
                      <p className="text-sm text-gray-500">
                        {customer.district}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(customer.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {customer.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors md:hidden">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length > itemsPerPage && (
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredCustomers.length)} of
            {filteredCustomers.length} customers
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md transition-colors ${
                  currentPage === page
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal - remains exactly the same */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Add New Customer
                </h3>
                <button
                  onClick={resetField}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <User className="text-blue-600" size={20} />
                      User Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email ID
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="example@domain.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Attended Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="attendedDate"
                            value={formData.attendedDate}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="123 Main St, City, Country"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <Package className="text-blue-600" size={20} />
                      Product Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="productName"
                          value={formData.productName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Product XYZ"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Version
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="version"
                            value={formData.version}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="v2.0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Brand Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Model
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Model Number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Warranty Date
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="warrantyDate"
                            value={formData.warrantyDate}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Guarantee Date
                        </label>
                        <div className="relative">
                          <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="guaranteeDate"
                            value={formData.guaranteeDate}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetField}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;