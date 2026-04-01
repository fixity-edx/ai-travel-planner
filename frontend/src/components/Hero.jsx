import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-[90vh] flex items-center overflow-hidden">
            <div className="mx-auto max-w-7xl py-12 sm:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="hidden sm:mb-8 sm:flex">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                            Announcing our new AI features. <a href="#" className="font-semibold text-blue-600"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></a>
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
                        Data-enriched <span className="text-blue-600">Travel Planning</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 mb-8 max-w-xl">
                        Experience the chaos-free way to plan your trips. Our AI-powered assistant curates personalized itineraries, packing lists, and weather forecasts just for you.
                    </p>
                    <div className="flex items-center gap-x-6">
                        <button
                            onClick={() => navigate('/register')}
                            className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105"
                        >
                            Start Planning Free
                        </button>
                        <button
                            onClick={() => navigate('/destinations')}
                            className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            Explore Destinations <span aria-hidden="true">→</span>
                        </button>
                    </div>
                    <div className="mt-10 flex items-center gap-x-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://randomuser.me/api/portraits/thumb/men/${i + 10}.jpg`} alt="" />
                            ))}
                        </div>
                        <div className="text-sm leading-6">
                            <p className="font-bold text-gray-900">4.9/5 Stars</p>
                            <p className="text-gray-500">From 200+ Reviews</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    <img
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80"
                        alt="Travel App Screenshot"
                        className="relative rounded-2xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
