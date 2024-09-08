import { NextResponse } from "next/server";
import crypto from 'crypto';
import axios from 'axios';

export async function POST(request) {
  const { partnerCode, amount, orderInfo, redirectUrl, ipnUrl, requestType, lang } = await request.json();
  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = '';
  const orderGroupId = '';
  
  const autoCapture = true;

  // Raw signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  // Generate signature
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  // JSON request body
  const requestBody = {
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  };

  try {
    // Use axios to send the POST request
    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Return the response data
    return NextResponse.json({ result: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error making payment request:', error);
    return NextResponse.json({ error: 'Payment request failed', details: error.message }, { status: 500 });
  }
}
