import React, { useState } from "react";
import { ElementData } from "@/types/game";
import { elementData } from "@/data/elements";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Theme = 
  | "classic" 
  | "3d" 
  | "neon"
  | "pastel"
  | "monochrome"
  | "gradient"
  | "retro"
  | "cyberpunk"
  | "nature"
  | "ocean"
  | "space"
  | "rainbow"
  | "minimal";

const themeStyles = {
  classic: {
    nonmetal: "bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800",
    "noble-gas": "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800",
    "alkali-metal": "bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800",
    "alkaline-earth": "bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800",
    metalloid: "bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800",
    halogen: "bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800",
    transition: "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800",
    "post-transition": "bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800",
    actinide: "bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800",
    lanthanide: "bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 dark:hover:bg-rose-800",
    default: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
  },
  "3d": {
    nonmetal: "bg-emerald-200 dark:bg-emerald-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    "noble-gas": "bg-purple-200 dark:bg-purple-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    "alkali-metal": "bg-red-200 dark:bg-red-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    "alkaline-earth": "bg-orange-200 dark:bg-orange-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    metalloid: "bg-teal-200 dark:bg-teal-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    halogen: "bg-yellow-200 dark:bg-yellow-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    transition: "bg-blue-200 dark:bg-blue-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    "post-transition": "bg-indigo-200 dark:bg-indigo-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    actinide: "bg-pink-200 dark:bg-pink-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    lanthanide: "bg-rose-200 dark:bg-rose-800 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl",
    default: "bg-gray-200 dark:bg-gray-700 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
  },
  neon: {
    nonmetal: "bg-emerald-500/20 dark:bg-emerald-500/30 hover:bg-emerald-500/30 dark:hover:bg-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    "noble-gas": "bg-purple-500/20 dark:bg-purple-500/30 hover:bg-purple-500/30 dark:hover:bg-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    "alkali-metal": "bg-red-500/20 dark:bg-red-500/30 hover:bg-red-500/30 dark:hover:bg-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
    "alkaline-earth": "bg-orange-500/20 dark:bg-orange-500/30 hover:bg-orange-500/30 dark:hover:bg-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.5)]",
    metalloid: "bg-teal-500/20 dark:bg-teal-500/30 hover:bg-teal-500/30 dark:hover:bg-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.5)]",
    halogen: "bg-yellow-500/20 dark:bg-yellow-500/30 hover:bg-yellow-500/30 dark:hover:bg-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
    transition: "bg-blue-500/20 dark:bg-blue-500/30 hover:bg-blue-500/30 dark:hover:bg-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    "post-transition": "bg-indigo-500/20 dark:bg-indigo-500/30 hover:bg-indigo-500/30 dark:hover:bg-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.5)]",
    actinide: "bg-pink-500/20 dark:bg-pink-500/30 hover:bg-pink-500/30 dark:hover:bg-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    lanthanide: "bg-rose-500/20 dark:bg-rose-500/30 hover:bg-rose-500/30 dark:hover:bg-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.5)]",
    default: "bg-gray-500/20 dark:bg-gray-500/30 hover:bg-gray-500/30 dark:hover:bg-gray-500/40 shadow-[0_0_15px_rgba(107,114,128,0.5)]"
  },
  pastel: {
    nonmetal: "bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    "noble-gas": "bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/40",
    "alkali-metal": "bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40",
    "alkaline-earth": "bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/40",
    metalloid: "bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/40",
    halogen: "bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/40",
    transition: "bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40",
    "post-transition": "bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40",
    actinide: "bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/40",
    lanthanide: "bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40",
    default: "bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-900/40"
  },
  monochrome: {
    nonmetal: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600",
    "noble-gas": "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500",
    "alkali-metal": "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 border border-gray-500 dark:border-gray-400",
    "alkaline-earth": "bg-gray-400 dark:bg-gray-500 hover:bg-gray-500 dark:hover:bg-gray-400 border border-gray-600 dark:border-gray-300",
    metalloid: "bg-gray-500 dark:bg-gray-400 hover:bg-gray-600 dark:hover:bg-gray-300 border border-gray-700 dark:border-gray-200",
    halogen: "bg-gray-600 dark:bg-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200 border border-gray-800 dark:border-gray-100",
    transition: "bg-gray-700 dark:bg-gray-200 hover:bg-gray-800 dark:hover:bg-gray-100 border border-gray-900 dark:border-gray-50",
    "post-transition": "bg-gray-800 dark:bg-gray-100 hover:bg-gray-900 dark:hover:bg-gray-50 border border-gray-950 dark:border-gray-25",
    actinide: "bg-gray-900 dark:bg-gray-50 hover:bg-gray-950 dark:hover:bg-gray-25 border border-gray-950 dark:border-gray-25",
    lanthanide: "bg-gray-950 dark:bg-gray-25 hover:bg-gray-900 dark:hover:bg-gray-50 border border-gray-900 dark:border-gray-100",
    default: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
  },
  gradient: {
    nonmetal: "bg-gradient-to-br from-emerald-100 to-emerald-300 dark:from-emerald-900 dark:to-emerald-700 hover:from-emerald-200 hover:to-emerald-400 dark:hover:from-emerald-800 dark:hover:to-emerald-600",
    "noble-gas": "bg-gradient-to-br from-purple-100 to-purple-300 dark:from-purple-900 dark:to-purple-700 hover:from-purple-200 hover:to-purple-400 dark:hover:from-purple-800 dark:hover:to-purple-600",
    "alkali-metal": "bg-gradient-to-br from-red-100 to-red-300 dark:from-red-900 dark:to-red-700 hover:from-red-200 hover:to-red-400 dark:hover:from-red-800 dark:hover:to-red-600",
    "alkaline-earth": "bg-gradient-to-br from-orange-100 to-orange-300 dark:from-orange-900 dark:to-orange-700 hover:from-orange-200 hover:to-orange-400 dark:hover:from-orange-800 dark:hover:to-orange-600",
    metalloid: "bg-gradient-to-br from-teal-100 to-teal-300 dark:from-teal-900 dark:to-teal-700 hover:from-teal-200 hover:to-teal-400 dark:hover:from-teal-800 dark:hover:to-teal-600",
    halogen: "bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-900 dark:to-yellow-700 hover:from-yellow-200 hover:to-yellow-400 dark:hover:from-yellow-800 dark:hover:to-yellow-600",
    transition: "bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 hover:from-blue-200 hover:to-blue-400 dark:hover:from-blue-800 dark:hover:to-blue-600",
    "post-transition": "bg-gradient-to-br from-indigo-100 to-indigo-300 dark:from-indigo-900 dark:to-indigo-700 hover:from-indigo-200 hover:to-indigo-400 dark:hover:from-indigo-800 dark:hover:to-indigo-600",
    actinide: "bg-gradient-to-br from-pink-100 to-pink-300 dark:from-pink-900 dark:to-pink-700 hover:from-pink-200 hover:to-pink-400 dark:hover:from-pink-800 dark:hover:to-pink-600",
    lanthanide: "bg-gradient-to-br from-rose-100 to-rose-300 dark:from-rose-900 dark:to-rose-700 hover:from-rose-200 hover:to-rose-400 dark:hover:from-rose-800 dark:hover:to-rose-600",
    default: "bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 hover:from-gray-200 hover:to-gray-400 dark:hover:from-gray-800 dark:hover:to-gray-600"
  },
  retro: {
    nonmetal: "bg-emerald-400 dark:bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-500 border-2 border-emerald-600 dark:border-emerald-400",
    "noble-gas": "bg-purple-400 dark:bg-purple-600 hover:bg-purple-500 dark:hover:bg-purple-500 border-2 border-purple-600 dark:border-purple-400",
    "alkali-metal": "bg-red-400 dark:bg-red-600 hover:bg-red-500 dark:hover:bg-red-500 border-2 border-red-600 dark:border-red-400",
    "alkaline-earth": "bg-orange-400 dark:bg-orange-600 hover:bg-orange-500 dark:hover:bg-orange-500 border-2 border-orange-600 dark:border-orange-400",
    metalloid: "bg-teal-400 dark:bg-teal-600 hover:bg-teal-500 dark:hover:bg-teal-500 border-2 border-teal-600 dark:border-teal-400",
    halogen: "bg-yellow-400 dark:bg-yellow-600 hover:bg-yellow-500 dark:hover:bg-yellow-500 border-2 border-yellow-600 dark:border-yellow-400",
    transition: "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-500 border-2 border-blue-600 dark:border-blue-400",
    "post-transition": "bg-indigo-400 dark:bg-indigo-600 hover:bg-indigo-500 dark:hover:bg-indigo-500 border-2 border-indigo-600 dark:border-indigo-400",
    actinide: "bg-pink-400 dark:bg-pink-600 hover:bg-pink-500 dark:hover:bg-pink-500 border-2 border-pink-600 dark:border-pink-400",
    lanthanide: "bg-rose-400 dark:bg-rose-600 hover:bg-rose-500 dark:hover:bg-rose-500 border-2 border-rose-600 dark:border-rose-400",
    default: "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 border-2 border-gray-600 dark:border-gray-400"
  },
  cyberpunk: {
    nonmetal: "bg-emerald-300 dark:bg-emerald-700 hover:bg-emerald-400 dark:hover:bg-emerald-600 border-2 border-emerald-500 dark:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    "noble-gas": "bg-purple-300 dark:bg-purple-700 hover:bg-purple-400 dark:hover:bg-purple-600 border-2 border-purple-500 dark:border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
    "alkali-metal": "bg-red-300 dark:bg-red-700 hover:bg-red-400 dark:hover:bg-red-600 border-2 border-red-500 dark:border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    "alkaline-earth": "bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-600 border-2 border-orange-500 dark:border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]",
    metalloid: "bg-teal-300 dark:bg-teal-700 hover:bg-teal-400 dark:hover:bg-teal-600 border-2 border-teal-500 dark:border-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]",
    halogen: "bg-yellow-300 dark:bg-yellow-700 hover:bg-yellow-400 dark:hover:bg-yellow-600 border-2 border-yellow-500 dark:border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
    transition: "bg-blue-300 dark:bg-blue-700 hover:bg-blue-400 dark:hover:bg-blue-600 border-2 border-blue-500 dark:border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    "post-transition": "bg-indigo-300 dark:bg-indigo-700 hover:bg-indigo-400 dark:hover:bg-indigo-600 border-2 border-indigo-500 dark:border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]",
    actinide: "bg-pink-300 dark:bg-pink-700 hover:bg-pink-400 dark:hover:bg-pink-600 border-2 border-pink-500 dark:border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]",
    lanthanide: "bg-rose-300 dark:bg-rose-700 hover:bg-rose-400 dark:hover:bg-rose-600 border-2 border-rose-500 dark:border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]",
    default: "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 border-2 border-gray-500 dark:border-gray-400 shadow-[0_0_10px_rgba(107,114,128,0.5)]"
  },
  nature: {
    nonmetal: "bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 border border-green-300 dark:border-green-700",
    "noble-gas": "bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 border border-sky-300 dark:border-sky-700",
    "alkali-metal": "bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 border border-amber-300 dark:border-amber-700",
    "alkaline-earth": "bg-lime-100 dark:bg-lime-900 hover:bg-lime-200 dark:hover:bg-lime-800 border border-lime-300 dark:border-lime-700",
    metalloid: "bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800 border border-emerald-300 dark:border-emerald-700",
    halogen: "bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 border border-yellow-300 dark:border-yellow-700",
    transition: "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 border border-blue-300 dark:border-blue-700",
    "post-transition": "bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 border border-indigo-300 dark:border-indigo-700",
    actinide: "bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 dark:hover:bg-rose-800 border border-rose-300 dark:border-rose-700",
    lanthanide: "bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800 border border-pink-300 dark:border-pink-700",
    default: "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700"
  },
  ocean: {
    nonmetal: "bg-cyan-100 dark:bg-cyan-900 hover:bg-cyan-200 dark:hover:bg-cyan-800 border border-cyan-300 dark:border-cyan-700",
    "noble-gas": "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 border border-blue-300 dark:border-blue-700",
    "alkali-metal": "bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 border border-sky-300 dark:border-sky-700",
    "alkaline-earth": "bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 border border-indigo-300 dark:border-indigo-700",
    metalloid: "bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 border border-teal-300 dark:border-teal-700",
    halogen: "bg-violet-100 dark:bg-violet-900 hover:bg-violet-200 dark:hover:bg-violet-800 border border-violet-300 dark:border-violet-700",
    transition: "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 border border-purple-300 dark:border-purple-700",
    "post-transition": "bg-fuchsia-100 dark:bg-fuchsia-900 hover:bg-fuchsia-200 dark:hover:bg-fuchsia-800 border border-fuchsia-300 dark:border-fuchsia-700",
    actinide: "bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800 border border-pink-300 dark:border-pink-700",
    lanthanide: "bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 dark:hover:bg-rose-800 border border-rose-300 dark:border-rose-700",
    default: "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700"
  },
  space: {
    nonmetal: "bg-indigo-900 dark:bg-indigo-950 hover:bg-indigo-800 dark:hover:bg-indigo-900 border border-indigo-700 dark:border-indigo-800 shadow-[0_0_10px_rgba(99,102,241,0.3)]",
    "noble-gas": "bg-purple-900 dark:bg-purple-950 hover:bg-purple-800 dark:hover:bg-purple-900 border border-purple-700 dark:border-purple-800 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    "alkali-metal": "bg-blue-900 dark:bg-blue-950 hover:bg-blue-800 dark:hover:bg-blue-900 border border-blue-700 dark:border-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    "alkaline-earth": "bg-cyan-900 dark:bg-cyan-950 hover:bg-cyan-800 dark:hover:bg-cyan-900 border border-cyan-700 dark:border-cyan-800 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
    metalloid: "bg-teal-900 dark:bg-teal-950 hover:bg-teal-800 dark:hover:bg-teal-900 border border-teal-700 dark:border-teal-800 shadow-[0_0_10px_rgba(20,184,166,0.3)]",
    halogen: "bg-emerald-900 dark:bg-emerald-950 hover:bg-emerald-800 dark:hover:bg-emerald-900 border border-emerald-700 dark:border-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    transition: "bg-violet-900 dark:bg-violet-950 hover:bg-violet-800 dark:hover:bg-violet-900 border border-violet-700 dark:border-violet-800 shadow-[0_0_10px_rgba(139,92,246,0.3)]",
    "post-transition": "bg-fuchsia-900 dark:bg-fuchsia-950 hover:bg-fuchsia-800 dark:hover:bg-fuchsia-900 border border-fuchsia-700 dark:border-fuchsia-800 shadow-[0_0_10px_rgba(192,38,211,0.3)]",
    actinide: "bg-pink-900 dark:bg-pink-950 hover:bg-pink-800 dark:hover:bg-pink-900 border border-pink-700 dark:border-pink-800 shadow-[0_0_10px_rgba(236,72,153,0.3)]",
    lanthanide: "bg-rose-900 dark:bg-rose-950 hover:bg-rose-800 dark:hover:bg-rose-900 border border-rose-700 dark:border-rose-800 shadow-[0_0_10px_rgba(244,63,94,0.3)]",
    default: "bg-gray-900 dark:bg-gray-950 hover:bg-gray-800 dark:hover:bg-gray-900 border border-gray-700 dark:border-gray-800 shadow-[0_0_10px_rgba(107,114,128,0.3)]"
  },
  rainbow: {
    nonmetal: "bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800",
    "noble-gas": "bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800",
    "alkali-metal": "bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800",
    "alkaline-earth": "bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800",
    metalloid: "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800",
    halogen: "bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800",
    transition: "bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800",
    "post-transition": "bg-pink-100 dark:bg-pink-900 hover:bg-pink-200 dark:hover:bg-pink-800",
    actinide: "bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 dark:hover:bg-rose-800",
    lanthanide: "bg-violet-100 dark:bg-violet-900 hover:bg-violet-200 dark:hover:bg-violet-800",
    default: "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
  },
  minimal: {
    nonmetal: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    "noble-gas": "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    "alkali-metal": "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    "alkaline-earth": "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    metalloid: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    halogen: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    transition: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    "post-transition": "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    actinide: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    lanthanide: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    default: "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
  }
};

