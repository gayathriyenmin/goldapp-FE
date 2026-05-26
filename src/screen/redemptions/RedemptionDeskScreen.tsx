import React, { useState } from 'react';
import { QrCode, Search, CheckCircle2, AlertCircle, Loader2, KeyRound, Check } from 'lucide-react';
import { redemptionService } from '../../store/services';

export const RedemptionDeskScreen: React.FC = () => {
  const [requestId, setRequestId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for the flow
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Scan, 2: Verify Scheme, 3: OTP, 4: Success
  const [schemeData, setSchemeData] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await redemptionService.scanRequest(requestId);
      if (response.data.data) {
        setSchemeData(response.data.data);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to scan request ID');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerOtp = async () => {
    setIsLoading(true);
    try {
      const response = await redemptionService.triggerOtp(requestId);
      // Automatically proceed to OTP entry step
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to trigger OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    
    setIsLoading(true);
    setOtpError(null);

    try {
      await redemptionService.verifyOtp(requestId, otp);
      setStep(4);
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setRequestId('');
    setSchemeData(null);
    setOtp('');
    setError(null);
    setOtpError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Showroom Redemption Desk</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Scan customer QR codes to verify and complete gold scheme maturities.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className={`absolute left-0 top-1/2 h-1 bg-yellow-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[
            { num: 1, label: 'Scan QR' },
            { num: 2, label: 'Verify' },
            { num: 3, label: 'OTP' },
            { num: 4, label: 'Redeem' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s.num ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }`}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Scan/Enter Request ID */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center transition-all">
            <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Scan Customer Pass</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Use a barcode scanner to scan the customer's redemption pass, or enter the Request ID manually.</p>
            
            <form onSubmit={handleScan} className="max-w-md mx-auto">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="e.g. REQ-GLD-12345"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value.toUpperCase())}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent uppercase font-mono text-center tracking-wider text-lg"
                  autoFocus
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm justify-center mb-4 bg-red-50 dark:bg-red-500/10 py-2 px-3 rounded-lg">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading || !requestId.trim()}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Look Up Request'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Verify Scheme Details */}
        {step === 2 && schemeData && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Verify Customer Details</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{schemeData.customer?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{schemeData.customer?.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scheme ID</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">{schemeData.schemeNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Accumulated Gold</p>
                <p className="text-xl font-bold text-yellow-500">{Number(schemeData.totalGrams).toFixed(3)}g</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount Paid</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{Number(schemeData.totalPaidAmount).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex gap-3 mb-8">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-400">Please physically verify the customer's ID against the details shown above before triggering the OTP.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-4 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerOtp}
                disabled={isLoading}
                className="flex-[2] bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify ID & Trigger OTP'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter OTP */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center transition-all">
            <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enter Verification OTP</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">An OTP has been sent to the customer's registered mobile number.</p>

            <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto">
              <input
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center text-3xl font-bold tracking-[1em] mb-4"
                autoFocus
              />
              
              {otpError && (
                <div className="text-red-500 text-sm font-medium mb-4">{otpError}</div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 mb-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Redemption'}
              </button>
              
              <button
                type="button"
                onClick={handleTriggerOtp}
                disabled={isLoading}
                className="text-yellow-600 dark:text-yellow-500 text-sm font-medium hover:underline"
              >
                Resend OTP
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center transition-all relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-500/10 to-transparent"></div>
            
            <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">Redemption Successful!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto relative z-10">
              The scheme has been successfully redeemed and marked as closed in the system. Proceed to hand over the gold.
            </p>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8 text-left inline-block w-full max-w-sm relative z-10">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Gold Handed Over:</p>
              <p className="text-3xl font-bold text-yellow-500">{Number(schemeData?.totalGrams).toFixed(3)}g</p>
            </div>

            <button
              onClick={resetFlow}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium py-3 px-8 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors relative z-10"
            >
              Start New Redemption
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
