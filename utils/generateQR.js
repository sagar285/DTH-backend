const QRCode = require("qrcode");

const generateQR = async (shopId) => {
    try {
        const url = `https://your-frontend.com/menu/${shopId}`;

        const qrData = await QRCode.toDataURL(url);
        return qrData;

    } catch (err) {
        throw new Error("QR generation failed: " + err.message);
    }
};

module.exports = generateQR;
