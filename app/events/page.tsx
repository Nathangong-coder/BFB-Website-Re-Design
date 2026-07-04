"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isTuesday, addWeeks, startOfToday, isAfter, isBefore, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Date | null>(null);

  const minDate = new Date(2026, 0, 1);
  const maxHighlightDate = new Date(2026, 5, 5); // June 5th, 2026

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  // Calculate the offset to align the 1st of the month with the correct weekday
  const startDayOfWeek = getDay(monthStart);

  const handlePrevMonth = () => {
    if (isBefore(currentDate, minDate)) return;
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const isEventDay = (date: Date) => {
    return isTuesday(date) && !isAfter(date, maxHighlightDate) && !isBefore(date, minDate);
  };

  const today = startOfToday();
  const pastEvents: Date[] = [];
  const upcomingEvents: Date[] = [];

  const allTuesdays = eachDayOfInterval({
    start: minDate,
    end: addWeeks(today, 3)
  });

  allTuesdays.forEach(d => {
    if (isTuesday(d)) {
      if (isBefore(d, today)) pastEvents.push(d);
      else upcomingEvents.push(d);
    }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-midnight pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <span className="block w-full text-center text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue mb-4">Events</span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-silver">Calendar</h1>
        </header>

        <div className="bg-white dark:bg-glass border border-slate-100 dark:border-white/10 rounded-xl p-8 relative">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevMonth}
              disabled={isBefore(currentDate, minDate)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft />
            </button>
            <h2 className="font-serif text-xl">{format(currentDate, "MMMM yyyy")}</h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>
            ))}

            {/* Render empty slots for the start of the month */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-4" />
            ))}

            {daysInMonth.map((day, i) => {
              const highlighted = isEventDay(day);
              return (
                <div
                  key={i}
                  onClick={() => highlighted && setSelectedEvent(day)}
                  className={`p-4 text-center text-sm cursor-pointer transition-all duration-200 relative
                    ${highlighted
                      ? "bg-bfb-blue text-white rounded-full hover:scale-110 shadow-lg shadow-bfb-blue/30"
                      : "hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-full"
                    }`}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-10 flex items-center justify-center p-8 bg-white/80 dark:bg-midnight/80 backdrop-blur-sm rounded-xl"
              >
                <div className="bg-white dark:bg-glass border border-slate-100 dark:border-white/10 p-6 rounded-xl shadow-xl max-w-xs w-full text-center space-y-4">
                  <div className="inline-flex p-3 bg-bfb-blue/10 text-bfb-blue rounded-full">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">General Meeting</h3>
                    <p className="text-sm text-slate-500 dark:text-silver/60">
                      {format(selectedEvent, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-2 bg-slate-100 dark:bg-white/10 rounded-sm text-xs font-bold uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-lg font-serif">Upcoming Events</h3>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                </div>
                <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="p-4 border-l-2 border-bfb-blue bg-slate-50 dark:bg-glass"
                    >
                        <p className="text-sm font-bold text-slate-900 dark:text-silver">General Meeting</p>
                        <p className="text-xs text-slate-500 dark:text-silver/60">{format(d, "MMMM d, yyyy")}</p>
                    </motion.div>
                ))}
                </div>
            </section>
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-lg font-serif">Past Events</h3>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                </div>
                <div className="space-y-4">
                {pastEvents.reverse().slice(0, 5).map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="p-4 border-l-2 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-glass/50"
                    >
                        <p className="text-sm text-slate-700 dark:text-silver/80">General Meeting</p>
                        <p className="text-xs text-slate-500 dark:text-silver/60">{format(d, "MMMM d, yyyy")}</p>
                    </motion.div>
                ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
