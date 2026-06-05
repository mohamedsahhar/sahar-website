"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/components/ImageUpload";

type Brand = {
  id: number;
  name: string;
};

type Device = {
  id: number;
  name: string;
  brandId?: number;
};

type Subcategory = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  subcategories: Subcategory[];
};

const conditionOptions = [
  "New",
  "Original",
  "OEM",
  "Used",
  "Refurbished",
  "High Copy",
];

const stockOptions = ["Available", "Out of stock"];

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [condition, setCondition] = useState("New");
  const [stockStatus, setStockStatus] = useState("Available");
  const [shippingInfo, setShippingInfo] = useState("Available in Cairo\nShipping all over Egypt");
  const [colors, setColors] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  useEffect(() => {
    async function load() {
      const brandsData: Brand[] = await fetch("/api/brands").then((r) => r.json());
      const categoriesData: Category[] = await fetch("/api/categories").then((r) => r.json());
      const devicesData: Device[] = await fetch("/api/devices").then((r) => r.json());

      setBrands(brandsData);
      setCategories(categoriesData);
      setDevices(devicesData);
    }

    load();
  }, []);

  const filteredDevices = useMemo(() => {
    if (!brandId) return devices;
    return devices.filter((device) => !device.brandId || device.brandId === Number(brandId));
  }, [brandId, devices]);

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(makeSlug(value));
  }

  function handleCategoryChange(id: string) {
    setCategoryId(id);
    setSubcategoryId("");

    const selected = categories.find((category) => category.id === Number(id));
    setSubcategories(selected?.subcategories || []);
  }

  async function addCategory() {
    if (!newCategoryName.trim()) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCategoryName.trim(),
        slug: makeSlug(newCategoryName),
      }),
    });

    const newCategory: Category = await res.json();
    setCategories([...categories, { ...newCategory, subcategories: [] }]);
    setCategoryId(String(newCategory.id));
    setSubcategories([]);
    setSubcategoryId("");
    setNewCategoryName("");
  }

  async function addSubcategory() {
    if (!newSubcategoryName.trim() || !categoryId) {
      alert("Select category first");
      return;
    }

    const res = await fetch("/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newSubcategoryName.trim(),
        slug: makeSlug(newSubcategoryName),
        categoryId: Number(categoryId),
      }),
    });

    const newSubcategory: Subcategory = await res.json();
    setSubcategories([...subcategories, newSubcategory]);
    setCategories((current) =>
      current.map((category) =>
        category.id === Number(categoryId)
          ? {
              ...category,
              subcategories: [...category.subcategories, newSubcategory],
            }
          : category
      )
    );
    setSubcategoryId(String(newSubcategory.id));
    setNewSubcategoryName("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanSlug = makeSlug(title);

    if (!title || !cleanSlug || !brandId || !categoryId || !subcategoryId) {
      alert("Please fill title, slug, brand, category, and subcategory");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug: cleanSlug,
        description,
        brandId: Number(brandId),
        deviceId: deviceId ? Number(deviceId) : null,
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        condition,
        stockStatus,
        shippingInfo,
        colors: splitList(colors),
        images,
        featured,
        isActive,
      }),
    });

    setSaving(false);

    const data = await res.json();

    if (!res.ok) {
      alert("Error: " + data.error);
      return;
    }

    router.push("/admin/products");
  }

  const fieldClassName =
    "mt-2 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-medium text-black shadow-sm outline-none transition placeholder:text-gray-600 focus:border-blue-600 focus:ring-4 focus:ring-blue-100";
  const readOnlyFieldClassName =
    "mt-2 w-full min-w-0 rounded-xl border border-gray-300 bg-gray-100 px-4 py-3.5 text-sm font-semibold text-black shadow-sm outline-none";
  const sectionClassName =
    "overflow-hidden rounded-3xl border border-gray-300 bg-white p-4 shadow-sm sm:p-6";
  const sectionTitleClassName = "text-lg font-bold text-black sm:text-xl";
  const sectionTextClassName = "mt-2 text-sm font-medium leading-6 text-gray-800";
  const helperTextClassName = "mt-2 text-xs font-semibold leading-5 text-blue-700";
  const addButtonClassName =
    "w-full shrink-0 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm font-bold text-blue-800 transition hover:bg-blue-100 sm:w-auto";
  const checkboxClassName =
    "mt-0.5 h-4 w-4 shrink-0 rounded border-gray-400 text-green-700 focus:ring-2 focus:ring-green-200";
  const previewBadgeClassName =
    "inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-800";

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:p-6">
      <div className="overflow-hidden rounded-[28px] border border-gray-300 bg-gradient-to-br from-white via-white to-blue-50/40 px-4 py-5 shadow-sm sm:px-7 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className={previewBadgeClassName}>Shop Catalog</span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Add Product
            </h1>
            <p className="mt-3 text-sm font-medium leading-7 text-gray-900 sm:text-base">
              Create a clean product listing for shop visitors and WhatsApp inquiries. All required product details,
              classification, images, and publishing controls stay in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <div className="rounded-2xl border border-gray-300 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Status</p>
              <p className="mt-2 text-sm font-bold text-black">{saving ? "Saving now" : "Draft mode"}</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">Visibility</p>
              <p className="mt-2 text-sm font-bold text-black">{isActive ? "Visible in shop" : "Hidden from shop"}</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Images</p>
              <p className="mt-2 text-sm font-bold text-black">{images.length} uploaded</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className={sectionClassName}>
            <div className="mb-6">
              <h2 className={sectionTitleClassName}>Product Details</h2>
              <p className={sectionTextClassName}>Set the product name, generated slug, and short description.</p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-black">Title <span className="text-red-600">*</span></span>
                <input
                  className={fieldClassName}
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="For example: iPhone 13 Original Screen"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Slug <span className="text-red-600">*</span></span>
                <input
                  className={readOnlyFieldClassName}
                  value={slug}
                  readOnly
                  placeholder="Generated automatically from title"
                />
                <p className={helperTextClassName}>The slug is generated automatically from the product title.</p>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Description</span>
                <textarea
                  className={`${fieldClassName} min-h-36 resize-y`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a clear product summary, key details, and anything a customer should know."
                />
              </label>
            </div>
          </section>

          <section className={sectionClassName}>
            <div className="mb-6">
              <h2 className={sectionTitleClassName}>Classification</h2>
              <p className={sectionTextClassName}>Assign the product to the right brand, device, category, and subcategory.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-black">Brand <span className="text-red-600">*</span></span>
                <select className={fieldClassName} value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Device</span>
                <select className={fieldClassName} value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
                  <option value="">Select Device (optional)</option>
                  {filteredDevices.map((device) => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Category <span className="text-red-600">*</span></span>
                <select className={fieldClassName} value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Subcategory <span className="text-red-600">*</span></span>
                <select className={fieldClassName} value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-4">
                <p className="text-sm font-bold text-black">New category</p>
                <p className={sectionTextClassName}>Create a category without leaving this page.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <input
                    className={fieldClassName}
                    placeholder="New category"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button type="button" className={addButtonClassName} onClick={addCategory}>Add</button>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-4">
                <p className="text-sm font-bold text-black">New subcategory</p>
                <p className={sectionTextClassName}>Choose a category first, then add its subcategory here.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <input
                    className={fieldClassName}
                    placeholder="New subcategory"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                  />
                  <button type="button" className={addButtonClassName} onClick={addSubcategory}>Add</button>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionClassName}>
            <div className="mb-6">
              <h2 className={sectionTitleClassName}>Images</h2>
              <p className={sectionTextClassName}>Upload product photos and remove any preview you do not want to keep.</p>
            </div>

            <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/40 p-4 sm:p-5">
              <ImageUpload
                slug={slug}
                existingImages={images}
                onUpload={(url) => setImages((current) => [...current, url].slice(0, 6))}
              />
            </div>

            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {images.map((image, index) => (
                  <div key={`${image}-${index}`} className="group relative aspect-square min-w-0 overflow-hidden rounded-2xl border border-gray-300 bg-gray-50 shadow-sm">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(min-width: 1280px) 220px, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent px-3 py-3 text-xs font-medium text-white">
                      Image {index + 1}
                    </div>
                    <button
                      type="button"
                      className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black"
                      onClick={() => setImages(images.filter((_, imageIndex) => imageIndex !== index))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <section className={sectionClassName}>
            <div className="mb-6">
              <h2 className={sectionTitleClassName}>Selling Info</h2>
              <p className={sectionTextClassName}>Review the condition, stock status, shipping details, and color options.</p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-black">Condition</span>
                <select className={fieldClassName} value={condition} onChange={(e) => setCondition(e.target.value)}>
                  {conditionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Stock Status</span>
                <select className={fieldClassName} value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
                  {stockOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Shipping Info</span>
                <textarea
                  className={`${fieldClassName} min-h-28 resize-y`}
                  value={shippingInfo}
                  onChange={(e) => setShippingInfo(e.target.value)}
                  placeholder="Explain delivery coverage, pickup, and shipping notes."
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Colors</span>
                <input
                  className={fieldClassName}
                  placeholder="black, white, red"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                />
                <p className={helperTextClassName}>Separate multiple colors with commas.</p>
              </label>
            </div>
          </section>

          <section className={sectionClassName}>
            <div className="mb-5">
              <h2 className={sectionTitleClassName}>Publishing</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-green-800">Choose how this product appears in the shop before creating it.</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
                <input
                  type="checkbox"
                  className={checkboxClassName}
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-bold text-black">Visible in shop</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-green-800">Enable this product for public shop visibility after creation.</span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
                <input
                  type="checkbox"
                  className={checkboxClassName}
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-bold text-black">Featured product</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-green-800">Use this when the item should stand out in the catalog.</span>
                </span>
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="font-bold text-blue-800">Ready to create</span>
                <span className="font-bold text-black">{title.trim() ? "Product details entered" : "Waiting for product title"}</span>
              </div>
            </div>

            <button
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-green-700 px-5 py-4 text-base font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Product"}
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
}
