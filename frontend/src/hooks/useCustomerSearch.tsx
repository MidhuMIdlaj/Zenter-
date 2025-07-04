import { useState, useEffect, useMemo } from 'react';
import { Customer } from '../types/dashboard';

export const useCustomerSearch = (customers: Customer[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: "asc" | "desc";
  } | null>(null);
  
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const filtered = filteredCustomers;
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [customers, searchTerm, statusFilter]);

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      if (!sortConfig) return 0; 
      const { key, direction } = sortConfig;
      
      if ((a[key] ?? "") < (b[key] ?? "")) {
        return direction === "asc" ? -1 : 1;
      }
      if ((a[key] ?? "") > (b[key] ?? "")) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [customers, sortConfig]);
  
  const filteredCustomers = useMemo(() => {
    return sortedCustomers.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.place.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === "all") return matchesSearch;
      return matchesSearch && customer.status === statusFilter;
    });
  }, [sortedCustomers, searchTerm, statusFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredCustomers, indexOfFirstItem, indexOfLastItem]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    sortConfig,
    setSortConfig,
    filteredCustomers,
    currentItems,
    totalPages,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem
  };
};