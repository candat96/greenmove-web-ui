// User type for authentication
export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
  
  // Company data type
  export interface Company {
    id: number;
    name: string;
    co2Consumption: number;
    target: number;
    exceededPerc: number;
  }
  
  // Delegation emissions data type
  export interface DelegationEmission {
    id: number;
    name: string;
    percentage: number;
    co2Value: number;
  }
  
  // Monthly emission data type
  export interface MonthlyEmission {
    month: string;
    emissions: number[];
  }
  
  // Dashboard summary type
  export interface DashboardSummary {
    totalEmission: number;
    averageByDivision: number;
    targetProgress: number;
    yearlyComparison: number;
    monthlyData: MonthlyEmission[];
    delegations: DelegationEmission[];
  }