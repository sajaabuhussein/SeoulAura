import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, HelpCircle, Truck, RefreshCcw, ShieldCheck, FileText, Instagram, ArrowLeft, Heart, Sparkles, X, Loader2 } from 'lucide-react';

interface InfoPageProps {
  type: string;
  onBack?: () => void;
}

export const InfoPage = ({ type, onBack }: InfoPageProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    try {
      // Using Formspree to send the email directly without opening the email client
      // Note: Formspree will send a confirmation email to jikuxn9@gmail.com on the first submission
      const response = await fetch('https://formspree.io/f/jikuxn9@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Message from ${formData.name} (Seoul Aura)`
        })
      });

      if (response.ok) {
        setShowPopup(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Fallback to mailto if Formspree fails for some reason
        const subject = encodeURIComponent(`Seoul Aura Message from ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        window.location.href = `mailto:jikuxn9@gmail.com?subject=${subject}&body=${body}`;
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to mailto on network error
      const subject = encodeURIComponent(`Seoul Aura Message from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:jikuxn9@gmail.com?subject=${subject}&body=${body}`;
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContent = () => {
    switch (type) {
      case 'shipping':
        return {
          title: 'Shipping Policy',
          icon: <Truck className="w-12 h-12 text-rose-gold" />,
          content: (
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xl font-heading">Domestic Shipping (Lebanon)</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  We offer reliable delivery across all regions of Lebanon. Orders are typically processed within 24 hours and delivered within 2-4 business days.
                </p>
                <ul className="list-disc list-inside text-charcoal/70 space-y-2 ml-4">
                  <li>Standard Delivery: $3.00 (Free on orders over $50)</li>
                  <li>Express Delivery (Beirut & South Lebanon): $6.00 (Next day)</li>
                </ul>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-heading">Order Tracking</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  Once your order is dispatched, you will receive a confirmation message via WhatsApp or Instagram.
                </p>
              </section>
            </div>
          )
        };
      case 'returns':
        return {
          title: 'Returns & Exchanges',
          icon: <RefreshCcw className="w-12 h-12 text-rose-gold" />,
          content: (
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xl font-heading">Our Return Policy</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  Due to the nature of skincare products, we can only accept returns for items that are unopened, unused, and in their original packaging within 7 days of delivery.
                </p>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-heading">How to Return</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  To initiate a return, please contact our support team via Instagram with your order number and reason for return.
                </p>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-heading">Damaged Items</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  If you receive a damaged or incorrect item, please notify us within 48 hours of receipt for a free replacement or full refund.
                </p>
              </section>
            </div>
          )
        };
      case 'faqs':
        return {
          title: 'Frequently Asked Questions',
          icon: <HelpCircle className="w-12 h-12 text-rose-gold" />,
          content: (
            <div className="space-y-8">
              {[
                { q: "Are your products authentic?", a: "Yes, 100%. We source all our products directly from authorized distributors in South Korea to ensure authenticity and freshness." },
                { q: "How do I know which products are right for me?", a: "We recommend taking our Skin Analysis Quiz on the home page! It's designed to help you find the perfect routine for your specific skin type." },
                { q: "Do you offer consultations?", a: "Yes! You can message us on Instagram @seoulauraofficial for a personalized skincare consultation with our experts." },
                { q: "What payment methods do you accept?", a: "We currently accept Cash on Delivery (COD) only." }
              ].map((faq, i) => (
                <div key={i} className="glass p-6 rounded-2xl space-y-3">
                  <h3 className="font-heading text-lg text-charcoal">{faq.q}</h3>
                  <p className="text-charcoal/70 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )
        };
      case 'contact':
        return {
          title: 'Contact Us',
          icon: <Mail className="w-12 h-12 text-rose-gold" />,
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <p className="text-charcoal/70 leading-relaxed">
                  Have a question or need skincare advice? We're here to help you glow! Reach out to us through any of the following channels:
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-soft-lavender/30 flex items-center justify-center text-rose-gold">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">WhatsApp</p>
                      <p className="font-medium">+961 78 970 271</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-soft-lavender/30 flex items-center justify-center text-rose-gold">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Instagram</p>
                      <p className="font-medium">@seoulauraofficial</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-soft-lavender/30 flex items-center justify-center text-rose-gold">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Location</p>
                      <p className="font-medium">NBC-LEBANON</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass p-8 rounded-[2rem] space-y-6">
                <h3 className="text-xl font-heading">Send us a message</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 focus:outline-none focus:border-rose-gold transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 focus:outline-none focus:border-rose-gold transition-colors"
                  />
                  <textarea
                    placeholder="How can we help?"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 focus:outline-none focus:border-rose-gold transition-colors resize-none"
                  ></textarea>
                  <button
                    onClick={handleSend}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-charcoal text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-rose-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        };

    }
  };

  const { title, icon, content } = getContent();

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <div className="text-center space-y-6">
          <div className="flex justify-center">{icon}</div>
          <h1 className="text-5xl md:text-6xl font-heading">{title}</h1>
          <div className="h-px w-24 bg-rose-gold/20 mx-auto" />
        </div>
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-charcoal/5">
          {content}
        </div>
      </motion.div>

      {/* Cute Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-charcoal/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-cream-white/90 backdrop-blur-xl border border-rose-gold/20 p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center space-y-6 overflow-hidden"
            >
              {/* Decorative Sparkles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 opacity-10"
              >
                <Sparkles className="w-32 h-32 text-rose-gold" />
              </motion.div>

              <div className="relative">
                <div className="w-20 h-20 bg-rose-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-rose-gold fill-rose-gold/20" />
                </div>
                <h3 className="text-2xl font-heading text-charcoal">Message Sent!</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed mt-4">
                  Thank you for reaching out! <br />
                  We'll get back to you soon to help you glow. ✨
                </p>
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-4 bg-charcoal text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-rose-gold transition-all shadow-lg shadow-charcoal/10"
              >
                Got it, thanks!
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 text-charcoal/20 hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
