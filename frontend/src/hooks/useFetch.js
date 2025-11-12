import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const useFetch = (endpoint, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}${endpoint}`);
        setData(res.data);
      } catch {
        setData([]);
      }
      setLoading(false);
    };
    getData();
  }, deps);

  return { data, loading };
};