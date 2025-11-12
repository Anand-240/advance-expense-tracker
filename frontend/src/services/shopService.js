import api from "./api";
const getShop = async (shopId) => {
  const res = await api.get(`/api/shops/${shopId}`);
  return res.data;
};
const getSummary = async (shopId, params = {}) => {
  const res = await api.get(`/api/shops/summary/${shopId}`, { params });
  return res.data;
};
const createShop = async (payload, token) => {
  const res = await api.post("/api/shops", payload, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
const getMyShops = async (token) => {
  const res = await api.get("/api/shops/mine", { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
export default { getShop, getSummary, createShop, getMyShops };