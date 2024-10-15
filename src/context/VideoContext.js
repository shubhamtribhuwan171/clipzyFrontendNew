import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const VideoContext = createContext();
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const VideoProvider = ({ children }) => {
  const [videoCache, setVideoCache] = useState({});

  const fetchVideos = useCallback(async (workspaceId, dateRange) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found');
      return [];
    }

    const cacheKey = `videos_${workspaceId}_${dateRange.startDate}_${dateRange.endDate}`;
    const cachedData = videoCache[cacheKey];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
      return cachedData.videos;
    }

    try {
      const response = await axios.get(
        `https://api.clipzy.ai/video/dateRange`,
        {
          params: {
            workspaceId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const fetchedVideos = response.data;
      setVideoCache(prevCache => ({
        ...prevCache,
        [cacheKey]: { videos: fetchedVideos, timestamp: Date.now() }
      }));

      return fetchedVideos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }, [videoCache]);

  return (
    <VideoContext.Provider value={{ fetchVideos }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);