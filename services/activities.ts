import axios from "axios";
import { IActivity } from "../utils/types";

export const fetchActivities = async (token: string): Promise<IActivity[]> => {
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
