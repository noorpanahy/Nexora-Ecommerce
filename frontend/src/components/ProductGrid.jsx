import ProductCard from "./ProductCard";

function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-900/50 py-20 text-center">
        <div className="text-5xl">🛍️</div>

        <h3 className="mt-5 text-xl font-semibold text-white">
          No products found
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          Products will appear here when they are available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;