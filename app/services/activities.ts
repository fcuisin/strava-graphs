import axios from "axios";

export const fetchActivities = async (token: string | null = "") => {
  try {
    const res = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch {
    return [];
  }
};
