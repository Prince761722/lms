import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getRazorpayKey,
  buySubscription,
  verifyPayment,
} from "../../redux/slice/razorpaySlice";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true); // already loaded
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

  const handleCheckout = async () => {
    try {
      
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        return;
      }

    
      const keyRes = await dispatch(getRazorpayKey());
      const razorpayKey = keyRes.payload;

      
      const subRes = await dispatch(buySubscription());
      const subscription_id = subRes.payload.subscription_id;

      
      const options = {
        key: razorpayKey,
        subscription_id,
        name: "Your Platform",
        description: "Premium Subscription",
        theme: { color: "#3399cc" },
        handler: async function (response) {
          await dispatch(
            verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature, 
            })
          );
          toast.success("Payment successful!");
          navigate("/");
        },
        modal: {
          ondismiss: () => toast.error("Payment cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        Subscribe Now
      </button>
    </div>
  );
}

export default Checkout;