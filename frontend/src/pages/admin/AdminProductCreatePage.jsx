import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminProductCreatePage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    sku: "",
    stock: "",
    category_id: "",
    status: true,
  });

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );

        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(event) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    setImages(selectedFiles);

    const previews = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviewImages(previews);
  }

  function removeImage(index) {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );

    setPreviewImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (
      form.discount_price !== "" &&
      Number(form.discount_price) < 0
    ) {
      setError("Please enter a valid discount price.");
      return;
    }

    if (Number(form.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      /*
       * First create the product.
       */
      const productResponse = await api.post(
        "/admin/products",
        {
          name: form.name,
          description: form.description || null,
          price: Number(form.price),
          discount_price:
            form.discount_price === ""
              ? null
              : Number(form.discount_price),
          sku: form.sku,
          stock: Number(form.stock),
          category_id: Number(form.category_id),
          status: form.status,
        }
      );

      const product =
        productResponse.data.product ||
        productResponse.data.data;

      /*
       * Then upload product images.
       */
      if (images.length > 0) {
        const imageFormData = new FormData();

        images.forEach((image) => {
          imageFormData.append("images[]", image);
        });

        await api.post(
          `/admin/products/${product.id}/images`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setSuccess("Product created successfully.");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to create product:",
        error
      );

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(validationErrors)[0]?.[0];

        setError(
          firstError || "Failed to create product."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to create product."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/70 px-6 py-6 backdrop-blur md:px-10">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            ←
          </Link>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Products
            </p>

            <h1 className="mt-1 text-3xl font-black text-white">
              Add Product
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-6 md:p-10">
        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          {/* Main information */}
          <div className="space-y-8">
            {/* Basic information */}
            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Basic information about the product.
                </p>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Product name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Example: Premium T-Shirt"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe the product..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Category
                  </label>

                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-emerald-400/50"
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">
                  Pricing & Inventory
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Set pricing and available stock.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                      $
                    </span>

                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-8 pr-4 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Discount price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                      $
                    </span>

                    <input
                      name="discount_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.discount_price}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-8 pr-4 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                    />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    SKU
                  </label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="SKU-001"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Stock
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right side */}
          <div className="space-y-8">
            {/* Images */}
            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Upload one or multiple images.
                </p>
              </div>

              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900 p-6 text-center transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.03]">
                <div className="text-3xl text-zinc-600">
                  +
                </div>

                <p className="mt-3 text-sm font-medium text-zinc-300">
                  Click to upload images
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  JPG, PNG or WEBP
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Preview */}
              {previewImages.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {previewImages.map(
                    (preview, index) => (
                      <div
                        key={`${preview.url}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900"
                      >
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-emerald-400 px-2 py-1 text-[10px] font-bold text-zinc-950">
                            PRIMARY
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white opacity-0 transition group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Status */}
            <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <h2 className="text-lg font-bold text-white">
                Visibility
              </h2>

              <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-zinc-900 p-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    Active product
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Customers can see this product.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                  className="h-5 w-5 accent-emerald-400"
                />
              </label>
            </section>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                to="/admin/products"
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Creating..."
                  : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductCreatePage;