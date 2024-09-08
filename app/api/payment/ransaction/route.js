import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(request) {
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const { orderId } = await request.json();
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
  const requestBody = {
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  };
  try {
    const response = await axios.post("https://paymentmomo.vercel.app/v2/gateway/api/query",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json({ result: response.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
