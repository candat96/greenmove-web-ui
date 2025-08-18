"use client";
import React, { useState, useEffect } from "react";
import { 
  Button, 
  Table, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  App, 
  Popconfirm, 
  Space, 
  Select, 
  Tag,
  Pagination,
  Card,
  Statistic
} from "antd";
import styles from "./style.module.scss";
import dayjs from "dayjs";
import { 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  FilterOutlined
} from "@ant-design/icons";
import type { AlignType } from 'rc-table/lib/interface';
import { useCompetitions } from "./useCompetitions";
import { 
  Competition, 
  CompetitionCategory, 
  CompetitionStatus, 
  CompetitionScope,
  CompetitionObjective,
  CreateCompetitionPayload
} from "@/services/competition";
import { getCompanies, Company } from "@/services/company";
import { useRouter } from "next/navigation";

const { Option } = Select;

// Category mapping pour l'affichage
const categoryLabels: Record<CompetitionCategory, string> = {
  'CO2': 'Émissions CO2',
  'BICYCLE': 'Vélo',
  'WALKING': 'Marche',
  'DISTANCE': 'Distance',
  'TRIPS': 'Nombre de trajets',
  'POINTS': 'Points',
  'CAR_POOL': 'Covoiturage',
  'PUBLIC_TRANSPORT': 'Transport public'
};

// Status mapping pour l'affichage
const statusLabels: Record<CompetitionStatus, { label: string; color: string }> = {
  'DRAFT': { label: 'Brouillon', color: 'default' },
  'ACTIVE': { label: 'En cours', color: 'green' },
  'ENDED': { label: 'Terminé', color: 'red' },
  'CANCELLED': { label: 'Annulé', color: 'gray' }
};

