'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from './components/ThemeProvider';

import Link from 'next/link';
import { State, City } from 'country-state-city';


const categories = [
  { name: 'Criminal', icon: '⚖️' },
  { name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { name: 'Property', icon: '🏠' },
  { name: 'Corporate', icon: '🏢' },
  { name: 'Labour', icon: '👷' },
  { name: 'Cyber', icon: '💻' },
  { name: 'Consumer', icon: '🛒' },
  { name: 'Tax', icon: '💰' }
];


export default function CustomerLanding() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '',
    state: '',
    stateCode: '',
    city: '',
    issue: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const scrollToForm = (category = '') => {
    if (category) setFormData(prev => ({ ...prev, category }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          clientPhone: formData.phone,
          category: formData.category,
          state: formData.state,
          city: formData.city,
          issue: formData.issue
        })

      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', category: '', state: '', stateCode: '', city: '', issue: '' });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l9-4 9 4" /><path d="M3 6v8l9 4 9-4V6" /><path d="M12 10v10" /></svg>
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">NyayConnect</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--text-secondary)]">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#services" className="hover:text-indigo-600 transition-colors">Services</a>
            <Link href="/status" className="px-5 py-2.5 rounded-full border border-indigo-600/20 bg-indigo-600/5 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Check Status</Link>

          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-indigo-600 transition-all">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => scrollToForm()} className="hidden sm:block px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">Get Legal Help</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="/hero-bg.png" className="w-full h-full object-cover opacity-100 dark:opacity-60 scale-105 animate-[subtle-zoom_20s_infinite_alternate]" alt="Hero Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background)]/40 to-[var(--background)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 text-sm font-bold mb-8 animate-bounce-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Trusted by 5,000+ Clients Pan India
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Expert Legal Advice<br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Online, Instantly.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect with top verified advocates for a free initial callback. 
            Get the right legal direction from the comfort of your home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => scrollToForm()} className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-full text-lg font-black shadow-xl shadow-indigo-600/40 hover:-translate-y-1 transition-all">Get Legal Help Now</button>
            <Link href="/status" className="w-full sm:w-auto px-10 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur text-[var(--text-primary)] rounded-full text-lg font-bold hover:bg-[var(--input-bg)] transition-all">Track My Case</Link>

          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8 border-y border-indigo-600/10">
            {[
              { val: '200+', label: 'Verified Advocates' },
              { val: '5000+', label: 'Cases Handled' },
              { val: '98%', label: 'Success Rate' },
              { val: '24/7', label: 'Availability' }
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-black text-[var(--text-primary)]">{s.val}</div>
                <div className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[var(--input-bg)]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Simple Process</h2>
            <h3 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">How NyayConnect Works</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Submit Request', desc: 'Fill the quick form with your legal concern and city.' },
              { step: '02', title: 'Admin Assignment', desc: 'Our experts assign the best matching lawyer for your case.' },
              { step: '03', title: 'Pay & Chat', desc: 'Talk to your lawyer on phone for free, or pay for full online chat.' }
            ].map((s, i) => (
              <div key={s.step} className="relative group">
                <div className="absolute -top-10 -left-6 text-9xl font-black text-indigo-600/5 group-hover:text-indigo-600/10 transition-colors pointer-events-none">{s.step}</div>
                <div className="glass-card p-10 relative z-10 hover:-translate-y-2 transition-all h-full">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg shadow-indigo-600/30">{s.step}</div>
                  <h4 className="text-2xl font-black text-[var(--text-primary)] mb-4">{s.title}</h4>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="text-left">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Practice Areas</h2>
              <h3 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">Legal Solutions for Everyone</h3>
            </div>
            <button onClick={() => scrollToForm()} className="px-8 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] font-bold rounded-full hover:bg-indigo-600 hover:text-white transition-all">View All Services</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(c => (
              <button 
                key={c.name}
                onClick={() => scrollToForm(c.name)}
                className="glass-card p-8 flex flex-col items-center text-center group hover:bg-indigo-600 transition-all active:scale-95"
              >
                <div className="text-4xl mb-6 group-hover:scale-125 transition-transform">{c.icon}</div>
                <div className="text-lg font-black text-[var(--text-primary)] group-hover:text-white transition-colors">{c.name} Law</div>
                <div className="text-sm text-[var(--text-muted)] mt-2 group-hover:text-indigo-100 transition-colors">Consult an Expert</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="consultation-form" ref={formRef} className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl -ml-64 -mb-64"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass-card max-w-4xl mx-auto overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="md:w-5/12 bg-indigo-600 p-12 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black mb-6">Get Your Free Call Back</h3>
                <p className="text-indigo-100 leading-relaxed mb-10">
                  Fill in your details and our admin team will assign the perfect advocate for your specific legal requirement.
                </p>
                
                <div className="space-y-6">
                  {[
                    { t: 'Confidential', d: 'Your data is 100% secure with us.' },
                    { t: 'Verified Lawyers', d: 'Talk to bar-registered advocates.' },
                    { t: 'Quick Response', d: 'Callback within 15-30 minutes.' }
                  ].map(i => (
                    <div key={i.t} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs">✓</div>
                      <div>
                        <div className="font-bold">{i.t}</div>
                        <div className="text-sm text-white/70">{i.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Support Line</div>
                <div className="text-xl font-black">+91 1800-NYAY-GRID</div>
              </div>
            </div>

            <div className="md:w-7/12 p-12 bg-[var(--glass-bg)]">
              {submitted ? (
                <div className="text-center py-10 animate-fade-in">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg shadow-green-500/20">✓</div>
                  <h4 className="text-3xl font-black text-[var(--text-primary)] mb-4">Request Submitted!</h4>
                  <p className="text-[var(--text-secondary)] mb-8">Our team will assign an advocate and they will call you back on <span className="font-bold text-indigo-600">{formData.phone}</span> shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold hover:underline">Submit another request</button>
                  <Link href="/status" className="block mt-6 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold">Check My Case Status</Link>

                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="glass-input !bg-[var(--background)]"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+91 98765 43210"
                        className="glass-input !bg-[var(--background)]"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Legal Category *</label>
                      <select 
                        required
                        className="glass-select !bg-[var(--background)] w-full"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.name} value={c.name}>{c.name} Law</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">State *</label>
                      <select 
                        required
                        className="glass-select !bg-[var(--background)] w-full"
                        value={formData.stateCode}
                        onChange={(e) => {
                          const state = State.getStateByCodeAndCountry(e.target.value, 'IN');
                          setFormData({ ...formData, stateCode: e.target.value, state: state.name, city: '' });
                        }}
                      >
                        <option value="">Select State</option>
                        {State.getStatesOfCountry('IN').map(s => (
                          <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">City *</label>
                    <select 
                      required
                      className="glass-select !bg-[var(--background)] w-full"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!formData.stateCode}
                    >
                      <option value="">Select City</option>
                      {formData.stateCode && City.getCitiesOfState('IN', formData.stateCode).map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>



                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Describe Your Concern</label>
                    <textarea 
                      required
                      placeholder="Please briefly explain your legal issue..."
                      rows={4}
                      className="glass-input !bg-[var(--background)] resize-none"
                      value={formData.issue}
                      onChange={e => setFormData({...formData, issue: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Free Callback'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[var(--background)] border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 6l9-4 9 4" /><path d="M3 6v8l9 4 9-4V6" /></svg>
                </div>
                <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">NyayConnect</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Empowering citizens with accessible, high-quality legal advice across India.
              </p>
            </div>
            
            <div>
              <h5 className="font-black text-[var(--text-primary)] mb-8 uppercase tracking-widest text-sm">Services</h5>
              <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Criminal Defense</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Property Disputes</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Family & Divorce</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Corporate Legal</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-[var(--text-primary)] mb-8 uppercase tracking-widest text-sm">Company</h5>
              <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-[var(--text-primary)] mb-8 uppercase tracking-widest text-sm">Newsletter</h5>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="glass-input !text-sm" />
                <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">→</button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-[var(--text-muted)]">© 2026 NyayConnect. All rights reserved.</div>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'Instagram'].map(s => <a key={s} href="#" className="text-sm text-[var(--text-muted)] hover:text-indigo-600 transition-colors">{s}</a>)}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes subtle-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.1); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
