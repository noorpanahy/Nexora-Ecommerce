import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // -----------------------------
  // STATE
  // -----------------------------

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    discount_price: "",
    sku: "",
    stock: 0,
    status: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // LOAD PRODUCT + CATEGORIES
  // -----------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] =
          await Promise.all([
            api.get(`/products/${id}`),
            api.get("/categories"),
          ]);

        if (cancelled) {
          return;
        }

        // -----------------------------
        // PRODUCT RESPONSE
        // -----------------------------

        const product =
          productResponse.data?.product ||
          productResponse.data?.data?.product ||
          productResponse.data?.data ||
          null;

        // -----------------------------
        // CATEGORY RESPONSE
        // -----------------------------

        const categoryData =
          categoryResponse.data?.categories ||
          categoryResponse.data?.data?.categories ||
          categoryResponse.data?.data ||
          [];

        if (!product) {
          setError("Product not found.");
          return;
        }

        // -----------------------------
        // SET FORM
        // -----------------------------

        setForm({
          name: product.name || "",

          description:
            product.description || "",

          category_id:
            product.category_id || "",

          price:
            product.price ?? "",

          discount_price:
            product.discount_price ?? "",

          sku:
            product.sku || "",

          stock:
            product.stock ?? 0,

          status:
            product.status ?? true,
        });

        // -----------------------------
        // SET IMAGES
        // -----------------------------

        setImages(
          Array.isArray(product.images)
            ? product.images
            : []
        );

        // -----------------------------
        // SET CATEGORIES
        // -----------------------------

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load product."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // -----------------------------
  // FORM CHANGE
  // -----------------------------

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // -----------------------------
  // UPDATE PRODUCT
  // -----------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put(
        `/admin/products/${id}`,
        {
          name: form.name,

          description:
            form.description || null,

          category_id:
            Number(form.category_id),

          price:
            Number(form.price),

          discount_price:
            form.discount_price === ""
              ? null
              : Number(form.discount_price),

          sku:
            form.sku,

          stock:
            Number(form.stock),

          status:
            form.status,
        }
      );

      console.log(
        "UPDATED PRODUCT:",
        response.data
      );

      setSuccess(
        "Product updated successfully."
      );

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(validationErrors)
            .flat()[0];

        setError(
          firstError ||
            "Please check the form."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to update product."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------
  // IMAGE URL
  // -----------------------------

  function getImageUrl(image) {
    if (!image) {
      return null;
    }

    const url =
      image.url ||
      image.image ||
      null;

    if (!url) {
      return null;
    }

    if (url.startsWith("http")) {
      return url;
    }

    if (url.startsWith("/")) {
      return `http://127.0.0.1:8000${url}`;
    }

    return `http://127.0.0.1:8000/${url}`;
  }

  // -----------------------------
  // SELECT IMAGES
  // -----------------------------

  function handleImageSelection(event) {
    const files = Array.from(
      event.target.files || []
    );

    setSelectedImages(files);
  }

  // -----------------------------
  // REMOVE SELECTED IMAGE
  // -----------------------------

  function removeSelectedImage(index) {
    setSelectedImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  }

  // -----------------------------
  // UPLOAD IMAGES
  // -----------------------------

  async function handleImageUpload() {
    if (selectedImages.length === 0) {
      setError(
        "Please select at least one image."
      );

      return;
    }

    try {
      setUploadingImages(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      selectedImages.forEach((image) => {
        formData.append(
          "images[]",
          image
        );
      });

      const response = await api.post(
        `/products/${id}/images`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "UPLOADED IMAGES:",
        response.data
      );

      const uploadedImages =
        response.data?.images || [];

      setImages((current) => [
        ...current,
        ...uploadedImages,
      ]);

      setSelectedImages([]);

      setSuccess(
        "Images uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Failed to upload images:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to upload images."
      );
    } finally {
      setUploadingImages(false);
    }
  }

  // -----------------------------
  // DELETE IMAGE
  // -----------------------------

  async function handleDeleteImage(image) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/product-images/${image.id}`
      );

      setImages((current) =>
        current.filter(
          (item) =>
            item.id !== image.id
        )
      );

      setSuccess(
        "Image deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete image:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete image."
      );
    }
  }

  // -----------------------------
  // SET PRIMARY IMAGE
  // -----------------------------

  async function handleSetPrimary(image) {
    try {
      setError("");
      setSuccess("");

      const response = await api.put(
        `/product-images/${image.id}/primary`
      );

      console.log(
        "PRIMARY IMAGE RESPONSE:",
        response.data
      );

      const updatedImage =
        response.data?.image;

      setImages((current) =>
        current.map((item) => ({
          ...item,

          is_primary:
            updatedImage
              ? item.id ===
                updatedImage.id
              : item.id === image.id,
        }))
      );

      setSuccess(
        "Primary image updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to set primary image:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update primary image."
      );
    }
  }

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // PAGE
  // -----------------------------

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <header className="border-b border-white/10 bg-zinc-950/70 px-6 py-6 backdrop-blur md:px-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <Link
              to="/admin/products"
              className="text-sm text-zinc-500 transition hover:text-emerald-400"
            >
              ← Back to Products
            </Link>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black text-white">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Update product information,
              inventory and images.
            </p>
          </div>
        </div>
      </header>

      {/* -------------------------------- */}
      {/* CONTENT */}
      {/* -------------------------------- */}

      <div className="mx-auto max-w-5xl p-6 md:p-10">
        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ================================= */}
          {/* BASIC INFORMATION */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-lg font-bold text-white">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update the main product information.
            </p>

            <div className="mt-6 space-y-5">
              {/* PRODUCT NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Category
                </label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* ================================= */}
          {/* PRICING */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-lg font-bold text-white">
              Pricing
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update the product pricing.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                />
              </div>

              {/* DISCOUNT PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Discount Price
                </label>

                <input
                  type="number"
                  name="discount_price"
                  value={
                    form.discount_price
                  }
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Leave empty if the product
                  has no discount.
                </p>
              </div>
            </div>
          </section>

          {/* ================================= */}
          {/* INVENTORY */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-lg font-bold text-white">
              Inventory
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Manage SKU and available stock.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* SKU */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  SKU
                </label>

                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                />
              </div>

              {/* STOCK */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                />
              </div>
            </div>

            {/* STATUS */}

            <label className="mt-6 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="status"
                checked={Boolean(
                  form.status
                )}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 bg-zinc-900 text-emerald-400 focus:ring-emerald-400"
              />

              <span className="text-sm text-zinc-300">
                Product is active
              </span>
            </label>
          </section>

          {/* ================================= */}
          {/* PRODUCT IMAGES */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Manage product photos and
                choose the primary image.
              </p>
            </div>

            {/* EXISTING IMAGES */}

            {images.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image) => {
                  const imageUrl =
                    getImageUrl(image);

                  return (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
                    >
                      {/* IMAGE */}

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={form.name}
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center text-xs text-zinc-600">
                          No image
                        </div>
                      )}

                      {/* PRIMARY BADGE */}

                      {image.is_primary && (
                        <div className="absolute left-2 top-2 rounded-full bg-emerald-400 px-2 py-1 text-[10px] font-bold uppercase text-zinc-950">
                          Primary
                        </div>
                      )}

                      {/* ACTIONS */}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-10">
                        {!image.is_primary && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSetPrimary(
                                image
                              )
                            }
                            className="mb-2 w-full rounded-lg bg-white/10 px-2 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-emerald-400 hover:text-zinc-950"
                          >
                            Set Primary
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteImage(
                              image
                            )
                          }
                          className="w-full rounded-lg bg-red-500/10 px-2 py-2 text-xs font-semibold text-red-400 backdrop-blur transition hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-zinc-900 p-10 text-center">
                <p className="text-sm text-zinc-500">
                  No product images yet.
                </p>
              </div>
            )}

            {/* UPLOAD AREA */}

            <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-zinc-900 p-6">
              <label className="block cursor-pointer text-center">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={
                    handleImageSelection
                  }
                />

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-2xl text-emerald-400">
                  +
                </div>

                <p className="mt-3 text-sm font-semibold text-white">
                  Add more images
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  JPG, PNG or WEBP · Maximum
                  5MB each
                </p>
              </label>

              {/* SELECTED IMAGES */}

              {selectedImages.length >
                0 && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Selected Images
                  </p>

                  <div className="space-y-2">
                    {selectedImages.map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          key={`${image.name}-${index}`}
                          className="flex items-center justify-between rounded-lg bg-zinc-950 px-3 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm text-zinc-300">
                              {
                                image.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              {(
                                image.size /
                                1024 /
                                1024
                              ).toFixed(
                                2
                              )}{" "}
                              MB
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeSelectedImage(
                                index
                              )
                            }
                            className="ml-4 text-xs font-semibold text-red-400 transition hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  {/* UPLOAD BUTTON */}

                  <button
                    type="button"
                    onClick={
                      handleImageUpload
                    }
                    disabled={
                      uploadingImages
                    }
                    className="mt-4 w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploadingImages
                      ? "Uploading..."
                      : `Upload ${selectedImages.length} Image${
                          selectedImages.length >
                          1
                            ? "s"
                            : ""
                        }`}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ================================= */}
          {/* BUTTONS */}
          {/* ================================= */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/admin/products"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductEditPage;