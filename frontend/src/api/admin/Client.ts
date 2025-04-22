// src/api/clientApi.ts
import axios from "axios";
import { ClientFormData } from "../../types/dashboard";

export const ClientApi = async (data: ClientFormData): Promise<any> => {
  try {
    const response = await axios.post("http://localhost:5000/api/admin/createUser", data);
    return response.data;
  } catch (error) {
    console.error("Client API error", error);
    throw error;
  }
};

export const ClientListApi = async (): Promise<ClientFormData> => {
  try {
    const response = await axios.get("http://localhost:5000/api/admin/getAllClients");
    console.log("Client List API response", response.data);
    return response.data;
  } catch (error) {
    console.error("Client List API error", error);
    throw error;
  }
}