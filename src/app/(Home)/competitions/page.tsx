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
  FilterOutlined,
  CheckCircleOutlined,
  InboxOutlined
} from "@ant-design/icons";
import type { AlignType } from 'rc-table/lib/interface';
import { useCompetitions } from "./useCompetitions";
import { 
  Competition, 
  CompetitionCategory, 
  CompetitionStatus, 
  CompetitionScope,
  CompetitionObjective,
  CreateCompetitionPayload,
  UpdateCompetitionStatusPayload
} from "@/services/competition";
import { getCompanies, Company } from "@/services/company";
import { uploadImage } from "@/services/upload";
import { useRouter } from "next/navigation";
import { InputNumber, Upload, message as antdMessage } from "antd/lib";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from 'antd';

const { Dragger } = Upload;

const { Option } = Select;

// Category mapping pour l'affichage
const categoryLabels: Record<CompetitionCategory, string> = {
  'CO2': 'Émissions CO2',
  'BICYCLE': 'Vélo',
  'WALKING': 'Marche',
  'CAR': 'Voiture',
  'CAR_POOL': 'Covoiturage',
  'TRAIN': 'Train',
  'AIRPLANE': 'Avion',
  'PUBLIC_TRANSPORT': 'Transport public',
  'POINTS': 'Points'
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
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [currentCompetition, setCurrentCompetition] = useState<Competition | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [statusForm] = Form.useForm();
  
  // State pour les entreprises
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  
  // State pour upload banner
  const [createBannerFile, setCreateBannerFile] = useState<File | null>(null);
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null);
  const [createBannerPreview, setCreateBannerPreview] = useState<string>('');
  const [editBannerPreview, setEditBannerPreview] = useState<string>('');
  const [createBannerFileList, setCreateBannerFileList] = useState<UploadFile[]>([]);
  const [editBannerFileList, setEditBannerFileList] = useState<UploadFile[]>([]);
  
  // Surveillance des changements de portée pour les mises à jour UI en temps réel
  const [createScope, setCreateScope] = useState<CompetitionScope | undefined>();
  const [editScope, setEditScope] = useState<CompetitionScope | undefined>();
  
  // Surveillance des changements d'objectif pour afficher les champs baseline
  const [createObjective, setCreateObjective] = useState<CompetitionObjective | undefined>();
  const [editObjective, setEditObjective] = useState<CompetitionObjective | undefined>();
  const {
    competitions,
    stats,
    loading,
    editLoading: hookEditLoading,
    deleteLoading,
    statusUpdateLoading,
    pagination,
    filters,
    updateFilters,
    handleCreateCompetition,
    handleUpdateCompetition,
    handleDeleteCompetition,
    handleUpdateCompetitionStatus,
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
      width: 280,
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
            type="default" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleStatusUpdateClick(record)}
            loading={statusUpdateLoading === record.id}
          >
            Statut
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
    setEditObjective(competition.objective); // Set initial objective state
    setEditBannerPreview(competition.banner || ''); // Set initial banner preview
    // Set initial banner file list if banner exists  
    if (competition.banner) {
      setEditBannerFileList([{
        uid: '-1',
        name: 'banner.jpg',
        status: 'done',
        url: competition.banner,
      }]);
    } else {
      setEditBannerFileList([]);
    }
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
      baselinePeriodDays: competition.baselinePeriodDays,
      baselineStartDate: competition.baselineStartDate ? dayjs(competition.baselineStartDate) : undefined,
    });
    setEditModalVisible(true);
    // Charger les entreprises à l'ouverture du modal
    fetchCompanies();
  };

  const handleDeleteClick = async (competitionId: string) => {
    await handleDeleteCompetition(competitionId);
  };

  const handleStatusUpdateClick = (competition: Competition) => {
    setCurrentCompetition(competition);
    statusForm.setFieldsValue({
      status: competition.status,
      reason: ''
    });
    setStatusModalVisible(true);
  };

  const handleStatusUpdateOk = async () => {
    if (!currentCompetition) return;
    
    try {
      const values = await statusForm.validateFields();
      
      const payload: UpdateCompetitionStatusPayload = {
        status: values.status,
        reason: values.reason
      };

      await handleUpdateCompetitionStatus(currentCompetition.id, payload);
      setStatusModalVisible(false);
      statusForm.resetFields();
      setCurrentCompetition(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const showCreateModal = () => {
    form.resetFields();
    setCreateModalVisible(true);
    setCreateScope(undefined); // Reset scope state
    setCreateObjective(undefined); // Reset objective state
    setCreateBannerFile(null); // Reset banner file
    setCreateBannerPreview(''); // Reset banner preview
    setCreateBannerFileList([]); // Reset banner file list
    // Charger les entreprises à l'ouverture du modal
    fetchCompanies();
  };

  const handleCreateOk = async () => {
    try {
      const values = await form.validateFields();
      setCreateLoading(true);
      
      // Upload de la bannière si un fichier est sélectionné
      let bannerUrl = '';
      if (createBannerFile) {
        try {
          const uploadResponse = await uploadImage(createBannerFile);
          console.log(uploadResponse);
          // @ts-ignore
          bannerUrl = uploadResponse?.data?.publicUrl || uploadResponse?.publicUrl;
        } catch (error) {
          message.error('Échec du téléchargement de l\'image de bannière !');
          throw error;
        }
      }
      
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
        banner: bannerUrl,
        baselinePeriodDays: values.baselinePeriodDays,
        baselineStartDate: values.baselineStartDate ? dayjs(values.baselineStartDate).toISOString() : undefined,
      };

      await handleCreateCompetition(payload);
      setCreateModalVisible(false);
      setCreateScope(undefined);
      setCreateObjective(undefined);
      setCreateBannerFile(null);
      setCreateBannerPreview('');
      setCreateBannerFileList([]);
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
      
      // Upload de la bannière si un nouveau fichier est sélectionné
      let bannerUrl = editBannerPreview; // Utiliser l'URL actuelle par défaut
      if (editBannerFile) {
        try {
          const uploadResponse = await uploadImage(editBannerFile);
         
          console.log(uploadResponse);
           // @ts-ignore
          bannerUrl =  uploadResponse?.data?.publicUrl || uploadResponse?.publicUrl;
        } catch (error) {
          message.error('Échec du téléchargement de l\'image de bannière !');
          throw error;
        }
      }
      
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
        banner: bannerUrl,
        baselinePeriodDays: values.baselinePeriodDays,
        baselineStartDate: values.baselineStartDate ? dayjs(values.baselineStartDate).toISOString() : undefined,
      };

      await handleUpdateCompetition(currentCompetition.id, payload);
      setEditModalVisible(false);
      setEditScope(undefined);
      setEditObjective(undefined);
      setEditBannerFile(null);
      setEditBannerPreview('');
      setEditBannerFileList([]);
      editForm.resetFields();
      setCurrentCompetition(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du concours:", error);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle banner change for create modal
  const handleCreateBannerChange = (info: any) => {
    const { fileList } = info;
    setCreateBannerFileList(fileList);
    
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];
      setCreateBannerFile(file);
      
      // Créer l'URL de prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setCreateBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCreateBannerFile(null);
      setCreateBannerPreview('');
    }
  };

  // Handle banner change for edit modal
  const handleEditBannerChange = (info: any) => {
    const { fileList } = info;
    setEditBannerFileList(fileList);
    
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];
      if (file && file instanceof File) {
        setEditBannerFile(file);
        
        // Créer l'URL de prévisualisation pour le nouveau fichier
        const reader = new FileReader();
        reader.onload = (e) => {
          setEditBannerPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setEditBannerFile(null);
      // Si il y a une ancienne bannière, la garder, sinon la supprimer
      if (!currentCompetition?.banner) {
        setEditBannerPreview('');
      }
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
          notFoundContent={companiesLoading ? "Chargement..." : "Aucune entreprise trouvée"}
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

      {/* Modal créer concours */}
      <Modal
        title="Créer nouveau concours"
        open={createModalVisible}
        onOk={handleCreateOk}
        onCancel={() => {
          setCreateModalVisible(false);
          setCreateScope(undefined);
          setCreateObjective(undefined);
          setCreateBannerFile(null);
          setCreateBannerPreview('');
          setCreateBannerFileList([]);
          form.resetFields();
        }}
        confirmLoading={createLoading}
        okText="Créer concours"
        cancelText="Annuler"
        width={'85%'}
        centered
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
              <Select 
                placeholder="Choisir objectif" 
                style={{ minWidth: 400}}
                onChange={(value: CompetitionObjective) => {
                  setCreateObjective(value);
                  // Réinitialiser les champs baseline si on change d'objectif
                  if (value !== 'INCREASE_FROM_BASELINE' && value !== 'DECREASE_FROM_BASELINE') {
                    form.setFieldValue('baselinePeriodDays', undefined);
                    form.setFieldValue('baselineStartDate', undefined);
                  }
                }}
              >
                <Option value="HIGHEST">Le plus élevé</Option>
                <Option value="LOWEST">Le plus bas</Option>
                <Option value="INCREASE_FROM_BASELINE">Augmentation par rapport à la période de référence</Option>
                <Option value="DECREASE_FROM_BASELINE">Diminution par rapport à la période de référence</Option>
              </Select>
            </Form.Item>
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

          <Form.Item
            name="scope"
            label="Portée"
            rules={[{ required: true, message: "Veuillez choisir la portée" }]}
          >
            <Select 
              placeholder="Sélectionner la portée du concours"
              onChange={(value: CompetitionScope) => {
                setCreateScope(value);
                // Réinitialiser companyIds lors du changement de portée
                if (value !== 'COMPANY') {
                  form.setFieldValue('companyIds', undefined);
                }
              }}
            >
              <Option value="GLOBAL">Global</Option>
              <Option value="COMPANY">Entreprise</Option>
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

          {/* Afficher seulement pour les objectifs baseline */}
          {(createObjective === 'INCREASE_FROM_BASELINE' || createObjective === 'DECREASE_FROM_BASELINE') && (
            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="baselinePeriodDays"
                label="Période de référence (jours)"
                rules={[{ required: true, message: "Veuillez saisir la période de référence en jours" }]}
              >
                <InputNumber 
                  placeholder="Ex: 30 pour comparer avec les 30 derniers jours"
                  min={1}
                  // controls={false}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="baselineStartDate"
                label="Date de début de référence (optionnel)"
              >
                <DatePicker 
                  showTime
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Laisser vide pour calculer automatiquement"
                />
              </Form.Item>
            </Space>
          )}

          <Form.Item
            name="rewards"
            label="Récompenses"
          >
            <Input.TextArea rows={2} placeholder="Description des récompenses (optionnel)" />
          </Form.Item>

          <Form.Item
            name="banner"
            label="Image de bannière"
          >
            <Dragger
              onChange={handleCreateBannerChange}
              fileList={createBannerFileList}
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => false} // Ne pas télécharger automatiquement
              style={{ padding: '20px' }}
            >
              {createBannerPreview ? (
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={createBannerPreview} 
                    alt="Banner preview" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px', 
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                  <p style={{ marginTop: '12px', color: '#666' }}>
                    Cliquez ou faites glisser une autre image ici pour la changer
                  </p>
                </div>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  </p>
                  <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: '500' }}>
                    Cliquez ou faites glisser une image ici pour télécharger
                  </p>
                  <p className="ant-upload-hint" style={{ color: '#999' }}>
                    Formats supportés : JPG, PNG, GIF. Taille maximum 2MB
                  </p>
                </>
              )}
            </Dragger>
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
          setEditObjective(undefined);
          setEditBannerFile(null);
          setEditBannerPreview('');
          setEditBannerFileList([]);
          editForm.resetFields();
        }}
        confirmLoading={editLoading}
        okText="Mettre à jour"
        cancelText="Annuler"
        width={'85%'}
        centered
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
              name="category"
              label="Type de concours"
              rules={[{ required: true, message: "Veuillez choisir le type de concours" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Choisir type de concours"  style={{ width: '100%' }}>
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
              <Select 
                placeholder="Choisir objectif"
                style={{ minWidth: 400}}
                onChange={(value: CompetitionObjective) => {
                  setEditObjective(value);
                  // Réinitialiser les champs baseline si on change d'objectif
                  if (value !== 'INCREASE_FROM_BASELINE' && value !== 'DECREASE_FROM_BASELINE') {
                    editForm.setFieldValue('baselinePeriodDays', undefined);
                    editForm.setFieldValue('baselineStartDate', undefined);
                  }
                }}
              >
                <Option value="HIGHEST">Le plus élevé</Option>
                <Option value="LOWEST">Le plus bas</Option>
                <Option value="INCREASE_FROM_BASELINE">Augmentation par rapport à la période de référence</Option>
                <Option value="DECREASE_FROM_BASELINE">Diminution par rapport à la période de référence</Option>
              </Select>
            </Form.Item>
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

          <Form.Item
            name="scope"
            label="Portée"
            rules={[{ required: true, message: "Veuillez choisir la portée" }]}
          >
            <Select 
              placeholder="Sélectionner la portée du concours"
              onChange={(value: CompetitionScope) => {
                setEditScope(value);
                // Réinitialiser companyIds lors du changement de portée
                if (value !== 'COMPANY') {
                  editForm.setFieldValue('companyIds', undefined);
                }
              }}
            >
              <Option value="GLOBAL">Global</Option>
              <Option value="COMPANY">Entreprise</Option>
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

          {/* Afficher seulement pour les objectifs baseline */}
          {(editObjective === 'INCREASE_FROM_BASELINE' || editObjective === 'DECREASE_FROM_BASELINE') && (
            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="baselinePeriodDays"
                label="Période de référence (jours)"
                rules={[{ required: true, message: "Veuillez saisir la période de référence en jours" }]}
              >
                <InputNumber 
                  placeholder="Ex: 30 pour comparer avec les 30 derniers jours"
                  min={1}
                  // controls={false}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="baselineStartDate"
                label="Date de début de référence (optionnel)"
              >
                <DatePicker 
                  showTime
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Laisser vide pour calculer automatiquement"
                />
              </Form.Item>
            </Space>
          )}

          <Form.Item
            name="rewards"
            label="Récompenses"
          >
            <Input.TextArea rows={2} placeholder="Description des récompenses (optionnel)" />
          </Form.Item>

          <Form.Item
            name="banner"
            label="Image de bannière"
          >
            <Dragger
              onChange={handleEditBannerChange}
              fileList={editBannerFileList}
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => false} // Ne pas télécharger automatiquement
              style={{ padding: '20px' }}
            >
              {editBannerPreview ? (
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={editBannerPreview} 
                    alt="Banner preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                  <p style={{ marginTop: '12px', color: '#666' }}>
                    Cliquez ou faites glisser une autre image ici pour la changer
                  </p>
                </div>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  </p>
                  <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: '500' }}>
                    Cliquez ou faites glisser une image ici pour télécharger
                  </p>
                  <p className="ant-upload-hint" style={{ color: '#999' }}>
                    Formats supportés : JPG, PNG, GIF. Taille maximum 10MB
                  </p>
                </>
              )}
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Mettre à jour le statut de la compétition"
        open={statusModalVisible}
        onOk={handleStatusUpdateOk}
        onCancel={() => {
          setStatusModalVisible(false);
          setCurrentCompetition(null);
          statusForm.resetFields();
        }}
        confirmLoading={statusUpdateLoading === currentCompetition?.id}
        okText="Mettre à jour le statut"
        cancelText="Annuler"
        width={500}
        okButtonProps={{ style: { backgroundColor: '#234B8E', borderColor: '#234B8E' } }}
      >
        <Form
          form={statusForm}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="Nouveau statut"
            rules={[{ required: true, message: "Veuillez sélectionner un statut" }]}
          >
            <Select placeholder="Sélectionner le nouveau statut">
              <Option value="DRAFT">Brouillon</Option>
              <Option value="ACTIVE">En cours</Option>
              <Option value="ENDED">Terminé</Option>
              <Option value="CANCELLED">Annulé</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="reason"
            label="Raison du changement"
            rules={[{ required: true, message: "Veuillez saisir la raison du changement" }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Exemple: La compétition est prête à commencer"
            />
          </Form.Item>

          {currentCompetition && (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '6px', 
              marginBottom: '16px' 
            }}>
              <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                <strong>Compétition:</strong> {currentCompetition.name}
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                <strong>Statut actuel:</strong> 
                <Tag color={statusLabels[currentCompetition.status].color} style={{ marginLeft: '8px' }}>
                  {statusLabels[currentCompetition.status].label}
                </Tag>
              </p>
            </div>
          )}
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