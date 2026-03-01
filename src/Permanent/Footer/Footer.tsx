import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-[#1F2937] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold">Jobito</h2>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed text-justify">
              We provide training programs in web and mobile development
              <br />
              to help you start and grow your career in tech
              <br />
              with practical skills and guidance for real projects.
            </p>

            {/* Social Media */}
            <div className="flex mt-6 space-x-4">
              <a
                href="#"
                aria-label="WhatsApp"
                className="w-12 h-12 rounded-full bg-dominant flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-green-600"
              >
                <FaWhatsapp size={24} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-12 h-12 rounded-full bg-dominant flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-blue-900"
              >
                <FaLinkedinIn size={24} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="w-12 h-12 rounded-full bg-dominant flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-blue-600"
              >
                <FaFacebookF size={24} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-12 h-12 rounded-full bg-dominant flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-gradient-to-tr hover:from-yellow-600 hover:via-pink-700 hover:to-purple-700"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Our Company */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-accen inline-block">
              Our Company
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li>Services</li>
              <li>Projects</li>
              <li>Courses & Training</li>
              <li>Events</li>
            </ul>
          </div>

          {/* Courses & Training */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-accen inline-block">
              Courses & Training
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li>Front-end Diploma & Training</li>
              <li>Back-end Diploma & Training</li>
              <li>Mobile Application Diploma & Training</li>
              <li>Full-stack Diploma & Training</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2026 jobito. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-accen text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-accen text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
