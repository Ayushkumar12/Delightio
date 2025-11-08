import React, { useState } from "react";
import Navbar from "../comp/Navbar";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "reservation",
    guests: "",
    message: "",
  });
  const channels = [
    { title: "Reservations", value: "+91 88000 11223", detail: "Table bookings and tasting menus" },
    { title: "Catering", value: "+91 88000 44556", detail: "Events, launches, and celebrations" },
    { title: "Concierge", value: "hello@delightio.com", detail: "General enquiries and feedback" },
  ];
  const hours = [
    { label: "Weekdays", value: "11:00 AM – 11:00 PM" },
    { label: "Weekends", value: "11:00 AM – 12:00 AM" },
  ];
  const topics = [
    { value: "reservation", label: "Reservation" },
    { value: "event", label: "Private event" },
    { value: "corporate", label: "Corporate catering" },
    { value: "partnership", label: "Partnership" },
    { value: "feedback", label: "Feedback" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", topic: "reservation", guests: "", message: "" });
  };

  return (
    <section>
      <Navbar />
      <main className="bg-stone-50" style={{ fontFamily: "Epilogue, Noto Sans, sans-serif" }}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/15 via-transparent to-amber-100/40" aria-hidden="true"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">
            <header className="text-center space-y-4 text-stone-800">
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--primary-color)]">Connect with Delightio</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Tell us how we can host you</h1>
              <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-600">
                Share your plans and our hospitality leads will tailor the perfect culinary experience, from intimate dinners to full-scale celebrations.
              </p>
            </header>
            <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
              <aside className="space-y-8">
                <div className="grid gap-4">
                  {channels.map((item) => (
                    <article key={item.title} className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-color)]">{item.title}</p>
                      <p className="text-xl font-semibold text-stone-900">{item.value}</p>
                      <p className="text-sm text-stone-600">{item.detail}</p>
                    </article>
                  ))}
                </div>
              </aside>
              <form className="bg-white border border-stone-200 rounded-2xl shadow-sm p-10 space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
                    Full name
                    <input
                      className="rounded-xl border border-stone-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Aarav Malhotra"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
                    Email address
                    <input
                      className="rounded-xl border border-stone-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="aarav@delightio.com"
                      required
                    />
                  </label>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
                    Phone number
                    <input
                      className="rounded-xl border border-stone-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 90000 12345"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
                    Topic
                    <select
                      className="rounded-xl border border-stone-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                    >
                      {topics.map((topic) => (
                        <option key={topic.value} value={topic.value}>{topic.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
                  Guests
                  <input
                    className="rounded-xl border border-stone-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="Number of guests"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
                  Message
                  <textarea
                    className="rounded-xl border border-stone-300 px-3 py-3 shadow-sm min-h-36 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your preferred date, cuisine inspirations, and any special requests"
                    required
                  />
                </label>
                <button
                  className="w-full bg-[var(--primary-color)] text-white rounded-xl px-5 py-3 text-sm font-semibold tracking-wide hover:bg-opacity-90 transition-colors"
                  type="submit"
                >
                  Submit request
                </button>
                {submitted ? (
                  <p className="text-sm text-green-600 text-center">Thank you. Our team will confirm the next steps shortly.</p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
