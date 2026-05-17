import { DashboardMain } from "@/components/dashboard/DashboardMain";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardMain />
    </DashboardShell>
  );
}
