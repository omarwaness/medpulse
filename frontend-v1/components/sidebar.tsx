'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  User,
  Cat,
  History,
  Clock,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Owners', href: '/owners', icon: User },
  { name: 'Patients', href: '/patients', icon: Cat },
  { name: 'Schedule', href: '/schedule', icon: Clock },
  { name: 'Billings', href: '/billings', icon: CreditCard },
  { name: 'History', href: '/history', icon: History }
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  return (
    <motion.div
      className="relative flex flex-col bg-zinc-100/80 h-screen transition-colors border-r border-slate-200"
      animate={{ width: isCollapsed ? '85px' : '260px' }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle Button - Larger, chevron turns blue on hover */}
      {isHovered && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border bg-zinc-300 shadow-sm hover:shadow-md group transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6 transition-colors group-hover:text-blue-500" />
          ) : (
            <ChevronLeft className="h-6 w-6 transition-colors group-hover:text-blue-500" />
          )}
        </button>
      )}

      {/* Navigation Container - Padding on Top, Left, Right */}
      <div className="flex flex-col w-full pt-5 px-4.25">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <React.Fragment key={item.name}>
              {index === 4 && <Separator className="my-1.5" />}
              <Link
                key={item.name}
                href={item.href}
                passHref
                className="w-full"
              >
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-10 px-3 transition-all cursor-pointer',
                    // Slightly darker gray for active buttons
                    isActive
                      ? 'bg-zinc-200 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-700 font-medium'
                      : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-700'
                  )}
                >
                  {/* Fixed width container for icon prevents "jumping" */}
                  <div className="flex items-center justify-center w-6 shrink-0">
                    <item.icon className="h-5 w-5" />
                  </div>

                  {/* Smooth text animation */}
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>
              {index === 5 && <Separator className="my-1.5" />}
            </React.Fragment>
          )
        })}
      </div>
    </motion.div>
  )
}
