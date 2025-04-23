
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Pencil, FileText, Paperclip, Coffee, Highlighter, Eraser, Bookmark, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import TypewriterTitle from "@/components/ui/TypewriterTitle";
import Link from "next/link";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8f5e6] bg-[url('/notebook-grid.svg')]">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left Group */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] text-[#5c4f3a] opacity-60"
        >
          <Pencil size={40} className="transform -rotate-45" />
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-15, 5, -15] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-40 left-[10%] text-[#8a7456] opacity-50"
        >
          <BookOpen size={56} />
        </motion.div>

        {/* Top Right Group */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-8, 12, -8] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut", delay: 1 }}
          className="absolute top-32 right-[20%] text-[#e57373] opacity-60"
        >
          <Paperclip size={32} className="transform rotate-12" />
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-12, 8, -12] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut", delay: 0.7 }}
          className="absolute top-60 right-[15%] text-[#5c4f3a] opacity-50"
        >
          <FileText size={48} className="transform -rotate-12" />
        </motion.div>

        {/* Bottom Left Group */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4.5, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-32 left-[25%] text-[#e57373] opacity-60"
        >
          <Highlighter size={36} className="transform rotate-45" />
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-15, 5, -15] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5.5, ease: "easeInOut", delay: 0.3 }}
          className="absolute bottom-48 left-[18%] text-[#8a7456] opacity-50"
        >
          <Coffee size={40} />
        </motion.div>

        {/* Bottom Right Group */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-12, 8, -12] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 right-[22%] text-[#5c4f3a] opacity-60"
        >
          <Eraser size={32} className="transform -rotate-12" />
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-8, 12, -8] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut", delay: 1.2 }}
          className="absolute bottom-60 right-[28%] text-[#8a7456] opacity-50"
        >
          <Bookmark size={44} className="transform rotate-12" />
        </motion.div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8f5e6]/30 to-[#f8f5e6]/70 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5e6]/50 via-transparent to-[#f8f5e6]/50 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-[#2d2d2d]">AI</span> <span className="text-[#ff5722]">note taking</span>
            <br />
            <span className="text-[#2d2d2d]">assistant.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-8 text-xl text-[#5c4f3a]"
          >
            <Rocket className="text-[#ff5722]" size={24} />
            <h2 className="font-semibold text-3xl text-center text-slate-700">
              <TypewriterTitle />
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#e2d9bc]/40 to-transparent pointer-events-none"></div>
    </div>
  )
}

