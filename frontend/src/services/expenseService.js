import api from "./api";
const getExpenses = async (shopId, params = {}) => {
  const res = await api.get(`/api/expenses/${shopId}`, { params });
  return res.data;
};
const createExpense = async (payload) => {
  const res = await api.post("/api/expenses", payload);
  return res.data;
};
export default { getExpenses, createExpense };