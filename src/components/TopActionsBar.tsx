"use client";

import { useState } from "react";
import { Printer, Download, Globe, ChevronDown, Sun, Moon } from "lucide-react";

export default function TopActionsBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [language, setLanguage] = useState("English");

  const handlePrint = () => window.print();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="fixed mt-2 top-0 right-4 z-50">
      <div className="flex items-center gap-6 pr-10   backdrop-blur-md p-1 rounded-xl ">
        {/* Print */}
        <button
          onClick={handlePrint}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <Printer size={20} />
        </button>

        {/* Download */}
        <button
          onClick={() => alert("Download logic goes here")}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <Download size={20} />
        </button>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenLang(!openLang)}
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Globe size={20} />
            {/* <ChevronDown size={16} /> */}
          </button>

          {openLang && (
            <div className="absolute right-0 mt-2 w-30 dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg">
              <button
                onClick={() => {
                  setLanguage("English");
                  setOpenLang(false);
                }}
                className="block w-full text-center px-2 py-2 text-white  dark:hover:bg-gray-700"
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage("French");
                  setOpenLang(false);
                }}
                className="block w-full text-center px-2 py-2 text-[#2db85b] hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                French
              </button>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </div>
  );
}
