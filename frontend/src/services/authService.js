import api from "./api";
const register = async (payload) => {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
};
const login = async (payload) => {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
};
export default { register, login };