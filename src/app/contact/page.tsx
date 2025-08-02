import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Contact Us
          </h1>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            We&apos;d love to hear from you! Whether you have questions about our products, need help with your order, or just want to share feedback, we&apos;re here to help.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Send us a Message
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="order">Order Support</option>
                    <option value="partnership">Partnership/Collaboration</option>
                    <option value="feedback">Feedback/Suggestion</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed transition-colors duration-300"
                >
                  Send Message (Coming Soon)
                </button>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    📧 <strong>Note:</strong> The contact form is not yet functional. For now, please email us directly at <a href="mailto:contact@wtfearthdiscovers.com" className="font-medium underline">contact@wtfearthdiscovers.com</a>
                  </p>
                </div>
                
                <p className="text-sm text-gray-600">
                  * Required fields. We typically respond within 24-48 hours.
                </p>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📧 Email Us
                  </h3>
                  <p className="text-gray-700 mb-2">
                    For general inquiries and support:
                  </p>
                  <a
                    href="mailto:contact@wtfearthdiscovers.com"
                    className="text-black font-medium hover:underline"
                  >
                    contact@wtfearthdiscovers.com
                  </a>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    ⏰ Response Time
                  </h3>
                  <p className="text-gray-700">
                    We aim to respond to all inquiries within 24-48 hours during business days (Monday-Friday).
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🌍 Follow Us
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Stay updated with our latest finds and discoveries:
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-black transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-black transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.8L4.27 17.94l-1.02-1.02l1.752-1.164c-.73-1.297-.73-2.9 0-4.197L3.25 10.395l1.02-1.02l1.164 1.752c.568-1.07 1.719-1.8 3.016-1.8s2.448.73 3.016 1.8l1.164-1.752l1.02 1.02l-1.752 1.164c.73 1.297.73 2.9 0 4.197l1.752 1.164l-1.02 1.02l-1.164-1.752c-.568 1.07-1.719 1.8-3.016 1.8z"/>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-black transition-colors"
                      aria-label="TikTok"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    💡 Quick Tips
                  </h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Include as much detail as possible in your message
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      Check your spam folder if you don&apos;t hear back from us
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      For urgent matters, mention &quot;URGENT&quot; in your subject line
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How do I find specific products?
                </h3>
                <p className="text-gray-700 text-sm">
                  Use our category filters and search functionality on the main page. You can also bookmark your favorite items for easy access later.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Are the prices shown final?
                </h3>
                <p className="text-gray-700 text-sm">
                  Prices are sourced from various retailers and may change. Always check the final price on the retailer&apos;s website before purchasing.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Do you sell products directly?
                </h3>
                <p className="text-gray-700 text-sm">
                  No, we&apos;re a discovery platform. We help you find amazing products and direct you to trusted retailers where you can make purchases.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How can I suggest a product?
                </h3>
                <p className="text-gray-700 text-sm">
                  We love product suggestions! Use the contact form above with &quot;Product Question&quot; as the subject and tell us about the amazing find you&apos;d like to see featured.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}