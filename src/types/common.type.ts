import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import { Key } from "react";

export interface PaginationTypes {
    total?: number,
    page: number | undefined,
    size: number | undefined,
    search?: string | undefined | null,
    sortBy?: Key | undefined,
    sortOption?: 'ASC' | 'DESC' | undefined,
}

export interface ActionRef {
    open: (arg0?: Key[]) => void;
    close: () => void;
    loading: (arg0: boolean) => void;
}

export type RangeValue = Parameters<NonNullable<React.ComponentProps<typeof DatePicker.RangePicker>['onChange']>>[0]

export interface DashboardPayloadTypes {
    from: Dayjs,
    to: Dayjs,
    option?: string,
}

export type FilterTypes = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'