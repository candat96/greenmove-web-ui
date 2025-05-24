"use client";
import React, { useState, useEffect } from "react";
import { Button, message, Table, Modal, Form, Input, DatePicker, App, Popconfirm, Space } from "antd";
import styles from "./style.module.scss";
import axiosInstance from "@/services/axios";
import type { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Holiday {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const HolidaysContent = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchHolidays = async () => {
    setTableLoading(true);
    try {
      const response = await axiosInstance.get<any, Holiday[]>('holidays');
      setHolidays(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      message.error("Impossible de charger la liste des jours fériés");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: Holiday) => {
    setCurrentHoliday(record);
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
      startDate: record.startDate.includes("/") ? dayjs(`2024-${record.startDate.split('/').reverse().join('-')}`) : dayjs(record.startDate),
      endDate: record.endDate.includes("/") ? dayjs(`2024-${record.endDate.split('/').reverse().join('-')}`) : dayjs(record.endDate)
    });
    setIsEditModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      try {
        const payload = {
          name: values.name,
          description: values.description,
          startDate: dayjs(values.startDate).format('DD/MM'),
          endDate: dayjs(values.endDate).format('DD/MM')
        };
        
        await axiosInstance.post('holidays', payload);
        message.success("Jour férié ajouté avec succès");
        setIsModalVisible(false);
        form.resetFields();
        fetchHolidays();
      } catch (error) {
        console.error("Erreur lors de l'ajout du jour férié:", error);
        message.error("Impossible d'ajouter le jour férié");
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la validation du formulaire:", error);
    }
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      if (currentHoliday) {
        setLoading(true);
        try {
          const payload = {
            name: values.name,
            description: values.description,
            startDate: dayjs(values.startDate).format('DD/MM'),
            endDate: dayjs(values.endDate).format('DD/MM')
          };
          
          await axiosInstance.patch(`holidays/${currentHoliday.id}`, payload);
          message.success("Jour férié mis à jour avec succès");
          setIsEditModalVisible(false);
          fetchHolidays();
        } catch (error) {
          console.error("Erreur lors de la mise à jour:", error);
          message.error("Impossible de mettre à jour le jour férié");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la validation du formulaire:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      await axiosInstance.delete(`holidays/${id}`);
      message.success("Jour férié supprimé avec succès");
      fetchHolidays();
    } catch (error) {
      console.error("Erreur lors de la suppression du jour férié:", error);
      message.error("Impossible de supprimer le jour férié");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    // Si la date est déjà au format DD/MM, l'afficher directement
    if (dateString.includes('/')) {
      return dateString;
    }
    
    // Si la date est au format ISO, la convertir en DD/MM
    try {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

  const columns = [
    {
      title: "N°",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date de début',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Date de fin',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: Holiday) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            style={{ backgroundColor: '#234B8E', borderColor: '#234B8E' }} 
            onClick={() => showEditModal(record)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Confirmation de suppression"
            description="Êtes-vous sûr de vouloir supprimer ce jour férié ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Supprimer"
            cancelText="Annuler"
            okButtonProps={{ style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' } }}
          >
            <Button 
              danger 
              loading={deleteLoading === record.id}
              icon={<DeleteOutlined />}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles["wrap-holidays"]}>
      <div className={styles["wrap-header"]}>
        <h2>Gestion des jours fériés</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showModal}
          style={{ backgroundColor: '#234B8E', borderColor: '#234B8E' }}
        >
          Ajouter
        </Button>
      </div>
      <div className={styles["wrap-body"]}>
        <Table 
          className={styles["table"]} 
          dataSource={holidays} 
          columns={columns} 
          rowKey="id"
          loading={tableLoading}
          pagination={{ pageSize: 10 }} 
        />
      </div>

      <Modal
        title="Ajouter un jour férié"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText="Enregistrer"
        cancelText="Annuler"
        okButtonProps={{ style: { backgroundColor: '#234B8E', borderColor: '#234B8E' } }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Nom du jour férié"
            rules={[{ required: true, message: "Veuillez saisir le nom du jour férié" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Veuillez saisir une description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Date de début"
            rules={[{ required: true, message: "Veuillez choisir une date de début" }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM"
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Date de fin"
            rules={[{ required: true, message: "Veuillez choisir une date de fin" }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Modifier le jour férié"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={loading}
        okText="Enregistrer"
        cancelText="Annuler"
        okButtonProps={{ style: { backgroundColor: '#234B8E', borderColor: '#234B8E' } }}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Nom du jour férié"
            rules={[{ required: true, message: "Veuillez saisir le nom du jour férié" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Veuillez saisir une description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Date de début"
            rules={[{ required: true, message: "Veuillez choisir une date de début" }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM"
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Date de fin"
            rules={[{ required: true, message: "Veuillez choisir une date de fin" }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Wrap with App component to fix message warning
const HolidaysPage = () => {
  return (
    <App>
      <HolidaysContent />
    </App>
  );
};

export default HolidaysPage; 