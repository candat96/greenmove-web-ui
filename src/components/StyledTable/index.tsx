import Icon, { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Table } from "antd";
import styles from "./table.module.scss";
import { Key, ReactNode } from "react";
import { SAR } from "@/assets/svg";
import type { TableProps } from 'antd/es/table';
import spin from "../Loading/spin.module.scss";

interface TablePropsType<T> extends TableProps<T> {
    total: number | undefined,
    currentPage?: number | undefined,
    pageSize?: number | undefined,
    onClickRow?: (arg0: T) => void,
    selectedRowKeys?: Key[],
    setSelectedRowKeys?: (selectedRowKeys: Key[], selectedRows: T[]) => void,
    loading?: boolean,
    defaultPageSize?: number,
    className?: string
}

const PAGE_SIZE_OPTIONS: number[] = [5, 20, 50, 100];

const StyledTable = <T extends object>({
    total,
    currentPage,
    pageSize,
    onClickRow = () => {},
    selectedRowKeys,
    setSelectedRowKeys = () => {},
    defaultPageSize,
    className,
    loading,
    ...props
}: TablePropsType<T>) => {

    const itemRender = (_: unknown, type: string, originalElement: ReactNode) => {
        if (type === 'prev') {
            return (
                <div className={styles['navigateBtn']} style={{ marginRight: 10 }}>
                    <LeftOutlined />
                    <span className="label">Previous</span>
                </div>
            );
        }
        if (type === 'next') {
            return (
                <div className={styles['navigateBtn']} style={{ marginLeft: 10 }}>
                    <span className="label">Next</span>
                    <RightOutlined />
                </div>
            );
        }
        return originalElement;
    };

    return (
        <Table
            className={`${styles.table} ${className}`}
            pagination={{
                showSizeChanger: true,
                total: total,
                current: currentPage,
                pageSize: pageSize,
                itemRender,
                locale: { items_per_page: '' },
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                defaultPageSize: defaultPageSize || 5,
            }}
            onRow={(record) => {
                return {
                    onClick: () => onClickRow(record), // click row
                };
            }}
            rowSelection={
                selectedRowKeys
                    ? {
                        selectedRowKeys,
                        onChange: setSelectedRowKeys
                    }
                    : undefined
            }
            loading={{
                indicator: <Icon component={SAR} style={{ fontSize: 30 }} className={spin.spin} />,
                spinning: loading
            }}
            showSorterTooltip={false}
            {...props}
        />
    )
}

export default StyledTable