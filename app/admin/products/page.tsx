"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  slug: string;
  condition: string;
  stockStatus: string;
  featured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  brand?: {
    id: number;
    name: string;
  };
  category?: {
    name: string;
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [loadingActionId, setLoadingActionId] = useState<number | null>(null);

  async function loadProducts() {
    const data = await fetch(
      "/api/products?includeDeleted=true&includeInactive=true"
    ).then((res) => res.json());

    setProducts(data);
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products?includeDeleted=true&includeInactive=true")
      .then((res) => res.json())
      .then((data: Product[]) => {
        if (!cancelled) setProducts(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const brands = Array.from(
    new Map(
      products
        .filter((product) => product.brand)
        .map((product) => [product.brand!.id, product.brand!])
    ).values()
  );

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.slug.toLowerCase().includes(search.toLowerCase()) ||
      product.brand?.name?.toLowerCase().includes(search.toLowerCase());

    const matchBrand =
      selectedBrand === "" || product.brand?.id === Number(selectedBrand);

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        product.isActive &&
        !product.isDeleted) ||
      (statusFilter === "inactive" &&
        !product.isActive &&
        !product.isDeleted) ||
      (statusFilter === "deactivated" && product.isDeleted);

    const matchFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && product.featured) ||
      (featuredFilter === "regular" && !product.featured);

    return matchSearch && matchBrand && matchStatus && matchFeatured;
  });

  async function updateProductState(
    productId: number,
    body: { isActive?: boolean; isDeleted?: boolean }
  ) {
    setLoadingActionId(productId);

    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    setLoadingActionId(null);

    if (!res.ok) {
      alert("Failed to update product");
      return;
    }

    await loadProducts();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Products</h1>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Link href="/admin/products/new">
          <button style={addBtnStyle}>Add Product</button>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search product / slug / brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="active">Visible</option>
          <option value="inactive">Hidden</option>
          <option value="deactivated">Deactivated</option>
          <option value="all">All Statuses</option>
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Products</option>
          <option value="featured">Featured</option>
          <option value="regular">Not Featured</option>
        </select>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Brand</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Featured</th>
              <th style={thStyle}>Visibility</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => {
              const busy = loadingActionId === product.id;

              return (
                <tr
                  key={product.id}
                  style={{
                    borderTop: "1px solid #eee",
                    opacity: product.isDeleted ? 0.55 : 1,
                  }}
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600 }}>{product.title}</div>
                    <div style={{ fontSize: "12px", color: "#777" }}>
                      {product.slug}
                    </div>
                  </td>

                  <td style={tdStyle}>{product.brand?.name || "-"}</td>

                  <td style={tdStyle}>{product.category?.name || "-"}</td>

                  <td style={tdStyle}>{product.stockStatus}</td>

                  <td style={tdStyle}>
                    {product.featured ? (
                      <span style={featuredBadgeStyle}>Featured</span>
                    ) : (
                      <span style={regularBadgeStyle}>Regular</span>
                    )}
                  </td>

                  <td style={tdStyle}>
                    {product.isDeleted ? (
                      <span style={deactivatedBadgeStyle}>Deactivated</span>
                    ) : product.isActive ? (
                      <span style={visibleBadgeStyle}>Visible</span>
                    ) : (
                      <span style={hiddenBadgeStyle}>Hidden</span>
                    )}
                  </td>

                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <button style={editBtnStyle} disabled={busy}>
                          Edit
                        </button>
                      </Link>

                      {!product.isDeleted && (
                        <button
                          style={product.isActive ? hideBtnStyle : showBtnStyle}
                          disabled={busy}
                          onClick={() =>
                            updateProductState(product.id, {
                              isActive: !product.isActive,
                            })
                          }
                        >
                          {product.isActive ? "Hide" : "Show"}
                        </button>
                      )}

                      {product.isDeleted ? (
                        <button
                          style={showBtnStyle}
                          disabled={busy}
                          onClick={() =>
                            updateProductState(product.id, {
                              isDeleted: false,
                              isActive: true,
                            })
                          }
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          style={deactivateBtnStyle}
                          disabled={busy}
                          onClick={() =>
                            updateProductState(product.id, {
                              isDeleted: true,
                              isActive: false,
                            })
                          }
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "12px",
  fontSize: "14px",
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const selectStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const addBtnStyle = {
  padding: "10px 16px",
  background: "black",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};

const editBtnStyle = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const hideBtnStyle = {
  padding: "6px 12px",
  background: "#525252",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const showBtnStyle = {
  padding: "6px 12px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deactivateBtnStyle = {
  padding: "6px 12px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const visibleBadgeStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "999px",
  background: "#dcfce7",
  color: "#166534",
  fontSize: "12px",
  fontWeight: 700,
};

const hiddenBadgeStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "999px",
  background: "#f3f4f6",
  color: "#374151",
  fontSize: "12px",
  fontWeight: 700,
};

const deactivatedBadgeStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "999px",
  background: "#fee2e2",
  color: "#991b1b",
  fontSize: "12px",
  fontWeight: 700,
};

const featuredBadgeStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "999px",
  background: "#dcfce7",
  color: "#166534",
  fontSize: "12px",
  fontWeight: 700,
};

const regularBadgeStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "999px",
  background: "#f3f4f6",
  color: "#374151",
  fontSize: "12px",
  fontWeight: 700,
};
