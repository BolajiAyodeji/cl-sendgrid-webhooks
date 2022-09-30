require("dotenv").config();
const express = require("express");
const CryptoJS = require("crypto-js");
const hmacSHA256 = require("crypto-js/hmac-sha256");

const app = express();
const port = 9000;

// Fetch RAW incoming JSON requests and put in req.rawBody
app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.post("/callback", (req, res) => {
  // Verify the payload coming from Commerce Layer
  const signature = req.headers["x-commercelayer-signature"];
  const hash = hmacSHA256(req.rawBody, process.env.CL_SHARED_SECRET);
  const encode = hash.toString(CryptoJS.enc.Base64);
  if (req.method === "POST" && signature === encode) {
    const payload = req.body;

    // Fetch the order summary from the payload
    const order = payload.data.attributes;

    // Send Email with SendGrid
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: inputData.customerEmail,
      from: {
        email: "bolaji@commercelayer.io",
        name: "Cake Store Team",
      },
      reply_to: {
        email: "bolaji@commercelayer.io",
        name: "No Reply",
      },
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamic_template_data: {
        customerName: inputData.customerName,
        orderTimeStamp: inputData.orderTimeStamp,
        dateFormat: "DD MMMM, YYYY h:mm:ss A",
        timezoneOffset: "-0800",
        shipmentNumber: `${
          inputData.shipmentNumber.match(/#\d{8}\/S\/\d{3}/g)[0]
        }`,
        orderNumber: inputData.orderNumber,
        customerEmail: inputData.customerEmail,
        marketName: inputData.marketName,
        paymentMethod: inputData.paymentMethod,
        shippingAddress: inputData.shippingAddress,
        shippingMethod: inputData.shippingMethod,
        lineItems: inputData.lineItems,
        totalAmount: inputData.totalAmount,
        shippingAmount: inputData.shippingAmount,
        grandTotalAmount: inputData.grandTotalAmount,
      },
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log(`Email sent to ${inputData.customerEmail}!`);
      })
      .catch((error) => {
        console.error(error);
      });
    res.status(200).json({
      message: "Email sent to customer!",
    });
  } else {
    res.status(401).json({
      error: "Unauthorized: Invalid signature",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
