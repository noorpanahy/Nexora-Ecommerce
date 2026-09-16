import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiArrowUpRight,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-zinc-950 text-white">
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/[0.04] blur-3xl" />

      <div className="page-container relative">

        {/* =====================================================
            NEWSLETTER
        ===================================================== */}

        <section className="py-16 md:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-10 md:px-10 md:py-12">

            {/* Decorative elements */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-emerald-400/[0.08]" />

            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-emerald-400/[0.06]" />

            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">

              {/* Text */}

              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Stay updated
                  </span>
                </div>

                <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  Discover what&apos;s
                  <span className="text-zinc-500"> next.</span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-500 md:text-base">
                  Get new arrivals, exclusive offers and product updates
                  delivered directly to your inbox.
                </p>
              </div>

              {/* Form */}

              <form
                onSubmit={(event) => event.preventDefault()}
                className="w-full"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <FiMail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    />

                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="h-14 w-full rounded-2xl border border-white/[0.08] bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-emerald-400/40 focus:bg-black/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-7 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-300"
                  >
                    Subscribe

                    <FiArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-zinc-600">
                  No spam. Just useful updates and new products.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <section className="border-t border-white/[0.06] py-14 md:py-16">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">

            {/* BRAND */}

            <div className="lg:col-span-5">

              <Link
                to="/"
                className="group inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black transition-transform duration-300 group-hover:rotate-3">
                  <span className="text-lg font-black">
                    N
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold tracking-[0.22em] text-white">
                    NEXORA
                  </div>

                  <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-600">
                    Premium Store
                  </div>
                </div>
              </Link>

              <p className="mt-6 max-w-md text-sm leading-7 text-zinc-500">
                A modern destination for carefully selected products,
                designed for people who appreciate quality, simplicity
                and timeless style.
              </p>

              {/* Social */}

              <div className="mt-7 flex items-center gap-2">

                <a
                  href="#"
                  aria-label="Instagram"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
                >
                  <FiInstagram
                    size={17}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
                >
                  <FiFacebook
                    size={17}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </a>

                <a
                  href="#"
                  aria-label="Twitter"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
                >
                  <FiTwitter
                    size={17}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </a>

              </div>
            </div>

            {/* SHOP */}

            <div className="lg:col-span-2">

              <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                Shop
              </h3>

              <ul className="space-y-4 text-sm text-zinc-500">

                <li>
                  <Link
                    to="/products"
                    className="group inline-flex items-center gap-1 transition-colors hover:text-white"
                  >
                    All Products

                    <FiArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>

                <li>
                  <a
                    href="#categories"
                    className="group inline-flex items-center gap-1 transition-colors hover:text-white"
                  >
                    Categories

                    <FiArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="#featured"
                    className="group inline-flex items-center gap-1 transition-colors hover:text-white"
                  >
                    Featured

                    <FiArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1 transition-colors hover:text-white"
                  >
                    New Arrivals

                    <FiArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>

              </ul>
            </div>

            {/* HELP */}

            <div className="lg:col-span-2">

              <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                Help
              </h3>

              <ul className="space-y-4 text-sm text-zinc-500">

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    Shipping
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    Returns
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    FAQ
                  </a>
                </li>

              </ul>
            </div>

            {/* COMPANY */}

            <div className="lg:col-span-3">

              <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                Nexora
              </h3>

              <ul className="space-y-4 text-sm text-zinc-500">

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    About Us
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    Our Story
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    Careers
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    Journal
                  </a>
                </li>

              </ul>
            </div>

          </div>
        </section>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <section className="border-t border-white/[0.06] py-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Copyright */}

            <div className="flex flex-col gap-1">
              <p className="text-xs text-zinc-600">
                © {currentYear} Nexora. All rights reserved.
              </p>

              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-700">
                Built for modern shopping
              </p>
            </div>

            {/* Bottom links */}

            <div className="flex flex-wrap items-center gap-5">

              <a
                href="#"
                className="text-xs text-zinc-600 transition-colors hover:text-white"
              >
                Privacy
              </a>

              <a
                href="#"
                className="text-xs text-zinc-600 transition-colors hover:text-white"
              >
                Terms
              </a>

              <span className="hidden h-3 w-px bg-white/10 sm:block" />

              <button
                type="button"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-white"
              >
                Back to top

                <span className="transition-transform duration-300 group-hover:-translate-y-1">
                  ↑
                </span>
              </button>

            </div>
          </div>
        </section>

      </div>
    </footer>
  );
}

export default Footer;