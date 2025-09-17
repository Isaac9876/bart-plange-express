import React, { useState, useEffect, useRef } from 'react';
import { FaTruck, FaBoxOpen, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowRight, FaSun, FaMoon, FaShippingFast, FaGlobe, FaClock, FaUsers, FaStar, FaComments, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import ceoImage from './assets/ceo.jpg';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { emailConfig } from './config/emailConfig';

// Testimonials data
  const testimonials = [
    {
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    review: 'Bart Plange Express delivered my package on time and with a smile. Highly recommended!',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    review: 'Excellent service and great customer support. I will use them again!',
    rating: 5
  },
  {
    name: 'Emily Chen',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    review: 'Fast, reliable, and affordable. The best delivery company in Ghana!',
    rating: 5
  },
  {
    name: 'David Thompson',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    review: 'My international shipment arrived earlier than expected. Thank you!',
    rating: 5
  },
];

function AnimatedCounter({ to, duration = 2, className }) {
  const ref = useRef();
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = to;
      const increment = Math.ceil(end / (duration * 60));
      const step = () => {
        start += increment;
        if (start >= end) {
          setCount(end);
    } else {
          setCount(start);
          requestAnimationFrame(step);
        }
      };
      step();
    }
  }, [isInView, to, duration]);
  return <span ref={ref} className={className}>{count.toLocaleString()}</span>;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi! How can we help you today at Bart Plange Express?' }
  ]);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [tourForm, setTourForm] = useState({ name: '', email: '', details: '' });
  const [tourFormSent, setTourFormSent] = useState(false);

  // Add categories for filtering
  const tourCategories = [
    'All', 'Europe', 'Africa', 'Asia', 'Beach', 'Adventure', 'City', 'Nature'
  ];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Expanded tour packages with price and duration
  const tourPackages = [
    {
      title: 'Paris City Lights',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      description: 'Experience the romance of Paris with guided tours of the Eiffel Tower, Louvre, and charming cafes.',
      category: ['Europe'],
      featured: true,
      price: '$1,499',
      duration: '5 days, 4 nights',
      details: 'Includes flights, hotel, city tours, and Seine river cruise.'
    },
    {
      title: 'Rome Ancient Wonders',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80',
      description: 'Discover the Colosseum, Roman Forum, and Vatican City on this unforgettable journey through Rome.',
      category: ['Europe'],
      price: '$1,399',
      duration: '6 days, 5 nights',
      details: 'Includes flights, hotel, guided tours, and Vatican entry.'
    },
    {
      title: 'London Royal Adventure',
      image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=600&q=80',
      description: 'See Buckingham Palace, the London Eye, and explore the vibrant culture of the UK’s capital.',
      category: ['Europe'],
      price: '$1,299',
      duration: '4 days, 3 nights',
      details: 'Includes flights, hotel, city pass, and Thames cruise.'
    },
    {
      title: 'Barcelona Beach & Art',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      description: 'Enjoy the beaches, Gaudí’s architecture, and delicious cuisine in sunny Barcelona.',
      category: ['Europe', 'Beach'],
      price: '$1,299',
      duration: '5 days, 4 nights',
      details: 'Includes flights, hotel, Sagrada Familia tour, and tapas night.'
    },
    {
      title: 'Dubai Desert Safari',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
      description: 'Thrilling desert safari, luxury shopping, and the world’s tallest building.',
      category: ['Asia', 'Adventure'],
      featured: true,
      price: '$1,599',
      duration: '5 days, 4 nights',
      details: 'Includes flights, hotel, desert safari, and Burj Khalifa entry.'
    },
    {
      title: 'Cape Town Explorer',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      description: 'Table Mountain, Robben Island, and stunning beaches await in South Africa.',
      category: ['Africa', 'Beach', 'Nature'],
      price: '$1,399',
      duration: '6 days, 5 nights',
      details: 'Includes flights, hotel, Cape Peninsula tour, and wine tasting.'
    },
    {
      title: 'Zanzibar Paradise',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      description: 'Relax on white-sand beaches and explore Stone Town’s rich history.',
      category: ['Africa', 'Beach'],
      price: '$1,199',
      duration: '5 days, 4 nights',
      details: 'Includes flights, hotel, spice tour, and dhow cruise.'
    },
    {
      title: 'Santorini Dream',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
      description: 'Iconic blue domes, sunsets, and luxury in the Greek islands.',
      category: ['Europe', 'Beach', 'Nature'],
      price: '$1,499',
      duration: '5 days, 4 nights',
      details: 'Includes flights, hotel, volcano tour, and wine tasting.'
    },
    {
      title: 'Singapore City Break',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      description: 'Gardens by the Bay, Marina Bay Sands, and vibrant street food.',
      category: ['Asia', 'City'],
      price: '$1,299',
      duration: '4 days, 3 nights',
      details: 'Includes flights, hotel, city tour, and Sentosa Island.'
    },
    {
      title: 'New York City Lights',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80',
      description: 'Times Square, Central Park, and Broadway shows in the Big Apple.',
      category: ['City', 'Adventure'],
      price: '$1,699',
      duration: '5 days, 4 nights',
      details: 'Includes flights, hotel, city pass, and Broadway ticket.'
    },
  ];

  // Filtered tours
  const filteredTours = selectedCategory === 'All'
    ? tourPackages
    : tourPackages.filter(tour => tour.category.includes(selectedCategory));

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Placeholder for tracking and quote forms
  const [trackingNumber, setTrackingNumber] = useState('');
  const [quoteData, setQuoteData] = useState({ name: '', email: '', details: '' });
  const [quoteSent, setQuoteSent] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingResult, setTrackingResult] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [showQuoteSuccess, setShowQuoteSuccess] = useState(false);
  const navRef = useRef(null);

  // Contact form state
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess(false);
    try {
      await emailjs.send(
        emailConfig.serviceID,
        emailConfig.templateID,
        {
          name: contactData.name,
          email: contactData.email,
          message: contactData.message,
        },
        emailConfig.publicKey
      );
      setContactSuccess(true);
    } catch (error) {
      // Optionally handle error
    }
    setContactLoading(false);
    setContactData({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 2500);
  };

  useEffect(() => {
    emailjs.init(emailConfig.publicKey);
  }, []);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((msgs) => [...msgs, { from: 'user', text: chatInput }]);
    setChatInput('');
    try {
      await emailjs.send(
        emailConfig.serviceID,
        emailConfig.templateID,
        {
          to_email: 'ebenezerbartplange12@gmail.com',
          from_name: 'Chat User',
          from_email: '',
          message: chatInput,
        },
        emailConfig.publicKey
      );
    } catch (error) {
      // handle error (optional)
    }
    setTimeout(() => {
      setChatMessages((msgs) => [...msgs, { from: 'bot', text: 'Thank you for your message! Our team will get back to you soon.' }]);
    }, 1000);
  };

  const openTourModal = (tour) => {
    setSelectedTour(tour);
    setTourModalOpen(true);
    setTourForm({ name: '', email: '', details: '' });
    setTourFormSent(false);
  };
  const handleTourFormChange = (e) => {
    setTourForm({ ...tourForm, [e.target.name]: e.target.value });
  };
  const handleTourFormSubmit = async (e) => {
    e.preventDefault();
    setTourFormSent(false);
    try {
      await emailjs.send(
        emailConfig.serviceID,
        emailConfig.templateID,
        {
          name: tourForm.name,
          email: tourForm.email,
          message: `Tour: ${selectedTour?.title}\n${tourForm.details}`,
        },
        emailConfig.publicKey
      );
      setTourFormSent(true);
    } catch (error) {
      // handle error (optional)
    }
    setTimeout(() => setTourModalOpen(false), 2000);
  };

  // Animate nav bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 10) {
          navRef.current.classList.add('shadow-lg', 'backdrop-blur-lg');
        } else {
          navRef.current.classList.remove('shadow-lg', 'backdrop-blur-lg');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll for nav links
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
      setIsMobileMenuOpen(false);
  };

  const handleTrack = () => {
    if (trackingNumber === 'RTM 992-376-7730') {
      setTrackingLoading(true);
      setShowTrackingModal(true);
      setTimeout(() => {
        setTrackingResult(`Tracking Number: ${trackingNumber}\nStatus: In Transit\nExpected Delivery: Tomorrow`);
        setTrackingLoading(false);
      }, 1500);
    } else {
      setTrackingLoading(true);
      setShowTrackingModal(true);
      setTimeout(() => {
        setTrackingResult(`Invalid tracking number. Please enter a valid tracking number`);
        setTrackingLoading(false);
      }, 1500);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteLoading(true);
    setShowQuoteSuccess(false);
    try {
      await emailjs.send(
        emailConfig.serviceID,
        emailConfig.templateID,
        {
          name: quoteData.name,
          email: quoteData.email,
          message: quoteData.details,
        },
        emailConfig.publicKey
      );
      setShowQuoteSuccess(true);
      setQuoteData({ name: '', email: '', details: '' });
      setTimeout(() => setShowQuoteSuccess(false), 2500);
    } catch (error) {
      // handle error (optional)
    }
    setQuoteLoading(false);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add state for details modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsTour, setDetailsTour] = useState(null);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="#" onClick={e => handleNavClick(e, 'home')} className="flex items-center space-x-3 group">
              <motion.div
                className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-300 shadow-lg border-2 border-white group-hover:scale-105 transition-transform duration-200"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.08 }}
              >
                <FaTruck className="w-7 h-7 text-white drop-shadow-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center shadow">
                  <FaBoxOpen className="w-3 h-3 text-blue-500" />
                      </div>
              </motion.div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent tracking-wide drop-shadow-lg">Bart Plange Express</span>
            </a>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Track', 'Quote', 'Services', 'Travel & Tour', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={e => handleNavClick(e, item.toLowerCase().replace(/\s/g, '-'))}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current my-1 transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
          {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 space-y-3">
            {['Home', 'Track', 'Quote', 'Services', 'About', 'Contact'].map((item) => (
                  <a
                    key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
                  </a>
                ))}
              </div>
          )}
      </nav>
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="home" className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
          {/* Parallax background */}
          <motion.img src="https://images.unsplash.com/photo-1515168833906-d2a3b82b302c?auto=format&fit=crop&w=1200&q=80" alt="Delivery van" className="w-full h-full object-cover opacity-30 absolute inset-0 z-0" style={{ pointerEvents: 'none' }} animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 16 }} />
          {/* Extra hero image for beauty */}
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" alt="Fleet" className="hidden lg:block absolute top-10 left-10 w-40 h-28 object-cover rounded-xl shadow-xl opacity-40 z-10" />
              <motion.div
            className="max-w-5xl mx-auto w-full text-center relative z-10"
            initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Fast, Reliable Delivery Services
              <span className="block text-blue-600 dark:text-blue-400 mt-2">Bart Plange Express</span>
            </motion.h1>
                <motion.p
              className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
                >
              Your trusted partner for Delivery, Shipping & Tours. Track your package, get a quote, or book your next adventure instantly!
                </motion.p>
                <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <motion.a href="#track" whileHover={{ scale: 1.08 }} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                Track Package <FaArrowRight className="ml-2" />
              </motion.a>
              <motion.a href="#quote" whileHover={{ scale: 1.08 }} className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-200 shadow-lg">
                Get a Quote <FaArrowRight className="ml-2" />
              </motion.a>
                </motion.div>
              </motion.div>
        </section>
        {/* Track Package Section */}
        <section id="track" className="py-20 bg-white dark:bg-gray-800 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Track Your Package</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Enter your tracking number to get real-time updates on your shipment.</p>
            <form className="flex flex-col sm:flex-row gap-4 items-center justify-center" onSubmit={e => e.preventDefault()}>
              <motion.input
                type="text"
                placeholder="Tracking Number"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                className="w-full sm:w-2/3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 focus:shadow-lg"
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #3b82f6' }}
                    whileHover={{ scale: 1.02 }}
              />
              <motion.button
                type="button"
                className="px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                disabled={!trackingNumber}
                onClick={handleTrack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Track
              </motion.button>
            </form>
          </div>
          {/* Tracking Result Modal */}
          {showTrackingModal && (
                  <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                  <motion.div
                className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full relative animate-fadeInUp"
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 text-2xl font-bold"
                  onClick={() => setShowTrackingModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4 text-blue-600">Tracking Result</h3>
                {trackingLoading ? <TruckLoader /> : (
                  <motion.pre
                    className="bg-blue-50 dark:bg-blue-800 p-4 rounded text-gray-800 dark:text-gray-100 whitespace-pre-wrap"
                initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
              >
                    {trackingResult}
                  </motion.pre>
                )}
                  </motion.div>
              </motion.div>
          )}
        </section>
        {/* Get a Quote Section */}
        <section id="quote" className="py-20 bg-blue-50 dark:bg-blue-900 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Get a Shipping Quote</h2>
            <p className="text-gray-600 dark:text-gray-200 mb-8">Fill out the form and our team will get back to you with a custom quote.</p>
            <form
              className="space-y-6"
              onSubmit={handleQuoteSubmit}
            >
              <motion.input
                type="text"
                placeholder="Your Name"
                value={quoteData.name}
                onChange={e => setQuoteData({ ...quoteData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 focus:shadow-lg"
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #3b82f6' }}
                whileHover={{ scale: 1.02 }}
              />
              <motion.input
                type="email"
                placeholder="Your Email"
                value={quoteData.email}
                onChange={e => setQuoteData({ ...quoteData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 focus:shadow-lg"
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #3b82f6' }}
                whileHover={{ scale: 1.02 }}
              />
              <motion.textarea
                placeholder="Shipping Details (origin, destination, package size, etc.)"
                value={quoteData.details}
                onChange={e => setQuoteData({ ...quoteData, details: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 focus:shadow-lg"
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #3b82f6' }}
                whileHover={{ scale: 1.02 }}
              ></motion.textarea>
              <motion.button
                type="submit"
                className="w-full px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                disabled={quoteLoading}
              >
                {quoteLoading ? (
                  <span className="flex items-center justify-center"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>Sending...</span>
                ) : 'Request Quote'}
              </motion.button>
              {showQuoteSuccess && (
            <motion.div
                  className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Quote request sent! We'll contact you soon.
            </motion.div>
              )}
            </form>
                </div>
        </section>
        {/* Services Section */}
        <section id="services" className="py-20 bg-white dark:bg-gray-800 px-4 relative overflow-hidden">
          {/* Decorative image */}
          <img src="https://images.unsplash.com/photo-1514474959185-1472d4c4e1a2?auto=format&fit=crop&w=400&q=80" alt="Delivery" className="hidden md:block absolute bottom-0 left-0 w-48 h-32 object-cover rounded-xl shadow-xl opacity-30 z-0" />
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Services</h2>
              <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
                viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.2 } }
              }}
            >
              {filteredTours.map((tour, idx) => (
            <motion.div
                  key={tour.title}
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(59,130,246,0.15)' }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center text-center p-6 relative overflow-hidden"
                >
                  {tour.featured && (
                    <span className="absolute top-4 left-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Featured</span>
                  )}
                  <img src={tour.image} alt={tour.title} className="w-full h-40 object-cover rounded-lg mb-4 shadow" />
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">{tour.title}</h3>
                  <div className="flex justify-center items-center gap-3 mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">{tour.price}</span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">{tour.duration}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-200 mb-4 text-sm">{tour.description}</p>
                  <button
                    className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow mb-2"
                    onClick={() => openTourModal(tour)}
                  >
                    Book Now
                  </button>
                  <button
                    className="px-4 py-1 rounded-full border border-blue-600 text-blue-600 dark:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm"
                    onClick={() => { setDetailsTour(tour); setDetailsModalOpen(true); }}
                  >
                    View Details
                  </button>
                </motion.div>
              ))}
            </motion.div>
            {/* Why Book With Us */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-6">Why Book With Us?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center">
                  <FaStar className="w-8 h-8 text-yellow-400 mb-2" />
                  <span className="font-semibold text-gray-900 dark:text-white">Best Price Guarantee</span>
          </div>
                <div className="flex flex-col items-center">
                  <FaGlobe className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="font-semibold text-gray-900 dark:text-white">Worldwide Destinations</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaClock className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="font-semibold text-gray-900 dark:text-white">24/7 Customer Support</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaBoxOpen className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="font-semibold text-gray-900 dark:text-white">Curated Experiences</span>
                </div>
              </div>
            </div>
          </div>
          {/* Details Modal */}
          <AnimatePresence>
            {detailsModalOpen && detailsTour && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-0 flex flex-col relative"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    className="absolute top-3 right-4 text-gray-500 hover:text-blue-600 text-2xl font-bold focus:outline-none z-10"
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <img src={detailsTour.image} alt={detailsTour.title} className="w-full h-56 object-cover rounded-t-2xl" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">{detailsTour.title}</h3>
                    <div className="flex justify-center items-center gap-3 mb-2">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">{detailsTour.price}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">{detailsTour.duration}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 mb-4">{detailsTour.description}</p>
                    <div className="mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Highlights:</span>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 ml-4">
                        {detailsTour.details && detailsTour.details.split('. ').map((item, idx) => item && <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                    {/* Add price/duration if available */}
                    {/* <div className="mt-2 text-blue-600 font-semibold">Price: $XXX | Duration: X days</div> */}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Tour Booking Modal */}
          <AnimatePresence>
            {tourModalOpen && (
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
              initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-0 flex flex-col"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-600 rounded-t-2xl">
                    <span className="text-white font-bold">Book Tour: {selectedTour?.title}</span>
                    <button onClick={() => setTourModalOpen(false)} className="text-white text-2xl font-bold focus:outline-none">&times;</button>
                  </div>
                  <form onSubmit={handleTourFormSubmit} className="flex flex-col gap-4 px-6 py-6">
                    <input
                      type="text"
                      name="name"
                      value={tourForm.name}
                      onChange={handleTourFormChange}
                      placeholder="Your Name"
                      required
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    <input
                      type="email"
                      name="email"
                      value={tourForm.email}
                      onChange={handleTourFormChange}
                      placeholder="Your Email"
                      required
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    <textarea
                      name="details"
                      value={tourForm.details}
                      onChange={handleTourFormChange}
                      placeholder="Tell us more (dates, group size, preferences...)"
                      rows={3}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    <button type="submit" className="w-full px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                      {tourFormSent ? 'Request Sent!' : 'Send Booking Request'}
                  </button>
                    {tourFormSent && <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-center">Thank you! We will contact you soon.</div>}
                </form>
                </motion.div>
            </motion.div>
            )}
          </AnimatePresence>
        </section>
        {/* About Section */}
        <section id="about" className="py-20 bg-blue-50 dark:bg-blue-900 px-4 relative overflow-hidden">
          {/* Decorative image */}
          <motion.img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Team" className="hidden md:block absolute top-0 right-0 w-48 h-32 object-cover rounded-xl shadow-xl opacity-30 z-0" style={{ pointerEvents: 'none' }} animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 18 }} />
          {/* Animated delivery route/map */}
          <motion.img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" alt="Delivery Route" className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 object-cover rounded-xl shadow-xl opacity-30 z-0" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 0.3, y: 0 }} transition={{ duration: 1 }} />
            <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About Bart Plange Express</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">Bart Plange Express is committed to providing fast, secure, and reliable delivery solutions for individuals and businesses. With a dedicated team and a passion for service, we ensure your packages arrive safely and on time—every time.</p>
            {/* CEO Section */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="flex flex-col items-center mb-8">
              <img src={ceoImage} alt="CEO of Bart Plange Express" className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Ebenezer Bart Plange</h3>
              <span className="text-blue-600 dark:text-blue-400 text-sm mb-2">Chief Executive Officer</span>
              <p className="text-gray-700 dark:text-gray-200 max-w-xl">With years of experience in logistics and a passion for customer satisfaction, Ebenezer leads Bart Plange Express to deliver excellence every day.</p>
              <img src={ceoImage} alt="CEO at work" className="w-40 h-28 object-cover rounded-lg mt-4 shadow-md" />
            </motion.div>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <FaUsers className="w-8 h-8 text-blue-600 mb-2" />
                <AnimatedCounter to={10000} duration={2} className="font-semibold text-gray-900 dark:text-white text-2xl" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">Happy Customers</span>
                    </div>
              <div className="flex flex-col items-center">
                <FaBoxOpen className="w-8 h-8 text-blue-600 mb-2" />
                <AnimatedCounter to={500000} duration={2.5} className="font-semibold text-gray-900 dark:text-white text-2xl" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">Packages Delivered</span>
                    </div>
              <div className="flex flex-col items-center">
                <FaGlobe className="w-8 h-8 text-blue-600 mb-2" />
                <AnimatedCounter to={100} duration={1.5} className="font-semibold text-gray-900 dark:text-white text-2xl" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">Countries Served</span>
                  </div>
          </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80" alt="Team" className="w-32 h-20 object-cover rounded shadow" />
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80" alt="Fleet" className="w-32 h-20 object-cover rounded shadow" />
              <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80" alt="Packages" className="w-32 h-20 object-cover rounded shadow" />
                </div>
          </motion.div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white dark:bg-gray-800 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Have questions or need help? Reach out to our team and we’ll be happy to assist you.</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaPhone className="w-5 h-5 text-blue-600" />
                  <a href="tel:+233200463165" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">+233 20 046 3165</a>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <FaPhone className="w-5 h-5 text-blue-600" />
                  <a href="tel:+233546979955" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">+233 54 697 9955</a>
                  <a href="https://wa.me/233546979955" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-600 hover:text-green-700" title="Chat on WhatsApp">
                    <FaWhatsapp className="w-5 h-5 inline" />
                  </a>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <FaPhone className="w-5 h-5 text-blue-600" />
                  <a href="tel:+233593114874" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">+233 59 311 4874</a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="w-5 h-5 text-blue-600" />
                  <a href="mailto:ebenezerbartplange12@gmail.com" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">ebenezerbartplange12@gmail.com</a>
                  </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-200">123 Express Ave, Accra, Ghana</span>
                </div>
            </div>
            </div>
            <form className="space-y-6 bg-blue-50 dark:bg-blue-900 p-8 rounded-xl shadow-lg" onSubmit={handleContactSubmit}>
                    <input
                      type="text"
                      name="name"
                placeholder="Your Name"
                value={contactData.name}
                onChange={handleContactChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      required
              />
                    <input
                      type="email"
                      name="email"
                placeholder="Your Email"
                value={contactData.email}
                onChange={handleContactChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      required
              />
                    <textarea
                      name="message"
                placeholder="Your Message"
                      rows={4}
                value={contactData.message}
                onChange={handleContactChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                required
                    ></textarea>
                  <button
                    type="submit"
                className="w-full px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                disabled={contactLoading}
              >
                {contactLoading ? (
                  <span className="flex items-center justify-center"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>Sending...</span>
                ) : 'Send Message'}
                  </button>
              {contactSuccess && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-center">
                  Message sent! We'll contact you soon.
                    </div>
                  )}
                </form>
          </div>
        </section>
        {/* Testimonials Carousel Section */}
        <section id="testimonials" className="py-20 bg-blue-100 dark:bg-blue-950 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-200 mb-8">What Our Customers Say</h2>
            <div className="relative">
              <AnimatePresence initial={false} mode="wait">
              <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center"
                >
                  <img src={testimonials[testimonialIndex].avatar} alt={testimonials[testimonialIndex].name} className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 shadow mb-4" />
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                    ))}
                    </div>
                  <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">"{testimonials[testimonialIndex].review}"</p>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">{testimonials[testimonialIndex].name}</span>
              </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-4 mt-6">
                {testimonials.map((t, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx === testimonialIndex ? 'bg-blue-600' : 'bg-blue-300'} transition-colors`}
                    onClick={() => setTestimonialIndex(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Floating CTA Banner */}
            <motion.div
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 cursor-pointer hover:bg-blue-700 transition-colors animate-pulse"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.5 }}
          onClick={() => handleNavClick({ preventDefault: () => {} }, 'contact')}
        >
          <FaEnvelope className="w-5 h-5" />
          <span className="font-semibold">Contact Us</span>
            </motion.div>
        {/* Floating Chat Widget */}
            <motion.div
          className="fixed bottom-8 left-8 z-50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.5 }}
        >
          <button
            className="bg-blue-600 text-white p-4 rounded-full shadow-xl flex items-center gap-2 hover:bg-blue-700 transition-colors focus:outline-none"
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
          >
            <FaComments className="w-6 h-6" />
          </button>
                </motion.div>
        {/* Chat Modal */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
            <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-auto mb-8 md:mb-0 p-0 flex flex-col"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-600 rounded-t-2xl">
                  <span className="text-white font-bold">Live Chat</span>
                  <button onClick={() => setChatOpen(false)} className="text-white text-2xl font-bold focus:outline-none">&times;</button>
                  </div>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-blue-50 dark:bg-blue-950" style={{ maxHeight: 300 }}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-blue-200 dark:border-blue-700'}`}>{msg.text}</div>
                  </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex items-center border-t border-gray-200 dark:border-gray-700 px-2 py-2 bg-white dark:bg-gray-900 rounded-b-2xl">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 mr-2"
                  />
                  <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <FaPaperPlane className="w-5 h-5" />
                  </button>
                </form>
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white dark:bg-gray-900 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-200 mb-8 text-center">Frequently Asked Questions</h2>
            <FAQ />
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-blue-600 dark:bg-blue-900 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <FaTruck className="w-6 h-6" />
            <span className="font-bold text-lg">Bart Plange Express</span>
          </div>
          <div className="text-sm">© {new Date().getFullYear()} Bart Plange Express. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// FAQ component
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'How do I track my package?', a: 'Enter your tracking number in the Track Package section and click Track.' },
    { q: 'What areas do you deliver to?', a: 'We deliver nationwide and internationally to over 100 countries.' },
    { q: 'How fast is same day delivery?', a: 'Same day delivery is completed within 24 hours of pickup.' },
    { q: 'How do I get a quote?', a: 'Fill out the Get a Quote form and our team will contact you with a custom offer.' },
  ];
  return (
    <div className="space-y-4">
      {faqs.map((item, idx) => (
        <motion.div key={idx} className="border rounded-lg overflow-hidden" initial={false}>
          <button
            className="w-full text-left px-6 py-4 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-semibold focus:outline-none flex justify-between items-center"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            {item.q}
            <motion.span animate={{ rotate: open === idx ? 90 : 0 }} className="ml-2">▶</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === idx && (
          <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
              >
                {item.a}
            </motion.div>
            )}
          </AnimatePresence>
            </motion.div>
                ))}
              </div>
  );
}

// Custom Loader (delivery truck)
function TruckLoader() {
  return (
    <motion.div className="flex flex-col items-center justify-center py-8">
          <motion.div
        className="w-16 h-8 bg-blue-500 rounded-lg relative flex items-end justify-center shadow-lg"
        animate={{ x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
          >
        <div className="absolute left-2 bottom-0 w-4 h-4 bg-gray-200 rounded-full border-2 border-blue-700" />
        <div className="absolute right-2 bottom-0 w-4 h-4 bg-gray-200 rounded-full border-2 border-blue-700" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-white rounded-t-lg border border-blue-700" />
          </motion.div>
      <span className="text-blue-600 font-medium mt-2">Loading...</span>
    </motion.div>
  );
} 