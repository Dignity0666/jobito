import MapComponent from "../../Subject to/MapContainer/MapContainer";
import { useState } from "react";
import "./Contact.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    website: "",
    message: "",
    preferredContact: "email",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({
      submitted: true,
      success: true,
      message: "Message sent successfully!",
    });
    // Add actual form submission logic here
  };

  const socialLinks = [
    { name: "Facebook", icon: "F", url: "#", color: "bg-blue-600" },
    { name: "Twitter", icon: "T", url: "#", color: "bg-sky-500" },
    { name: "Instagram", icon: "I", url: "#", color: "bg-pink-600" },
    { name: "LinkedIn", icon: "L", url: "#", color: "bg-blue-700" },
  ];

  const quickLinks = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about" },
    { title: "Services", path: "/services" },
    { title: "Individual Therapy", path: "/therapy/individual" },
    { title: "Couples Therapy", path: "/therapy/couples" },
    { title: "Family Counseling", path: "/therapy/family" },
    { title: "Group Counseling", path: "/therapy/group" },
    { title: "Resources", path: "/resources" },
    { title: "Blog", path: "/blog" },
    { title: "FAQs", path: "/faqs" },
  ];

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            We're here to listen and help. Reach out to us for any questions or
            support.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm">Typically replies within 1 hour</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Quick Contact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Happy Clients", value: "10K+", icon: "😊" },
              { label: "Sessions Done", value: "25K+", icon: "📊" },
              { label: "Expert Therapists", value: "50+", icon: "👥" },
              { label: "Years Experience", value: "15+", icon: "⭐" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <div className="text-2xl font-bold text-blue-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column - Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-blue-900 mb-4">
                    Send us a message
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Have a question or want to schedule a session? Fill out the
                    form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                {formStatus.submitted && formStatus.success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-3 animate-slide-down">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Preferred Contact Method */}
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <label className="block text-gray-700 font-medium mb-3">
                      Preferred contact method
                    </label>
                    <div className="flex gap-6">
                      {["email", "phone"].map((method) => (
                        <label
                          key={method}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="preferredContact"
                            value={method}
                            checked={formData.preferredContact === method}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-gray-700 font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-blue-400"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-gray-700 font-medium mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-blue-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-gray-700 font-medium mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-blue-400"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-gray-700 font-medium mb-2">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-blue-400"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl p-3.5 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-blue-400 resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      SEND MESSAGE
                    </button>
                    <span className="text-sm text-gray-500">
                      * Required fields
                    </span>
                  </div>
                </form>
              </div>
              <div className="relative h-[450px] w-full overflow-hidden MapComponent">
                <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg MapComponentTExt">
                  <p className="font-semibold text-gray-800">📍 Our Location</p>
                  <p className="text-sm text-gray-600">
                    123 Wellness Avenue, San Francisco
                  </p>
                </div>
                <MapComponent lat={29.9765} lng={31.1313} />
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-8">
              {/* Live Chat Card */}

              {/* Contact Information */}
              <div className="bg-white p-7 rounded-2xl shadow-xl border border-gray-100">
                <h4 className="text-2xl font-bold text-blue-900 mb-6">
                  Contact Information
                </h4>

                <div className="space-y-8">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 mb-1">Call Us</h5>
                      <p className="text-blue-600 font-semibold text-lg">
                        +1 (234) 567-890
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Mon-Fri: 9:00 AM - 9:00 PM
                      </p>
                      <p className="text-gray-500 text-sm">
                        Sat: 10:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 mb-1">Email Us</h5>
                      <p className="text-blue-600 font-semibold">
                        support@counseling.com
                      </p>
                      <p className="text-blue-600 font-semibold">
                        appointments@counseling.com
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        24/7 support available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 mb-1">Visit Us</h5>
                      <p className="text-gray-700">123 Wellness Avenue</p>
                      <p className="text-gray-700">
                        Suite 100, San Francisco, CA 94105
                      </p>
                      <button className="text-blue-600 text-sm font-semibold mt-2 hover:underline">
                        Get Directions →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h5 className="font-bold text-gray-900 mb-4">
                    Connect With Us
                  </h5>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className={`w-10 h-10 ${social.color} rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 text-white font-bold shadow-lg hover:shadow-xl`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-7 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Live Chat Support</h4>
                  <p className="text-blue-100 mb-4">
                    Chat with our team in real-time
                  </p>
                  <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                    Start Chat
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-7 rounded-2xl shadow-xl border border-gray-100">
                <h4 className="text-2xl font-bold text-blue-900 mb-6">
                  Quick Links
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.path}
                      className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-blue-600 rounded-full group-hover:w-2 transition-all"></span>
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter for mental health tips and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
