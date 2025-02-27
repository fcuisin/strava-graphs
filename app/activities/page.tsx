import { cookies } from "next/headers";
import { verifySession } from "../../services/auth";
import { redirect } from "next/navigation";
import { fetchActivities } from "../../services/activities";
import { Dashboard } from "@/components/dashboard";

export default async function ActivitiesPage() {
  const accessToken = (await cookies()).get("access_token")?.value;
  const token = verifySession(accessToken);

  if (!token) {
    redirect("/");
  }

  const activities = await fetchActivities(token);

  return <Dashboard data={activities} />;
}
