import { cookies } from "next/headers";
import { generateRandomData } from "../utils/seeds";
import { Heatmap } from "../components/heatmap";
import { STRAVA_OAUTH_URL } from "../utils/url";
import { verifySession } from "../services/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const accessToken = (await cookies()).get("access_token")?.value;
  const token = verifySession(accessToken);

  if (token) {
    return redirect("/activities");
  }

  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  const data = generateRandomData(startDate, endDate, 300);

  return (
    <section className="w-full flex flex-col max-w-7xl px-2 md:px-8 mx-auto gap-10">
      <div className="flex flex-col items-center text-center md:text-left md:flex-row md:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Strava Activities Heatmap
          </h1>
          <p className="text-lg md:text-xl mt-4">
            Follow your Strava activities progress with ease!
          </p>
        </div>
        <div>
          <a
            href={STRAVA_OAUTH_URL}
            className="inline-flex items-center p-4 text-md font-medium text-white rounded-lg bg-[#FC4C02] hover:bg-[#d94302] transition"
          >
            Login with Strava
          </a>
        </div>
      </div>
      <Heatmap
        data={data}
        startDate={startDate}
        endDate={endDate}
        metric="distance"
      />
    </section>
  );
}
