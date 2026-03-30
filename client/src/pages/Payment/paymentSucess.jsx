import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PaymentSuccess() {
  const navigate = useNavigate();

  const { isPaymentVerified } = useSelector((state) => state.payment);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] text-white">
      <div className="bg-[#111118] p-8 rounded-2xl shadow-xl text-center max-w-md w-full">

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-2xl font-bold">✓</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-400 mb-6">
          {isPaymentVerified
            ? "Your subscription is now active."
            : "Processing your payment..."}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400"
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate("/courses")}
            className="border border-gray-600 py-2 rounded-lg hover:bg-[#1a1a22]"
          >
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;