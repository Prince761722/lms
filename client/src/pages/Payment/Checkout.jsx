import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  getRazorpayKey,
  buySubscription,
  verifyPayment,
} from "../../redux/slice/razorpaySlice";

// =======================
// LOAD RAZORPAY SCRIPT
// =======================
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      // 🔴 BLOCK ADMIN
      const role = localStorage.getItem("role");
      if (role === "admin") {
        toast.error("Admin cannot purchase subscription");
        return;
      }

      setLoading(true);

      // =======================
      // LOAD SCRIPT
      // =======================
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay");
        setLoading(false);
        return;
      }

      // =======================
      // GET KEY
      // =======================
      const keyRes = await dispatch(getRazorpayKey());
      console.log("KEY RESPONSE:", keyRes);

      const razorpayKey = keyRes.payload?.key || keyRes.payload;

      if (!razorpayKey) {
        toast.error("Failed to load payment key");
        setLoading(false);
        return;
      }

      // =======================
      // CREATE SUBSCRIPTION
      // =======================
      const subRes = await dispatch(buySubscription());
      console.log("SUB RESPONSE:", subRes);

      if (
        subRes.meta.requestStatus === "rejected" ||
        !subRes.payload?.subscription_id
      ) {
        toast.error(subRes.payload || "Subscription failed");
        setLoading(false);
        return;
      }

      const subscription_id = subRes.payload.subscription_id;

      // =======================
      // RAZORPAY OPTIONS
      // =======================
      const options = {
        key: razorpayKey,
        subscription_id,
        name: "Your Platform",
        description: "Premium Subscription",
        theme: { color: "#3399cc" },

        prefill: {
          email: JSON.parse(localStorage.getItem("data"))?.email || "",
        },

        handler: async function (response) {
          console.log("RAZORPAY RESPONSE:", response);

          const verifyRes = await dispatch(
            verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: subscription_id, // ✅ FIXED
              razorpay_signature: response.razorpay_signature,
            })
          );

          console.log("VERIFY RESPONSE:", verifyRes);

          if (verifyRes.payload?.success) {
            toast.success("Payment successful!");
            navigate("/");
          } else {
            toast.error("Payment verification failed");
          }

          setLoading(false);
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`px-6 py-2 rounded-lg ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
      >
        {loading ? "Processing..." : "Subscribe Now"}
      </button>
    </div>
  );
}

export default Checkout;