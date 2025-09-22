"use client";

import { FaShippingFast, FaShieldAlt, FaHeadset } from "react-icons/fa";

export default function WhyChooseUs() {
  return (
    <section className="bg-beige py-6 px-6 text-olive">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-olive">
            Why Choose LevoMart
          </h2>
          <div className="w-32 h-1 bg-olive/40 mx-auto rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="group text-center p-8 bg-beige/30 rounded-3xl hover:bg-beige/50 transition-all duration-300 hover:scale-105">
            <div className="w-20 h-20 bg-olive/15 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:bg-olive/25 transition-colors">
              <FaShippingFast className="text-3xl text-olive" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-olive">
              Free Shipping
            </h3>
            <p className="text-olive/70 text-lg leading-relaxed">
              Enjoy fast & free shipping on all orders across India.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group text-center p-8 bg-beige/30 rounded-3xl hover:bg-beige/50 transition-all duration-300 hover:scale-105">
            <div className="w-20 h-20 bg-olive/15 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:bg-olive/25 transition-colors">
              <FaShieldAlt className="text-3xl text-olive" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-olive">
              Secure Payments
            </h3>
            <p className="text-olive/70 text-lg leading-relaxed">
              Your transactions are protected with end-to-end encryption.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group text-center p-8 bg-beige/30 rounded-3xl hover:bg-beige/50 transition-all duration-300 hover:scale-105">
            <div className="w-20 h-20 bg-olive/15 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:bg-olive/25 transition-colors">
              <FaHeadset className="text-3xl text-olive" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-olive">24/7 Support</h3>
            <p className="text-olive/70 text-lg leading-relaxed">
              Need help? Our team is here for you round the clock.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
