"use client";

import { Table, Button, TableColumnsType, Space } from "antd";
import { Product } from "../interfaces";

interface Props {
  products: Product[];
}

const TableComponent: React.FC<Props> = ({ products }) => {
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

  const handleEdit = (record: Product) => {
    // Implement edit functionality here using the record object
    console.log("Edit product:", record);
    // You can open a modal or navigate to an edit page for this product
  };

  const handleDelete = (productId: number) => {
    // Implement delete functionality here using the productId
    console.log("Delete product with ID:", productId);
    // You can perform deletion logic and update the table accordingly
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
      </div>
    </div>
  );
};

export default TableComponent;
