import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import styles from "./style.module.scss";
import { Co2, Transport3, Transport4, Transport5 } from "@/assets/svg";
import { getVehicleCO2Daily, VehicleCO2DailyResponse } from "@/services/report";
import dayjs from "dayjs";
import { DatePicker, Select } from "antd";
import locale from "antd/es/date-picker/locale/en_US";

const { RangePicker } = DatePicker;

const vehicleTypeMap: Record<string, string> = {
  "CAR": "Par voiture individuelle",
  "WALKING": "Marche",
  "TRAIN": "Train",
  "BICYCLE": "Vélo",
  "OTHER": "Autre",
  "CAR_POOL": "Par covoiturage",
  "BUS": "Bus",
  "RUNNING": "Course",
  "SUBWAY_TRANWAY": "Metro/Tramway",
  "ELECTRIC_BIKE": "Vélo électrique"
};

const vehicleColors: Record<string, string> = {
  "Emission totales": "#010101",
  "Par voiture individuelle": "#FF992C", 
  "Par covoiturage": "#0E5F12",
  "Par transport en commun": "#82EB99",
  "Par avion": "#FF1C1C",
  "Train": "#4287f5",
  "Metro/Tramway": "#82EB99",
  "Bus": "#82EB99",
  "Vélo": "#8fce00",
  "Vélo électrique": "#8fce00",
  "Marche": "#9966ff",
  "Course": "#9966ff",
  "Autre": "#cccccc"
};

// Group relevant public transport types together
const getDisplayType = (vehicleType: string): string => {
  const typeMapping = vehicleTypeMap[vehicleType] || "Autre";
  
  // Group bus, metro, train into "Par transport en commun"
  if (["BUS", "SUBWAY_TRANWAY", "TRAIN"].includes(vehicleType)) {
    return "Par transport en commun";
  }
  
  return typeMapping;
};

const ChartBottom = () => {
  const [data, setData] = useState<Array<{month: string; value: number; type: string}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'month').startOf('month'),
    dayjs().endOf('month')
  ]);
  const [period, setPeriod] = useState<string>("daily");

  useEffect(() => {
    fetchData();
  }, [dateRange, period]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      const response = await getVehicleCO2Daily(startDate, endDate, period );
     
      if (response.data) {
       
        processChartData(response.data);
      }
    } catch (error) {
      console.error("Error fetching vehicle CO2 data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processChartData = (responseData: VehicleCO2DailyResponse) => {
    const chartData: Array<{month: string; value: number; type: string}> = [];
    const { dailyStats, vehicles } = responseData;
    console.log(`responseData`, responseData);
    
    // Create a map to aggregate data by month for each vehicle type
    const monthlyData: Record<string, Record<string, { totalCo2: number, count: number }>> = {};
    
    // Process data for each vehicle type
    vehicles.forEach(vehicleType => {
      if (dailyStats[vehicleType]) {
        dailyStats[vehicleType].forEach(day => {
          // Skip days with no data
          if (day.totalCo2 === 0 && day.totalDistance === 0) return;
          
          const date = dayjs(day.timeGroup);
          const formatDefault = period === "daily" ? "DD/MM" : period === "weekly" ? "wo" : "MM/YYYY";

          const monthKey = date.format(formatDefault); // Get month name (Jan, Feb, etc.)
          
          const displayType = getDisplayType(vehicleType);
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {};
          }
          
          if (!monthlyData[monthKey][displayType]) {
            monthlyData[monthKey][displayType] = { totalCo2: 0, count: 0 };
          }
          
          monthlyData[monthKey][displayType].totalCo2 += day.totalCo2;
          monthlyData[monthKey][displayType].count += 1;
          
          // Also add to the total emissions for this month
          if (!monthlyData[monthKey]["Emission totales"]) {
            monthlyData[monthKey]["Emission totales"] = { totalCo2: 0, count: 0 };
          }
          monthlyData[monthKey]["Emission totales"].totalCo2 += day.totalCo2;
          monthlyData[monthKey]["Emission totales"].count += 1;
        });
      }
    });
    
    // Convert the aggregated data to the format expected by the chart
    Object.entries(monthlyData).forEach(([month, typesData]) => {
      Object.entries(typesData).forEach(([type, data]) => {
        chartData.push({
          month,
          value: parseFloat(data.totalCo2.toFixed(2)),
          type
        });
      });
    });

    console.log(`chartData`, chartData);
    
    setData(chartData);
  };

  const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    legend: { visible: false },
    yAxis: {
      label: {
        formatter: (text: string) =>
          `${text}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    color: (datum: {type: string}) => vehicleColors[datum.type] || "#cccccc",
  };

  return (
    <div className={styles["warp-chart"]} style={{flexDirection: "column"}}>
      <div className={styles["chart-header"]} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", width: "100%" }}>
        <h3>Émission de carbone par type de transport</h3>
       <div>
        <Select
          value={period}
          options={[
            {
              label: "Daily",
              value: "daily"
            },
            // {
            //   label: "Week",
            //   value: "weekly"
            // },
            {
              label: "Month",
              value: "monthly"
            }
          ]}
          onChange={(value) => {
            setPeriod(value);
          }}
        />
       <RangePicker
          suffixIcon={false}
          picker="month"
          format="MMM"
          value={dateRange}
          onChange={handleDateChange}
          locale={locale}
          style={{ width: 190 }}
        />
       </div>
      </div>
      <div style={{display: "flex", width: "100%", gap: 20}}>
      <div className={styles["chart"]}>
        <h2 className={styles["chart-title-vertical"]}>
          Emission de CO2 (kg)
        </h2>
        {isLoading ? (
          <div style={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
            Chargement des données...
          </div>
        ) : (
          <Line {...config} style={{ height: 300 }} />
        )}
      </div>
      <div className={styles["group-type"]}>
        <p className={styles["type"]}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className={styles["dot"]}
              style={{ backgroundColor: "#010101" }}
            ></span>
           <Co2/>
          </div>

          <span style={{color: '#010101'}}>Emission totales</span>
        </p>
        <p className={styles["type"]}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className={styles["dot"]}
              style={{ backgroundColor: "#FF992C" }}
            ></span>

          <Transport3/>
          </div>

          <span style={{ color: "#010101" }}>Par voiture individuelle</span>
        </p>
        <p className={styles["type"]}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className={styles["dot"]}
              style={{ backgroundColor: "#82EB99" }}
            ></span>
             <Transport4/>
          </div>

          <span style={{ color: "#010101" }}>Par transport en commun</span>
        </p>
        <p className={styles["type"]}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className={styles["dot"]}
              style={{ backgroundColor: "#0E5F12" }}
            ></span>
             <Transport5/>
          </div>

          <span style={{ color: "#010101" }}>Par covoiturage</span>
        </p>
      </div>
      </div>
    </div>
  );
};

export default ChartBottom;
