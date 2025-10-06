import { API_ROUTES } from "@/constants/api-routes";

export interface ActivityData {
  name: string;
  date: string;
  category: string;
}

export interface Activity {
  id: number;
  name: string;
  date: string;
  category: string;
}

export interface CreateActivityResponse {
  id: number;
  name: string;
  date: string;
  category: string;
}

export interface UpdateActivityData {
  name: string;
  date: string;
}

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export const createActivityAdapter = async (
  data: ActivityData
): Promise<CreateActivityResponse> => {
  try {
    const response = await fetch(API_ROUTES.ACTIVITIES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Activity creation failed:", error);
    throw error;
  }
};

export const getActivitiesAdapter = async (
  category?: string
): Promise<Activity[]> => {
  try {
    const url = new URL(API_ROUTES.ACTIVITIES);
    if (category) {
      url.searchParams.set("category", category);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Activities fetch successful:", result);
    return result;
  } catch (error) {
    console.error("Activities fetch failed:", error);
    throw error;
  }
};

export const updateActivityAdapter = async (
  id: number,
  data: UpdateActivityData
): Promise<Activity> => {
  try {
    const response = await fetch(`${API_ROUTES.ACTIVITIES}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Activity update successful:", result);
    return result;
  } catch (error) {
    console.error("Activity update failed:", error);
    throw error;
  }
};

export const deleteActivityAdapter = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_ROUTES.ACTIVITIES}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    console.log("Activity deletion successful");
  } catch (error) {
    console.error("Activity deletion failed:", error);
    throw error;
  }
};
