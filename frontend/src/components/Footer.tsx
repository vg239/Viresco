import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Virseeco</h3>
            <p className="text-gray-600">Sustainable investing for a better future</p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/learning" className="text-gray-600 hover:text-blue-600">Learning</Link></li>
              <li><Link to="/portfolio" className="text-gray-600 hover:text-blue-600">Portfolio</Link></li>
              <li><Link to="/watchlist" className="text-gray-600 hover:text-blue-600">Watchlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Discord</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">© 2024 Virseeco. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 