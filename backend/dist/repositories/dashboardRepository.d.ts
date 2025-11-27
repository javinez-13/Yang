export type DashboardStats = {
    totalUsers: number;
    averageAge: number | null;
    latestUsers: Array<{
        id: string;
        fullName: string;
        email: string;
    }>;
};
export declare class DashboardRepository {
    fetchStats(): Promise<DashboardStats>;
}
//# sourceMappingURL=dashboardRepository.d.ts.map