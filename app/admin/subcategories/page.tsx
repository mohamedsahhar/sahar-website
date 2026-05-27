"use client";

import { useEffect, useMemo, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
};

type Subcategory = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  isActive: boolean;
  isDeleted: boolean;
  category?: Category;
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<number | null>(null);

  async function loadData() {
    setLoading(true);

    const [categoriesData, subcategoriesData] = await Promise.all([
      fetch("/api/categories?includeInactive=true&includeDeleted=true").then(
        (res) => res.json()
      ),
      fetch("/api/subcategories?includeInactive=true&includeDeleted=true").then(
        (res) => res.json()
      ),
    ]);

    setCategories(categoriesData);
    setSubcategories(subcategoriesData);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/api/categories?includeInactive=true&includeDeleted=true").then(
        (res) => res.json()
      ),
      fetch("/api/subcategories?includeInactive=true&includeDeleted=true").then(
        (res) => res.json()
      ),
    ]).then(([categoriesData, subcategoriesData]: [Category[], Subcategory[]]) => {
      if (!cancelled) {
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((subcategory) => {
      const matchSearch =
        subcategory.name.toLowerCase().includes(search.toLowerCase()) ||
        subcategory.slug.toLowerCase().includes(search.toLowerCase()) ||
        subcategory.category?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "" ||
        subcategory.categoryId === Number(selectedCategory);

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          subcategory.isActive &&
          !subcategory.isDeleted) ||
        (statusFilter === "inactive" &&
          !subcategory.isActive &&
          !subcategory.isDeleted) ||
        (statusFilter === "deactivated" && subcategory.isDeleted);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [subcategories, search, selectedCategory, statusFilter]);

  function resetForm() {
    setName("");
    setSlug("");
    setCategoryId("");
    setEditingId(null);
  }

  function startEdit(subcategory: Subcategory) {
    setName(subcategory.name);
    setSlug(subcategory.slug);
    setCategoryId(String(subcategory.categoryId));
    setEditingId(subcategory.id);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanSlug = editingId ? slug : makeSlug(name);

    if (!cleanName || !cleanSlug || !categoryId) {
      alert("Subcategory name, slug, and category are required");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/subcategories", {
      method: editingId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        name: cleanName,
        slug: cleanSlug,
        categoryId: Number(categoryId),
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to save subcategory");
      return;
    }

    resetForm();
    await loadData();
  }

  async function updateSubcategoryState(
    subcategoryId: number,
    body: { isActive?: boolean; isDeleted?: boolean }
  ) {
    setLoadingActionId(subcategoryId);

    const res = await fetch("/api/subcategories", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: subcategoryId,
        ...body,
      }),
    });

    setLoadingActionId(null);

    if (!res.ok) {
      alert("Failed to update subcategory");
      return;
    }

    await loadData();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Subcategories</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns:
            "minmax(160px, 1fr) minmax(160px, 1fr) minmax(180px, 1fr) auto auto",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Subcategory name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!editingId) setSlug(makeSlug(e.target.value));
          }}
          style={inputStyle}
        />

        <input
          aria-label="Subcategory slug"
          value={slug || makeSlug(name)}
          readOnly
          style={readOnlyInputStyle}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {!category.isActive || category.isDeleted ? " (hidden)" : ""}
            </option>
          ))}
        </select>

        <button type="submit" style={addBtnStyle} disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
            ? "Save Subcategory"
            : "Create Subcategory"}
        </button>

        {editingId && (
          <button type="button" style={cancelBtnStyle} onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search subcategory / slug / category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
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
              <th style={thStyle}>Subcategory</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Visibility</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  Loading subcategories...
                </td>
              </tr>
            ) : filteredSubcategories.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  No subcategories found.
                </td>
              </tr>
            ) : (
              filteredSubcategories.map((subcategory) => {
                const busy = loadingActionId === subcategory.id;

                return (
                  <tr
                    key={subcategory.id}
                    style={{
                      borderTop: "1px solid #eee",
                      opacity: subcategory.isDeleted ? 0.55 : 1,
                    }}
                  >
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{subcategory.name}</div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {subcategory.slug}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {subcategory.category?.name || "-"}
                    </td>

                    <td style={tdStyle}>
                      {subcategory.isDeleted ? (
                        <span style={deactivatedBadgeStyle}>Deactivated</span>
                      ) : subcategory.isActive ? (
                        <span style={visibleBadgeStyle}>Visible</span>
                      ) : (
                        <span style={hiddenBadgeStyle}>Hidden</span>
                      )}
                    </td>

                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          style={editBtnStyle}
                          disabled={busy}
                          onClick={() => startEdit(subcategory)}
                        >
                          Edit
                        </button>

                        {subcategory.isActive && !subcategory.isDeleted ? (
                          <button
                            style={hideBtnStyle}
                            disabled={busy}
                            onClick={() =>
                              updateSubcategoryState(subcategory.id, {
                                isActive: false,
                              })
                            }
                          >
                            Hide
                          </button>
                        ) : (
                          <button
                            style={showBtnStyle}
                            disabled={busy}
                            onClick={() =>
                              updateSubcategoryState(subcategory.id, {
                                isDeleted: false,
                                isActive: true,
                              })
                            }
                          >
                            Show
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
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

const readOnlyInputStyle = {
  ...inputStyle,
  background: "#f9fafb",
  color: "#4b5563",
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

const cancelBtnStyle = {
  padding: "10px 16px",
  background: "#f3f4f6",
  color: "#111827",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
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
