import { SAR } from "@/assets/svg";
import Icon from "@ant-design/icons";
import { Spin } from "antd";
import { ReactNode } from "react";
import style from "./spin.module.scss";

interface LoadingTypes {
    children: ReactNode,
    loading: boolean,
}

const Loading: React.FC<LoadingTypes> = ({ children, loading }) => (
    <Spin
        indicator={
            <Icon
                component={SAR}
                style={{ fontSize: 30 }}
                className={style.spin}
            />
        }
        spinning={loading}
    >
        {children}
    </Spin>
)

export default Loading