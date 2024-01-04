// EditModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Product } from '../interfaces';

interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (updatedProduct: Product) => void;
  initialProduct: Product | null;
}

const EditModal: React.FC<EditModalProps> = ({ visible, onCancel, onSave, initialProduct }) => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState<Product | null>(() => {
    if (initialProduct !== null) {
      return initialProduct;
    }
    return null;
  });

  useEffect(() => {
    if (initialProduct !== null) {
        setProduct(initialProduct);
    }
  }, [initialProduct]);

  useEffect(() => {
    if (product !== null) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const updatedProduct = { ...product, ...values };
      onSave(updatedProduct);
      onCancel();
    });
  };

  return (
    <Modal
      visible={visible}
      title="Edit Product"
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
      <Form form={form} initialValues={product !== null ? product : undefined}>
        <Form.Item name="id" label="ID">
          <Input disabled />
        </Form.Item>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price">
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>
        {/* Add other Form.Item fields as needed */}
      </Form>
    </Modal>
  );
};

export default EditModal;
