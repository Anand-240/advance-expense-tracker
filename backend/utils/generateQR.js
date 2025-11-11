import QRCode from "qrcode";

export const generateShopQR = async (shopId) => {
  const url = `https://yourfrontendurl.com/pay/${shopId}`;
  const qr = await QRCode.toDataURL(url);
  return qr;
};