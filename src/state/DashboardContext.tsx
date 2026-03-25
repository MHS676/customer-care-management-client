import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Severity = 'normal' | 'warning' | 'critical';

export type CenterStatus = {
  id: number;
  online: boolean;
  queueSize: number;
  activeAlerts: number;
};

export type FeatureStatus = {
  id: number;
  name: string;
  value: string;
  severity: Severity;
  live: boolean;
};

export type AlertLog = {
  id: number;
  centerId: number;
  message: string;
  time: string;
  severity: Severity;
};

type DashboardContextType = {
  totalCenters: number;
  activeAlerts: number;
  totalFootfall: number;
  avgServiceTime: string;
  centers: CenterStatus[];
  features: FeatureStatus[];
  alertLogs: AlertLog[];
};

const TOTAL_CENTERS = 105;

const initialFeatures: FeatureStatus[] = [
  { id: 1, name: 'Queue Alert', value: 'Normal', severity: 'normal', live: true },
  { id: 2, name: 'Idle Agent Detection', value: 'Counter 1: Active', severity: 'normal', live: true },
  { id: 3, name: 'Vandalism Alert', value: 'No Aggression', severity: 'normal', live: true },
  { id: 4, name: 'Noise Alert', value: 'Sound Meter: 38 dB', severity: 'normal', live: true },
  { id: 5, name: 'Hybrid Feed', value: 'Vision + WiFi Synced', severity: 'normal', live: true },
  { id: 6, name: 'Service Timer', value: 'Longest: 07m 22s', severity: 'warning', live: true },
  { id: 7, name: 'Auto-Token Verification', value: 'Presence Verified', severity: 'normal', live: true },
  { id: 8, name: 'Counter Utilization', value: 'Counter 2: Idle', severity: 'warning', live: true },
  { id: 9, name: 'Multi-Center Uptime', value: '99.1%', severity: 'normal', live: true },
  { id: 10, name: 'Waiting Timer', value: 'Max Wait: 05m 11s', severity: 'warning', live: true },
  { id: 11, name: 'Anti-Tamper', value: 'Shutter: Closed', severity: 'normal', live: true },
  { id: 12, name: 'Sentiment Analysis', value: 'Customer Mood: Positive (85%)', severity: 'normal', live: true },
  { id: 13, name: 'Mood Meter', value: 'Happy: 61% | Neutral: 29%', severity: 'normal', live: true },
  { id: 14, name: 'Environmental Monitor', value: 'Fire/Smoke: Secure', severity: 'normal', live: true },
  { id: 15, name: 'Weapon Detection', value: 'Secure', severity: 'normal', live: true },
  { id: 16, name: 'Fall Detection', value: 'No Anomaly', severity: 'normal', live: true },
  { id: 17, name: 'Accessibility Assist', value: 'Wheelchair Support: Standby', severity: 'normal', live: true },
  { id: 18, name: 'Speech-to-Text Logs', value: '2 New Logs Indexed', severity: 'normal', live: true },
  { id: 19, name: 'Loyalty Recognition', value: 'Repeat Customer: Center 18', severity: 'normal', live: true },
  { id: 20, name: 'Token Presence Audit', value: 'All Tokens Matched', severity: 'normal', live: true },
];

const buildCenters = (): CenterStatus[] =>
  Array.from({ length: TOTAL_CENTERS }, (_, index) => ({
    id: index + 1,
    online: Math.random() > 0.08,
    queueSize: Math.floor(Math.random() * 14),
    activeAlerts: Math.floor(Math.random() * 3),
  }));

const initialLogs: AlertLog[] = [
  { id: 1, centerId: 42, message: 'Long Serving Alert', time: '10:42:15', severity: 'warning' },
  { id: 2, centerId: 5, message: 'Sudden Sick Alert (WiFi Detected)', time: '10:43:32', severity: 'critical' },
  { id: 3, centerId: 18, message: 'Queue Threshold Reached', time: '10:44:02', severity: 'warning' },
  { id: 4, centerId: 77, message: 'Camera 2 Lens Obstruction', time: '10:44:45', severity: 'critical' },
  { id: 5, centerId: 8, message: 'Weapon Detection: Secure Recheck', time: '10:45:17', severity: 'normal' },
];

