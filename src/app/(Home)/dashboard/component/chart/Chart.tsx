import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/en_US";
import { Column } from "@ant-design/plots";
import ItemChart, { ItemProps } from "./item/ItemChart";
import dayjs from 'dayjs';
import { getCompanyCO2Statistics, CompanyData } from "@/services/report";

const { RangePicker } = DatePicker;

export const Chart = () => {
  const [dataChart2, setDataChart2] = useState<ItemProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'), // Ngày đầu tiên của tháng hiện tại
    dayjs().endOf('month')    // Ngày cuối cùng của tháng hiện tại
  ]);

  const config = {
    data : dataMock,
    xField: "month",
    yField: "value",
    seriesField:'type',
    isStack: true,
    color: ['#93F0DA','#10B981','#3B82F6','#C4B5FD'],
    maxColumnWidth:80,
    legend: { visible: false }
  };

  const fetchCompaniesData = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    try {
      const response = await getCompanyCO2Statistics(startDate, endDate);
      
      const { companies } = response.data;
      
      if (companies && companies.length > 0) {
        // Sắp xếp công ty theo CO2 giảm dần
        const sortedCompanies = [...companies].sort((a, b) => b.totalCo2 - a.totalCo2);
        
        let companiesToShow: CompanyData[] = sortedCompanies;
        let otherCompanies: CompanyData[] = [];
        
        // Nếu có hơn 10 công ty, gộp từ công ty thứ 11 trở đi vào "Other"
        if (sortedCompanies.length > 10) {
          companiesToShow = sortedCompanies.slice(0, 10);
          otherCompanies = sortedCompanies.slice(10);
          
          // Tạo nhóm Other bằng cách cộng tổng tất cả các giá trị
          if (otherCompanies.length > 0) {
            const otherCompany: CompanyData = {
              companyId: "other",
              companyName: "Other",
              totalUsers: otherCompanies.reduce((sum, company) => sum + company.totalUsers, 0),
              totalTrips: otherCompanies.reduce((sum, company) => sum + company.totalTrips, 0),
              totalDistance: otherCompanies.reduce((sum, company) => sum + company.totalDistance, 0),
              totalCo2: otherCompanies.reduce((sum, company) => sum + company.totalCo2, 0),
              totalDuration: otherCompanies.reduce((sum, company) => sum + company.totalDuration, 0),
            };
            
            companiesToShow.push(otherCompany);
          }
        }
        
        // Tổng CO2 để tính phần trăm
        const totalCO2 = companies.reduce((sum: number, company: CompanyData) => sum + company.totalCo2, 0);
        
        // Chuyển đổi dữ liệu từ API sang định dạng ItemProps
        const formattedData = companiesToShow.map((company: CompanyData, index: number) => {
          // Định nghĩa các màu theo thứ tự
          const colors = ["#3B82F6", "#10B981", "#7EF6DE", "#C4B5FD", "#F87171", "#FBBF24", "#60A5FA", "#9CA3AF", "#EC4899", "#8B5CF6", "#6B7280"];
          const percent = totalCO2 > 0 ? Math.round((company.totalCo2 / totalCO2) * 100) : 0;
          
          return {
            title: company.companyName,
            percent: percent,
            total: `${company.totalCo2.toFixed(2)}kg`,
            color: company.companyId === "other" ? "#6B7280" : colors[index % colors.length],
          };
        });
        
        setDataChart2(formattedData);
      }
    } catch (error) {
      console.error("Error fetching companies data:", error);
      // Dữ liệu mặc định nếu có lỗi
      
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchCompaniesData(dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD'));
  }, [dateRange]);

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  return (
    <div className={styles["wrap-chart"]}>
      <div className={styles["chart-top"]}>
        <h2>Emission de CO2 par délégation</h2>
        <RangePicker
          suffixIcon={false}
          picker="month"
          format="MMM YYYY"
          value={dateRange}
          onChange={handleDateChange}
          locale={locale}
        />
      </div>
      <div className={styles["group-chart"]} style={{marginTop: 20}}>
        <h2>Emission de CO2 (tones)</h2>
        <Column className={styles["chart"]} {...config} />
      </div>
      <div className={styles["group-chart-2"]} style={{marginTop: 20}}>
        {isLoading ? (
          <p>Chargement des données...</p>
        ) : (
          dataChart2?.map((obj, index) => (
            <div key={index} className={styles["Item"]}>
              <ItemChart {...obj} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
const dataMock = [
  { month: "Jan", value: 10, type: "Mr.pip" },
  { month: "Jan", value: 20, type: "Mr.pap" },
  { month: "Jan", value: 30, type: "Mr.pup" },
  { month: "Jan", value: 10, type: "Mr.hup" },

  { month: "Feb", value: 12, type: "Mr.pip" },
  { month: "Feb", value: 2, type: "Mr.pap" },
  { month: "Feb", value: 3, type: "Mr.pup" },
  { month: "Feb", value: 40, type: "Mr.hup" },

  { month: "Mar", value: 11, type: "Mr.pip" },
  { month: "Mar", value: 22, type: "Mr.pap" },
  { month: "Mar", value: 33, type: "Mr.pup" },
  { month: "Mar", value: 4, type: "Mr.hup" },

  { month: "Apr", value: 20, type: "Mr.pip" },
  { month: "Apr", value: 21, type: "Mr.pap" },
  { month: "Apr", value: 22, type: "Mr.pup" },
  { month: "Apr", value: 23, type: "Mr.hup" },

  { month: "May", value: 10, type: "Mr.pip" },
  { month: "May", value: 11, type: "Mr.pap" },
  { month: "May", value: 29, type: "Mr.pup" },
  { month: "May", value: 5, type: "Mr.hup" },
];
