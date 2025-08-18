"use client";
import React from "react";
import { 
  Button, 
  Table, 
  App, 
  Space, 
  Tag,
  Card,
  Statistic,
  Descriptions,
  Spin,
  Empty,
  Breadcrumb
} from "antd";
import styles from "./style.module.scss";
import dayjs from "dayjs";
import { 
  ArrowLeftOutlined,
  TrophyOutlined,
  UserOutlined,
  CalendarOutlined,
  FlagOutlined
} from "@ant-design/icons";
import type { AlignType } from 'rc-table/lib/interface';
import { useCompetitionDetail } from "./useCompetitionDetail";
import { 
  CompetitionCategory, 
  CompetitionStatus, 
  CompetitionObjective
} from "@/services/competition";
import { useParams, useRouter } from "next/navigation";

// Mapping des catégories pour l'affichage
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

// Mapping des statuts pour l'affichage
const statusLabels: Record<CompetitionStatus, { label: string; color: string }> = {
  'DRAFT': { label: 'Brouillon', color: 'default' },
  'ACTIVE': { label: 'En cours', color: 'green' },
  'ENDED': { label: 'Terminé', color: 'red' },
  'CANCELLED': { label: 'Annulé', color: 'gray' }
};

const CompetitionDetailContent = () => {
  const { message } = App.useApp();
  const params = useParams();
  const router = useRouter();
  const competitionId = params?.id as string;

  const {
    competition,
    leaderboard,
    leaderboardLoading,
    currentPage,
    pageSize,
    handlePageChange,
  } = useCompetitionDetail(competitionId);

  // Colonnes pour le tableau de classement
  const leaderboardColumns = [
    {
      title: "Rang",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      align: 'center' as AlignType,
      render: (rank: number) => (
        <Space>
          {rank <= 3 && (
            <TrophyOutlined 
              style={{ 
                color: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32',
                fontSize: '16px'
              }} 
            />
          )}
          <span style={{ 
            fontWeight: rank <= 3 ? 'bold' : 'normal',
            fontSize: rank <= 3 ? '16px' : '14px'
          }}>
            #{rank}
          </span>
        </Space>
      )
    },
    {
      title: "Nom d'utilisateur",
      dataIndex: "displayName",
      key: "displayName",
      width: 200,
      render: (name: string, record: any) => (
        <Space>
          <UserOutlined />
          <span style={{ fontWeight: '500' }}>{name}</span>
        </Space>
      )
    },
    {
      title: "Score",
      dataIndex: "totalScore",
      key: "totalScore",
      width: 120,
      align: 'center' as AlignType,
      render: (score: number) => (
        <span style={{ fontWeight: '600', color: '#234B8E' }}>
          {score.toFixed(2)}
        </span>
      ),
      sorter: (a: any, b: any) => a.totalScore - b.totalScore,
    },
    {
      title: "Nombre de trajets",
      key: "tripCount",
      width: 120,
      align: 'center' as AlignType,
      render: (_: any, record: any) => (
        <span>{record.summary?.tripCount || 0}</span>
      ),
    },
    {
      title: "Distance totale (km)",
      key: "totalDistance", 
      width: 150,
      align: 'center' as AlignType,
      render: (_: any, record: any) => (
        <span>{(record.summary?.totalDistance || 0).toFixed(2)}</span>
      ),
    },
    {
      title: "Durée totale (minutes)",
      key: "totalDuration",
      width: 150,
      align: 'center' as AlignType,
      render: (_: any, record: any) => (
        <span>{(record.summary?.totalDuration || 0).toFixed(0)}</span>
      ),
    },
    {
      title: "Changement",
      key: "change",
      width: 100,
      align: 'center' as AlignType,
      render: (_: any, record: any) => {
        if (!record.change) return '-';
        return (
          <span style={{ 
            color: record.change > 0 ? '#52c41a' : '#ff4d4f',
            fontWeight: '600'
          }}>
            {record.change > 0 ? '+' : ''}{record.change}
          </span>
        );
      },
    },
  ];

  const handleBack = () => {
    router.push('/competitions');
  };

  if (leaderboardLoading && !competition) {
    return (
      <div className={styles["loading-container"]}>
        <Spin size="large" />
        <p>Chargement des informations de compétition...</p>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className={styles["error-container"]}>
        <Empty description="Compétition non trouvée" />
        <Button type="primary" onClick={handleBack}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const statusInfo = statusLabels[competition.status];

  const getStatusColor = (status: CompetitionStatus) => {
    switch (status) {
      case 'ACTIVE': return '#52c41a';
      case 'ENDED': return '#ff4d4f';
      case 'DRAFT': return '#faad14';
      case 'CANCELLED': return '#d9d9d9';
      default: return '#1890ff';
    }
  };

  return (
    <div className={styles["wrap-competition-detail"]}>
      {/* Header */}
      <div className={styles["header"]}>
        {/* <Breadcrumb >
          <Breadcrumb.Item>
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              size="large"
            >
              Cuộc thi
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{competition.name}</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className={styles["title-section"]}>
          <h1>{competition.name}</h1>
          <Space size="large">
            <Tag color={statusInfo.color} style={{ fontSize: '14px', padding: '4px 12px' }}>
              {statusInfo.label}
            </Tag>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {categoryLabels[competition.category]}
            </Tag>
          </Space>
        </div>
      </div>

      {/* Competition Info */}
      <div className={styles["info-grid"]}>
        <Card className={styles["info-card"]} title="Informations de compétition">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Description" span={2}>
              {competition.description}
            </Descriptions.Item>
            <Descriptions.Item label="Heure de début">
              <Space>
                <CalendarOutlined />
                {dayjs(competition.startTime).format('HH:mm- DD/MM/YYYY')}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Heure de fin">
              <Space>
                <CalendarOutlined />
                {dayjs(competition.endTime).format('HH:mm - DD/MM/YYYY')}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Objectif">
              {competition.objective === 'HIGHEST' ? 'Le plus haut' : 'Le plus bas'}
            </Descriptions.Item>
            <Descriptions.Item label="Portée">
              {competition.scope === 'GLOBAL' ? 'Mondial' : 'Entreprise'}
            </Descriptions.Item>
            <Descriptions.Item label="Nombre total de participants">
              {leaderboard?.totalParticipants || 0}
            </Descriptions.Item>
            {competition.config && (
              <>
                {/* <Descriptions.Item label="Tự động tham gia">
                  {competition.config.autoJoin ? 'Có' : 'Không'}
                </Descriptions.Item>
                <Descriptions.Item label="Số người tối đa">
                  {competition.config.maxParticipants}
                </Descriptions.Item> */}
              </>
            )}
            {competition.rewards && (
              <Descriptions.Item label="Récompenses" span={2}>
                {competition.rewards}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Companies Info */}
        {competition.companies && competition.companies.length > 0 && (
          <Card className={styles["companies-card"]} title="Entreprises participantes">
            <div className={styles["companies-list"]}>
              {competition.companies.map((company) => (
                <Tag key={company.id} color="blue" style={{ margin: '4px', padding: '4px 8px' }}>
                  {company.name}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {/* Banner */}
        {competition.banner && (
          <Card className={styles["banner-card"]} title="Bannière de compétition">
            <img 
              src={competition.banner} 
              alt="Competition Banner"
              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Card>
        )}
      </div>

      {/* Stats */}
      {/* <div className={styles["stats-section"]}>
        <Space size="large" wrap>
          <Card>
            <Statistic
              title="Tổng số người tham gia"
              value={leaderboard?.totalParticipants || 0}
              prefix={<UserOutlined />}
            />
          </Card>
          <Card>
            <Statistic
              title="Số người có điểm"
              value={leaderboard?.pagination.total || 0}
              prefix={<TrophyOutlined />}
            />
          </Card>
          {competition.config && (
            <Card>
              <Statistic
                title="Số người tối đa"
                value={competition.config.maxParticipants}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          )}
          <Card>
            <Statistic
              title="Tỷ lệ tham gia"
              value={competition.config ? 
                Math.round((leaderboard?.totalParticipants || 0) / competition.config.maxParticipants * 100) : 
                0
              }
              suffix="%"
              prefix={<FlagOutlined />}
              valueStyle={{ 
                color: competition.config && (leaderboard?.totalParticipants || 0) / competition.config.maxParticipants > 0.8 ? '#52c41a' : '#faad14' 
              }}
            />
          </Card>
          <Card>
            <Statistic
              title="Trạng thái"
              value={statusLabels[competition.status].label}
              valueStyle={{ color: getStatusColor(competition.status) }}
            />
          </Card>
        </Space>
      </div> */}



      {/* Leaderboard */}
      <Card className={styles["leaderboard-card"]} title="Classement">
        <Table 
          className={styles["leaderboard-table"]} 
          dataSource={leaderboard?.leaderboard || []} 
          columns={leaderboardColumns}
          rowKey="userId"
          loading={leaderboardLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: leaderboard?.pagination.total || 0,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} sur ${total} participants`,
            style: { marginTop: 16 }
          }}
          scroll={{ x: 800 }}
          rowClassName={(record, index) => {
            if (record.rank === 1) return styles['first-place'];
            if (record.rank === 2) return styles['second-place'];
            if (record.rank === 3) return styles['third-place'];
            return '';
          }}
        />
      </Card>
    </div>
  );
};

// Wrap with App component
const CompetitionDetailPage = () => {
  return (
    <App>
      <CompetitionDetailContent />
    </App>
  );
};

export default CompetitionDetailPage;
