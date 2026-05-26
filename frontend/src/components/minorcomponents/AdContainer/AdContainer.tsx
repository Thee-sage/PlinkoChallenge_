import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { baseURL } from '../../../utils';
import { Ad } from '../types';
import styles from './AdContainer.module.css';

interface AdContainerProps {
  renderAds: (props: {
    headerAds: Ad[];
    sidebarAds: Ad[];
    mainContentAds: Ad[];
    footerAds: Ad[];
  }) => React.ReactNode;
  children: React.ReactNode;
}

export const AdContainer = ({ renderAds, children }: AdContainerProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [mainContentAds, setMainContentAds] = useState<Ad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once — ads are public data, no need to refetch on auth changes
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let isMounted = true;

    const fetchAds = async () => {
      try {
        setError(null);

        const [regularResponse, mainContentResponse] = await Promise.all([
          axios.get<Ad[]>(`${baseURL}/public`, {
            withCredentials: true
          }),
          axios.get<Ad[]>(`${baseURL}/public/main-content`, {
            withCredentials: true
          })
        ]);

        if (!isMounted) return;

        const regularAds = Array.isArray(regularResponse.data) ? regularResponse.data : [];
        const mainContentData = Array.isArray(mainContentResponse.data) ? mainContentResponse.data : [];

        setAds(regularAds);
        setMainContentAds(mainContentData.filter(ad => ad.location === "MainContent"));

      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching ads:", error);
        setError("Failed to load advertisements");
        setAds([]);
        setMainContentAds([]);
      }
    };

    fetchAds();

    return () => {
      isMounted = false;
    };
  }, []); // No dependencies — fetch once on mount

  const headerAds = Array.isArray(ads) ? ads.filter(ad => ad?.location === "Header") : [];
  const sidebarAds = Array.isArray(ads) ? ads.filter(ad => ad?.location === "Sidebar") : [];
  const footerAds = Array.isArray(ads) ? ads.filter(ad => ad?.location === "Footer") : [];

  return (
    <div className={styles.pageWrapper}>
      {renderAds({
        headerAds,
        sidebarAds,
        mainContentAds,
        footerAds,
      })}
      {children}
    </div>
  );
};