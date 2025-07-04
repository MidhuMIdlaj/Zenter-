import mongoose from "mongoose";
import  CustomerModel  from "../../../../infrastructure/db/models/Admin/ClientModel";
import { escapeRegExp } from "../../../../utils/stringUtils";

interface SearchParams {
    searchTerm?: string;
    status?: 'active' | 'inactive' | 'all';
    page: number;
    limit: number;
}

interface SearchResult {
    customers: any[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}

export const SearchCustomers = async ({
    searchTerm,
    status,
    page,
    limit
}: SearchParams): Promise<SearchResult> => {
    try {
        // Build the query
        const query: any = { isDeleted: false };
        
        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Search term filter
        if (searchTerm) {
            const safeSearchTerm = escapeRegExp(searchTerm);
            query.$or = [
                { clientName: { $regex: safeSearchTerm, $options: 'i' } },
                { email: { $regex: safeSearchTerm, $options: 'i' } },
                { contactNumber: { $regex: safeSearchTerm, $options: 'i' } },
                { address: { $regex: safeSearchTerm, $options: 'i' } }
            ];
        }
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Execute query
        const [customers, total] = await Promise.all([
            CustomerModel.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            CustomerModel.countDocuments(query)
        ]);
        
        return {
            customers,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            limit
        };
        
    } catch (error) {
        console.error('Error in SearchCustomers use case:', error);
        throw error;
    }
}