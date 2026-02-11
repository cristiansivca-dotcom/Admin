"use client";

import { useTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const colors = [
    { name: "Blue", primary: "59, 130, 246", secondary: "99, 102, 241", class: "bg-blue-500" },
    { name: "Purple", primary: "168, 85, 247", secondary: "236, 72, 153", class: "bg-purple-500" },
    { name: "Green", primary: "34, 197, 94", secondary: "16, 185, 129", class: "bg-green-500" },
    { name: "Orange", primary: "249, 115, 22", secondary: "234, 179, 8", class: "bg-orange-500" },
    { name: "Pink", primary: "236, 72, 153", secondary: "244, 63, 94", class: "bg-pink-500" },
];

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [activeColor, setActiveColor] = useState(() => {
        if (typeof window !== "undefined") {
            const savedPrimary = localStorage.getItem("theme-primary");
            if (savedPrimary) {
                const found = colors.find((c) => c.primary === savedPrimary);
                if (found) return found.name;
            }
        }
        return "Blue";
    });

    const updateCssVars = (primary: string, secondary: string) => {
        document.documentElement.style.setProperty("--primary-color", primary);
        document.documentElement.style.setProperty("--secondary-color", secondary);
    };

    useLayoutEffect(() => {
        const savedPrimary = localStorage.getItem("theme-primary");
        const savedSecondary = localStorage.getItem("theme-secondary");
        if (savedPrimary) {
            updateCssVars(savedPrimary, savedSecondary || "");
        }
    }, []);

    const handleColorChange = (color: typeof colors[0]) => {
        setActiveColor(color.name);
        updateCssVars(color.primary, color.secondary);
        localStorage.setItem("theme-primary", color.primary);
        localStorage.setItem("theme-secondary", color.secondary);
    };



    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="glass p-4 rounded-2xl flex flex-col gap-4 min-w-[180px]"
                    >
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Modo</span>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">Acento</span>
                            <div className="grid grid-cols-5 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => handleColorChange(color)}
                                        className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                                            color.class
                                        )}
                                        title={color.name}
                                    >
                                        {activeColor === color.name && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group",
                    theme === "dark" ? "bg-white text-black hover:bg-blue-50" : "bg-black text-white hover:bg-gray-900"
                )}
            >
                <Palette className={cn("w-6 h-6 transition-transform duration-500", isOpen && "rotate-180")} />
            </button>
        </div>
    );
}
