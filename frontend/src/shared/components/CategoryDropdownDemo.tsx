import { postCategoryProps } from "@shared/types/post";
import React, { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";

// Demo data for testing
const demoCategories: postCategoryProps[] = [
  {
    id: 1,
    name: "Bia thủ công",
    title: "Bia thủ công",
    description: "Bia thủ công chất lượng cao",
    parent_id: null,
    posts_count: 15,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    allParents: null,
    allChildren: null,
  },
  {
    id: 2,
    name: "Bia nhập khẩu",
    title: "Bia nhập khẩu",
    description: "Bia nhập khẩu từ các nước",
    parent_id: null,
    posts_count: 8,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    allParents: null,
    allChildren: null,
  },
  {
    id: 3,
    name: "Bia trong nước",
    title: "Bia trong nước",
    description: "Bia sản xuất trong nước",
    parent_id: null,
    posts_count: 22,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    allParents: null,
    allChildren: null,
  },
  {
    id: 4,
    name: "Bia không cồn",
    title: "Bia không cồn",
    description: "Bia không có cồn",
    parent_id: null,
    posts_count: 5,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    allParents: null,
    allChildren: null,
  },
];

const CategoryDropdownDemo: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-primary font-serif mb-6">
          Category Dropdown Demo
        </h1>

        <div className="mb-6">
          <h2 className="text-lg text-primary mb-3">
            Multi-select Dropdown:
          </h2>
          <CategoryDropdown
            categories={demoCategories}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            placeholder="Chọn nhiều danh mục..."
            multiple={true}
            searchable={true}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-md text-primary font-serif mb-2">Selected IDs:</h3>
          <div className="p-3 bg-surface border border-[#eee] rounded-lg text-primary">
            {selectedIds.length > 0 ? JSON.stringify(selectedIds) : "None"}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg text-primary mb-3">
            Single-select Dropdown:
          </h2>
          <CategoryDropdown
            categories={demoCategories}
            selectedIds={selectedIds.slice(0, 1)}
            onSelectionChange={(ids) => setSelectedIds(ids.slice(0, 1))}
            placeholder="Chọn một danh mục..."
            multiple={false}
            searchable={true}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg text-primary mb-3">No Search Dropdown:</h2>
          <CategoryDropdown
            categories={demoCategories}
            selectedIds={[]}
            onSelectionChange={() => {}}
            placeholder="Không có tìm kiếm..."
            multiple={true}
            searchable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdownDemo;


