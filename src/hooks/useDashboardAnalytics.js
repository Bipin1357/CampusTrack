import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { dashboardService } from '../services/dashboardService';

const REFRESH_INTERVAL_MS = 30_000;
const DASHBOARD_TABLES = ['students', 'courses', 'enrollments', 'attendance'];

export function useDashboardAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const nextAnalytics = await dashboardService.getAnalytics();
      setAnalytics(nextAnalytics);
      setError(null);
    } catch (nextError) {
      console.error('Failed to load dashboard analytics:', nextError);
      setError(nextError.message || 'Failed to load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let refreshTimer;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(refresh, 250);
    };

    refresh();

    const channel = supabase
      .channel('dashboard-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, scheduleRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, scheduleRefresh)
      .subscribe();

    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { analytics, loading, error, refresh };
}
