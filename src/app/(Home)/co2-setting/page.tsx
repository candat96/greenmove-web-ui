"use client";
import React, { useState, useEffect } from "react";
import { Button, message, Table, Modal, Form, Input, InputNumber } from "antd";
import styles from "./style.module.scss";
import axiosInstance from "@/services/axios";

interface EmissionFactor {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  vehicle: string;
  emissionFactor: string | number;
  description: string;
}

const CO2SettingPage = () => {
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFactor, setCurrentFactor] = useState<EmissionFactor | null>(null);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchEmissionFactors = async () => {
    setTableLoading(true);
    try {
      const response = await axiosInstance.get<any, EmissionFactor[]>('emission-factors');
      setEmissionFactors(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      message.error("Impossible de récupérer les facteurs d'émission");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchEmissionFactors();
  }, []);

  const showEditModal = (record: EmissionFactor) => {
    setCurrentFactor(record);
    editForm.setFieldsValue({
      emissionFactor: Number(record.emissionFactor),
      description: record.description
    });
    setIsModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      if (currentFactor) {
        setLoading(true);
        try {
          const response = await axiosInstance.patch<any, EmissionFactor>(
            `emission-factors/vehicle/${currentFactor.vehicle}`,
            {
              emissionFactor: Number(values.emissionFactor),
              description: values.description
            }
          );
          
          // Mise à jour de la liste des facteurs d'émission
          setEmissionFactors(prev => 
            prev.map(item => 
              item.vehicle === currentFactor.vehicle ? response : item
            )
          );
          
          message.success("Facteur d'émission mis à jour avec succès");
          setIsModalVisible(false);
        } catch (error) {
          console.error("Erreur lors de la mise à jour:", error);
          message.error("Impossible de mettre à jour le facteur d'émission");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Erreur de validation du formulaire:", error);
    }
  };

  const getVehicleName = (vehicle: string): string => {
    const vehicleNames: {[key: string]: string} = {
      CAR: 'voiture',
      BICYCLE: 'vélo',
      BUS: 'bus',
      TRAIN: 'train',
      MOTORCYCLE: 'moto',
      OTHER: 'autre',
      WALKING: 'marche',
      RUNNING: 'course à pied',
      SUBWAY_TRANWAY: 'métro/tramway',
      SCOOTER: 'scooter',
      ELECTRIC_BIKE: 'vélo électrique',
      PLANE: 'avion',
      PUBLIC_TRANSPORT: 'transport en commun'
    };
    return vehicleNames[vehicle] || vehicle.toLowerCase();
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
    },
    {
      title: 'Véhicule',
      dataIndex: 'vehicle',
      key: 'vehicle',
      render: (text: string) => {
        const vehicleNames: {[key: string]: string} = {
          CAR: 'Voiture',
          BICYCLE: 'Vélo',
          BUS: 'Bus',
          TRAIN: 'Train',
          MOTORCYCLE: 'Moto',
          OTHER: 'Autre',
          WALKING: 'Marche',
          RUNNING: 'Course à pied',
          SUBWAY_TRANWAY: 'Métro/Tramway',
          SCOOTER: 'Scooter',
          ELECTRIC_BIKE: 'Vélo électrique',
          PLANE: 'Avion',
          PUBLIC_TRANSPORT: 'Transport en commun'
        };
        return vehicleNames[text] || text;
      }
    },
    {
      title: "Facteur d'émission",
      dataIndex: 'emissionFactor',
      key: 'emissionFactor',
      render: (text: string) => text + ' kg/km',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: EmissionFactor) => (
        <Button type="primary" style={{ backgroundColor: '#234B8E', borderColor: '#234B8E' }} onClick={() => showEditModal(record)}>
          Modifier
        </Button>
      ),
    },
  ];

  return (
    <div className={styles["wrap-co2-setting"]}>
      <div className={styles["wrap-header"]}>
        <h2>Paramètres des facteurs d'émission CO2</h2>
      </div>
      <div className={styles["wrap-body"]}>
        <Table 
          className={styles["table"]} 
          dataSource={emissionFactors} 
          columns={columns} 
          rowKey="id"
          loading={tableLoading}
          pagination={false} 
        />
      </div>

      <Modal
        title="Modifier le facteur d'émission"
        open={isModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        okText="Accepter"
        cancelText="Annuler"
        okButtonProps={{ style: { backgroundColor: '#234B8E', borderColor: '#234B8E' } }}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="emissionFactor"
            label="Facteur d'émission"
            rules={[{ required: true, message: "Veuillez saisir le facteur d'émission" }]}
          >
            <InputNumber min={0} step={0.001} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Veuillez saisir une description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CO2SettingPage; 