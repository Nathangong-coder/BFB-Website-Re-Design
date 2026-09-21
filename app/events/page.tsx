"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isTuesday,
  startOfToday,
  isBefore,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CalendarEvent = { date: Date; title: string; time?: string };

// Earliest month the calendar will navigate back to.
const minDate = new Date(2026, 0, 1);

// Weekly general meetings run every Tuesday from January through June 5, 2026.
const generalMeetings: CalendarEvent[] = eachDayOfInterval({
  start: minDate,
  end: new Date(2026, 5, 5),
})
  .filter((date) => isTuesday(date))
  .map((date) => ({ date, title: "General Meeting" }));

// Fall 2026 recruiting cycle — mirrors the dates on /recruitment.
const recruitingEvents: CalendarEvent[] = [
  { date: new Date(2026, 8, 22), title: "Applications Open" },
  { date: new Date(2026, 8, 30), title: "UBS Fall Business Showcase", time: "6:00–8:00 PM" },
  { date: new Date(2026, 9, 2), title: "Info Session" },
  { date: new Date(2026, 9, 2), title: "Applications Due", time: "11:59 PM" },
  { date: new Date(2026, 9, 5), title: "Coffee Chats" },
  { date: new Date(2026, 9, 8), title: "Final Round Interviews", time: "Day 1" },
  { date: new Date(2026, 9, 9), title: "Final Round Interviews", time: "Day 2" },
];

const allEvents: CalendarEvent[] = [...generalMeetings, ...recruitingEvents].sort(
  (a, b) => a.date.getTime() - b.date.getTime()
);

const eventsOn = (day: Date) => allEvents.filter((e) => isSameDay(e.date, day));

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Offset so the 1st lands on the correct weekday column.
  const startDayOfWeek = getDay(monthStart);

  const handlePrevMonth = () => {
    if (isBefore(currentDate, minDate)) return;
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const today = startOfToday();
  const pastEvents = allEvents.filter((e) => isBefore(e.date, today));
  const upcomingEvents = allEvents.filter((e) => !isBefore(e.date, today));

  const selectedEvents = selectedDay ? eventsOn(selectedDay) : [];

  return (
    <div className="relative min-h-screen bg-white dark:bg-midnight pt-page pb-section px-gutter overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="block w-full text-center text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue">Events</span>
          <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-center">Calendar</h1>
        </header>

        <div className="bg-white dark:bg-glass border border-slate-100 dark:border-white/10 rounded-xl p-6 relative">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevMonth}
              disabled={isBefore(currentDate, minDate)}
              aria-label="Previous month"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <h2 className="font-serif text-xl">{format(currentDate, "MMMM yyyy")}</h2>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>
            ))}

            {/* Render empty slots for the start of the month */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2.5" />
            ))}

            {daysInMonth.map((day, i) => {
              const dayEvents = eventsOn(day);
              const highlighted = dayEvents.length > 0;

              if (!highlighted) {
                return (
                  <div
                    key={i}
                    className="p-2.5 text-center text-sm text-slate-500 dark:text-silver/50 tabular-nums"
                  >
                    {format(day, "d")}
                  </div>
                );
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  aria-label={`${format(day, "MMMM d")}: ${dayEvents.map((e) => e.title).join(", ")}`}
                  style={{ touchAction: "manipulation" }}
                  className="p-2.5 text-center text-sm tabular-nums bg-bfb-blue text-white rounded-full shadow-lg shadow-bfb-blue/30 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2"
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-10 flex items-center justify-center p-8 bg-white/80 dark:bg-midnight/80 backdrop-blur-sm rounded-xl"
              >
                <div className="bg-white dark:bg-glass border border-slate-100 dark:border-white/10 p-6 rounded-xl shadow-xl max-w-xs w-full text-center space-y-4">
                  <div className="inline-flex p-3 bg-bfb-blue/10 text-bfb-blue rounded-full">
                    <Info size={24} aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    {selectedEvents.map((event) => (
                      <div key={`${event.title}-${event.time ?? ""}`}>
                        <h3 className="font-serif text-xl mb-1 text-pretty">{event.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-silver/60">
                          {format(event.date, "EEEE, MMMM d, yyyy")}
                          {event.time ? ` · ${event.time}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="w-full py-2 bg-slate-100 dark:bg-white/10 rounded-sm text-xs font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue"
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
                {upcomingEvents.slice(0, 5).map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="p-4 border-l-2 border-bfb-blue bg-slate-50 dark:bg-glass"
                    >
                        <p className="text-sm font-bold text-slate-900 dark:text-silver">{event.title}</p>
                        <p className="text-xs text-slate-500 dark:text-silver/60">
                          {format(event.date, "MMMM d, yyyy")}
                          {event.time ? ` · ${event.time}` : ""}
                        </p>
                    </motion.div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-silver/40">No upcoming events scheduled.</p>
                )}
                </div>
            </section>
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-lg font-serif">Past Events</h3>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                </div>
                <div className="space-y-4">
                {[...pastEvents].reverse().slice(0, 5).map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="p-4 border-l-2 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-glass/50"
                    >
                        <p className="text-sm text-slate-700 dark:text-silver/80">{event.title}</p>
                        <p className="text-xs text-slate-500 dark:text-silver/60">
                          {format(event.date, "MMMM d, yyyy")}
                          {event.time ? ` · ${event.time}` : ""}
                        </p>
                    </motion.div>
                ))}
                {pastEvents.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-silver/40">No past events yet.</p>
                )}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
