import { Dashboard } from "../utils/dashboard";

export class DashboardService {
  public async ticketRevenuePerMonth(year: number) {
    const dashboard = new Dashboard();
    const result = await dashboard.ticketRevenuePerMonth(year);
    return result;
  }

  public async orderCountsPerMonth(year: number) {
    const dashboard = new Dashboard();
    const result = await dashboard.orderCountsPerMonth(year);
    return result;
  }

  public async ticketCounts(year: number) {
    const dashboard = new Dashboard();
    const result = await dashboard.ticketCounts(year);
    return result;
  }

  public async orderCounts(year: number) {
    const dashboard = new Dashboard();
    const result = await dashboard.orderCounts(year);
    return result;
  }
}
