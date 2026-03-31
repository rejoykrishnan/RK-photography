import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Play, ChevronRight } from 'lucide-react';

// --- Types ---
interface ImageAsset {
  id: string;
  url: string;
  title?: string;
}

interface Workshop {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

interface Testimony {
  id: string;
  name: string;
  role: string;
  content: string;
  mediaUrl: string;
  type: 'video' | 'image';
}

interface PhotoTalk {
  id: string;
  title: string;
  description: string;
  links: {
    type: 'reel' | 'post' | 'youtube' | 'image' | 'other';
    url: string;
    label: string;
  }[];
  imageUrl: string;
}

interface ShootCategory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

// --- Mock Data ---
const MOCK_IMAGES: ImageAsset[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `img-${i}`,
  url: `https://picsum.photos/seed/rejoy-${i}/1000/1000`,
  title: `Photography ${i + 1}`
}));

const INITIAL_WORKSHOPS: Workshop[] = [
  { id: 'w1', title: 'Mindful Seeing: The Art of Observation', date: 'April 15, 2026', description: 'A deep dive into how we perceive the world before we even touch the camera.', imageUrl: 'https://picsum.photos/seed/w1/800/450' },
  { id: 'w2', title: 'Cinematic Storytelling in Stills', date: 'May 20, 2026', description: 'Learn to create narrative-driven photographs that feel like scenes from a film.', imageUrl: 'https://picsum.photos/seed/w2/800/450' },
];

const INITIAL_TESTIMONIES: Testimony[] = [
  { id: 't1', name: 'Sarah Jenkins', role: 'Aspiring Photographer', content: 'Rejoy has a unique way of teaching that goes beyond technical settings. He taught me how to feel the moment before capturing it.', mediaUrl: 'https://picsum.photos/seed/t1/600/400', type: 'image' },
  { id: 't2', name: 'Michael Chen', role: 'Workshop Attendee', content: 'The best investment I have made in my creative journey. The focus on mindfulness changed everything for me.', mediaUrl: 'https://picsum.photos/seed/t2/600/400', type: 'video' },
];

const INITIAL_PHOTO_TALKS: PhotoTalk[] = [
  { 
    id: 'pt1', 
    title: 'The Philosophy of Light', 
    description: 'A discussion on how light dictates the emotional weight of a photograph.', 
    links: [
      { type: 'youtube', url: 'https://youtube.com/watch?v=example1', label: 'Watch Full Talk' },
      { type: 'reel', url: 'https://instagram.com/reels/example1', label: 'Behind the Scenes' }
    ], 
    imageUrl: 'https://picsum.photos/seed/pt1/600/400' 
  },
  { 
    id: 'pt2', 
    title: 'Capturing the Unseen', 
    description: 'Exploring the beauty in the mundane and often overlooked details of life.', 
    links: [
      { type: 'post', url: 'https://instagram.com/p/example2', label: 'View Photo Series' },
      { type: 'image', url: 'https://picsum.photos/seed/pt2-detail/1200/800', label: 'High-Res Detail' }
    ], 
    imageUrl: 'https://picsum.photos/seed/pt2/600/400' 
  },
];

const SHOOT_CATEGORIES: ShootCategory[] = [
  {
    id: 'portrait',
    title: 'Portrait Photography',
    description: 'Capturing the essence of personality through intimate and expressive portraiture. Specializing in natural light and studio sessions that tell your unique story.',
    imageUrl: 'https://picsum.photos/seed/portrait-shoot/800/1000'
  },
  {
    id: 'architecture',
    title: 'Architecture Photography',
    description: 'Documenting the soul of structures. From modern minimalism to classical grandeur, I capture the lines, light, and geometry of built environments.',
    imageUrl: 'https://picsum.photos/seed/arch-shoot/800/1000'
  },
  {
    id: 'portfolio',
    title: 'Portfolio Shoots',
    description: 'Professional portfolio sessions for artists, actors, and professionals. A comprehensive visual representation of your talent and persona.',
    imageUrl: 'https://picsum.photos/seed/general-portfolio/800/1000'
  },
  {
    id: 'wedding',
    title: 'Personalised Wedding Shoots',
    description: 'Bespoke wedding photography that captures the raw emotions and fleeting moments of your special day. A personalized approach to timeless memories.',
    imageUrl: 'https://picsum.photos/seed/wedding-shoot/800/1000'
  }
];

