import PDFDocument from "pdfkit";
import fs from "fs";

export const generateReceiptPDF = async (payment, shop) => {
  const doc = new PDFDocument();
  const filePath = `./public/receipts/receipt_${payment._id}.pdf`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text(shop.name || "Shop Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Shop: ${shop.name}`);
  doc.text(`Owner: ${shop.ownerName || "-"}`);
  doc.text(`Email: ${shop.email || "-"}`);
  doc.moveDown();

  doc.text(`Payment ID: ${payment._id}`);
  doc.text(`Amount: ₹${payment.amount}`);
  doc.text(`Method: ${payment.method}`);
  doc.text(`Status: ${payment.status}`);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`);

  doc.moveDown();
  doc.fontSize(10).text("Thank you for your purchase!", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};