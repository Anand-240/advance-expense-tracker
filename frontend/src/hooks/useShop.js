import { useEffect, useState } from "react";
import shopService from "../services/shopService";

export const useShop = (shopId) => {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    if (!shopId) return;
    (async () => {
      const s = await shopService.getShop(shopId);
      setShop(s);
    })();
  }, [shopId]);

  return shop;
};