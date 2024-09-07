import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const generatePDF = async (
  restaurantName,
  guestName,
  orderItems,
  tableData
) => {
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
        ${orderItems
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>x${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
        <tr class="total">
          <td>Total</td>
            <td colspan="2">x${orderItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}</td>
          <td>₹${orderItems
            .reduce((sum, item) => sum + item.quantity * item.price, 0)
            .toFixed(2)}</td>
        </tr>
      </table>
    </div>

    ${
      tableData.notes
        ? `
      <div class="section">
        <h2>Notes</h2>
        <p class="notes">${tableData.notes}</p>
      </div>
    `
        : ""
    }

    <div class="section">
      <p>Thank you for dining with us!</p>
    </div>
  </body>
</html>
`;

    // if (Platform.OS === "web") {
    //   const iframe = document.createElement("iframe");
    //   iframe.style.display = "none";
    //   document.body.appendChild(iframe);
    //   iframe.contentDocument.write(htmlContent);
    //   iframe.contentDocument.close();
    //   iframe.contentWindow.print();
    // } else {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing isn't available on your platform");
      return;
    }

    await Sharing.shareAsync(uri);

    console.log("PDF generated successfully");
    return uri;
    // }
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
};

export default generatePDF;
