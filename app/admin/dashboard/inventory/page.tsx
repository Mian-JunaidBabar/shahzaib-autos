"use client";

import { useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  status: "active" | "inactive" | "out-of-stock";
  brand: string;
  description: string;
  images: string[];
  lastUpdated: string;
  supplier: string;
}

const inventoryData: Product[] = [
  {
    id: "INV001",
    name: "Premium Car Wax",
    category: "Car Care",
    sku: "WAX-PREM-001",
    price: 45.99,
    costPrice: 28.5,
    stock: 25,
    minStock: 10,
    status: "active",
    brand: "AutoShine",
    description: "Premium grade car wax for long-lasting protection and shine",
    images: ["/placeholder-product.jpg"],
    lastUpdated: "2024-01-20T10:30:00Z",
    supplier: "AutoShine Supplies",
  },
  {
    id: "INV002",
    name: "Leather Seat Covers",
    category: "Accessories",
    sku: "SEAT-LEATH-002",
    price: 129.99,
    costPrice: 75.0,
    stock: 8,
    minStock: 5,
    status: "active",
    brand: "ComfortDrive",
    description: "Premium leather seat covers for enhanced comfort and style",
    images: ["/placeholder-product.jpg"],
    lastUpdated: "2024-01-19T14:20:00Z",
    supplier: "ComfortDrive Ltd",
  },
  {
    id: "INV003",
    name: "Brake Pads - Toyota Camry",
    category: "Brake System",
    sku: "BRAKE-TOY-003",
    price: 89.99,
    costPrice: 52.0,
    stock: 3,
    minStock: 10,
    status: "active",
    brand: "BrakeMaster",
    description: "OEM quality brake pads for Toyota Camry 2018-2024",
    images: ["/placeholder-product.jpg"],
    lastUpdated: "2024-01-18T09:15:00Z",
    supplier: "BrakeMaster Inc",
  },
  {
    id: "INV004",
    name: "Engine Oil Filter",
    category: "Engine Parts",
    sku: "FILT-ENG-004",
    price: 12.99,
    costPrice: 7.5,
    stock: 0,
    minStock: 20,
    status: "out-of-stock",
    brand: "FilterPro",
    description: "High-efficiency engine oil filter for various vehicle models",
    images: ["/placeholder-product.jpg"],
    lastUpdated: "2024-01-17T16:45:00Z",
    supplier: "FilterPro Supplies",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50";
    case "inactive":
      return "text-gray-600 bg-gray-50";
    case "out-of-stock":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getStockStatus = (stock: number, minStock: number) => {
  if (stock === 0) return { text: "Out of Stock", color: "text-red-600" };
  if (stock <= minStock) return { text: "Low Stock", color: "text-orange-600" };
  return { text: "In Stock", color: "text-green-600" };
};

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = inventoryData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(inventoryData.map((p) => p.category))];

  const stats = {
    total: inventoryData.length,
    active: inventoryData.filter((p) => p.status === "active").length,
    outOfStock: inventoryData.filter((p) => p.status === "out-of-stock").length,
    lowStock: inventoryData.filter((p) => p.stock <= p.minStock && p.stock > 0)
      .length,
    totalValue: inventoryData.reduce(
      (sum, product) => sum + product.price * product.stock,
      0,
    ),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Manage products, stock levels, and pricing
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">file_download</span>
              Export
            </span>
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Add Product
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Products</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-full">
              inventory
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <span className="material-symbols-outlined text-green-500 bg-green-50 p-2 rounded-full">
              check_circle
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outOfStock}
              </p>
            </div>
            <span className="material-symbols-outlined text-red-500 bg-red-50 p-2 rounded-full">
              error
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.lowStock}
              </p>
            </div>
            <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-2 rounded-full">
              warning
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                ${stats.totalValue.toLocaleString()}
              </p>
            </div>
            <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 p-2 rounded-full">
              monetization_on
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            search
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Product
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  SKU
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Category
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Stock
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Price
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Cost
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Margin
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(
                  product.stock,
                  product.minStock,
                );
                const margin = (
                  ((product.price - product.costPrice) / product.price) *
                  100
                ).toFixed(1);

                return (
                  <tr key={product.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-muted-foreground">
                            inventory
                          </span>
                        </div>
                        <div>
                          <Link
                            href={`/admin/dashboard/inventory/${product.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-sm text-foreground">
                        {product.sku}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{product.category}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className={`font-medium ${stockStatus.color}`}>
                          {product.stock}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Min: {product.minStock}
                        </p>
                        <span className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">
                        ${product.price}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">${product.costPrice}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-green-600">{margin}%</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}
                      >
                        {product.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/dashboard/inventory/${product.id}`}
                          className="text-muted-foreground hover:text-primary"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined">
                            visibility
                          </span>
                        </Link>
                        <button
                          className="text-muted-foreground hover:text-primary"
                          title="Edit Product"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                        <button
                          className="text-muted-foreground hover:text-green-500"
                          title="Update Stock"
                        >
                          <span className="material-symbols-outlined">
                            add_box
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-muted-foreground text-4xl mb-4">
            inventory_2
          </span>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No products have been added to inventory yet"}
          </p>
        </div>
      )}
    </div>
  );
}
