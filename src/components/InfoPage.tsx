import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, HelpCircle, Truck, RefreshCcw, ShieldCheck, FileText, Instagram, ArrowLeft } from 'lucide-react';

interface InfoPageProps {
  type: string;
  onBack?: () => void;
}

export const InfoPage = ({ type, onBack }: InfoPageProps) => {
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
                  <li>Express Delivery (Beirut only): $6.00 (Next day)</li>
                </ul>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-heading">Order Tracking</h3>
                <p className="text-charcoal/70 leading-relaxed">
                  Once your order is dispatched, you will receive a confirmation message via WhatsApp or SMS with your tracking details.
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
                  To initiate a return, please contact our support team via WhatsApp at +961 78 970 271 with your order number and reason for return.
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
                { q: "What payment methods do you accept?", a: "We currently accept Cash on Delivery (COD) and select digital payment methods in Lebanon." }
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
                  <input type="text" placeholder="Your Name" className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 focus:outline-none focus:border-rose-gold transition-colors" />
                  <input type="email" placeholder="Your Email" className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 focus:outline-none focus:border-rose-gold transition-colors" />
                  <textarea placeholder="How can we help?" rows={4} className="w-full px-6 py-4 rounded-xl bg-white border border-charcoal/5 focus:outline-none focus:border-rose-gold transition-colors resize-none"></textarea>
                  <button className="w-full py-4 bg-charcoal text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-rose-gold transition-all">Send Message</button>
                </div>
              </div>
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <ShieldCheck className="w-12 h-12 text-rose-gold" />,
          content: (
            <div className="space-y-6 text-charcoal/70 leading-relaxed">
              <p>At Seoul Aura, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
              <h3 className="text-xl font-heading text-charcoal pt-4">Data Collection</h3>
              <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team.</p>
              <h3 className="text-xl font-heading text-charcoal pt-4">Use of Information</h3>
              <p>Your data is used to process orders, improve our services, and communicate with you about your account or our latest K-beauty arrivals.</p>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FileText className="w-12 h-12 text-rose-gold" />,
          content: (
            <div className="space-y-6 text-charcoal/70 leading-relaxed">
              <p>By using Seoul Aura, you agree to the following terms and conditions. Please read them carefully.</p>
              <h3 className="text-xl font-heading text-charcoal pt-4">User Accounts</h3>
              <p>You are responsible for maintaining the confidentiality of your account and password. Seoul Aura reserves the right to refuse service or terminate accounts.</p>
              <h3 className="text-xl font-heading text-charcoal pt-4">Product Information</h3>
              <p>We strive to be as accurate as possible with product descriptions and images. However, we do not warrant that product descriptions are error-free.</p>
            </div>
          )
        };
      default:
        return { title: 'Information', icon: null, content: null };
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
    </div>
  );
};
