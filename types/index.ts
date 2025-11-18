// D:\Professional_life\CA_Projects\react_native\ParkinTrace\app\types\index.ts
export interface VitalData {
  heartRate: number;
  bloodOxygen: number;
  tremorStatus: string;
  tremorLevel: number;
  fallStatus: string;
  fallDetected: boolean;
}

export type RootStackParamList = {
  Dashboard: undefined;
  Details: {
    title: string;
    value: string | number;
    unit?: string;
  };
};