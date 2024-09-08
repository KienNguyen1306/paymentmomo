"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [amount, setAmount] = useState("50000");
  const [productName, setProductName] = useState("Đoaload File");
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handlePayment = async () => {
    setLoading(true);
    const data = {
      partnerCode: "MOMO",
      amount: amount,
      orderInfo: productName,
      redirectUrl: "https://paymentmomo.vercel.app",
      ipnUrl: "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b",
      requestType: "payWithMethod",
      lang: "vi",
    };

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      router.push(result.result.payUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    
    if (orderId) {
      axios
        .post("/api/payment/ransaction", {
          orderId: orderId,
        })
        .then((response) => {
          console.log("API Response:", response.data);
          const mess = response.data.result.resultCode;
          if (mess === 0) {
            setLoading(false);
          }
        });
    }
  }, [orderId]);
  return (
    <>
      <h2>Credit Cards Test Details </h2>
      <p>
        NGUYEN VAN A - 5200 0000 0000 1096 - 05/25 - 111 OTP Card Successful
      </p>
      <p>NGUYEN VAN A - 5200 0000 0000 1104 - 05/25 - 111 OTP Card failed</p>
      <p>
        NGUYEN VAN A - 4111 1111 1111 1111 - 05/25 - 111 noOTP Card Successful
      </p>
      <h2>Test Thẻ ATM </h2>
      <p>NGUYEN VAN A - 9704 0000 0000 0018 - 03/07 - OTP Thành công</p>
      <p>NGUYEN VAN A 9704 0000 0000 0026 03/07 OTP Thẻ bị khóa</p>
      <p>NGUYEN VAN A 9704 0000 0000 0034 03/07 OTP Nguồn tiền không đủ</p>
      <p>NGUYEN VAN A 9704 0000 0000 0042 03/07 OTP Hạn mức thẻ</p>

      <form class="max-w-sm mx-auto">
        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Số tiền thanh toán
          </label>
          <input
            id="money"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={handleAmountChange}
          />
        </div>
        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Tên sản phẩm
          </label>
          <input
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            onChange={handleProductNameChange}
          />
        </div>
      </form>
      <div className="p-50 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {loading ? (
          <button
            onClick={handlePayment}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Thanh toán
          </button>
        ) : (
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>
              <a
                href="https://file.io/Zz8GOCmz5oK4" // Replace with the path to your file
                download
              >
                Download File
              </a>
            </span>
          </button>
        )}
      </div>
    </>
  );
}
