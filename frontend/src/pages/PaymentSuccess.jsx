import { Link, useLocation } from "react-router";

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const planName = query.get("plan");
  const amount = planName === "annual" ? "$ 99.99" : "$ 9.99";
  const planDisplay =
    planName === "annual" ? "Convofy Elite Annual Plan" : "Convofy Pro Monthly Premium Plan";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4"
      data-theme={"light"}
    >
      <div
        className={`card w-full max-w-md bg-base-100 shadow-2xl transition-all duration-700 transform `}
      >
        <div className="card-body items-center text-center p-8">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-success mb-2">
            Payment Successful!
          </h1>
          <p className="text-base-content/70 mb-6">
            Thank you for your purchase. Your transaction has been completed
            successfully.
          </p>

          {/* Payment Details */}
          <div className="bg-base-200 rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-base-content/60">Plan</span>
              <span className="font-semibold">{planDisplay}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-base-content/60">Amount</span>
              <span className="font-semibold text-success">{amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/60">Date</span>
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Link to="/">
              <button className="btn btn-success w-full">
                Return to Home Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;
