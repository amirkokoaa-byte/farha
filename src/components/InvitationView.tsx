import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InvitationData, GuestbookEntry } from '../types';

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: 'أيام', value: timeLeft.days },
    { label: 'ساعات', value: timeLeft.hours },
    { label: 'دقائق', value: timeLeft.minutes },
    { label: 'ثواني', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-4 my-8" dir="ltr">
      {blocks.map((b, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FCFAEF] border-2 border-[#D4B872] shadow-[0_0_15px_rgba(212,184,114,0.3)] flex items-center justify-center mb-2">
            <span className="text-[#B89B5E] text-xl md:text-2xl font-bold font-sans">{b.value.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-[#8C7A59] text-sm font-semibold">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export function InvitationView({ onBack, data, guestbook = [], onRSVP }: { onBack: () => void, data?: InvitationData, guestbook?: GuestbookEntry[], onRSVP?: (name: string, guestsCount: number, message?: string) => Promise<void> }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpCount, setRsvpCount] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use passed data or fallbacks
  const groom = data?.groomName || 'كريم';
  const bride = data?.brideName || 'ملك';
  const font = data?.font || 'Amiri';
  const message = data?.message || 'بكل الحب والسعادة، 💖\nندعوكم لتشاركونا فرحة العمر ✨\nبحضوركم تكتمل سعادتنا وتزيد بهجتنا 🕊️💍';
  const weddingDate = data?.weddingDate || '١٥ أكتوبر ٢٠٢٤';
  const weddingTime = data?.weddingTime || 'فندق الريتز كارلتون';
  const bgClass = data?.background || 'bg-[#FCFAEF]';
  const customBg = data?.customBackgroundImage;
  const songUrl = data?.songUrl;
  const showPause = data?.showPauseButton ?? true;

  useEffect(() => {
    if (audioRef.current && songUrl) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio auto-play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, songUrl]);

  const handleSendCongratulation = async () => {
    if (!rsvpName || !rsvpCount) return;
    setIsSubmitting(true);
    try {
      if (onRSVP) {
        await onRSVP(rsvpName, parseInt(rsvpCount) || 0, rsvpMessage);
      }
      setIsModalOpen(false);
      setIsSuccessOpen(true);
      setRsvpName('');
      setRsvpCount('');
      setRsvpMessage('');
      setTimeout(() => setIsSuccessOpen(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FAF8F5] z-50 flex items-center justify-center overflow-hidden font-serif" dir="rtl">
      {/* Hidden Audio Element */}
      {songUrl && (
        <audio ref={audioRef} src={songUrl} loop />
      )}

      {/* Background and Mobile Container */}
       <div className="relative w-full h-full sm:w-[400px] sm:h-[800px] sm:max-h-[95vh] sm:rounded-[40px] sm:shadow-2xl bg-[#FAF8F5] overflow-hidden flex flex-col items-center justify-center sm:border-[8px] sm:border-white" style={{ fontFamily: font }}>
          
          {/* Back to dashboard button (visible for preview purposes) */}
          <button 
            onClick={onBack}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 z-50 flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors"
          >
            <ChevronRight size={16} />
            <span className="text-sm font-sans">العودة</span>
          </button>

          {/* Audio toggle button (left side) */}
          {showPause && songUrl && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-1/2 -translate-y-1/2 left-4 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-[#D4B872]/40 flex items-center justify-center text-[#B89B5E] shadow-lg transition-all hover:bg-white/60 z-50"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
          )}

          {/* Envelope and Card Area */}
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div 
                key="envelope"
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.8 }}
                className="relative flex flex-col items-center justify-center w-full px-6 h-full absolute inset-0 z-40"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  onClick={() => setIsOpen(true)}
                  className="relative w-full aspect-[3/4] max-w-[320px] bg-gradient-to-br from-[#E8DCC4] via-[#F3EAD3] to-[#E8DCC4] rounded-md shadow-2xl flex flex-col items-center cursor-pointer border border-[#D4C3A3]/50 group"
                >
                  {/* Envelope Flap */}
                  <div 
                    className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-[#F0E6CF] to-[#E5D7BC] shadow-[0_5px_10px_-2px_rgba(0,0,0,0.15)] rounded-t-md z-10 border-b border-[#D4C3A3]/60 transition-transform duration-500 origin-top group-hover:rotate-x-12"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                  />
                  
                  {/* Back panel inner shadow */}
                  <div className="absolute inset-0 rounded-md shadow-inner bg-black/5 z-0" />

                  {/* Envelope side folds */}
                  <div 
                    className="absolute bottom-0 inset-x-0 h-[65%] bg-gradient-to-t from-[#E8DCC4] to-[#F0E6CF]/50 rounded-b-md z-0"
                    style={{ clipPath: 'polygon(50% 30%, 100% 100%, 0 100%)' }}
                  />

                  {/* Wax Seal */}
                  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#5C0000] rounded-full shadow-[0_6px_12px_rgba(0,0,0,0.3)] flex items-center justify-center border border-[#3A0000] z-20 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full border border-[#B22222] flex items-center justify-center bg-gradient-to-br from-[#A52A2A] to-[#7B0000]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F3EAD3" strokeWidth="1.5">
                        <circle cx="9" cy="12" r="5" />
                        <circle cx="15" cy="12" r="5" />
                      </svg>
                    </div>
                  </div>

                  {/* Envelope details below seal */}
                  <div className="absolute top-[58%] flex flex-col items-center text-center w-full px-4 z-20 pointer-events-none">
                    <p className="text-[#8C7A59] text-xl mb-3 font-medium tracking-wide">دعوة زفاف</p>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#B89B5E] via-[#D4B872] to-[#B89B5E] bg-clip-text text-transparent drop-shadow-sm mb-8 font-serif leading-tight">
                      {groom} & {bride}
                    </h1>
                    <p className="text-[#8C7A59]/80 text-sm mt-4 tracking-wider animate-pulse flex items-center gap-2">
                      اضغط لفتح دعوتك
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className={`absolute inset-0 z-40 ${customBg ? 'bg-transparent' : bgClass} overflow-y-auto scrollbar-none bg-cover bg-center`}
                style={{ backgroundImage: customBg ? `url("${customBg}")` : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4b872' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
              >
                <div className={`min-h-full w-full py-16 px-6 flex flex-col items-center relative ${customBg ? 'bg-white/40 backdrop-blur-[2px]' : ''}`}>
                  {/* Faint gold filigree corners */}
                  <div className="absolute top-6 left-6 w-16 h-16 opacity-40 border-t-2 border-l-2 border-[#D4B872] rounded-tl-3xl"></div>
                  <div className="absolute top-6 right-6 w-16 h-16 opacity-40 border-t-2 border-r-2 border-[#D4B872] rounded-tr-3xl"></div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 opacity-40 border-b-2 border-l-2 border-[#D4B872] rounded-bl-3xl"></div>
                  <div className="absolute bottom-6 right-6 w-16 h-16 opacity-40 border-b-2 border-r-2 border-[#D4B872] rounded-br-3xl"></div>

                  <h1 className="text-6xl font-bold text-[#B89B5E] drop-shadow-md mb-10 font-serif leading-tight mt-8 tracking-wide text-center">
                    {groom} <span className="text-4xl text-[#D4B872] mx-2 drop-shadow-md">&</span> {bride}
                  </h1>
                  
                  <div className="flex flex-col items-center text-[#8C7A59] mb-10 space-y-3 font-medium drop-shadow-md">
                    <p className="text-xl font-bold">{weddingDate}</p>
                    <p className="text-xl font-bold">{weddingTime}</p>
                  </div>

                  {(data?.thumbnail_image_url || !data) && (
                    <div 
                      className="w-full max-w-[280px] aspect-[3/4] overflow-hidden border-4 border-white shadow-[0_10px_30px_rgba(184,155,94,0.15)] mb-10 relative bg-stone-100"
                      style={{ borderRadius: '50% 50% 0 0' }}
                    >
                       <img 
                        src={data?.thumbnail_image_url || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"} 
                        alt="العروسين" 
                        className="w-full h-full object-cover" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  )}

                  <div className="text-center px-4 mb-10 relative drop-shadow-md">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#D4B872] opacity-50 -mt-4"></div>
                    <p className="text-[#8C7A59] text-xl leading-[1.8] whitespace-pre-wrap font-medium font-bold">
                      {message}
                    </p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#D4B872] opacity-50 -mb-4"></div>
                  </div>

                  <Countdown />
                  
                  {/* RSVP Section */}
                  <div className="w-full max-w-sm mt-8 mb-8 bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-[#D4B872]/30 shadow-sm relative z-10">
                    <h2 className="text-2xl font-bold text-[#B89B5E] text-center mb-6 font-serif">تأكيد الحضور</h2>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="الاسم" 
                        className="w-full bg-white/90 border border-[#D4C3A3] rounded-xl px-4 py-3 text-[#8C7A59] placeholder-[#D4C3A3] focus:outline-none focus:ring-2 focus:ring-[#D4B872]/50 font-sans"
                      />
                      <div className="relative">
                        <select 
                          value={rsvpCount}
                          onChange={(e) => setRsvpCount(e.target.value)}
                          className="w-full bg-white/90 border border-[#D4C3A3] rounded-xl px-4 py-3 text-[#8C7A59] focus:outline-none focus:ring-2 focus:ring-[#D4B872]/50 appearance-none font-sans"
                        >
                          <option value="" disabled>عدد المرافقين</option>
                          <option value="0">بدون مرافقين</option>
                          <option value="1">١ مرافق</option>
                          <option value="2">٢ مرافقين</option>
                          <option value="3">٣ مرافقين</option>
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4C3A3]">▼</div>
                      </div>
                      <button 
                        disabled={!rsvpName || !rsvpCount}
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-gradient-to-r from-[#C2A366] to-[#D4B872] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(212,184,114,0.4)] hover:shadow-[0_6px_20px_rgba(212,184,114,0.6)] transition-all active:scale-95 font-sans"
                      >
                        تأكيد الحضور بضغطة
                      </button>
                    </div>
                  </div>

                  {/* Guestbook Section */}
                  <div className="w-full max-w-sm mb-16 relative z-10">
                    <h2 className="text-2xl font-bold text-[#B89B5E] text-center mb-6 font-serif flex items-center justify-center gap-2">
                      دفتر التهاني <span className="text-lg">🕊️</span>
                    </h2>
                    <div className="space-y-4">
                      {guestbook.map((guest, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm border border-[#D4B872]/40 rounded-2xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-[#B89B5E]">{guest.name}</span>
                            <span className="text-sm font-sans font-semibold bg-[#D4B872]/20 text-[#8C7A59] px-2 py-1 rounded-md">{guest.guestsCount} مرافق</span>
                          </div>
                          {guest.message && <p className="text-[#8C7A59] leading-relaxed text-sm font-medium">{guest.message}</p>}
                        </div>
                      ))}
                      {guestbook.length === 0 && (
                        <div className="text-center text-[#8C7A59]/80 py-4 font-sans text-sm">كن أول المهنئين</div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Congratulation Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center bg-[#FAF8F5]/80 backdrop-blur-sm px-6"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-sm bg-[#FCFAEF] border border-[#D4B872]/40 rounded-3xl p-6 shadow-2xl relative"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4b872' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
                >
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-4 right-4 text-[#D4C3A3] hover:text-[#B89B5E] p-1"
                  >
                    <X size={20} />
                  </button>
                  <h3 className="text-xl font-bold text-[#B89B5E] text-center mb-6 mt-2 font-serif">اكتب تهنئتك للعروسين</h3>
                  <textarea 
                    rows={4}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="تهانينا القلبية..."
                    className="w-full bg-white/90 border border-[#D4C3A3] rounded-xl px-4 py-3 text-[#8C7A59] placeholder-[#D4C3A3] focus:outline-none focus:ring-2 focus:ring-[#D4B872]/50 resize-none mb-6 font-sans"
                  ></textarea>
                  <button 
                    disabled={isSubmitting}
                    onClick={handleSendCongratulation}
                    className="w-full bg-gradient-to-r from-[#C2A366] to-[#D4B872] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(212,184,114,0.4)] transition-all active:scale-95 font-sans"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال التهنئة'}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Toast */}
          <AnimatePresence>
            {isSuccessOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="absolute bottom-12 left-0 right-0 z-[70] flex items-center justify-center px-6 pointer-events-none"
              >
                <div className="bg-white/95 backdrop-blur-md border border-[#D4B872]/40 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-[#B89B5E] font-bold text-lg font-sans">شكراً، سجلنا حضوركم</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

       </div>
    </div>
  );
}
