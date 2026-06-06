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
    loading: boolean;
  }) => React.ReactNode;
  children: React.ReactNode;
}

const ADS_CACHE_KEY = 'plinko_ads_cache';
const ADS_MAIN_CACHE_KEY = 'plinko_ads_main_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function loadFromCache(key: string): Ad[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data as Ad[];
  } catch {
    return null;
  }
}

function saveToCache(key: string, data: Ad[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore storage errors
  }
}

export const AdContainer = ({ renderAds, children }: AdContainerProps) => {
  const cachedAds = loadFromCache(ADS_CACHE_KEY);
  const cachedMain = loadFromCache(ADS_MAIN_CACHE_KEY);

  const [ads, setAds] = useState<Ad[]>(cachedAds ?? []);
  const [mainContentAds, setMainContentAds] = useState<Ad[]>(cachedMain ?? []);
  // Only show loading state if there's no cache at all
  const [loading, setLoading] = useState(!cachedAds);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let isMounted = true;

    const fetchAds = async () => {
      try {
        const [regularResponse, mainContentResponse] = await Promise.all([
          axios.get<Ad[]>(`${baseURL}/public`, { withCredentials: true }),
          axios.get<Ad[]>(`${baseURL}/public/main-content`, { withCredentials: true })
        ]);

        if (!isMounted) return;

        const regularAds = Array.isArray(regularResponse.data) ? regularResponse.data : [];
        const mainContentData = Array.isArray(mainContentResponse.data) ? mainContentResponse.data : [];
        const filteredMain = mainContentData.filter(ad => ad.location === "MainContent");

        setAds(regularAds);
        setMainContentAds(filteredMain);

        saveToCache(ADS_CACHE_KEY, regularAds);
        saveToCache(ADS_MAIN_CACHE_KEY, filteredMain);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching ads:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAds();

    return () => {
      isMounted = false;
    };
  }, []);

  const headerAds = ads.filter(ad => ad?.location === "Header");
  const sidebarAds = ads.filter(ad => ad?.location === "Sidebar");
  const footerAds = ads.filter(ad => ad?.location === "Footer");

  return (
    <div className={styles.pageWrapper}>
      {renderAds({ headerAds, sidebarAds, mainContentAds, footerAds, loading })}
      {children}
    </div>
  );
};