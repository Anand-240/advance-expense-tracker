import api from "./api";
const getPayments = async (shopId, params = {}) => {
  const res = await api.get(`/api/payments/${shopId}`, { params });
  return res.data;
};
const getPayment = async (id) => {
  const res = await api.get(`/api/payments/single/${id}`);
  return res.data;
};
const simulatePayment = async (payload) => {
  const res = await api.post("/api/payments/simulate", payload);
  return res.data;
};
const refundPayment = async (id, token) => {
  const res = await api.put(`/api/payments/refund/${id}`, null, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
export default { getPayments, getPayment, simulatePayment, refundPayment };