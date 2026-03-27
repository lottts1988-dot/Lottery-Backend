import { Dashboard } from "../utils/dashboard";

export class DashboardService {
  public async getTicketRevenue(year: number) {
    const dashboard = new Dashboard();
    const result = await dashboard.ticketRevenue(year);
    return result;
  }
}
