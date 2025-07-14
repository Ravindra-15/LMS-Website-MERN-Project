import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-10 border-t dark:border-t-gray-700">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left - Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Edemy</h2>
          <p className="text-sm">
            Edemy is your platform for learning and upskilling. Join us and explore a wide variety of educational content designed just for you.
          </p>
        </div>

        {/* Middle - Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact us</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy policy</Link>
            </li>
          </ul>
        </div>

        {/* Right - Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Connect with us</h3>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t mt-8 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Edemy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
