import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Pie } from "@ant-design/plots";
import { DatePicker, Select, Spin } from "antd";
import locale from "antd/es/date-picker/locale/en_US";
import dayjs from 'dayjs';
import { Company, VehicleStats, getCompanies, getCompanyVehicleDistanceStats, getCompanyVehicleDurationStats } from "@/services/report";

const { RangePicker } = DatePicker;

interface PieChartItem {
  type: string;
  value: number;
  hours?: string;
  distance?: string;
}

const Chart2 = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [distanceData, setDistanceData] = useState<PieChartItem[]>([]);
  const [durationData, setDurationData] = useState<PieChartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Lấy danh sách công ty
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompanies();
        if (response.data && response.data.length > 0) {
          setCompanies(response.data);
          // Chọn công ty đầu tiên mặc định
          setSelectedCompany(response.data[0].id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách công ty:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Lấy dữ liệu thống kê khi chọn công ty hoặc thay đổi khoảng thời gian
  useEffect(() => {
    if (!selectedCompany) return;

    const fetchVehicleStats = async () => {
      setIsLoading(true);
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');

        // Lấy thống kê khoảng cách
        const distanceResponse = await getCompanyVehicleDistanceStats(
          selectedCompany,
          startDate,
          endDate
        );

        // Lấy thống kê thời gian
        const durationResponse = await getCompanyVehicleDurationStats(
          selectedCompany,
          startDate,
          endDate
        );

        if (distanceResponse.data?.vehicleStats) {
          // Xử lý dữ liệu khoảng cách cho biểu đồ
          const totalDistance = distanceResponse.data.totalDistance;
          const distanceChartData = distanceResponse.data.vehicleStats.map((stat: VehicleStats) => {
            const percentage = totalDistance > 0 ? Math.round((stat.totalDistance / totalDistance) * 100) : 0;
            return {
              type: getVehicleTypeText(stat.vehicleType),
              value: percentage,
              distance: stat.totalDistance.toFixed(2)
            };
          });
          setDistanceData(distanceChartData);
        }

        if (durationResponse.data?.vehicleStats) {
          // Xử lý dữ liệu thời gian cho biểu đồ
          const totalDuration = durationResponse.data.totalDuration;
          const durationChartData = durationResponse.data.vehicleStats.map((stat: VehicleStats) => {
            const percentage = totalDuration > 0 ? Math.round((stat.totalDuration as number / totalDuration) * 100) : 0;
            return {
              type: getVehicleTypeText(stat.vehicleType),
              value: percentage,
              hours: formatDuration(stat.totalDuration as number)
            };
          });
          setDurationData(durationChartData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê phương tiện:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleStats();
  }, [selectedCompany, dateRange]);

  // Chuyển đổi mã phương tiện thành văn bản
  const getVehicleTypeText = (vehicleType: string): string => {
    const types: { [key: string]: string } = {
      CAR: "Voiture",
      CARPOOLING: "Covoiturage",
      WALKING: "À pied",
      CYCLING: "Vélo",
      PUBLIC_TRANSPORT: "Transport public",
      PLANE: "Avion",
      OTHER: "Autre"
    };
    return types[vehicleType] || vehicleType;
  };

  // Định dạng thời gian từ phút thành giờ:phút
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Cấu hình cho biểu đồ khoảng cách
  const distanceConfig = {
    appendPadding: 10,
    data: distanceData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.3,
    label: {
      type: "inner",
      offset: "-50%",
      formatter: (datum: any) => {
        return `${datum.value}%`;
      },
      style: {
        textAlign: "center",
        fontSize: 14,
        lineHeight: 1.2,
      },
    },
    pieStyle: {
      lineWidth: 0,
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.value}%\n${datum.distance} km`,
        };
      },
      customContent: (title: string, items: any[]) => {
        if (!items || items.length === 0) return `<div></div>`;
        const { data: itemData } = items[0];
        return `
          <div style="padding: 8px;">
            <div style="margin-bottom: 4px;">${itemData.type}</div>
            <div>${itemData.value}%</div>
            <div>${itemData.distance} km</div>
          </div>
        `;
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false as any,
      content: {
        style: {
          fontSize: "32px",
          lineHeight: "32px",
        },
        content: " ",
        customHtml: () => {
          return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">
            <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2187 29.0461C4.75814 29.0461 0.30127 33.4844 0.30127 38.96C0.30127 46.2552 7.99022 53.7545 10.2187 55.7951C12.4471 53.7715 20.136 46.2552 20.136 38.96C20.136 33.4844 15.6792 29.0461 10.2187 29.0461ZM10.2187 43.5514C7.68402 43.5514 5.6257 41.4938 5.6257 38.96C5.6257 36.4263 7.68402 34.3687 10.2187 34.3687C12.7533 34.3687 14.8116 36.4263 14.8116 38.96C14.8116 41.4938 12.7533 43.5514 10.2187 43.5514Z" fill="#214784"/>
<path d="M46.3837 26.8703C48.6121 24.8467 56.3011 17.3304 56.3011 10.0352C56.3011 4.57661 51.8612 0.121277 46.3837 0.121277C40.9232 0.121277 36.4663 4.5596 36.4663 10.0352C36.4663 17.3304 44.1553 24.8297 46.3837 26.8703ZM41.7907 10.1883C41.7907 7.65453 43.8491 5.59692 46.3837 5.59692C48.9183 5.59692 50.9766 7.65453 50.9766 10.1883C50.9766 12.722 48.9183 14.7797 46.3837 14.7797C43.8491 14.7797 41.7907 12.722 41.7907 10.1883Z" fill="#214784"/>
<path d="M49.446 42.3982H35.9733C33.7619 42.3982 31.9757 40.6126 31.9757 38.402C31.9757 36.1913 33.7619 34.4058 35.9733 34.4058H40.9575C44.5468 34.4058 47.4897 31.634 47.7789 28.1309C47.3366 28.539 47.0474 28.7771 46.9794 28.8281C46.8093 28.9642 46.5881 29.0492 46.384 29.0492C46.1629 29.0492 45.9587 28.9812 45.7886 28.8281C45.7206 28.7771 45.4144 28.505 44.9381 28.0799C44.6829 30.0355 42.9988 31.5659 40.9745 31.5659H35.9903C32.2139 31.5659 29.1349 34.6439 29.1349 38.419C29.1349 42.1941 32.2139 45.272 35.9903 45.272H49.463C51.6744 45.272 53.4606 47.0576 53.4606 49.2682C53.4606 51.4789 51.6744 53.2644 49.463 53.2644H15.322C14.3354 54.4038 13.3998 55.3731 12.6343 56.1213H49.446C53.2224 56.1213 56.3014 53.0434 56.3014 49.2682C56.3014 45.4761 53.2224 42.3982 49.446 42.3982Z" fill="#214784"/>
</svg>
          </div>`;
        },
      },
    },
  };

  // Cấu hình cho biểu đồ thời gian
  const durationConfig = {
    appendPadding: 10,
    data: durationData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.3,
    label: {
      type: "inner",
      offset: "-50%",
      formatter: (datum: any) => {
        return `${datum.value}%`;
      },
      style: {
        textAlign: "center",
        fontSize: 14,
        lineHeight: 1.2,
      },
    },
    pieStyle: {
      lineWidth: 0,
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.value}%\n${datum.hours}`,
        };
      },
      customContent: (title: string, items: any[]) => {
        if (!items || items.length === 0) return `<div></div>`;
        const { data: itemData } = items[0];
        return `
          <div style="padding: 8px;">
            <div style="margin-bottom: 4px;">${itemData.type}</div>
            <div>${itemData.value}%</div>
            <div>${itemData.hours}</div>
          </div>
        `;
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false as any,
      content: {
        style: {
          fontSize: "32px",
          lineHeight: "32px",
        },
        content: " ",
        customHtml: () => {
          return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">
            <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M47.96 28.1213C47.96 27.8892 48.0522 27.6667 48.2163 27.5026C48.3804 27.3385 48.6029 27.2463 48.835 27.2463H56.2795C56.1528 22.9251 55.0219 18.6927 52.9764 14.8843L48.9444 17.2127C48.8448 17.271 48.7347 17.3091 48.6204 17.3247C48.506 17.3404 48.3897 17.3332 48.2782 17.3037C48.1666 17.2742 48.062 17.223 47.9703 17.1529C47.8787 17.0828 47.8018 16.9953 47.7441 16.8953C47.6864 16.7954 47.649 16.685 47.6341 16.5706C47.6193 16.4562 47.6272 16.3399 47.6574 16.2286C47.6876 16.1172 47.7396 16.0129 47.8103 15.9217C47.881 15.8305 47.969 15.7542 48.0694 15.6972L52.0944 13.3705C49.8148 9.69977 46.7205 6.60332 43.0512 4.32128L40.7264 8.35153C40.6693 8.45185 40.593 8.53989 40.5018 8.61059C40.4106 8.68129 40.3063 8.73326 40.195 8.76349C40.0836 8.79373 39.9674 8.80163 39.8529 8.78676C39.7385 8.77189 39.6281 8.73452 39.5282 8.67683C39.4283 8.61913 39.3407 8.54223 39.2706 8.45056C39.2005 8.3589 39.1493 8.25427 39.1198 8.14271C39.0903 8.03115 39.0831 7.91485 39.0988 7.80052C39.1144 7.68619 39.1525 7.57608 39.2109 7.47653L41.5375 3.44628C37.7293 1.40083 33.4972 0.269943 29.1764 0.143158V7.58766C29.1764 7.81972 29.0842 8.04228 28.9201 8.20638C28.756 8.37047 28.5334 8.46266 28.3014 8.46266C28.0693 8.46266 27.8467 8.37047 27.6826 8.20638C27.5186 8.04228 27.4264 7.81972 27.4264 7.58766V0.143158C23.1052 0.26984 18.8728 1.40073 15.0644 3.44628L17.3927 7.47828C17.5069 7.67915 17.5371 7.91703 17.4765 8.14001C17.416 8.363 17.2697 8.55299 17.0696 8.66852C16.8695 8.78405 16.6318 8.81575 16.4084 8.75669C16.1851 8.69763 15.9941 8.55261 15.8772 8.35328L13.5515 4.32128C9.87976 6.60252 6.78296 9.69902 4.50137 13.3705L8.52637 15.6972C8.7257 15.814 8.87072 16.005 8.92977 16.2284C8.98883 16.4517 8.95714 16.6894 8.84161 16.8895C8.72608 17.0896 8.53609 17.2359 8.3131 17.2964C8.09011 17.357 7.85223 17.3269 7.65137 17.2127L3.62637 14.8843C1.58081 18.6927 0.449924 22.9251 0.323242 27.2463H7.76774C7.99981 27.2463 8.22237 27.3385 8.38646 27.5026C8.55055 27.6667 8.64274 27.8892 8.64274 28.1213C8.64274 28.3533 8.55055 28.5759 8.38646 28.74C8.22237 28.9041 7.99981 28.9963 7.76774 28.9963H0.323242C0.449924 33.3175 1.58081 37.5498 3.62637 41.3583L7.65837 39.0299C7.75792 38.9715 7.86803 38.9334 7.98236 38.9178C8.09669 38.9022 8.21298 38.9093 8.32454 38.9388C8.43611 38.9683 8.54073 39.0196 8.6324 39.0897C8.72406 39.1598 8.80096 39.2473 8.85866 39.3472C8.91636 39.4472 8.95372 39.5575 8.96859 39.672C8.98347 39.7864 8.97556 39.9026 8.94533 40.014C8.91509 40.1254 8.86313 40.2297 8.79243 40.3209C8.72172 40.4121 8.63368 40.4884 8.53337 40.5454L4.50137 42.872C6.78269 46.5435 9.87919 49.64 13.5506 51.9213L15.8764 47.8963C15.9334 47.796 16.0097 47.7079 16.1009 47.6372C16.1921 47.5665 16.2964 47.5146 16.4078 47.4843C16.5191 47.4541 16.6354 47.4462 16.7498 47.4611C16.8642 47.4759 16.9746 47.5133 17.0745 47.571C17.1745 47.6287 17.262 47.7056 17.3321 47.7972C17.4022 47.8889 17.4535 47.9935 17.483 48.1051C17.5124 48.2167 17.5196 48.333 17.504 48.4473C17.4883 48.5616 17.4502 48.6717 17.3919 48.7713L15.0644 52.7963C18.8728 54.8419 23.1052 55.9728 27.4264 56.0994V48.6549C27.4264 48.4228 27.5186 48.2003 27.6826 48.0362C27.8467 47.8721 28.0693 47.7799 28.3014 47.7799C28.5334 47.7799 28.756 47.8721 28.9201 48.0362C29.0842 48.2003 29.1764 48.4228 29.1764 48.6549V56.0994C33.4975 55.9728 37.7299 54.8419 41.5384 52.7963L39.21 48.7643C39.1516 48.6647 39.1135 48.5546 39.0979 48.4403C39.0823 48.326 39.0894 48.2097 39.1189 48.0981C39.1484 47.9865 39.1997 47.8819 39.2698 47.7902C39.3399 47.6986 39.4274 47.6217 39.5273 47.564C39.6273 47.5063 39.7376 47.4689 39.8521 47.4541C39.9665 47.4392 40.0827 47.4471 40.1941 47.4773C40.3055 47.5076 40.4097 47.5595 40.5009 47.6302C40.5921 47.7009 40.6685 47.789 40.7255 47.8893L43.0512 51.9143C46.7222 49.6351 49.8189 46.541 52.1014 42.872L48.0764 40.5454C47.976 40.4884 47.888 40.4121 47.8173 40.3209C47.7466 40.2297 47.6946 40.1254 47.6644 40.014C47.6342 39.9026 47.6263 39.7864 47.6411 39.672C47.656 39.5575 47.6934 39.4472 47.7511 39.3472C47.8088 39.2473 47.8857 39.1598 47.9773 39.0897C48.069 39.0196 48.1736 38.9683 48.2852 38.9388C48.3967 38.9093 48.513 38.9022 48.6274 38.9178C48.7417 38.9334 48.8518 38.9715 48.9514 39.0299L52.9764 41.3583C55.0219 37.5498 56.1528 33.3175 56.2795 28.9963H48.835C48.6029 28.9963 48.3804 28.9041 48.2163 28.74C48.0522 28.5759 47.96 28.3533 47.96 28.1213ZM41.3625 17.8549L31.8451 27.3688C32.1013 27.8941 32.2359 28.4704 32.2389 29.0549C32.2389 30.0992 31.824 31.1007 31.0856 31.8391C30.3472 32.5776 29.3457 32.9924 28.3014 32.9924C27.2571 32.9924 26.2556 32.5776 25.5171 31.8391C24.7787 31.1007 24.3639 30.0992 24.3639 29.0549C24.3656 28.5787 24.4546 28.1069 24.6264 27.6628L18.2047 22.67C18.0703 22.5621 17.9584 22.4287 17.8755 22.2775C17.7927 22.1263 17.7403 21.9603 17.7216 21.7889C17.7029 21.6175 17.7181 21.4441 17.7664 21.2786C17.8147 21.113 17.8951 20.9587 18.0031 20.8242C18.111 20.6898 18.2444 20.5779 18.3956 20.495C18.5468 20.4121 18.7128 20.3598 18.8842 20.3411C19.0556 20.3224 19.229 20.3376 19.3945 20.3859C19.56 20.4342 19.7144 20.5146 19.8489 20.6225L26.3361 25.6625C26.8835 25.333 27.505 25.1465 28.1434 25.1202C28.7818 25.0939 29.4166 25.2286 29.9892 25.512L39.5066 15.999C39.7542 15.7599 40.0857 15.6277 40.4298 15.6306C40.774 15.6336 41.1032 15.7717 41.3465 16.015C41.5899 16.2584 41.7279 16.5876 41.7309 16.9317C41.7339 17.2758 41.6016 17.6074 41.3625 17.8549Z" fill="#214784"/>
</svg>
          </div>`;
        },
      },
    },
  };

  // Xử lý khi thay đổi công ty được chọn
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
  };

  // Xử lý khi thay đổi khoảng thời gian
  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  return (
    <>
      <div className={styles["group-header"]}>
        <h3>Répartition de votre mobilité</h3>
        <div style={{display: 'flex', gap: 10, flexDirection: 'row'}}>
          <RangePicker
            suffixIcon={false}
            picker="month"
            format="MMM YYYY"
            value={dateRange}
            onChange={handleDateChange}
            locale={locale}
          />
          <Select
            options={companies.map(company => ({ 
              value: company.id, 
              label: company.name 
            }))}
            style={{ minWidth: 190 }}
            value={selectedCompany}
            onChange={handleCompanyChange}
            placeholder="Chọn công ty"
            loading={companies.length === 0}
          />
        </div>
      </div>
      <div className={styles["warp-chart"]} style={{ justifyContent: "space-around" }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center" }}>
              <h4>Distance</h4>
              <Pie {...distanceConfig} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h4>Durée</h4>
              <Pie {...durationConfig} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chart2;