// --- Components ---

const Header = ({ isMoving }: { isMoving: boolean }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: (isMoving || isHome) ? 1 : 0,
        y: (isMoving || isHome) ? 0 : -20,
        pointerEvents: (isMoving || isHome) ? 'auto' : 'none'
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 px-8 py-8 md:px-16"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-md border border-black/5 px-12 py-8 shadow-sm">
        <Link 
          to="/about" 
          className="flex flex-col items-start hover:opacity-70 transition-opacity group"
        >
          <span className="text-2xl md:text-4xl font-cinzel tracking-[0.05em] text-black">The Dark Room</span>
          <span className="text-[10px] md:text-[12px] uppercase tracking-[0.3em] opacity-40 font-bold group-hover:opacity-100 transition-opacity mt-1">About me</span>
        </Link>
        
        <nav className="hidden md:flex gap-12 items-center text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-bold text-black">
          <Link to="/" className={`hover:opacity-60 transition-opacity ${location.pathname === '/' && !location.search.includes('mode=portfolio') ? 'underline underline-offset-8' : ''}`}>Home</Link>
          <Link to="/testimony" className={`hover:opacity-60 transition-opacity ${location.pathname === '/testimony' ? 'underline underline-offset-8' : ''}`}>Testimony</Link>
          <Link to="/photo-talk" className={`hover:opacity-60 transition-opacity ${location.pathname === '/photo-talk' ? 'underline underline-offset-8' : ''}`}>Photo Talk</Link>
        </nav>
      </div>
    </motion.header>
  );
};

