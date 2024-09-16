import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { aggregateOrders, calculateOrderValue } from "@/utils/orderManagement";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";

let isSharing = false;
const sharingQueue = [];

const shareWithQueue = async (uri) => {
  if (isSharing && uri.uri) {
    return new Promise((resolve, reject) => {
      sharingQueue.push({ uri, resolve, reject });
    });
  }

  isSharing = true;
  try {
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Sharing failed:", error);
    throw error;
  } finally {
    isSharing = false;
    if (sharingQueue.length > 0) {
      const nextShare = sharingQueue.shift();
      shareWithQueue(nextShare.uri)
        .then(nextShare.resolve)
        .catch(nextShare.reject);
    }
  }
};

const generatePDF = async (
  restaurantName,
  guestName,
  orderItems,
  tableData
) => {
  const orders = aggregateOrders(orderItems);
  const orderValue = calculateOrderValue(orders);
  try {
    const htmlContent = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
      body {
        font-family: 'Helvetica', sans-serif;
        padding: 20px;
        max-width: 400px;
        margin: 0 auto;
        color: #333;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #4a4a4a;
        margin-bottom: 5px;
      }
      .header p {
        color: #888;
        margin: 0;
      }
      .section {
        margin-bottom: 20px;
      }
      .section h2 {
        color: #4a4a4a;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        font-size: 18px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        text-align: left;
        padding: 8px 4px;
      }
      th {
        border-bottom: 1px solid #ddd;
        font-weight: normal;
        color: #888;
      }
      .total {
        font-weight: bold;
        border-top: 1px solid #ddd;
      }
      .notes {
        font-style: italic;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>${restaurantName}</h1>
      <p>Fine Dining Experience</p>
    </div>

    <div class="section">
      <h2>Guest Details</h2>
      <p><strong>Name:</strong> ${guestName}</p>
      <p><strong>Table:</strong> ${
        tableData.number
      } | <strong>Guests:</strong> ${tableData.guests}</p>
      <p><strong>Occasion:</strong> ${tableData.occasion}</p>
      <p><strong>Server:</strong> ${tableData.waiter}</p>
    </div>

    <div class="section">
      <h2>Order Details</h2>
      <table>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        ${orders
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>x${item.quantity}</td>
            <td>${INDIAN_RUPPEE_SYMBOL}${item.price}</td>
            <td>${INDIAN_RUPPEE_SYMBOL}${item.itemValue}</td>
          </tr>
        `
          )
          .join("")}
        <tr class="total">
          <td>Total</td>
            <td colspan="2">x${orders.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}</td>
          <td>${INDIAN_RUPPEE_SYMBOL}${orderValue}</td>
        </tr>
      </table>
    </div>
    <div class="section">
      <p>Thank you for dining with us!</p>
    </div>
  </body>
</html>
`;
    const result = await Print.printToFileAsync({ html: htmlContent });

    if (!result || !result.uri) {
      throw new Error("Failed to generate PDF: No URI returned");
    }

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing isn't available on your platform");
      return;
    }

    await shareWithQueue(result.uri);

    console.log("PDF generated and shared successfully");
    return result.uri;
  } catch (error) {
    console.error("Failed to generate or share PDF:", error);
    throw error;
  }
};

export default generatePDF;