const DashboardContext = createContext<DashboardContextType | null>(null);

const formatTime = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [centers, setCenters] = useState<CenterStatus[]>(() => buildCenters());
  const [features, setFeatures] = useState<FeatureStatus[]>(initialFeatures);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>(initialLogs);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCenters((current) =>
        current.map((center) => {
          const queueShift = Math.floor(Math.random() * 5) - 2;
          const nextQueue = Math.max(0, Math.min(25, center.queueSize + queueShift));
          const online = Math.random() > 0.02 ? center.online : !center.online;
          const activeAlerts = Math.max(0, Math.min(4, Math.floor(nextQueue / 8) + (online ? 0 : 1)));

          return {
            ...center,
            queueSize: nextQueue,
            online,
            activeAlerts,
          };
        })
      );

      setFeatures((current) =>
        current.map((feature) => {
          if (feature.id === 1) {
            const busy = Math.random() > 0.7;
            return {
              ...feature,
              value: busy ? 'Excess Waiting!' : 'Normal',
              severity: busy ? 'warning' : 'normal',
            };
          }

          if (feature.id === 6) {
            const min = String(Math.floor(Math.random() * 10)).padStart(2, '0');
            const sec = String(Math.floor(Math.random() * 60)).padStart(2, '0');
            return { ...feature, value: `Longest: ${min}m ${sec}s` };
          }

          if (feature.id === 15) {
            const unsafe = Math.random() > 0.95;
            return {
              ...feature,
              value: unsafe ? 'Potential Threat: Review Camera 1' : 'Secure',
              severity: unsafe ? 'critical' : 'normal',
            };
          }

          if (feature.id === 16) {
            const anomaly = Math.random() > 0.97;
            return {
              ...feature,
              value: anomaly ? 'Possible Collapse: Center 05' : 'No Anomaly',
              severity: anomaly ? 'critical' : 'normal',
            };
          }

          return feature;
        })
      );

      setAlertLogs((current) => {
        const maybeCreate = Math.random() > 0.55;
        if (!maybeCreate) {
          return current;
        }

        const centerId = Math.floor(Math.random() * TOTAL_CENTERS) + 1;
        const alertTemplates: Array<{ msg: string; severity: Severity }> = [
          { msg: 'Long Serving Alert', severity: 'warning' },
          { msg: 'Sudden Sick Alert (WiFi Detected)', severity: 'critical' },
          { msg: 'Queue Threshold Reached', severity: 'warning' },
          { msg: 'Anti-Tamper Triggered', severity: 'critical' },
          { msg: 'Mood Drop Detected', severity: 'warning' },
        ];

        const randomAlert = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
        const newLog: AlertLog = {
          id: Date.now(),
          centerId,
          message: randomAlert.msg,
          time: formatTime(),
          severity: randomAlert.severity,
        };

        return [newLog, ...current].slice(0, 18);
      });
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const activeAlerts = useMemo(
    () => centers.reduce((acc, center) => acc + center.activeAlerts, 0),
    [centers]
  );

  const totalFootfall = useMemo(
    () => centers.reduce((acc, center) => acc + (18 + center.queueSize * 3), 0),
    [centers]
  );

  const avgServiceTime = useMemo(() => {
    const avgQueue = centers.reduce((acc, center) => acc + center.queueSize, 0) / centers.length;
    const mins = 4 + Math.round(avgQueue / 4);
    return `${mins}m ${String((mins * 7) % 60).padStart(2, '0')}s`;
  }, [centers]);

  const value = {
    totalCenters: TOTAL_CENTERS,
    activeAlerts,
    totalFootfall,
    avgServiceTime,
    centers,
    features,
    alertLogs,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }

  return context;
}
