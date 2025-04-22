import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  
    const navigate = useNavigate()
  useEffect(() => {
    // Scroll animation
    const revealOnScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    };
    window.addEventListener('scroll', revealOnScroll);
    // Trigger initial reveal
    revealOnScroll();
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);


  return (
    <div className="overflow-x-hidden mx-4">
      {/* Hero Section */}
      <section className="relative text-white text-center py-40 overflow-hidden" 
               style={{background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/api/placeholder/1200/600") center/cover no-repeat'}}>
        <div className="absolute top-0 left-0 w-full h-full opacity-30" 
             style={{background: 'radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(0, 0, 0, 0) 70%)'}}></div>
        
        {/* Solar System Animation */}
        <div className="absolute top-20 right-12 w-24 h-24 opacity-50">
          <div className="absolute w-8 h-8 bg-yellow-500 rounded-full top-8 left-8 shadow-lg animate-pulse"></div>
          <div className="absolute top-2 left-2 w-20 h-20 border border-dashed border-white  rounded-full animate-spin" style={{animationDuration: '10s'}}>
            <div className="absolute -top-1 left-10 w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Lightning Animation */}
        <button className="absolute top-5 right-10 bg-green-500 text-white px-4 py-2 rounded" onClick={()=> navigate("/employee-login")}>Login</button>
        <button className="absolute top-5 right-30 bg-green-500 text-white px-4 py-2 rounded">Signup</button>

        <div className="absolute top-24 left-24 text-yellow-500 text-4xl opacity-0 animate-pulse">⚡</div>
        
        {/* Battery Animation */}
        <div className="absolute bottom-12 left-12 w-16 h-8 bg-white bg-opacity-20 rounded">
          <div className="absolute top-1 left-1 h-6 bg-green-500 animate-pulse" style={{width: '80%'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <h1 className="text-5xl mb-5 opacity-0 animate-fadeIn">Powering the Future with Renewable Energy</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-0 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Premium solar panels, inverters, and battery solutions for residential and commercial applications
          </p>
          <a href="#contact" className="inline-block bg-green-500 text-white px-8 py-3 rounded font-bold 
                                     hover:bg-green-700 transform hover:-translate-y-1 hover:shadow-lg transition-all
                                     opacity-0 animate-fadeIn animate-pulse" style={{animationDelay: '0.4s'}}>
            Get Free Consultation
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-16 relative reveal">
            Why Choose Our Solutions
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-500 -mb-4"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center transform hover:-translate-y-4 hover:shadow-xl transition-all reveal">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl text-green-500
                          transform transition-all hover:bg-green-500 hover:text-white hover:rotate-y-180">
                ★
              </div>
              <h3 className="text-xl text-green-500 mb-4">Premium Quality</h3>
              <p className="text-gray-700">All our products come with industry-leading warranties and are built to last for decades.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center transform hover:-translate-y-4 hover:shadow-xl transition-all reveal"
                 style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl text-green-500
                          transform transition-all hover:bg-green-500 hover:text-white hover:rotate-y-180">
                💰
              </div>
              <h3 className="text-xl text-green-500 mb-4">Save Money</h3>
              <p className="text-gray-700">Reduce your electricity bills by up to 70% and enjoy government incentives and rebates.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center transform hover:-translate-y-4 hover:shadow-xl transition-all reveal"
                 style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl text-green-500
                          transform transition-all hover:bg-green-500 hover:text-white hover:rotate-y-180">
                🌍
              </div>
              <h3 className="text-xl text-green-500 mb-4">Eco-Friendly</h3>
              <p className="text-gray-700">Reduce your carbon footprint and contribute to a cleaner, greener planet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-blue-50 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-16 relative reveal">
            Our Products
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-500 -mb-4"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md transform hover:-translate-y-2 hover:shadow-xl transition-all reveal opacity-0 animate-slideInLeft">
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <img src="/api/placeholder/300/200" alt="Solar Panels" className="w-full h-full transition-all hover:scale-110" />
              </div>
              <div className="p-5 relative">
                <h3 className="text-xl text-gray-800 mb-2">Solar Panels</h3>
                <p className="text-gray-700">High-efficiency monocrystalline and polycrystalline panels with 25+ years warranty.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md transform hover:-translate-y-2 hover:shadow-xl transition-all reveal opacity-0 animate-slideInUp"
                 style={{animationDelay: '0.2s'}}>
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <img src="/api/placeholder/300/200" alt="Inverters" className="w-full h-full transition-all hover:scale-110" />
              </div>
              <div className="p-5 relative">
                <h3 className="text-xl text-gray-800 mb-2">Grid-Tie Inverters</h3>
                <p className="text-gray-700">Smart inverters with Wi-Fi connectivity and real-time monitoring capabilities.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md transform hover:-translate-y-2 hover:shadow-xl transition-all reveal opacity-0 animate-slideInRight"
                 style={{animationDelay: '0.4s'}}>
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <img src="/api/placeholder/300/200" alt="Battery Storage" className="w-full h-full transition-all hover:scale-110" />
              </div>
              <div className="p-5 relative">
                <h3 className="text-xl text-gray-800 mb-2">Battery Storage</h3>
                <p className="text-gray-700">Lithium-ion battery systems for energy storage and backup power solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-16 relative reveal">
            What Our Customers Say
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-500 -mb-4"></span>
          </h2>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-md text-center transform hover:-translate-y-1 hover:shadow-xl transition-all reveal animate-float">
            <p className="text-lg italic mb-5 relative">
              "We installed the complete solar system with battery backup last year. Our electricity bills have dropped by almost 80%, and we have power even during grid outages. The team was professional and the installation was flawless."
            </p>
            <p className="font-bold text-green-500">- Michael Johnson, Homeowner</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center text-white relative overflow-hidden" 
               style={{background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url("/api/placeholder/1200/400") center/cover no-repeat'}}>
        <div className="absolute top-0 left-0 w-full h-full opacity-0 animate-pulse" 
             style={{
               background: 'radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
               animationDuration: '8s'
             }}></div>
             
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl mb-5 reveal opacity-0 animate-fadeIn">Ready to Switch to Clean Energy?</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8 reveal opacity-0 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Our experts will help you design the perfect solar system tailored to your energy needs and budget.
          </p>
          <a href="#contact" className="inline-block bg-green-500 text-white px-8 py-3 rounded font-bold 
                                     hover:bg-green-700 transform hover:-translate-y-1 hover:shadow-lg transition-all
                                     reveal opacity-0 animate-fadeIn animate-pulse" style={{animationDelay: '0.4s'}}>
            Contact Us Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-4 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="opacity-0 animate-slideInLeft">
              <h3 className="text-xl mb-6 relative text-green-500">
                SolarPower Solutions
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-green-500 -mb-2"></span>
              </h3>
              <p>Your trusted partner for renewable energy solutions since 2010.</p>
            </div>
            
            <div className="opacity-0 animate-slideInLeft" style={{animationDelay: '0.2s'}}>
              <h3 className="text-xl mb-6 relative text-green-500">
                Products
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-green-500 -mb-2"></span>
              </h3>
              <ul>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">Solar Panels</a>
                </li>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">Inverters</a>
                </li>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">Battery Systems</a>
                </li>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">Monitoring Solutions</a>
                </li>
              </ul>
            </div>
            
            <div className="opacity-0 animate-slideInLeft" style={{animationDelay: '0.4s'}}>
              <h3 className="text-xl mb-6 relative text-green-500">
                Services
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-green-500 -mb-2"></span>
              </h3>
              <ul>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">Free Consultation</a>
                </li>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">System Design</a>
                </li>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">Installation</a>
                </li>
                <li className="mb-2 pl-4 relative hover:pl-5 transition-all">
                  <span className="absolute left-0 text-green-500">→</span>
                  <a href="#" className="text-gray-300 hover:text-green-500 transition-all">Maintenance</a>
                </li>
              </ul>
            </div>
            
            <div className="opacity-0 animate-slideInLeft" style={{animationDelay: '0.6s'}}>
              <h3 className="text-xl mb-6 relative text-green-500">
                Contact Us
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-green-500 -mb-2"></span>
              </h3>
              <ul>
                <li className="mb-2 pl-4 relative">
                  <span className="absolute left-0 text-green-500">→</span>
                  Email: info@solarpowersolutions.com
                </li>
                <li className="mb-2 pl-4 relative">
                  <span className="absolute left-0 text-green-500">→</span>
                  Phone: (555) 123-4567
                </li>
                <li className="mb-2 pl-4 relative">
                  <span className="absolute left-0 text-green-500">→</span>
                  Address: 123 Green Energy St, Solar City
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-gray-700 opacity-0 animate-fadeIn" style={{animationDelay: '0.8s'}}>
            <p>&copy; 2025 SolarPower Solutions. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;