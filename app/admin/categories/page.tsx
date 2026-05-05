"use client";

import { useEffect, useMemo, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  subcategories?: {
    id: number;
    name: string;
  }[];
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<number | null>(null);

  async function loadCategories() {
    setLoading(true);

    const data = await fetch(
      "/api/categories?includeInactive=true&includeDeleted=true"
    ).then((res) => res.json());

    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/categories?includeInactive=true&includeDeleted=true")
      .then((res) => res.json())
      .then((data: Category[]) => {
        if (!cancelled) {
          setCategories(data);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchSearch =
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.slug.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          category.isActive &&
          !category.isDeleted) ||
        (statusFilter === "inactive" &&
          !category.isActive &&
          !category.isDeleted) ||
        (statusFilter === "deactivated" && category.isDeleted);

      return matchSearch && matchStatus;
    });
  }, [categories, search, statusFilter]);

  function resetForm() {
    setName("");
    setSlug("");
    setEditingId(null);
  }

  function startEdit(category: Category) {
    setName(category.name);
    setSlug(category.slug);
    setEditingId(category.id);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanSlug = editingId ? slug : makeSlug(name);

    if (!cleanName || !cleanSlug) {
      alert("Category name and slug are required");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/categories", {
      method: editingId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        name: cleanName,
        slug: cleanSlug,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to save category");
      return;
    }

    resetForm();
    await loadCategories();
  }

  async function updateCategoryState(
    categoryId: number,
    body: { isActive?: boolean; isDeleted?: boolean }
  ) {
    setLoadingActionId(categoryId);

    const res = await fetch("/api/categories", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: categoryId,
        ...body,
      }),
    });

    setLoadingActionId(null);

    if (!res.ok) {
      alert("Failed to update category");
      return;
    }

    await loadCategories();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Categories</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "minmax(180px, 1fr) minmax(180px, 1fr) auto auto",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!editingId) setSlug(makeSlug(e.target.value));
          }}
          style={inputStyle}
        />

        <input
          aria-label="Category slug"
          value={slug || makeSlug(name)}
          readOnly
          style={readOnlyInputStyle}
        />

        <button type="submit" style={addBtnStyle} disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
            ? "Save Category"
            : "Create Category"}
        </button>

        {editingId && (
          <button type="button" style={cancelBtnStyle} onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search category / slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

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
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Subcategories</th>
              <th style={thStyle}>Visibility</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  Loading categories...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => {
                const busy = loadingActionId === category.id;

                return (
                  <tr
                    key={category.id}
                    style={{
                      borderTop: "1px solid #eee",
                      opacity: category.isDeleted ? 0.55 : 1,
                    }}
                  >
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{category.name}</div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {category.slug}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {category.subcategories?.length || 0}
                    </td>

                    <td style={tdStyle}>
                      {category.isDeleted ? (
                        <span style={deactivatedBadgeStyle}>Deactivated</span>
                      ) : category.isActive ? (
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
                          onClick={() => startEdit(category)}
                        >
                          Edit
                        </button>

                        {category.isActive && !category.isDeleted ? (
                          <button
                            style={hideBtnStyle}
                            disabled={busy}
                            onClick={() =>
                              updateCategoryState(category.id, {
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
                              updateCategoryState(category.id, {
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
