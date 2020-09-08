require('dotenv').config()
const sendPayloadToKlaviyo = require("../utils/send_to_klaviyo.js");
const timestamp = require('unix-timestamp');

/*
Once the data has been pulled in from Shopify, I iterated over each order for “Ordered Product” over each order and formatted the data into its respective payload
*/ 
const orderedProduct = (data) => {
  data.line_items.forEach((item) => {
    const payload = {
      token: process.env.KLAVIYO_API_KEY,
      event: 'Ordered Product',
      customer_properties: {
        $email: data.email,
        $first_name: data.customer.first_name,
        $last_name: data.customer.last_name,
      },
      properties: {
        $event_id: item.id,
        $value: item.price,
        ProductID: item.product_id,
        SKU: item.sku,
        ProductName: item.name,
        Quantity: item.quantity,
        ProductURL: `${process.env.KLAVIYO_API_KEY}.myshopify.com${item.url}` ,
        ProductCategories: item.properties,
      },
      time: timestamp.fromDate(data.processed_at),
    };
    sendPayloadToKlaviyo(payload)
    .catch((error) => console.log(`error: ${error}`));
  });
};

module.exports = orderedProduct;
