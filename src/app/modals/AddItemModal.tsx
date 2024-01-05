// AddModal.tsx
import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { Product } from "../interfaces";

interface AddItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (newProduct: Product) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onCancel,
  onAdd,
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      const addedProduct = values as Product;
      onAdd(addedProduct);
      onCancel();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      open={visible}
      title="Add New Product"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} onFinishFailed={onFinishFailed}>
        <Form.Item name="id" label="ID">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter the price!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please enter the category!" }]}
        >
          <Input />
        </Form.Item>
        {/* Add other Form.Item fields as needed */}
      </Form>
    </Modal>
  );
};

export default AddItemModal;
