import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
} from "react-icons/fi";

import api from "../services/api";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const response = await api.get("/products");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        if (!ignore) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = [
    {
      name: "Electronics",
      icon: "💻",
      description: "Smart technology",
    },
    {
      name: "Fashion",
      icon: "👕",
      description: "Modern essentials",
    },
    {
      name: "Accessories",
      icon: "⌚",
      description: "Complete your look",
    },
    {
      name: "Home & Living",
      icon: "🏠",
      description: "For your space",
    },
    {
      name: "Sports",
      icon: "⚽",
      description: "Move with purpose",
    },
    {
      name: "Beauty",
      icon: "✨",
      description: "Everyday care",
    },
  ];

  return (
    <div className="bg-zinc-950 text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[720px] overflow-hidden border-b border-white/[0.06]">

        {/* Background */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[15%] h-80 w-80 rounded-full bg-emerald-400/[0.06] blur-3xl" />

          <div className="absolute bottom-[5%] right-[10%] h-96 w-96 rounded-full bg-emerald-300/[0.04] blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.55)_70%,rgba(9,9,11,1)_100%)]" />
        </div>

        {/* Grid pattern */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="page-container relative flex min-h-[720px] items-center">

          <div className="max-w-4xl">

            {/* Eyebrow */}

            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400">
                Welcome to Nexora
              </span>

            </div>

            {/* Heading */}

            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">

              Everything you want.

              <span className="block text-zinc-500">
                One place.
              </span>

            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
              Discover carefully selected products with modern design,
              reliable quality, and prices made for everyday life.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-3">

              <Link
  to="/products"
  className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold !text-black transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300"
>
                Shop now

                <FiArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#featured"
                className="group inline-flex items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.02] px-7 py-4 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Explore collection

                <FiArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

            </div>

            {/* Trust points */}

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-zinc-600">

              <div className="flex items-center gap-2">
                <FiCheck className="text-emerald-400" />
                Carefully selected
              </div>

              <div className="flex items-center gap-2">
                <FiCheck className="text-emerald-400" />
                Quality products
              </div>

              <div className="flex items-center gap-2">
                <FiCheck className="text-emerald-400" />
                Secure shopping
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="page-container py-24 md:py-28">

        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-400">
              Explore
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Shop by category
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">
              Explore our collection and find products that fit your
              everyday needs.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
          >
            View all

            <FiArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.05]"
            >

              {/* Hover glow */}

              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-900 text-2xl transition-transform duration-500 group-hover:scale-110">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-sm font-semibold text-white">
                  {category.name}
                </h3>

                <p className="mt-1 text-[11px] text-zinc-600">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-zinc-500 transition-colors group-hover:text-emerald-400">
                  Explore
                  <FiArrowUpRight
                    size={13}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section
        id="featured"
        className="border-y border-white/[0.06] bg-white/[0.015]"
      >

        <div className="page-container py-24 md:py-28">

          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-400">
                Our collection
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Featured products
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                A selection of products from our latest collection.
              </p>
            </div>

            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
            >
              View all products

              <FiArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          {loading ? (
            <div className="py-10">
              <Loading />
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products.slice(0, 8)} />
          ) : (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
              <p className="text-sm text-zinc-500">
                No products available yet.
              </p>

              <Link
                to="/products"
                className="mt-4 inline-flex text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Browse products →
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          PROMO
      ===================================================== */}

      <section className="page-container py-24 md:py-28">

        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white px-7 py-12 text-black sm:px-12 sm:py-16 lg:px-16">

          {/* Decorative glow */}

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-100 blur-3xl" />

          <div className="absolute -bottom-32 right-20 h-80 w-80 rounded-full bg-zinc-100 blur-3xl" />

          {/* Circle */}

          <div className="absolute right-10 top-10 hidden h-32 w-32 rounded-full border border-black/[0.05] md:block" />

          <div className="absolute right-16 top-16 hidden h-20 w-20 rounded-full border border-black/[0.05] md:block" />

          <div className="relative z-10 max-w-2xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                Discover more
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-black tracking-[-0.03em] sm:text-5xl md:text-6xl">
              Upgrade your
              <span className="block text-zinc-400">
                everyday.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              Find products designed to make your everyday experience
              simpler, better, and more enjoyable.
            </p>

            <Link
              to="/products"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800"
            >
              Explore collection

              <FiArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
          BENEFITS
      ===================================================== */}

      <section className="border-t border-white/[0.06]">

        <div className="page-container py-20 md:py-24">

          <div className="grid gap-10 md:grid-cols-3 md:divide-x md:divide-white/[0.06]">

            {/* Delivery */}

            <div className="md:pr-10">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-emerald-400">
                <FiTruck size={19} />
              </div>

              <h3 className="mt-5 text-base font-bold">
                Fast delivery
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Get your products delivered quickly and safely.
              </p>

            </div>

            {/* Security */}

            <div className="md:px-10">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-emerald-400">
                <FiShield size={19} />
              </div>

              <h3 className="mt-5 text-base font-bold">
                Secure shopping
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Your account and shopping experience are protected.
              </p>

            </div>

            {/* Returns */}

            <div className="md:pl-10">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-emerald-400">
                <FiRefreshCw size={19} />
              </div>

              <h3 className="mt-5 text-base font-bold">
                Easy returns
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Shop confidently with a simple return experience.
              </p>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default HomePage;