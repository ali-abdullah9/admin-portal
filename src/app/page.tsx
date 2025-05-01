import AccessLogsAnalytics from "@/components/AccessLogsAnalytics";
import LogsPage from "@/components/LogsPage";

export default function Home() {
  return (
    <div>
          <div >
          <LogsPage/>       
          <AccessLogsAnalytics/>
          </div>
    </div>
  );
}
