"use client";

import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    // Show button after scrolling down a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappLink = "https://wa.me/5562981316462?text=Ol%C3%A1!%20Visitei%20o%20site%20da%20Use%20KIN%20e%20gostaria%20de%20tirar%20algumas%20d%C3%BAvidas.%20Pode%20me%20ajudar%3F";

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative">
        {/* Tooltip */}
        <div
          className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap transition-all duration-200 ${
            isTooltipVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
          }`}
        >
          Fale conosco
          <div className="absolute top-full right-4 -mt-1">
            <div className="border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } animate-pulse`}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          aria-label="Fale conosco pelo WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>

      {/* Pulse animation overlay */}
      <div
        className={`absolute inset-0 bg-green-400 rounded-full animate-ping pointer-events-none ${
          isVisible ? "inline-block" : "hidden"
        }`}
        style={{ animationDuration: "2s" }}
      />
    </div>
  );
}
