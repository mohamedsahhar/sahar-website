"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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

type ProductResponse = {
  title?: string;
  slug?: string;
  description?: string;
  brandId?: number;
  deviceId?: number | null;
  categoryId?: number;
  subcategoryId?: number;
  condition?: string;
  stockStatus?: string;
  shippingInfo?: string;
  colors?: string[];
  images?: string[];
  featured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isActive?: boolean;
};

type ProductDraft = {
  title: string;
  slug: string;
  description: string;
  brandId: string;
  deviceId: string;
  categoryId: string;
  subcategoryId: string;
  condition: string;
  stockStatus: string;
  shippingInfo: string;
  colors: string;
  images: string[];
  featured: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  updatedAt: number;
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

const autosaveVersion = "v1";

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

function readSavedDraft(autosaveKey: string): ProductDraft | null {
  if (!autosaveKey) return null;

  try {
    const saved = window.localStorage.getItem(autosaveKey);
    if (!saved) return null;

    const draft = JSON.parse(saved) as ProductDraft;
    if (!draft || typeof draft !== "object") return null;

    return {
      title: draft.title || "",
      slug: draft.slug || "",
      description: draft.description || "",
      brandId: draft.brandId || "",
      deviceId: draft.deviceId || "",
      categoryId: draft.categoryId || "",
      subcategoryId: draft.subcategoryId || "",
      condition: draft.condition || "New",
      stockStatus: draft.stockStatus || "Available",
      shippingInfo: draft.shippingInfo || "",
      colors: draft.colors || "",
      images: Array.isArray(draft.images) ? draft.images : [],
      featured: Boolean(draft.featured),
      isActive: typeof draft.isActive === "boolean" ? draft.isActive : true,
      seoTitle: draft.seoTitle || "",
      seoDescription: draft.seoDescription || "",
      updatedAt: typeof draft.updatedAt === "number" ? draft.updatedAt : Date.now(),
    };
  } catch (err) {
    console.error("PRODUCT AUTOSAVE READ ERROR:", err);
    return null;
  }
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const productId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);
  const autosaveKey = useMemo(
    () => (productId ? `sa7ar-product-edit:${productId}:${autosaveVersion}` : ""),
    [productId]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autosaveReady, setAutosaveReady] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [condition, setCondition] = useState("New");
  const [stockStatus, setStockStatus] = useState("Available");
  const [shippingInfo, setShippingInfo] = useState("");
  const [colors, setColors] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  function applyDraft(draft: ProductDraft) {
    setTitle(draft.title);
    setSlug(draft.slug);
    setDescription(draft.description);
    setBrandId(draft.brandId);
    setDeviceId(draft.deviceId);
    setCategoryId(draft.categoryId);
    setSubcategoryId(draft.subcategoryId);
    setCondition(draft.condition);
    setStockStatus(draft.stockStatus);
    setShippingInfo(draft.shippingInfo);
    setColors(draft.colors);
    setImages(draft.images);
    setFeatured(draft.featured);
    setIsActive(draft.isActive);
    setSeoTitle(draft.seoTitle);
    setSeoDescription(draft.seoDescription);
  }

  function makeDraftFromProduct(product: ProductResponse): ProductDraft {
    return {
      title: product.title || "",
      slug: product.slug || "",
      description: product.description || "",
      brandId: String(product.brandId || ""),
      deviceId: product.deviceId ? String(product.deviceId) : "",
      categoryId: String(product.categoryId || ""),
      subcategoryId: String(product.subcategoryId || ""),
      condition: product.condition || "New",
      stockStatus: product.stockStatus || "Available",
      shippingInfo: product.shippingInfo || "",
      colors: product.colors?.join(", ") || "",
      images: product.images || [],
      featured: Boolean(product.featured),
      isActive: product.isActive ?? true,
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      updatedAt: Date.now(),
    };
  }

  useEffect(() => {
    async function load() {
      try {
        const product: ProductResponse = await fetch(`/api/products/${productId}`).then((r) => r.json());
        const brandsData: Brand[] = await fetch("/api/brands").then((r) => r.json());
        const devicesData: Device[] = await fetch("/api/devices").then((r) => r.json());
        const categoriesData: Category[] = await fetch("/api/categories").then((r) => r.json());
        const savedDraft = readSavedDraft(autosaveKey);
        const formDraft = savedDraft || makeDraftFromProduct(product);

        applyDraft(formDraft);
        setDraftRestored(Boolean(savedDraft));

        setBrands(brandsData);
        setDevices(devicesData);
        setCategories(categoriesData);

        const selected = categoriesData.find((category) => category.id === Number(formDraft.categoryId));
        setSubcategories(selected?.subcategories || []);
        setAutosaveReady(true);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (productId) load();
  }, [productId, autosaveKey]);

  useEffect(() => {
    if (!autosaveReady || !autosaveKey) return;

    const draft: ProductDraft = {
      title,
      slug,
      description,
      brandId,
      deviceId,
      categoryId,
      subcategoryId,
      condition,
      stockStatus,
      shippingInfo,
      colors,
      images,
      featured,
      isActive,
      seoTitle,
      seoDescription,
      updatedAt: Date.now(),
    };

    try {
      window.localStorage.setItem(autosaveKey, JSON.stringify(draft));
    } catch (err) {
      console.error("PRODUCT AUTOSAVE WRITE ERROR:", err);
    }
  }, [
    autosaveReady,
    autosaveKey,
    title,
    slug,
    description,
    brandId,
    deviceId,
    categoryId,
    subcategoryId,
    condition,
    stockStatus,
    shippingInfo,
    colors,
    images,
    featured,
    isActive,
    seoTitle,
    seoDescription,
  ]);

  const filteredDevices = useMemo(() => {
    if (!brandId) return devices;
    return devices.filter((device) => !device.brandId || device.brandId === Number(brandId));
  }, [brandId, devices]);

  function handleTitleChange(value: string) {
    setTitle(value);
  }

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setSubcategoryId("");

    const selected = categories.find((category) => category.id === Number(value));
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

    if (!title || !slug || !brandId || !categoryId || !subcategoryId) {
      alert("Please fill title, slug, brand, category, and subcategory");
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
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

    if (!res.ok) {
      const data = await res.json();
      alert("Error: " + data.error);
      return;
    }

    if (autosaveKey) {
      window.localStorage.removeItem(autosaveKey);
    }

    router.push("/admin/products");
  }

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update catalog, SEO, and publishing details.
        </p>
        {draftRestored && (
          <p className="mt-2 text-sm font-medium text-amber-700">
            Unsaved changes were restored from this browser.
          </p>
        )}
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
              <input className="field" value={slug} readOnly />
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
              {saving ? "Saving..." : "Save Product"}
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
}
