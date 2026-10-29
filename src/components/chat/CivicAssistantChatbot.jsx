import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { aiChatService } from '../../services/api/aiChatService';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Bot,
  ArrowRight,
  HelpCircle,
  AlertOctagon,
  Clock,
  Building,
} from 'lucide-react';

export default function CivicAssistantChatbot() {
  const navigate = useNavigate();
  const { isMarathi, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const getInitialMessage = () => ({
    id: 1,
    sender: 'bot',
    text: isMarathi
      ? 'नमस्कार! मी इचलकरंजी महानगरपालिका नगरसेतू AI सहाय्यक आहे. मी तुम्हाला नागरी समस्यांची नोंद करणे, कामाची स्थिती तपासणे किंवा प्रभागाची माहिती मिळवण्यासाठी कशी मदत करू?'
      : 'Greetings! I am the Ichalkaranji Municipal NagarSetu AI Civic Assistant. How can I guide you with municipal services, complaint tracking, or reporting today?',
    actions: isMarathi
      ? [
          { label: 'खड्डे दुरुस्ती तक्रार कशी करावी?', prompt: 'खड्डा किंवा रस्ता दुरुस्ती कशी नोंदवावी?' },
          { label: 'माझ्या तक्रारीची स्थिती तपासा', prompt: 'माझी तक्रार कुठे आहे?' },
          { label: 'अग्रक्रम P1 ते P4 म्हणजे काय?', prompt: 'P2 अग्रक्रमाचा अर्थ काय?' },
          { label: 'कचरा व स्वच्छता माहिती', prompt: 'कचरा उचलण्याची जबाबदारी कोणत्या विभागाची आहे?' },
        ]
      : [
          { label: 'How to Report a Pothole', prompt: 'How do I report a pothole?' },
          { label: 'Track My Complaint', prompt: 'Where is my complaint?' },
          { label: 'Explain Priority P1-P4', prompt: 'What does P2 priority mean?' },
          { label: 'Garbage & Waste Info', prompt: 'Which department handles garbage?' },
        ],
  });

  const [messages, setMessages] = useState([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Re-seed greeting if language changes and only initial message is present
  useEffect(() => {
    setMessages((prev) => (prev.length <= 1 ? [getInitialMessage()] : prev));
  }, [isMarathi]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Dynamic Client-side NLP Fallback Engine
  const generateClientResponse = (query) => {
    const q = query.toLowerCase().trim();

    if (q.includes('pothole') || q.includes('road') || q.includes('asphalt') || q.includes('report') || q.includes('खड्डा') || q.includes('रस्ता')) {
      return {
        text: isMarathi
          ? `इचलकरंजीमध्ये रस्ता किंवा खड्डा दुरुस्तीची तक्रार नोंदवण्यासाठी:
1. डाव्या मेनूमधून "नवीन तक्रार नोंदवा" वर क्लिक करा.
2. विभाग निवडा: "रस्ता खराब व खड्डे दुरुस्ती".
3. समस्येचे शीर्षक, तपशील व फोटो पुरावा अपलोड करा.
4. नकाशावर संबंधित प्रभाग निवडा.
5. सबमिट करून तात्काळ युनिक ट्रॅकिंग आयडी (उदा. NGS-2026-000143) मिळवा.`
          : `To report a pothole or road damage in Ichalkaranji:
1. Click "Report Civic Issue" in the sidebar menu.
2. Select Category: "Road Damage / Pothole Cavity".
3. Add title, description, and upload evidence photo/video.
4. Pin location on the Ichalkaranji map to resolve your prabhag.
5. Confirm submission to get atomic Complaint ID (e.g. NGS-2026-000143).`,
        actions: [
          { label: isMarathi ? 'आताच तक्रार नोंदवा' : 'Report Road Issue Now', path: '/citizen/report' },
          { label: isMarathi ? 'माझ्या तक्रारी पहा' : 'View My Complaints', path: '/citizen/dashboard' },
        ],
      };
    } else if (q.includes('water') || q.includes('leak') || q.includes('pipe') || q.includes('contamination') || q.includes('पाणी')) {
      return {
        text: isMarathi
          ? `पाणी पुरवठा व जलनिस्सारण विभागाकडे पंचगंगा उपसा केंद्र व शहरातील सर्व पाइपलाइन देखभालीची जबाबदारी आहे. पाणी गळती अथवा अस्वच्छतेच्या तक्रारी ४ ते ६ तासांच्या मुदतीत (P1/P2) सोडवल्या जातात.`
          : `Water leaks and supply contamination are classified as P1/P2 Critical Priority with 4-24h SLA. They are dispatched to the Water Supply & Pipeline Management Department for rapid repair.`,
        actions: [{ label: isMarathi ? 'पाणी समस्या नोंदवा' : 'Report Water Leak', path: '/citizen/report' }],
      };
    } else if (q.includes('garbage') || q.includes('waste') || q.includes('trash') || q.includes('clean') || q.includes('कचरा')) {
      return {
        text: isMarathi
          ? `घनकचरा व्यवस्थापन व स्वच्छता विभागाद्वारे प्रभागांमधील दैनंदिन कचरा उचल व स्वच्छता केली जाते. क्षेत्रीय कर्मचारी काम पूर्ण झाल्यावर फोटो पुरावा प्रणालीवर अपलोड करतात.`
          : `Solid waste accumulation grievances are handled by the Sanitation Cell with a 24-hour SLA. Field workers upload before/after photos upon completion.`,
        actions: [{ label: isMarathi ? 'कचरा तक्रार नोंदवा' : 'Report Garbage Issue', path: '/citizen/report' }],
      };
    } else if (q.includes('light') || q.includes('street light') || q.includes('dark') || q.includes('lamp') || q.includes('दिवा') || q.includes('लाईट')) {
      return {
        text: isMarathi
          ? `इचलकरंजीमधील पथदिवे व विद्युत दोष निवारण विद्युत विभागाकडे वर्ग केले जातात. दुरुस्तीनंतर नियंत्रण कक्षात अहवाल नोंदवला जातो.`
          : `Streetlight outages are dispatched to Electrical & Streetlighting Cell. Workers repair cabling or replace bulbs and upload completion proof.`,
        actions: [{ label: isMarathi ? 'पथदिवे दुरुस्ती नोंदवा' : 'Report Streetlight Outage', path: '/citizen/report' }],
      };
    } else if (q.includes('track') || q.includes('where is my complaint') || q.includes('status') || q.includes('ngs-') || q.includes('स्थिती')) {
      return {
        text: isMarathi
          ? `आपल्या तक्रारीची सद्यस्थिती नागरिक डॅशबोर्डवर थेट तपासता येते:
नोंदणी झाली → AI विश्लेषण → प्रभाग वाटप → कामाचे आदेश → काम प्रगतीपथावर → नागरी पडताळणी प्रलंबित → निवारण पूर्ण.`
          : `Track your reported issues on the Citizen Dashboard.
Workflow States:
SUBMITTED → AI_ANALYSIS → ROUTED → ASSIGNED → IN_PROGRESS → AWAITING_CITIZEN_VERIFICATION → CLOSED.`,
        actions: [{ label: isMarathi ? 'नागरिक डॅशबोर्ड उघडा' : 'Open Citizen Dashboard', path: '/citizen/dashboard' }],
      };
    } else if (q.includes('priority') || q.includes('p1') || q.includes('p2') || q.includes('sla') || q.includes('अग्रक्रम')) {
      return {
        text: isMarathi
          ? `इचलकरंजी मनपा सेवा हमी मुदत (SLA):
• P1 (अतितातडीची): ४ तास (उदा. मुख्य जलवाहिनी फुटणे, जिवंत विद्युत तार).
• P2 (उच्च अग्रक्रम): २४ तास (उदा. रस्ता खड्डे, पडलेली झाडे).
• P3 (मध्यम): ४८ तास (उदा. पेव्हर ब्लॉक दुरुस्ती).
• P4 (सामान्य): ७२ तास.`
          : `Priority Tiers & SLA:
• P1 (Critical Emergency): 4h SLA (e.g. pipe explosion, live wire).
• P2 (High Priority): 24h SLA (e.g. pothole, fallen tree branch).
• P3 (Medium Priority): 48h SLA (e.g. broken paver block).
• P4 (Low Priority): 72h SLA.`,
        actions: [{ label: isMarathi ? 'SLA मॉनिटर पहा' : 'View SLA Command Center', path: '/controller/sla' }],
      };
    } else if (q.includes('reopen') || q.includes('not fixed') || q.includes('persist')) {
      return {
        text: isMarathi
          ? `जर तक्रारीचे निवारण योग्य झाले नसेल, तर आपण केस फाईलमध्ये "काम अपूर्ण आहे" क्लिक करून फेरदुरुस्तीची मागणी करू शकता.`
          : `If a resolved issue was not fixed properly, click "NO — Issue Still Exists" on your Case File page. Status updates to REOPENED and escalates to the supervisor.`,
        actions: [{ label: isMarathi ? 'माझ्या तक्रारी पहा' : 'View My Complaints', path: '/citizen/dashboard' }],
      };
    } else if (q.includes('emergency') || q.includes('police') || q.includes('disaster') || q.includes('आपत्कालीन')) {
      return {
        text: isMarathi
          ? `गंभीर आपत्कालीन किंवा पूर परिस्थितीचे समन्वय आपत्कालीन नियंत्रण कक्षाद्वारे केले जाते.`
          : `High-risk disaster and emergency incidents are coordinated via the Emergency Gateway for inter-agency rapid response.`,
        actions: [{ label: isMarathi ? 'आपत्कालीन कक्ष उघडा' : 'Open Emergency Gateway', path: '/emergency' }],
      };
    } else if (q.includes('project') || q.includes('public work') || q.includes('budget') || q.includes('विकासकाम')) {
      return {
        text: isMarathi
          ? `इचलकरंजी शहरातील सार्वजनिक विकासकामे (रस्ते डांबरीकरण, जलवाहिन्या, एलईडी पथदिवे) सार्वजनिक विकासकामे पृष्ठावर पाहू शकता.`
          : `You can monitor municipal capital infrastructure schemes (road resurfacing, sewer lines, LED grids) on the Public Projects page.`,
        actions: [{ label: isMarathi ? 'सार्वजनिक कामे पहा' : 'View Public Projects', path: '/public-projects' }],
      };
    } else {
      return {
        text: isMarathi
          ? `आपण नगरसेतू AI द्वारे नागरी तक्रार नोंदवू शकता, कामाची प्रगती तपासू शकता किंवा शहरातील प्रभाग व विकासकामांची माहिती मिळवू शकता.`
          : `Regarding "${query}": You can report issues via the guided wizard, track complaint progress on your Citizen Dashboard, or explore city analytics & public projects anytime.`,
        actions: [
          { label: isMarathi ? 'नवीन तक्रार नोंदवा' : 'Report Civic Issue', path: '/citizen/report' },
          { label: isMarathi ? 'नागरिक डॅशबोर्ड' : 'View Citizen Dashboard', path: '/citizen/dashboard' },
          { label: isMarathi ? 'सार्वजनिक विकासकामे' : 'View Public Projects', path: '/public-projects' },
        ],
      };
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await aiChatService.sendMessage(query);
      const data = res.data?.data;

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data?.reply || generateClientResponse(query).text,
        actions: data?.suggestedActions || generateClientResponse(query).actions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Intelligent Client Fallback - ALWAYS RESPONDS TO EVERY QUESTION
      const fallback = generateClientResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: fallback.text,
        actions: fallback.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.path) {
      navigate(action.path);
      setIsOpen(false);
    } else if (action.prompt) {
      handleSend(action.prompt);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs shadow-2xl shadow-amber-500/30 border border-amber-400"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>{isMarathi ? 'नागरी AI सहाय्यक' : 'CIVIC ASSISTANT'}</span>
        </motion.button>
      )}

      {/* Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[90vw] sm:w-[420px] h-[540px] bg-white dark:bg-brand-charcoal border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
          >
            {/* Top Bar Header */}
            <div className="p-3.5 bg-slate-100 dark:bg-brand-deepCharcoal border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/50 flex items-center justify-center bg-slate-900 shadow-sm shrink-0">
                  <img src="/assets/nagarsetu-icon.png" alt="NagarSetu AI" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-sans tracking-wide">
                    {isMarathi ? 'नगरसेतू AI नागरी सहाय्यक' : 'NAGARSETU CIVIC ASSISTANT'}
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{' '}
                    {isMarathi ? 'उपलब्ध व सज्ज' : 'ONLINE & READY'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([getInitialMessage()])}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[10px] font-mono"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`p-3 rounded-2xl ${
                        m.sender === 'user'
                          ? 'bg-amber-500 text-slate-950 font-semibold rounded-tr-none shadow-md'
                          : 'bg-slate-100 dark:bg-brand-deepCharcoal border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line text-xs leading-relaxed">{m.text}</p>
                    </div>

                    {/* Suggested Action Chips */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(act)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-amber-500/40 text-[10px] text-amber-600 dark:text-amber-300 font-mono font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-xs font-mono">
                  <Bot className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>{isMarathi ? 'नगरसेतू AI विश्लेषण करत आहे...' : 'NagarSetu AI is analyzing...'}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer Banner */}
            <div className="px-3 py-1 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[9px] font-mono text-slate-500 text-center">
              {isMarathi
                ? 'नगरसेतू AI नागरी सहाय्यक — केवळ मार्गदर्शनासाठी व माहितीसाठी.'
                : 'AI assistant — information and guidance only.'}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-slate-50 dark:bg-brand-deepCharcoal border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isMarathi
                    ? 'कोणताही प्रश्न विचारा (खड्डे, पाणी, कामाची स्थिती, प्रभाग)...'
                    : 'Ask any question (pothole, water leak, status, SLA)...'
                }
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-amber-500 font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
