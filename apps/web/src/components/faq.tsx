"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORT_EMAIL } from "@claimsaver/shared";
import { ObfuscatedMailtoButton } from "@/components/obfuscated-support-email";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}

export default function FAQ({
  title,
  subtitle,
  items,
  className = "",
}: FAQProps) {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const heading = title ?? t("faqBox.defaultTitle");
  const sub = subtitle ?? t("faqBox.defaultSubtitle");

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section
      className={`py-12 sm:py-16 bg-gradient-to-br from-gray-50/65 to-teal-50/65 dark:from-gray-950/65 dark:to-gray-900/65 relative z-10 backdrop-blur-[1px] ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Contact Info */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full mb-4 sm:mb-6 shadow-lg">
            <span className="text-white text-lg sm:text-2xl">❓</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-3 sm:mb-4">
            {heading}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {sub}
          </p>
        </div>

        {/* FAQ Content - Responsive Layout */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {/* Enhanced Help Box - Full width, prominent placement */}
          <div className="bg-gradient-to-r from-teal-50/90 to-teal-100/90 dark:from-teal-950/90 dark:to-teal-900/90 rounded-2xl p-8 border border-teal-200 dark:border-teal-800 backdrop-blur-[1px] shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t("faqBox.supportTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4 max-w-2xl">
                  {t("faqBox.supportBody")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <ObfuscatedMailtoButton className="inline-flex items-center justify-center bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    {SUPPORT_EMAIL}
                  </ObfuscatedMailtoButton>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-2 border-teal-300 hover:border-teal-400 text-teal-700 dark:text-teal-300 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <a href="/when-to-call-an-attorney">{t("faqBox.attorneyLink")}</a>
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full flex items-center justify-center shadow-lg">
                  <HelpCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Questions Column - Full width */}
          <div>
            <div className="space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/92 dark:bg-gray-800/92 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-[1px]"
                >
                  <Button
                    variant="ghost"
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 sm:p-6 text-left flex items-start justify-between hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white pr-3 sm:pr-4 leading-tight">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-400 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300" />
                      )}
                    </div>
                  </Button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openItems.includes(index)
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Loading component for FAQ
export function FAQLoading() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full flex items-center justify-center shadow-lg"></div>
        </div>
      </div>
    </section>
  );
}