interface PeriodicTableProps {
  onElementClick: (element: ElementData) => void;
  selectedElement: ElementData | null;
  correctElement?: string;
  viewMode?: "standard" | "compact";
}

const PeriodicTable = ({
  onElementClick,
  selectedElement,
  correctElement,
  viewMode = "standard",
}: PeriodicTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [theme, setTheme] = useState<Theme>("classic");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const categories = [
    "all",
    "nonmetal",
    "noble-gas",
    "alkali-metal",
    "alkaline-earth",
    "metalloid",
    "halogen",
    "transition",
    "post-transition",
    "actinide",
    "lanthanide",
  ];

  const getElementColor = (category: string) => {
    const themeStyle = themeStyles[theme];
    return themeStyle[category as keyof typeof themeStyle] || themeStyle.default;
  };

  const filteredElements = elementData.filter(
    (element) =>
      selectedCategory === "all" || element.category === selectedCategory
  );

  return (
    <div className={cn("space-y-4", isDarkMode ? "dark" : "")}>
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {category.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Theme:</span>
            <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="3d">3D</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
                <SelectItem value="pastel">Pastel</SelectItem>
                <SelectItem value="monochrome">Monochrome</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="retro">Retro</SelectItem>
                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="ocean">Ocean</SelectItem>
                <SelectItem value="space">Space</SelectItem>
                <SelectItem value="rainbow">Rainbow</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "p-2 rounded-md transition-colors",
              isDarkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-1",
          viewMode === "standard"
            ? "grid-cols-18"
            : "grid-cols-10 sm:grid-cols-18"
        )}
      >
        {filteredElements.map((element) => (
          <button
            key={element.symbol}
            onClick={() => onElementClick(element)}
            className={cn(
              "p-2 rounded-md transition-all duration-200 flex flex-col items-center justify-center",
              getElementColor(element.category),
              selectedElement?.symbol === element.symbol &&
                "ring-2 ring-primary ring-offset-2"
            )}
          >
            <span className="text-xs font-medium">{element.atomicNumber}</span>
            <span className="text-lg font-bold">{element.symbol}</span>
            <span className="text-xs">{element.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PeriodicTable;