const CompetitionsContent = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCompetition, setCurrentCompetition] = useState<Competition | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  
  // State pour les entreprises
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  
  // Surveillance des changements de portée pour les mises à jour UI en temps réel
  const [createScope, setCreateScope] = useState<CompetitionScope | undefined>();
  const [editScope, setEditScope] = useState<CompetitionScope | undefined>();
  const {
    competitions,
    stats,
    loading,
    editLoading: hookEditLoading,
    deleteLoading,
    pagination,
    filters,
    updateFilters,
    handleCreateCompetition,
    handleUpdateCompetition,
    handleDeleteCompetition,
    onChangePagination,
  } = useCompetitions();

  // Charger les entreprises quand le filtre de portée est défini sur COMPANY
  useEffect(() => {
    if (filters.scope === 'COMPANY') {
      fetchCompanies();
    }
  }, [filters.scope]);

  // Colonnes pour le tableau des concours
  const getCompetitionsColumns = (showActions = true) => [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Nom du concours',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: Competition) => (
        <Button 
          type="link" 
          onClick={() => handleViewDetail(record.id)}
          style={{ padding: 0, height: 'auto', color: '#234B8E', fontWeight: '500' }}
        >
          {name}
        </Button>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: CompetitionCategory) => (
        <Tag color="blue">{categoryLabels[category]}</Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: CompetitionStatus) => {
        const statusInfo = statusLabels[status];
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
      },
    },
    {
      title: 'Heure de début',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
      render: (date: string) => dayjs(date).format('HH:mm - DD/MM/YYYY'),
    },
    {
      title: 'Heure de fin',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
      render: (date: string) => dayjs(date).format(' HH:mm - DD/MM/YYYY'),
    },
    {
      title: 'Nombre de participants',
      dataIndex: 'participantCount',
      key: 'participantCount',
      width: 160
    },
    ...(showActions ? [{
      title: 'Actions',
      key: 'action',
      align: 'center' as AlignType,
      width: 200,
      render: (_: any, record: Competition) => (
        <Space>
          <Button 
            size="middle"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
            type="primary" 
            style={{ backgroundColor: '#234B8E', borderColor: '#234B8E', color: '#fff'}}
          >
            Voir détails
          </Button>
          <Button 
            size="middle"
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Confirmer la suppression"
            description="Êtes-vous sûr de vouloir supprimer ce concours ?"
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Supprimer"
            cancelText="Annuler"
            okButtonProps={{ danger: true }}
          >
            <Button 
              size="middle"
              danger 
              loading={deleteLoading === record.id}
              icon={<DeleteOutlined />}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    }] : [])
  ];



  const handleViewDetail = (competitionId: string) => {
    router.push(`/competitions/${competitionId}`);
  };



  const handleEditClick = (competition: Competition) => {
    setCurrentCompetition(competition);
    setEditScope(competition.scope); // Set initial scope state
    editForm.setFieldsValue({
      name: competition.name,
      description: competition.description,
      startTime: dayjs(competition.startTime),
      endTime: dayjs(competition.endTime),
      category: competition.category,
      objective: competition.objective,
      scope: competition.scope,
      companyIds: competition.companies?.map(c => c.id),
      rewards: competition.rewards,
      banner: competition.banner,
    });
    setEditModalVisible(true);
    // Load companies khi mở modal
    fetchCompanies();
  };

  const handleDeleteClick = async (competitionId: string) => {
    await handleDeleteCompetition(competitionId);
  };

  const showCreateModal = () => {
    form.resetFields();
    setCreateModalVisible(true);
    setCreateScope(undefined); // Reset scope state
    // Load companies khi mở modal
    fetchCompanies();
  };

  const handleCreateOk = async () => {
    try {
      const values = await form.validateFields();
      setCreateLoading(true);
      
      const payload: CreateCompetitionPayload = {
        name: values.name,
        description: values.description,
        startTime: dayjs(values.startTime).toISOString(),
        endTime: dayjs(values.endTime).toISOString(),
        category: values.category,
        objective: values.objective,
        scope: values.scope,
        companyIds: values.companyIds,
        rewards: values.rewards,
        banner: values.banner,
      };

      await handleCreateCompetition(payload);
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Erreur lors de la création du concours:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditOk = async () => {
    if (!currentCompetition) return;
    
    try {
      const values = await editForm.validateFields();
      setEditLoading(true);
      
      const payload: Partial<CreateCompetitionPayload> = {
        name: values.name,
        description: values.description,
        startTime: dayjs(values.startTime).toISOString(),
        endTime: dayjs(values.endTime).toISOString(),
        category: values.category,
        objective: values.objective,
        scope: values.scope,
        companyIds: values.companyIds,
        rewards: values.rewards,
        banner: values.banner,
      };

      await handleUpdateCompetition(currentCompetition.id, payload);
      setEditModalVisible(false);
      editForm.resetFields();
      setCurrentCompetition(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du concours:", error);
    } finally {
      setEditLoading(false);
    }
  };

  // Fetch companies with search
  const fetchCompanies = async (search = '') => {
    try {
      setCompaniesLoading(true);
      const response = await getCompanies({
        search,
        page: 1,
        limit: 50
      });
      setCompanies(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la liste des entreprises:', error);
      message.error('Impossible de charger la liste des entreprises');
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleFilterChange = (filterType: 'status' | 'category' | 'scope' | 'companyId', value: any) => {
    const newFilters = { 
      ...filters,
      [filterType]: value 
    };
    
    // Si la portée change et n'est pas COMPANY, supprimer companyId
    if (filterType === 'scope' && value !== 'COMPANY') {
      delete newFilters.companyId;
    }
    
    updateFilters(newFilters);
  };

  const handleCompanySearch = (value: string) => {
    setCompanySearch(value);
    if (value.trim()) {
      fetchCompanies(value);
    }
  };

  const renderFilters = () => (
    <Space wrap style={{ marginBottom: 16 }}>
      <Select
        placeholder="Filtrer par statut"
        allowClear
        style={{ width: 150 }}
        value={filters.status}
        onChange={(value) => handleFilterChange('status', value)}
      >
        {Object.entries(statusLabels).map(([key, value]) => (
          <Option key={key} value={key}>{value.label}</Option>
        ))}
      </Select>
      
      <Select
        placeholder="Filtrer par type"
        allowClear
        style={{ width: 180 }}
        value={filters.category}
        onChange={(value) => handleFilterChange('category', value)}
      >
        {Object.entries(categoryLabels).map(([key, value]) => (
          <Option key={key} value={key}>{value}</Option>
        ))}
      </Select>
      
      <Select
        placeholder="Filtrer par portée"
        allowClear
        style={{ width: 140 }}
        value={filters.scope}
        onChange={(value) => handleFilterChange('scope', value)}
      >
        <Option value="GLOBAL">Global</Option>
        <Option value="COMPANY">Entreprise</Option>
      </Select>

      {/* Afficher seulement quand portée = COMPANY */}
      {filters.scope === 'COMPANY' && (
        <Select
          placeholder="Choisir entreprise"
          allowClear
          style={{ width: 200 }}
          value={filters.companyId}
          onChange={(value) => handleFilterChange('companyId', value)}
          showSearch
          searchValue={companySearch}
          onSearch={handleCompanySearch}
          filterOption={false}
          loading={companiesLoading}
          notFoundContent={companiesLoading ? "Đang tải..." : "Không tìm thấy công ty"}
        >
          {companies.map((company) => (
            <Option key={company.id} value={company.id}>
              {company.name}
            </Option>
          ))}
        </Select>
      )}
    </Space>
  );

  const renderStatCards = () => {
    if (!stats) return null;
    
    return (
      <div style={{ marginBottom: 24 }}>
        <Space size="large">
          <Card>
            <Statistic
              title="Total concours"
              value={stats.totalCompetitions}
              prefix={<TrophyOutlined />}
            />
          </Card>
          <Card>
            <Statistic
              title="En cours"
              value={stats.activeCompetitions}
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
          <Card>
            <Statistic
              title="Remportés"
              value={stats.wonCompetitions}
              valueStyle={{ color: '#cf1322' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Space>
      </div>
    );
  };

  return (
    <div className={styles["wrap-competitions"]}>
      <div className={styles["wrap-header"]}>
        <h2>Concours</h2>
        <div className={styles["wrap-header-actions"]}>
        {renderFilters()}
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
            onClick={showCreateModal}
          style={{ backgroundColor: '#234B8E', borderColor: '#234B8E' }}
        >
            Créer nouveau concours
        </Button>
        </div>
      </div>

      {renderStatCards()}

      <div className={styles["wrap-body"]}>
        
        <Table 
          className={styles["table"]} 
          dataSource={competitions} 
          columns={getCompetitionsColumns()} 
          rowKey="id"
          loading={loading}
          pagination={false}
        />
        {pagination && (
          <Pagination 
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={(page, pageSize) => onChangePagination(page, pageSize)}
            style={{ marginTop: 16, textAlign: 'center' }}
          />
        )}
      </div>

      {/* Modal tạo cuộc thi */}
      <Modal
        title="Créer nouveau concours"
        open={createModalVisible}
        onOk={handleCreateOk}
        onCancel={() => {
          setCreateModalVisible(false);
          setCreateScope(undefined);
          form.resetFields();
        }}
        confirmLoading={createLoading}
        okText="Créer concours"
        cancelText="Annuler"
        width={'80%'}
        okButtonProps={{ style: { backgroundColor: '#234B8E', borderColor: '#234B8E' } }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
                          label="Nom du concours"
              rules={[{ required: true, message: "Veuillez saisir le nom du concours" }]}
          >
            <Input placeholder="Exemple: Concours vélo décembre" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
              rules={[{ required: true, message: "Veuillez saisir la description" }]}
          >
            <Input.TextArea rows={3} placeholder="Description détaillée du concours" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="startTime"
              label="Heure de début"
              rules={[{ required: true, message: "Veuillez choisir l'heure de début" }]}
              style={{ flex: 1 }}
            >
              <DatePicker 
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="Heure de fin"
              rules={[{ required: true, message: "Veuillez choisir l'heure de fin" }]}
              style={{ flex: 1 }}
            >
              <DatePicker 
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="category"
              label="Type de concours"
              rules={[{ required: true, message: "Veuillez choisir le type de concours" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Choisir type de concours" style={{ minWidth: 200}}>
                {Object.entries(categoryLabels).map(([key, value]) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="objective"
              label="Objectif"
              rules={[{ required: true, message: "Veuillez choisir l'objectif" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Choisir objectif" style={{ minWidth: 200}}>
                <Option value="HIGHEST">Le plus élevé</Option>
                <Option value="LOWEST">Le plus bas</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            name="scope"
            label="Portée"
            rules={[{ required: true, message: "Veuillez choisir la portée" }]}
          >
            <Select 
              placeholder="Chọn phạm vi cuộc thi"
              onChange={(value: CompetitionScope) => {
                setCreateScope(value);
                // Reset companyIds khi thay đổi scope
                if (value !== 'COMPANY') {
                  form.setFieldValue('companyIds', undefined);
                }
              }}
            >
              <Option value="GLOBAL">Toàn cầu</Option>
              <Option value="COMPANY">Công ty</Option>
            </Select>
          </Form.Item>

          {/* Afficher seulement quand portée = COMPANY */}
          {createScope === 'COMPANY' && (
            <Form.Item
              name="companyIds"
              label="Choisir entreprise"
              rules={[{ required: true, message: "Veuillez choisir au moins une entreprise" }]}
            >
              <Select
                mode="multiple"
                placeholder="Choisir entreprises participantes (sélection multiple possible)"
              style={{ width: '100%' }}
                showSearch
                searchValue={companySearch}
                onSearch={handleCompanySearch}
                filterOption={false}
                loading={companiesLoading}
                notFoundContent={companiesLoading ? "Chargement..." : "Aucune entreprise trouvée"}
                maxTagCount="responsive"
                allowClear
              >
                {companies.map((company) => (
                  <Option key={company.id} value={company.id}>
                    {company.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="rewards"
            label="Récompenses"
          >
            <Input.TextArea rows={2} placeholder="Description des récompenses (optionnel)" />
          </Form.Item>

          <Form.Item
            name="banner"
            label="Banner (URL)"
          >
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>
        </Form>
      </Modal>

              {/* Modal modification du concours */}
      <Modal
        title="Modifier le concours"
        open={editModalVisible}
        onOk={handleEditOk}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentCompetition(null);
          setEditScope(undefined);
          editForm.resetFields();
        }}
        confirmLoading={editLoading}
        okText="Mettre à jour"
        cancelText="Annuler"
        width={600}
        okButtonProps={{ style: { backgroundColor: '#234B8E', borderColor: '#234B8E' } }}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
                          label="Nom du concours"
              rules={[{ required: true, message: "Veuillez saisir le nom du concours" }]}
          >
            <Input placeholder="Exemple: Concours vélo décembre" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
              rules={[{ required: true, message: "Veuillez saisir la description" }]}
          >
            <Input.TextArea rows={3} placeholder="Description détaillée du concours" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="startTime"
              label="Heure de début"
              rules={[{ required: true, message: "Veuillez choisir l'heure de début" }]}
              style={{ flex: 1 }}
            >
              <DatePicker 
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="Heure de fin"
              rules={[{ required: true, message: "Veuillez choisir l'heure de fin" }]}
              style={{ flex: 1 }}
            >
              <DatePicker 
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="category"
              label="Type de concours"
              rules={[{ required: true, message: "Veuillez choisir le type de concours" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Choisir type de concours">
                {Object.entries(categoryLabels).map(([key, value]) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="objective"
              label="Objectif"
              rules={[{ required: true, message: "Veuillez choisir l'objectif" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Choisir objectif">
                <Option value="HIGHEST">Le plus élevé</Option>
                <Option value="LOWEST">Le plus bas</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            name="scope"
            label="Portée"
            rules={[{ required: true, message: "Veuillez choisir la portée" }]}
          >
            <Select 
              placeholder="Chọn phạm vi cuộc thi"
              onChange={(value: CompetitionScope) => {
                setEditScope(value);
                // Reset companyIds khi thay đổi scope
                if (value !== 'COMPANY') {
                  editForm.setFieldValue('companyIds', undefined);
                }
              }}
            >
              <Option value="GLOBAL">Toàn cầu</Option>
              <Option value="COMPANY">Công ty</Option>
            </Select>
          </Form.Item>

          {/* Afficher seulement quand portée = COMPANY */}
          {editScope === 'COMPANY' && (
            <Form.Item
              name="companyIds"
              label="Choisir entreprise"
              rules={[{ required: true, message: "Veuillez choisir au moins une entreprise" }]}
            >
              <Select
                mode="multiple"
                placeholder="Choisir entreprises participantes (sélection multiple possible)"
              style={{ width: '100%' }}
                showSearch
                searchValue={companySearch}
                onSearch={handleCompanySearch}
                filterOption={false}
                loading={companiesLoading}
                notFoundContent={companiesLoading ? "Chargement..." : "Aucune entreprise trouvée"}
                maxTagCount="responsive"
                allowClear
              >
                {companies.map((company) => (
                  <Option key={company.id} value={company.id}>
                    {company.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="rewards"
            label="Récompenses"
          >
            <Input.TextArea rows={2} placeholder="Description des récompenses (optionnel)" />
          </Form.Item>

          <Form.Item
            name="banner"
            label="Banner (URL)"
          >
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
};

// Wrap with App component to fix message warning
const CompetitionsPage = () => {
  return (
    <App>
      <CompetitionsContent />
    </App>
  );
};

export default CompetitionsPage; 