const CollageBackground = ({ isPortfolioMode, onImageClick }: { isPortfolioMode: boolean, onImageClick: (index: number) => void }) => {
  const scatteredImages = useMemo(() => {
    return MOCK_IMAGES.map((img, i) => ({
      ...img,
      top: `${Math.random() * 85}%`,
      left: `${Math.random() * 85}%`,
      rotate: `${(Math.random() - 0.5) * 40}deg`,
      scale: 0.4 + Math.random() * 0.6,
      delay: Math.random() * 1.5
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      <motion.div 
        className="relative w-full h-full"
        animate={{ 
          opacity: isPortfolioMode ? 1 : 0.1,
          scale: isPortfolioMode ? 1 : 1.05
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {isPortfolioMode ? (
          <div className="w-full h-full pt-64 pb-24 px-8 md:px-16 overflow-y-auto pointer-events-auto no-scrollbar bg-[#FBFBFA]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-[1600px] mx-auto">
              {MOCK_IMAGES.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: i * 0.03,
                    duration: 0.8,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  className="relative aspect-square overflow-hidden cursor-pointer group bg-white ring-1 ring-black/5 shadow-sm hover:shadow-xl transition-all duration-500"
                  onClick={() => onImageClick(i)}
                >
                  <img 
                    src={img.url} 
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                </motion.div>
              ))}
            </div>
            <div className="h-24" />
          </div>
        ) : (
          scatteredImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: img.scale }}
              transition={{ delay: img.delay, duration: 2 }}
              className="absolute w-72 aspect-[3/4] overflow-hidden shadow-xl border border-black/5 bg-white"
              style={{ 
                top: img.top, 
                left: img.left, 
                rotate: img.rotate,
              }}
            >
              <img 
                src={img.url} 
                alt="" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

const FullscreenSlideshow = ({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev,
  direction
}: { 
  images: ImageAsset[], 
  currentIndex: number, 
  onClose: () => void,
  onNext: () => void,
  onPrev: () => void,
  direction: number
}) => {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.3 }
          }}
          className="absolute w-full h-full flex items-center justify-center p-4 md:p-20"
        >
          <img 
            src={images[currentIndex].url} 
            alt="" 
            className="max-w-full max-h-full object-contain border-[12px] border-white shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize z-10" onClick={onPrev} />
      <div className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize z-10" onClick={onNext} />

      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-black/50 hover:text-black transition-colors z-20 p-2"
      >
        <X size={32} />
      </button>
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isPortfolioMode = searchParams.get('mode') === 'portfolio';
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const handleImageClick = (index: number) => {
    setSlideshowIndex(index);
  };

  const nextImage = () => {
    setDirection(1);
    if (slideshowIndex !== null) {
      setSlideshowIndex((slideshowIndex + 1) % MOCK_IMAGES.length);
    }
  };

  const prevImage = () => {
    setDirection(-1);
    if (slideshowIndex !== null) {
      setSlideshowIndex((slideshowIndex - 1 + MOCK_IMAGES.length) % MOCK_IMAGES.length);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (!isPortfolioMode) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) return;
      setSearchParams({ mode: 'portfolio' });
    }
  };

  return (
    <main 
      className="relative min-h-screen bg-white text-black overflow-hidden"
      onClick={handleBackgroundClick}
    >
      <CollageBackground isPortfolioMode={isPortfolioMode} onImageClick={handleImageClick} />
      
      <AnimatePresence>
        {!isPortfolioMode && (
          <>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-3xl md:text-5xl lg:text-7xl tracking-tight uppercase mb-10 whitespace-nowrap font-custom drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              >
                Rejoy Krishnan Photography
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-lg md:text-xl font-serif italic opacity-60 mb-8 md:mb-16 tracking-[0.1em]"
              >
                A Space for Mindfulness
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="relative px-8 md:px-16 py-6 md:py-8 border border-black/20 bg-black/[0.02] mb-10 md:mb-16"
              >
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-black/40" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-black/40" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-black/40" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-black/40" />
                <p className="relative text-[10px] md:text-xs tracking-[0.6em] uppercase font-bold text-black/80">
                  See • Observe • Feel • Experience • Capture
                </p>
              </motion.div>

              <div className="flex flex-col md:flex-row items-center gap-8 pointer-events-auto">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/workshops');
                  }}
                  className="group relative px-16 py-7 bg-black text-white hover:bg-black/90 transition-all uppercase tracking-[0.4em] text-xs font-bold shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20"
                >
                  Join Workshop
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/schedule-shoot');
                  }}
                  className="group relative px-16 py-7 border-2 border-black text-black hover:bg-black hover:text-white transition-all uppercase tracking-[0.4em] text-xs font-bold"
                >
                  Schedule a shoot
                </motion.button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {slideshowIndex !== null && (
          <FullscreenSlideshow 
            images={MOCK_IMAGES}
            currentIndex={slideshowIndex}
            direction={direction}
            onClose={() => setSlideshowIndex(null)}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

const AboutPage = () => (
  <div className="min-h-screen bg-white text-black pt-80 px-8 md:px-24 pb-24">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="aspect-[3/4] bg-gray-50 overflow-hidden border border-black/5 shadow-sm"
      >
        <img 
          src="https://picsum.photos/seed/rejoy-profile/800/1066" 
          alt="Rejoy Krishnan" 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-10"
      >
        <div className="space-y-2">
          <h2 className="text-5xl font-cinzel tracking-[0.1em] uppercase">The Dark Room</h2>
          <p className="text-xs uppercase tracking-[0.3em] opacity-40 font-bold">About me</p>
        </div>
        <div className="space-y-8 text-lg font-light leading-relaxed opacity-70 font-serif italic">
          <p>
            Photography, for me, is more than just capturing light on a sensor. It is a mindful practice of being present in the moment, observing the subtle nuances of life, and feeling the emotional resonance of a scene.
          </p>
          <p>
            My journey started with a simple curiosity about the world around me. Over the years, this curiosity evolved into a deep-seated passion for storytelling through visuals. I believe that every frame has a story to tell.
          </p>
          <p>
            Through my workshops and personal projects, I strive to create a space where learning is not just about technical mastery, but about emotional connection and mindful observation.
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

const ScheduleShootPage = () => {
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBookNow = (category: string) => {
    const message = encodeURIComponent(`Hi Rejoy, I would like to book a ${category} session. Please let me know the availability.`);
    const whatsappUrl = `https://wa.me/919876543210?text=${message}`; // Replace with actual number
    
    window.open(whatsappUrl, '_blank');
    setBookingSuccess(category);
    
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="min-h-screen bg-white text-black pt-80 px-8 md:px-24 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-4">
          <h2 className="text-5xl font-cinzel tracking-[0.1em] uppercase">Schedule a Shoot</h2>
          <p className="text-xs uppercase tracking-[0.3em] opacity-40 font-bold">Professional Photography Services</p>
        </div>

        <div className="space-y-32">
          {SHOOT_CATEGORIES.map((cat, i) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div className={`aspect-[4/5] bg-gray-50 overflow-hidden border border-black/5 shadow-sm ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <img 
                  src={cat.imageUrl} 
                  alt={cat.title} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-8">
                <h3 className="text-3xl font-cinzel tracking-widest uppercase">{cat.title}</h3>
                <p className="text-xl font-serif italic opacity-60 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-4">
                  <button 
                    onClick={() => handleBookNow(cat.title)}
                    className="group flex items-center gap-4 px-10 py-5 bg-black text-white hover:bg-black/80 transition-all uppercase tracking-[0.4em] text-[10px] font-bold"
                  >
                    Book Now
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {bookingSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-8 py-4 shadow-2xl flex flex-col items-center gap-2 text-center min-w-[320px]"
          >
            <p className="text-xs uppercase tracking-[0.2em] font-bold">Thanks for booking!</p>
            <p className="text-[10px] opacity-60 uppercase tracking-[0.1em]">We'll reach you shortly regarding your {bookingSuccess} session.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState(INITIAL_WORKSHOPS);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  return (
    <div className="min-h-screen bg-white text-black pt-80 px-8 md:px-24 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-5xl font-cinzel tracking-[0.1em] uppercase">Workshops</h2>
          <p className="text-xs uppercase tracking-[0.3em] opacity-40">Curated Learning Experiences</p>
        </div>
        
        <div className="grid gap-24">
          {workshops.map((w, i) => (
            <div key={w.id} className="group grid md:grid-cols-2 gap-16 items-center">
              <div className={`aspect-video bg-gray-50 overflow-hidden border border-black/5 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">{w.date}</p>
                <h3 className="text-3xl font-cinzel tracking-widest uppercase">{w.title}</h3>
                <p className="text-lg font-serif italic opacity-60 leading-relaxed">{w.description}</p>
                <button 
                  onClick={() => setSelectedWorkshop(w)}
                  className="px-10 py-4 border border-black/10 hover:bg-black hover:text-white transition-all uppercase tracking-[0.3em] text-xs"
                >
                  Join Workshop
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedWorkshop && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-md"
              onClick={() => setSelectedWorkshop(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-black/10 shadow-2xl max-w-2xl w-full p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedWorkshop(null)}
                className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-black/40">{selectedWorkshop.date}</p>
                  <h3 className="text-3xl font-cinzel tracking-widest uppercase">{selectedWorkshop.title}</h3>
                </div>
                
                <div className="aspect-video bg-gray-50 overflow-hidden border border-black/5">
                  <img src={selectedWorkshop.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-6 text-lg font-serif italic opacity-70 leading-relaxed">
                  <p>{selectedWorkshop.description}</p>
                  <p>This workshop includes hands-on sessions, personalized feedback, and a deep dive into the philosophy of mindful photography.</p>
                </div>

                <div className="pt-8 border-t border-black/5 space-y-6">
                  <div className="flex flex-col gap-4">
                    <a 
                      href="https://forms.gle/example" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-5 bg-black text-white text-center uppercase tracking-[0.3em] text-xs font-bold hover:bg-black/90 transition-colors"
                    >
                      Fill Registration Form
                    </a>
                    <button 
                      className="w-full py-5 border border-black/10 text-center uppercase tracking-[0.3em] text-xs font-bold hover:bg-black/5 transition-colors"
                      onClick={() => alert('Redirecting to Payment Gateway...')}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-center opacity-40">Secure Payment via Stripe / Razorpay</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TestimonyPage = () => (
  <div className="min-h-screen bg-white text-black pt-80 px-8 md:px-24 pb-24">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h2 className="text-5xl font-cinzel tracking-[0.1em] uppercase mb-24">Testimony</h2>
      
      <div className="space-y-32">
        {INITIAL_TESTIMONIES.map((t) => (
          <div key={t.id} className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-video bg-gray-50 relative group border border-black/5 overflow-hidden">
              <img src={t.mediaUrl} alt={t.name} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-1000" referrerPolicy="no-referrer" />
              {t.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-black/10 flex items-center justify-center bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Play className="text-black ml-1" size={32} />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-cinzel tracking-widest uppercase">{t.name}</h3>
                <p className="text-xs uppercase tracking-[0.3em] opacity-40">{t.role}</p>
              </div>
              <p className="text-2xl font-serif italic opacity-70 leading-relaxed">
                "{t.content}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const PhotoTalkPage = () => (
  <div className="min-h-screen bg-white text-black pt-80 px-8 md:px-24 pb-24">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h2 className="text-5xl font-cinzel tracking-[0.1em] uppercase mb-24">Photo Talk</h2>
      
      <div className="space-y-24">
        {INITIAL_PHOTO_TALKS.map((pt) => (
          <div 
            key={pt.id} 
            className="group grid md:grid-cols-2 gap-16 items-center border-b border-black/5 pb-24 last:border-0"
          >
            <div className="aspect-video bg-gray-50 overflow-hidden border border-black/5">
              <img src={pt.imageUrl} alt={pt.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-cinzel tracking-widest uppercase">{pt.title}</h3>
                <p className="text-xl font-serif italic opacity-60 leading-relaxed">{pt.description}</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Content Links</p>
                <div className="flex flex-wrap gap-4">
                  {pt.links.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-black/10 hover:bg-black hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2"
                    >
                      {link.type === 'youtube' && <Play size={12} />}
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const CustomCursor = ({ isMoving }: { isMoving: boolean }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isPortfolioMode = searchParams.get('mode') === 'portfolio';
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('button, a, [role="button"], .cursor-pointer');
      setIsHoveringInteractive(isInteractive);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none flex items-center"
      animate={{ 
        x: mousePos.x, 
        y: mousePos.y,
        scale: isHoveringInteractive ? 1.2 : 1,
      }}
      transition={{ 
        x: { type: "spring", damping: 40, stiffness: 500, mass: 0.4 },
        y: { type: "spring", damping: 40, stiffness: 500, mass: 0.4 },
        scale: { duration: 0.2 }
      }}
      style={{ left: -24, top: -24 }}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current drop-shadow-sm">
          <path d="M35,35 Q35,30 40,30 L75,30 Q80,30 80,35 L80,75 Q80,80 75,80 L40,80 Q35,80 35,75 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="57" cy="55" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="57" cy="55" r="7" fill="currentColor" />
          <rect x="65" y="22" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="72" y="18" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      
      <AnimatePresence>
        {isHome && !isPortfolioMode && !isHoveringInteractive && isMoving && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="ml-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/60 whitespace-nowrap"
          >
            Click to see
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function App() {
  const [isMoving, setIsMoving] = useState(true);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMoving(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Router>
      <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white cursor-none">
        <CustomCursor isMoving={isMoving} />
        <Header isMoving={isMoving} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/schedule-shoot" element={<ScheduleShootPage />} />
          <Route path="/testimony" element={<TestimonyPage />} />
          <Route path="/photo-talk" element={<PhotoTalkPage />} />
        </Routes>
      </div>
    </Router>
  );
}
