import toast from "react-hot-toast";
import api from "./apis";

const fetchPointTableData = async () => {
  try {
    const response = await api.get("/point-table");
    return response?.data;
  } catch (error: any) {
    toast.error(error?.message ?? "Failed To Fetch Point Table");
  }
};

const calculateNrr = async (data:any) => {
  try {
    const response = await api.post('/calculate-nrr',data);
    return response?.data;
  } catch (error:any) {
    toast.error(error?.message ?? "Failed To Calucate NRR")
  }
}


export default {
  fetchPointTableData,
  calculateNrr
}