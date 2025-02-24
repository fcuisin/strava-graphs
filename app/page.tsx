import { generateRandomData } from "./constants";
import { Heatmap } from "./heatmap";
import { STRAVA_OAUTH_URL } from "./utils/url";

export interface IActivity {
  name: string;
  id: number;
  sport_type: string;
  start_date: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  average_speed: number;
  average_heartrate: number;
}

export default async function Home() {
  const currentYear = new Date().getFullYear();
  const data = generateRandomData(
    new Date(currentYear, 0, 1),
    new Date(currentYear, 11, 31)
  );

  return (
    <section className="w-full flex flex-col max-w-7xl px-2 md:px-8 mx-auto gap-10">
      <div className="flex flex-col items-center text-center md:text-left md:flex-row md:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Strava Activities Heatmap.
          </h1>
          <p className="text-lg md:text-xl">
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

      <Heatmap data={data} width={1300} height={300} />
    </section>
  );
}
