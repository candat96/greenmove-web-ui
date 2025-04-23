import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import { BackGroundCo2 } from "@/assets/img";
import { AroundDown } from "@/assets/svg";
import Item from "../Item/Item";
import { Spin } from "antd";
import { useReport } from "../../useReport";

const DashboardTopLeft: React.FC = () => {
  const { totalReport, loading } = useReport();

  return (
    <div className={styles["dashboard-top__left"]}>
      <div className={styles["left-top"]}>
        <h2>Tableau de bord</h2>
        <Image
          className={styles.co2}
          src={BackGroundCo2}
          alt="Decor Red"
          priority
        />

        <div className={styles["left-top-des"]}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <p className={styles["des-1"]}>CO2e</p>
              <h2 className={styles["des-2"]}>
                {totalReport?.totalCo2 
                  ? totalReport.totalCo2 >= 1000 
                    ? `${(totalReport.totalCo2 / 1000).toFixed(2)}t` 
                    : `${totalReport.totalCo2} kg` 
                  : "0 kg"}
              </h2>
              <h3 className={styles["des-3"]}>Émission totale de CO2</h3>
              {/* <div className={styles["des-4"]}>
                <AroundDown />
                <p>12%</p>
                <p>Inférieur à l'année précédente</p>
              </div> */}
            </>
          )}
        </div>
      </div>
      <div className={styles["left-list"]}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <div className={styles["left-list-item"]}>
              <Item
                header="Nombre total d'utilisateurs"
                total={`${totalReport?.totalUsers || 0}`}
                percent={10}
                increase={false}
                unit="users"
              />
            </div>
            <div className={styles["left-list-item"]}>
              <Item
                header="Nombre total de voyages"
                total={`${totalReport?.totalTrips || 0}`}
                percent={10}
                increase={true}
                unit="trips"
              />
            </div>
            <div className={styles["left-list-item"]}>
              <Item
                header="Distance totale"
                total={`${totalReport?.totalDistance?.toFixed(2) || 0}`}
                percent={10}
                increase={false}
                unit="km"
              />
            </div>
            <div className={styles["left-list-item"]}>
              <Item
                header="Durée totale"
                total={totalReport?.totalDuration 
                  ? totalReport.totalDuration >= 60 
                    ? (totalReport.totalDuration / 60).toFixed(2) 
                    : totalReport.totalDuration.toString() 
                  : "0"}
                percent={10}
                increase={false}
                unit={totalReport?.totalDuration && totalReport.totalDuration >= 60 ? "h" : "min"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardTopLeft; 