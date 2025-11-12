import api from "./api";
const getSummary = async (shopId, params = {}) => {
  const res = await api.get(`/api/reports/summary/${shopId}`, { params });
  return res.data;
};
const getTrends = async (shopId, params = {}) => {
  const res = await api.get(`/api/reports/trends/${shopId}`, { params });
  return res.data;
};
export default { getSummary, getTrends };