import api from "./api";
const getCustomers = async (shopId, params = {}) => {
  const res = await api.get(`/api/customers/${shopId}`, { params });
  return res.data;
};
const createCustomer = async (payload) => {
  const res = await api.post("/api/customers", payload);
  return res.data;
};
export default { getCustomers, createCustomer };