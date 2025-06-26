import { Link } from 'react-router';

const PaymentFailed = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4" data-theme={'light'}>
      <div className={`card w-full max-w-md bg-base-100 shadow-2xl transition-all duration-700 transform`}>
        <div className="card-body items-center text-center p-8">
          {/* Failed Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-error rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>

          {/* Failed Message */}
          <h1 className="text-3xl font-bold text-error mb-2">Payment Failed</h1>
          <p className="text-base-content/70 mb-6">
            We couldn't process your payment. Please check your payment details and try again.
          </p>

          {/* Error Details */}
          <div className="alert alert-error mb-6">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Transaction Declined</h3>
              <div className="text-xs">Error Code: CARD_DECLINED</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Link to='/premium-upgrade'>
              <button className="btn btn-primary w-full ">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Try Again
              </button>
            </Link>
            <Link to='/'>
              <button  className="btn btn-outline w-full ">Return to Home Page</button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );

export default PaymentFailed;