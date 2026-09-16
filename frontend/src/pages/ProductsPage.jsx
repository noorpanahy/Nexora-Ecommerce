import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../services/api";
import ProductGrid from "../components/ProductGrid";
import Loading from "../components/Loading";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "default"
  );

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setLoading(true);

        const response = await api.get("/products");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        if (!ignore) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);

        if (!ignore) {
          setProducts([]);
        }
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

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const response = await api.get("/categories");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        if (!ignore) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (!ignore) {
          setCategories([]);
        }
      } finally {
        if (!ignore) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  // ==========================================
  // UPDATE URL
  // ==========================================

  useEffect(() => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category) {
      params.category = category;
    }

    if (sort !== "default") {
      params.sort = sort;
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [search, category, sort, setSearchParams]);

  // ==========================================
  // FILTER + SORT PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();

      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        const categoryName =
          product.category?.name?.toLowerCase() || "";

        return (
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          categoryName.includes(searchTerm)
        );
      });
    }

    // Category
    if (category) {
      result = result.filter(
        (product) =>
          product.category?.name === category
      );
    }

    // Sorting
    if (sort === "price_low") {
      result.sort(
        (a, b) =>
          Number(a.discount_price ?? a.price) -
          Number(b.discount_price ?? b.price)
      );
    }

    if (sort === "price_high") {
      result.sort(
        (a, b) =>
          Number(b.discount_price ?? b.price) -
          Number(a.discount_price ?? a.price)
      );
    }

    if (sort === "name_az") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "name_za") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [products, search, category, sort]);

  // ==========================================
  // RESET FILTERS
  // ==========================================

  function clearFilters() {
    setSearch("");
    setCategory("");
    setSort("default");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* =====================================
          HEADER
      ====================================== */}

      <section className="border-b border-white/5 bg-zinc-900/40">

        <div className="page-container py-16">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600">
            Flex Store
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
            Shop
          </h1>

          <p className="mt-5 max-w-2xl text-zinc-500">
            Discover our complete collection of products.
            Find something you love and make it yours.
          </p>

        </div>

      </section>


      {/* =====================================
          FILTER AREA
      ====================================== */}

      <section className="page-container py-10">

        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative flex-1">

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                >
                  ×
                </button>
              )}

            </div>


            {/* CATEGORY */}

            <div className="lg:w-56">

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                disabled={categoriesLoading}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4 text-sm text-white outline-none focus:border-white/30"
              >

                <option value="">
                  All categories
                </option>

                {categories.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}

              </select>

            </div>


            {/* SORT */}

            <div className="lg:w-56">

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-4 text-sm text-white outline-none focus:border-white/30"
              >

                <option value="default">
                  Sort by
                </option>

                <option value="price_low">
                  Price: Low to High
                </option>

                <option value="price_high">
                  Price: High to Low
                </option>

                <option value="name_az">
                  Name: A → Z
                </option>

                <option value="name_za">
                  Name: Z → A
                </option>

              </select>

            </div>

          </div>


          {/* ACTIVE FILTERS */}

          {(search || category || sort !== "default") && (

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">

              <span className="text-xs text-zinc-600">
                Filters:
              </span>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-zinc-300"
                >
                  Search: {search} ×
                </button>
              )}

              {category && (
                <button
                  type="button"
                  onClick={() => setCategory("")}
                  className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-zinc-300"
                >
                  {category} ×
                </button>
              )}

              {sort !== "default" && (
                <button
                  type="button"
                  onClick={() => setSort("default")}
                  className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-zinc-300"
                >
                  Sorting ×
                </button>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-white underline underline-offset-4"
              >
                Clear all
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =====================================
          PRODUCTS
      ====================================== */}

      <section className="page-container pb-24">

        {/* RESULT COUNT */}

        {!loading && (
          <div className="mb-8 flex items-center justify-between">

            <p className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </p>

          </div>
        )}


        {/* LOADING */}

        {loading && (
          <Loading />
        )}


        {/* PRODUCTS */}

        {!loading && filteredProducts.length > 0 && (
          <ProductGrid
            products={filteredProducts}
          />
        )}


        {/* EMPTY */}

        {!loading && filteredProducts.length === 0 && (

          <div className="rounded-[2rem] border border-white/10 bg-zinc-900/50 px-6 py-24 text-center">

            <div className="text-6xl">
              🔍
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No products found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
              We couldn't find any products matching
              your current filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-7 rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
            >
              Clear filters
            </button>

          </div>

        )}

      </section>

    </div>
  );
}

export default ProductsPage;