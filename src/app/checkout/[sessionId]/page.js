'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { sessionId } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('upi');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    fetch(`/api/consultations?id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setConsultation(data);
        setLoading(false);
      });
  }, [sessionId]);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, paymentMethod: method })
      });
      if (res.ok) {
        router.push(`/chat/${sessionId}`);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">Loading...</div>;
  if (!consultation) return <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">Case not found.</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/status" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 mb-8 hover:-translate-x-1 transition-all">

          ← Back to Status
        </Link>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Order Summary */}
          <div className="md:col-span-2 order-2 md:order-1">
            <h2 className="text-xl font-black text-[var(--text-primary)] mb-6">Order Summary</h2>
            <div className="glass-card p-8 bg-indigo-600 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Advocate Assigned</div>
              <div className="text-2xl font-black mb-1">{consultation.lawyerName}</div>
              <div className="text-sm text-white/80 mb-8">{consultation.category} Specialist</div>
              
              <div className="space-y-4 pt-6 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Consultation Fee</span>
                  <span className="font-bold">₹{consultation.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Platform Fee</span>
                  <span className="font-bold">₹0 (Waived)</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span>Total Amount</span>
                  <span>₹{consultation.fee}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 glass-card border-l-4 border-l-green-500">
              <div className="text-sm font-bold text-[var(--text-primary)] mb-1">Secure Transaction</div>
              <p className="text-xs text-[var(--text-secondary)]">Your payment is processed through a secure 256-bit encrypted gateway.</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="md:col-span-3 order-1 md:order-2">
            <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Checkout</h1>
            <p className="text-[var(--text-secondary)] mb-10">Select your preferred payment method to start your session.</p>

            <div className="glass-card p-8">
              <div className="flex gap-4 mb-8">
                {['upi', 'card', 'netbanking'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm uppercase tracking-widest ${method === m ? 'border-indigo-600 bg-indigo-600/5 text-indigo-600' : 'border-[var(--glass-border)] text-[var(--text-muted)]'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {method === 'upi' && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="block text-xs font-black uppercase text-[var(--text-muted)]">Enter VPA / UPI ID</label>
                    <input type="text" placeholder="username@upi" className="glass-input" />
                    <div className="grid grid-cols-4 gap-4 opacity-50 grayscale">
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                )}

                {method === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <input type="text" placeholder="Card Number" className="glass-input" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="glass-input" />
                      <input type="password" placeholder="CVV" className="glass-input" />
                    </div>
                  </div>
                )}

                {method === 'netbanking' && (
                  <div className="space-y-4 animate-fade-in">
                    <select className="glass-select w-full">
                      <option>Select Bank</option>
                      <option>HDFC Bank</option>
                      <option>SBI</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                )}

                <div className="pt-8">
                  <button 
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
                  >
                    {isPaying ? 'Processing...' : `Pay ₹${consultation.fee} & Start Chat`}
                  </button>
                  <p className="text-center text-[var(--text-muted)] text-xs mt-6">
                    By clicking above, you agree to our Terms & Conditions for online consultations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
