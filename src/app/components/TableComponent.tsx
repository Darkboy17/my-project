"use client";

import { Table, Button, TableColumnsType, Space } from "antd";
import { Product } from "../interfaces";
import { useState } from "react";
import EditModal from "../modals/EditModal";

interface Props {
  products: Product[];
}

const TableComponent: React.FC<Props> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEdit = (record: Product) => {
    setSelectedProduct(record);
    setEditModalVisible(true);
  };

  const handleEditModalSave = (updatedProduct: Product) => {
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
    );
    setProducts(updatedProducts);
  };

  const handleCancelEditModal = () => {
    setEditModalVisible(false);
    setSelectedProduct(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
    const updatedProducts = products.filter((product) => product.id !== recordId);
    setProducts(updatedProducts);
  };

  return (
    <div className="table-container">
      <div className="table-content">
        <h1 className="header-title">Product Catalog</h1>
        <div className="add">
        <Button type="primary">
          Add New Item
        </Button>
        </div>
        <Table<Product>
          dataSource={products}
          columns={columns}
          rowKey="id"
          size="small" // To scale down the size of the table
        />
        <EditModal
        visible={editModalVisible}
        onCancel={handleCancelEditModal}
        onSave={handleEditModalSave}
        initialProduct={selectedProduct} // Pass an empty object if no selectedProduct
      />
      </div>
    </div>
  );
};

export default TableComponent;
