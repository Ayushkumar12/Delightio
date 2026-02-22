import React from "react";
import Navbar from "../comp/Navbar";

export default function About() {
  return (
    <section>
      <Navbar />
      <main className="bg-stone-50" style={{ fontFamily: "Epilogue, Noto Sans, sans-serif" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-stone-800">
          <header className="space-y-3 text-center">
            <h1 className="text-4xl font-bold tracking-tight">About Delightio</h1>
            <p className="text-base text-stone-600">
              Delightio brings the warmth of handcrafted meals to your table with a modern ordering experience.
            </p>
          </header>
          <section className="grid gap-8 md:grid-cols-2">
            <article className="space-y-3 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold">Our Story</h2>
              <p className="leading-relaxed text-stone-600">
                Founded by culinary enthusiasts, Delightio started as a neighborhood eatery celebrating seasonal ingredients and regional flavors.
                Today we blend tradition with technology to deliver comforting dishes faster, fresher, and more sustainably.
              </p>
            </article>
            <article className="space-y-3 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold">What We Value</h2>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-lg font-semibold text-[var(--primary-color)]">01</span>
                  <div>
                    <h3 className="font-semibold text-stone-800">Freshness</h3>
                    <p>Every plate is crafted with locally sourced produce and made-to-order care.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg font-semibold text-[var(--primary-color)]">02</span>
                  <div>
                    <h3 className="font-semibold text-stone-800">Community</h3>
                    <p>We support local growers, partner with nearby artisans, and give back through food drives.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg font-semibold text-[var(--primary-color)]">03</span>
                  <div>
                    <h3 className="font-semibold text-stone-800">Innovation</h3>
                    <p>Our digital-first experience keeps ordering seamless while preserving hospitality.</p>
                  </div>
                </li>
              </ul>
            </article>
          </section>
          <section className="grid gap-6 md:grid-cols-3">
            <article className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--primary-color)]">Impact</h3>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-stone-600">Meals served with care and consistency.</p>
            </article>
            <article className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--primary-color)]">Partners</h3>
              <p className="text-3xl font-bold">30+</p>
              <p className="text-stone-600">Local farms and artisans collaborating with us.</p>
            </article>
            <article className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--primary-color)]">Satisfaction</h3>
              <p className="text-3xl font-bold">4.9/5</p>
              <p className="text-stone-600">Average rating from the Delightio community.</p>
            </article>
          </section>
        </div>
      </main>
    </section>
  );
}
