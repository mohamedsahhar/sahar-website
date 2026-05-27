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

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Add Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a catalog product for WhatsApp inquiries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <section className="bg-white border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold text-gray-950">Product Details</h2>

            <label className="block">
              <span className="label-text">Title *</span>
              <input className="field" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
            </label>

            <label className="block">
              <span className="label-text">Slug *</span>
              <input
                className="field"
                value={slug}
                readOnly
              />
            </label>

            <label className="block">
              <span className="label-text">Description</span>
              <textarea className="field min-h-32" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
          </section>

          <section className="bg-white border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold text-gray-950">Classification</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="label-text">Brand *</span>
                <select className="field" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="label-text">Device</span>
                <select className="field" value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
                  <option value="">Select Device (optional)</option>
                  {filteredDevices.map((device) => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="label-text">Category *</span>
                <select className="field" value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="label-text">Subcategory *</span>
                <select className="field" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-2">
                <input className="field" placeholder="New category" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                <button type="button" className="secondary-btn" onClick={addCategory}>Add</button>
              </div>

              <div className="flex gap-2">
                <input className="field" placeholder="New subcategory" value={newSubcategoryName} onChange={(e) => setNewSubcategoryName(e.target.value)} />
                <button type="button" className="secondary-btn" onClick={addSubcategory}>Add</button>
              </div>
            </div>
          </section>

          <section className="bg-white border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold text-gray-950">Images</h2>
            <ImageUpload
              slug={slug}
              existingImages={images}
              onUpload={(url) => setImages((current) => [...current, url].slice(0, 6))}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-md border bg-gray-50">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(min-width: 768px) 220px, 50vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded bg-black px-2 py-1 text-xs text-white"
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

        <aside className="space-y-5">
          <section className="bg-white border rounded-lg p-5 space-y-4">
            <h2 className="font-semibold text-gray-950">Selling Info</h2>

            <label className="block">
              <span className="label-text">Condition</span>
              <select className="field" value={condition} onChange={(e) => setCondition(e.target.value)}>
                {conditionOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="label-text">Stock Status</span>
              <select className="field" value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
                {stockOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="label-text">Shipping Info</span>
              <textarea className="field min-h-24" value={shippingInfo} onChange={(e) => setShippingInfo(e.target.value)} />
            </label>

            <label className="block">
              <span className="label-text">Colors</span>
              <input className="field" placeholder="black, white, red" value={colors} onChange={(e) => setColors(e.target.value)} />
            </label>
          </section>

          <section className="bg-white border rounded-lg p-5 space-y-3">
            <h2 className="font-semibold text-gray-950">Publishing</h2>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Visible in shop
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured product
            </label>

            <button disabled={saving} className="w-full rounded-md bg-black px-4 py-3 font-semibold text-white disabled:opacity-60">
              {saving ? "Creating..." : "Create Product"}
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
}
