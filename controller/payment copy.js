const Payment = require("../models/payment");
const axios = require("axios");

const api = axios.create({
  baseURL: "https://payment.intasend.com/api/v1/payment/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ISSecretKey}`,
  },
});

const stkpush = async (req, res) => {
  // const userId = req.user.details._id;
  const { amount, phone_number } = req.body;
  const endpoint = "mpesa-stk-push/";

  try {
    const response = await api.post(endpoint, {
      amount,
      phone_number,
    });

    // const {
    //   id,
    //   invoice,
    //   customer,
    //   payment_link,
    //   customer_comment,
    //   refundable,
    //   created_at,
    //   updated_at,
    // } = response.data;

    // const paymentData = {
    //   id,
    //   invoice,
    //   customer,
    //   payment_link,
    //   customer_comment,
    //   refundable,
    //   created_at,
    //   updated_at,
    // };

    // const payment = await Payment.create(paymentData);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const webhookTrigger = async (req, res) => {
  try {
    const { invoice_id, state, failed_reason, failed_code } = req.body;

    const filter = { "invoice.invoice_id": invoice_id };
    const update = {
      $set: {
        "invoice.state": state,
        "invoice.failed_reason": failed_reason,
        "invoice.failed_code": failed_code,
      },
    };

    const updatedPayment = await Payment.findOneAndUpdate(filter, update, {
      new: true,
    });

    res.status(200).json({
      message: "Payload received successfully",
      payload: req.body,
      updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error });
  }
};

const paymentStatus = async (req, res) => {
  const options = {
    method: "POST",
    url: "https://payment.intasend.com/api/v1/payment/status/",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-IntaSend-Public-API-Key": process.env.ISPubKey,
    },
    data: { invoice_id: req.body.invoice_id },
  };

  try {
    const response = await axios.request(options);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred", error });
  }
};

module.exports = { webhookTrigger, stkpush, paymentStatus };
