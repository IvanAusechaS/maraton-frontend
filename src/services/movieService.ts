const PEXELS_API_KEY =
  "qo19orh1hqpe82bKV5yLFNPHv0gW17ODPZ2deOf3QauXXdj5SiudOevZ";
const PEXELS_API_URL = "https://api.pexels.com/v1";

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  image: string;
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

export const searchVideos = async (
  query: string,
  page: number = 1,
  per_page: number = 10
): Promise<PexelsResponse> => {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/videos/search?query=${encodeURIComponent(
        query
      )}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch videos from Pexels");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export const getPopularVideos = async (
  page: number = 1,
  per_page: number = 10
): Promise<PexelsResponse> => {
  try {
    const response = await fetch(
      `${PEXELS_API_URL}/videos/popular?page=${page}&per_page=${per_page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular videos from Pexels");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching popular videos:", error);
    throw error;
  }
};
