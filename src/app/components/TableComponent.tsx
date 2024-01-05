"use client";

import { Table, Button, TableColumnsType, Space, Input, Select } from "antd";
import { Product } from "../interfaces";
import { useState } from "react";
import EditModal from "../modals/EditModal";
import { mockProducts } from "../mockData";
import AddItemModal from "../modals/AddItemModal";
import { ColumnType } from "antd/lib/table";
import { SortOrder } from "antd/lib/table/interface";
import { FilterOutlined, FilterFilled } from "@ant-design/icons";

interface Props {
  products: Product[];
}

const TableComponent: React.FC<Props> = ({ products: initialProducts }) => {
  // Create a state to hold the selected category and another state to manage the filtered products
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [deletedRowId, setDeletedRowId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortedInfo, setSortedInfo] = useState<{
    columnKey: string | number;
    order: string | undefined;
  }>({ columnKey: "", order: undefined });

  // When initializing the component, check if there's data in local storage
  const storedMockProducts = localStorage.getItem("mockProducts");

  const initialMockProducts = storedMockProducts
    ? JSON.parse(storedMockProducts)
    : mockProducts;
  const [products, setProducts] = useState<Product[]>(initialMockProducts);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [addModalVisible, setAddModalVisible] = useState(false);

  // for handling searching
  const [searchTextResults, setSearchTextResults] = useState<Product[]>([]);

  // Create a function to handle the category selection change
  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    if (value === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => product.category === value);
      setFilteredProducts(filtered);
    }
  };

  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();
    setSearchText(value);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue)
    );

    setSearchTextResults(filtered);
  };

  // Fetch data from localStorage to be populated into the drop-down filter
  const storedProducts = JSON.parse(
    localStorage.getItem("mockProducts") || "[]"
  ) as Product[];

  // Extract unique categories
  const uniqueCategoriesSet = new Set(
    storedProducts.map((product: { category: any }) => product.category)
  );
  const uniqueCategories = Array.from(uniqueCategoriesSet);

  // for handling sorting of columns
  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo({ columnKey: sorter.columnKey, order: sorter.order });
  };

  const handleAddModalSave = (newProduct: Product) => {
    const updatedProducts = [
      ...products,
      { ...newProduct, id: products.length + 1 },
    ];
    setProducts(updatedProducts);

    const updatedMockProducts = [
      ...initialMockProducts,
      { ...newProduct, id: initialMockProducts.length + 1 },
    ];

    localStorage.setItem("mockProducts", JSON.stringify(updatedMockProducts));
    setAddModalVisible(false);
  };

  const handleEdit = (record: Product) => {
    setSelectedProduct(record);
    setEditModalVisible(true);
  };

  const updateMockProducts = (updatedProduct: Product) => {
    const updatedMockProducts = mockProducts.map((product) =>
      product.id === updatedProduct.id
        ? { ...product, ...updatedProduct }
        : product
    );
    setProducts(updatedMockProducts);

    // Save the updated data to local storage
    localStorage.setItem("mockProducts", JSON.stringify(updatedMockProducts));
  };

  const handleEditModalSave = (updatedProduct: Product) => {
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id
        ? { ...product, ...updatedProduct }
        : product
    );
    setProducts(updatedProducts);

    // Save the updated data to local storage
    localStorage.setItem("mockProducts", JSON.stringify(updatedProducts));

    setEditModalVisible(false);
    setSelectedProduct(null);
  };

  const handleCancelEditModal = () => {
    setEditModalVisible(false);
    setSelectedProduct(null);
  };

  const columns: ColumnType<Product>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      sortOrder:
        sortedInfo.columnKey === "name"
          ? (sortedInfo.order as SortOrder)
          : undefined,
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a: Product, b: Product) => a.category.localeCompare(b.category),
      sortOrder:
        sortedInfo.columnKey === "category"
          ? (sortedInfo.order as SortOrder)
          : undefined,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_text: any, record: Product) => (
        <Space size="middle">
          {/* Edit Button */}
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          {/* Delete Button */}
          <Button type="primary" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (recordId: number) => {
    setDeletedRowId(recordId);

    setTimeout(() => {
      const updatedProducts = products.filter(
        (product) => product.id !== recordId
      );
      setProducts(updatedProducts);
      setDeletedRowId(null);
    }, 500);
  };

  const totalItems = searchText
    ? searchTextResults.length // Your filtered products based on the search text
    : selectedCategory // If a category is selected, use its filtered products
    ? filteredProducts.length
    : products.length; // total items in the catalogue
  return (
    <div className="table-container">
      <div className="table-content">
        <h1 className="header-title">Product Catalog</h1>
        <div className="add">
          <Button type="primary" onClick={() => setAddModalVisible(true)}>
            Add New Item
          </Button>
          <Select
            suffixIcon={<FilterOutlined />}
            style={{ width: 200, marginLeft: "10px" }}
            value={selectedCategory}
            className="dropdown-filter"
            onChange={(value) => {
              setSelectedCategory(value);
              handleCategorySelect(value);
            }}
          >
            <Select.Option value={null}>All Categories</Select.Option>
            {uniqueCategories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>

          <Input
            placeholder="Type Name or Category to search..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginTop: "8px" }}
            className="search"
          />
        </div>
        <Table<Product>
          bordered={true}
          dataSource={
            searchText
              ? searchTextResults // Your filtered products based on the search text
              : selectedCategory // If a category is selected, use its filtered products
              ? filteredProducts
              : products // Default to all products if no filters are active
          }
          columns={columns}
          rowKey="id"
          size="small" // To scale down the size of the table
          onChange={handleChange} // Attach the onChange handler to update sortedInfo
          pagination={{ pageSize: 8 }} // Modify pagination as needed
          footer={() => (
            <div style={{ textAlign: "right" }}>Total items: {totalItems}</div>
          )}
          rowClassName={(record) =>
            deletedRowId === record.id ? "delete-transition" : ""
          }
          onRow={(record) => ({
            className:
              deletedRowId && record.id > deletedRowId ? "shift-up" : "",
            style: {
              transition:
                deletedRowId && record.id > deletedRowId
                  ? "transform 0.5s ease"
                  : "",
            },
          })}
        />
        <EditModal
          visible={editModalVisible}
          onCancel={handleCancelEditModal}
          onSave={handleEditModalSave}
          initialProduct={selectedProduct} // Pass an empty object if no selectedProduct
        />
        <AddItemModal
          visible={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          onAdd={handleAddModalSave}
        />
      </div>
    </div>
  );
};

export default TableComponent;
