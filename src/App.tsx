import {
  Activity,
  AlarmClock,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  Brain,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleGauge,
  ClipboardCheck,
  Clock,
  Cpu,
  Flame,
  Gauge,
  HandHelping,
  LayoutDashboard,
  Lock,
  MapPin,
  Mic,
  Radar,
  Search,
  Settings,
  Shield,
  Siren,
  Smile,
  Star,
  TrendingDown,
  TrendingUp,
  UserCog,
  UserRound,
  Users,
  Wifi,
  XCircle,
  Zap,
  Building2,
  ClipboardList,
  Download,
  FileText,
  Headphones,
  Video,
  Film,
  Mic2,
  ScanFace,
  PlayCircle,
  Volume2,
  FolderSearch,
  IdCard,
  Contact,
  ChevronRight,
  UploadCloud,
  LibraryBig,
  HardDrive,
  CalendarDays,
  Filter,
} from 'lucide-react';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useDashboard, type AlertLog, type FeatureStatus } from './state/DashboardContext';
import { exportCenterReportPDF, exportMediaVaultPDF } from './utils/exportPDF';

type Severity = 'normal' | 'warning' | 'critical';
type Page = 'Overview' | '105 Centers' | 'AI Alerts' | 'Analytics' | 'Settings' | 'Reports' | 'Agent Search' | 'Media Vault';

function sev(level: Severity) {
  if (level === 'critical') return 'border-red-500/40 bg-red-500/10 text-red-200';
  if (level === 'warning') return 'border-amber-400/30 bg-amber-400/10 text-amber-100';
  return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100';
}

function SevBadge({ level }: { level: Severity }) {
  const cls =
    level === 'critical'
      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
      : level === 'warning'
      ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
      : 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/30';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}>{level}</span>;
}

const featureIcons: Record<number, ReactNode> = {
  1: <Users size={16} />, 2: <UserRound size={16} />, 3: <Shield size={16} />,
  4: <Gauge size={16} />, 5: <Brain size={16} />, 6: <AlarmClock size={16} />,
  7: <ClipboardCheck size={16} />, 8: <Activity size={16} />, 9: <Radar size={16} />,
  10: <AlarmClock size={16} />, 11: <Lock size={16} />, 12: <Smile size={16} />,
  13: <CircleGauge size={16} />, 14: <Flame size={16} />, 15: <Shield size={16} />,
  16: <CircleAlert size={16} />, 17: <HandHelping size={16} />, 18: <Mic size={16} />,
  19: <UserCog size={16} />, 20: <ClipboardCheck size={16} />,
};

const navItems: { label: Page; icon: ReactNode }[] = [
  { label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { label: '105 Centers', icon: <Blocks size={18} /> },
  { label: 'AI Alerts', icon: <Siren size={18} /> },
  { label: 'Analytics', icon: <CircleGauge size={18} /> },
  { label: 'Settings', icon: <Settings size={18} /> },
  { label: 'Reports', icon: <FileText size={18} /> },
  { label: 'Agent Search', icon: <FolderSearch size={18} /> },
  { label: 'Media Vault', icon: <LibraryBig size={18} /> },
];

function OverviewPage() {
  const { totalCenters, activeAlerts, totalFootfall, avgServiceTime, centers, features, alertLogs } = useDashboard();
  const onlineCount = useMemo(() => centers.filter((c) => c.online).length, [centers]);
  const kpis = [
    { label: 'Total Centers', value: totalCenters, icon: <Blocks size={18} />, color: 'text-cyan-300' },
    { label: 'Active Alerts', value: activeAlerts, icon: <Siren size={18} />, color: 'text-red-400' },
    { label: 'Total Footfall Today', value: totalFootfall.toLocaleString(), icon: <Users size={18} />, color: 'text-cyan-300' },
    { label: 'Avg Service Time', value: avgServiceTime, icon: <AlarmClock size={18} />, color: 'text-amber-300' },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <section className="xl:col-span-9">
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-neon">
              <div className="mb-3 flex items-center justify-between text-slate-400">
                <span className="text-xs uppercase tracking-wider">{kpi.label}</span>
                <span className={kpi.color}>{kpi.icon}</span>
              </div>
              <p className="text-2xl font-semibold text-slate-100">{kpi.value}</p>
              <p className="mt-2 text-xs text-slate-400 group-hover:text-cyan-200">Live enterprise metric</p>
            </article>
          ))}
        </div>
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          {[1, 2, 3].map((cameraId) => (
            <article key={cameraId} className={`relative rounded-2xl border p-4 transition hover:shadow-neon ${cameraId === 1 ? 'border-red-500/30 bg-slate-900/85' : 'border-slate-800 bg-slate-900/70'}`}>
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Camera size={16} className="text-cyan-300" /> Camera {cameraId}
                  {cameraId === 1 && <span className="ml-1 text-xs text-red-400">Threat Detected</span>}
                </p>
                <p className="flex items-center gap-1 text-xs text-cyan-200"><span className="status-dot animate-pulse bg-cyan-300" /> Live</p>
              </div>
              <div className="relative h-40 overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute left-[12%] top-[22%] h-16 w-12 rounded border border-cyan-300/70" />
                <div className="absolute left-[45%] top-[35%] h-20 w-14 rounded border border-cyan-300/70" />
                {cameraId === 1 && <div className="absolute right-[15%] top-[18%] h-14 w-10 rounded border-2 border-red-500 animate-pulse" />}
                <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-[10px] text-cyan-200">4MP AI Overlay - DensePose sync</div>
              </div>
            </article>
          ))}
          <article className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-4 transition hover:shadow-neon">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold"><Wifi size={16} className="text-cyan-300" /> WiFi DensePose Heatmap</p>
              <p className="flex items-center gap-1 text-xs text-cyan-200"><span className="status-dot animate-pulse bg-cyan-300" /> Live</p>
            </div>
            <div className="relative h-40 overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(34,211,238,0.35),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(34,211,238,0.45),transparent_35%)]" />
              <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full text-cyan-200/80">
                <g stroke="currentColor" strokeWidth="1.8" fill="none">
                  <circle cx="42" cy="30" r="4" /><line x1="42" y1="34" x2="42" y2="52" />
                  <line x1="42" y1="40" x2="30" y2="47" /><line x1="42" y1="40" x2="54" y2="47" />
                  <line x1="42" y1="52" x2="34" y2="67" /><line x1="42" y1="52" x2="50" y2="67" />
                  <circle cx="128" cy="46" r="4" /><line x1="128" y1="50" x2="128" y2="68" />
                  <line x1="128" y1="56" x2="116" y2="62" /><line x1="128" y1="56" x2="140" y2="62" />
                  <line x1="128" y1="68" x2="120" y2="84" /><line x1="128" y1="68" x2="136" y2="84" />
                </g>
              </svg>
              <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-[10px] text-cyan-200">RF skeletal motion tracking - Occlusion resistant</div>
            </div>
          </article>
        </div>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Real-Time Command Center - 105 Centers</h3>
            <p className="text-xs text-slate-400">Online: <span className="text-cyan-300">{onlineCount}</span> / 105</p>
          </div>
          <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-5 xl:grid-cols-7">
            {centers.map((center) => (
              <div key={center.id} className="rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-2 text-[11px] transition hover:border-cyan-400/40">
                <p className="mb-1 font-medium text-slate-200">C {String(center.id).padStart(2, '0')}</p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <span className={`status-dot ${center.online ? 'bg-cyan-300' : 'bg-red-500'}`} />
                  {center.online ? 'Active' : 'Offline'}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <aside className="space-y-4 xl:col-span-3">
        <FeaturePanel features={features} />
        <AlertFeed alertLogs={alertLogs} />
        <ModuleStatus />
      </aside>
    </div>
  );
}

function CentersPage() {
  const { centers } = useDashboard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'alerts'>('all');
  const [sortKey, setSortKey] = useState<'id' | 'queue' | 'alerts'>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const filtered = useMemo(() => {
    let list = [...centers];
    if (filter === 'online') list = list.filter((c) => c.online);
    if (filter === 'offline') list = list.filter((c) => !c.online);
    if (filter === 'alerts') list = list.filter((c) => c.activeAlerts > 0);
    if (search) list = list.filter((c) => String(c.id).padStart(2, '0').includes(search));
    list.sort((a, b) => {
      const diff = sortKey === 'id' ? a.id - b.id : sortKey === 'queue' ? a.queueSize - b.queueSize : a.activeAlerts - b.activeAlerts;
      return sortDir === 'asc' ? diff : -diff;
    });
    return list;
  }, [centers, filter, search, sortKey, sortDir]);
  const totalAlerts = centers.reduce((sum, c) => sum + c.activeAlerts, 0);
  const onlineCount = centers.filter((c) => c.online).length;
  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: 105, color: 'text-slate-100', icon: <Blocks size={16} /> },
          { label: 'Online', value: onlineCount, color: 'text-cyan-300', icon: <Wifi size={16} /> },
          { label: 'Offline', value: 105 - onlineCount, color: 'text-red-400', icon: <XCircle size={16} /> },
          { label: 'With Alerts', value: centers.filter((c) => c.activeAlerts > 0).length, color: 'text-amber-300', icon: <Siren size={16} /> },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-cyan-400/40">
            <div className="mb-2 flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">{stat.label}</span>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find center #..." className="rounded-xl border border-slate-700 bg-slate-950/70 py-2 pl-9 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" />
        </div>
        {(['all', 'online', 'offline', 'alerts'] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-wider transition ${filter === f ? 'border-cyan-400 bg-cyan-400/15 text-cyan-200' : 'border-slate-700 bg-slate-900/70 text-slate-400 hover:border-cyan-400/40'}`}>{f}</button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} centers shown</span>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        <div className="grid grid-cols-6 gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-3 text-[11px] uppercase tracking-wider text-slate-400">
          <button className="col-span-1 flex items-center gap-1 text-left" onClick={() => toggleSort('id')}>Center {sortKey === 'id' ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}</button>
          <span className="col-span-1">Status</span>
          <button className="col-span-1 flex items-center gap-1" onClick={() => toggleSort('queue')}>Queue {sortKey === 'queue' ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}</button>
          <button className="col-span-1 flex items-center gap-1" onClick={() => toggleSort('alerts')}>Alerts {sortKey === 'alerts' ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}</button>
          <span className="col-span-1">Utilisation</span>
          <span className="col-span-1">AI Feed</span>
        </div>
        <div className="max-h-[calc(100vh-22rem)] overflow-y-auto divide-y divide-slate-800/60">
          {filtered.map((center) => {
            const util = Math.round((center.queueSize / 20) * 100);
            return (
              <div key={center.id} className="grid grid-cols-6 gap-2 items-center px-4 py-3 text-sm transition hover:bg-slate-800/30">
                <div className="col-span-1 font-medium text-slate-100 flex items-center gap-2">
                  <MapPin size={13} className="text-slate-500" />
                  Center {String(center.id).padStart(2, '0')}
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <span className={`status-dot ${center.online ? 'bg-cyan-300 animate-pulse' : 'bg-red-500'}`} />
                  <span className={center.online ? 'text-cyan-200' : 'text-red-300'}>{center.online ? 'Active' : 'Offline'}</span>
                </div>
                <div className="col-span-1">
                  <span className={`font-mono text-sm ${center.queueSize > 10 ? 'text-amber-300' : 'text-slate-200'}`}>{center.queueSize}</span>
                  <span className="text-slate-500 text-xs"> ppl</span>
                </div>
                <div className="col-span-1">
                  {center.activeAlerts > 0 ? (
                    <span className="flex items-center gap-1 text-red-300"><Siren size={13} /> {center.activeAlerts}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-cyan-400"><CheckCircle size={13} /> Clear</span>
                  )}
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-slate-700">
                      <div className={`h-full rounded-full ${util > 70 ? 'bg-red-500' : util > 40 ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${Math.min(util, 100)}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{util}%</span>
                  </div>
                </div>
                <div className="col-span-1 flex gap-2">
                  <Camera size={13} className={center.online ? 'text-cyan-400' : 'text-slate-600'} />
                  <Wifi size={13} className={center.online ? 'text-cyan-400' : 'text-slate-600'} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-slate-800 bg-slate-950/50 px-4 py-2 text-xs text-slate-400">
          Total queue load: {centers.reduce((s, c) => s + c.queueSize, 0)} | Total alerts: {totalAlerts}
        </div>
      </div>
    </div>
  );
}

function AlertsPage() {
  const { alertLogs, features, centers } = useDashboard();
  const [sevFilter, setSevFilter] = useState<'all' | Severity>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = useMemo(() => {
    let list = [...alertLogs];
    if (sevFilter !== 'all') list = list.filter((l) => l.severity === sevFilter);
    if (searchTerm) list = list.filter((l) => l.message.toLowerCase().includes(searchTerm.toLowerCase()) || String(l.centerId).includes(searchTerm));
    return list;
  }, [alertLogs, sevFilter, searchTerm]);
  const criticalFeatures = features.filter((f) => f.severity === 'critical');
  const warningFeatures = features.filter((f) => f.severity === 'warning');
  const offlineCenters = centers.filter((c) => !c.online);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Critical', count: alertLogs.filter((l) => l.severity === 'critical').length, cls: 'border-red-500/30 bg-red-500/5', txt: 'text-red-300' },
          { label: 'Warning', count: alertLogs.filter((l) => l.severity === 'warning').length, cls: 'border-amber-400/30 bg-amber-400/5', txt: 'text-amber-200' },
          { label: 'Info', count: alertLogs.filter((l) => l.severity === 'normal').length, cls: 'border-cyan-400/30 bg-cyan-400/5', txt: 'text-cyan-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.cls}`}>
            <p className={`mb-1 text-xs uppercase tracking-wider ${s.txt}`}>{s.label}</p>
            <p className={`text-3xl font-bold ${s.txt}`}>{s.count}</p>
            <p className="mt-1 text-xs text-slate-400">Active {s.label.toLowerCase()} alerts</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Bell size={15} className="text-red-400" /> Live Alert Feed
                <span className="status-dot animate-pulse bg-red-400 ml-1" />
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search alerts..." className="rounded-xl border border-slate-700 bg-slate-950/70 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-cyan-400" />
                </div>
                {(['all', 'critical', 'warning', 'normal'] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setSevFilter(s)} className={`rounded-lg border px-2.5 py-1 text-[11px] uppercase tracking-wider transition ${sevFilter === s ? 'border-cyan-400 bg-cyan-400/15 text-cyan-200' : 'border-slate-700 text-slate-400 hover:border-cyan-400/40'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {filtered.length === 0 && <p className="py-6 text-center text-xs text-slate-500">No alerts matching filter.</p>}
              {filtered.map((log) => (
                <article key={log.id} className={`rounded-xl border p-3 text-sm ${sev(log.severity)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <CircleAlert size={15} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Center {String(log.centerId).padStart(2, '0')}: {log.message}</p>
                        <p className="mt-1 text-[11px] opacity-70">{log.time}</p>
                      </div>
                    </div>
                    <SevBadge level={log.severity} />
                  </div>
                </article>
              ))}
            </div>
          </div>
          {offlineCenters.length > 0 && (
            <div className="rounded-2xl border border-red-500/30 bg-slate-900/70 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-300"><XCircle size={15} /> Offline Centers ({offlineCenters.length})</h3>
              <div className="flex flex-wrap gap-2">
                {offlineCenters.map((c) => (
                  <span key={c.id} className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs text-red-200">Center {String(c.id).padStart(2, '0')}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="xl:col-span-4 space-y-4">
          {criticalFeatures.length > 0 && (
            <div className="rounded-2xl border border-red-500/30 bg-slate-900/70 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-300">Critical Features</h3>
              <div className="space-y-2">
                {criticalFeatures.map((f) => (
                  <div key={f.id} className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs">
                    <p className="mb-0.5 flex items-center gap-2 font-medium text-red-200">{featureIcons[f.id]} {f.name}</p>
                    <p className="text-red-100">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {warningFeatures.length > 0 && (
            <div className="rounded-2xl border border-amber-400/30 bg-slate-900/70 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-200">Warning Features</h3>
              <div className="space-y-2">
                {warningFeatures.map((f) => (
                  <div key={f.id} className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-2.5 text-xs">
                    <p className="mb-0.5 flex items-center gap-2 font-medium text-amber-100">{featureIcons[f.id]} {f.name}</p>
                    <p className="text-amber-50">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-200">Alert Type Breakdown</h3>
            {[
              { label: 'Queue / Capacity', count: alertLogs.filter((l) => l.message.includes('Queue')).length },
              { label: 'Health / Sick', count: alertLogs.filter((l) => l.message.includes('Sick') || l.message.includes('Fall')).length },
              { label: 'Security / Tamper', count: alertLogs.filter((l) => l.message.includes('Tamper') || l.message.includes('Weapon')).length },
              { label: 'Sentiment / Mood', count: alertLogs.filter((l) => l.message.includes('Mood')).length },
              { label: 'Serving / Wait', count: alertLogs.filter((l) => l.message.includes('Serving') || l.message.includes('Wait')).length },
            ].map(({ label, count }) => (
              <div key={label} className="mb-2 flex items-center gap-2 text-xs">
                <span className="w-36 text-slate-300">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-700">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min((count / (alertLogs.length || 1)) * 100, 100)}%` }} />
                </div>
                <span className="w-5 text-right text-slate-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const HOURS = ['07','08','09','10','11','12','13','14','15','16','17','18'];
const seedBars = (base: number, spread: number) => HOURS.map(() => base + Math.floor(Math.random() * spread));
const footfallData = seedBars(180, 120);
const serviceData = seedBars(3, 7);
const alertData = seedBars(2, 8);

function BarChart({ data, color, maxVal }: { data: number[]; color: string; maxVal: number; unit: string }) {
  return (
    <div className="flex h-28 items-end gap-1">
      {data.map((val, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className={`w-full rounded-t ${color}`} style={{ height: `${Math.round((val / maxVal) * 100)}%`, minHeight: 2 }} title={`${HOURS[i]}:00`} />
          <span className="text-[9px] text-slate-500">{HOURS[i]}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPage() {
  const { centers, features, totalFootfall, avgServiceTime } = useDashboard();
  const sentimentFeature = features.find((f) => f.id === 12);
  const queueFeature = features.find((f) => f.id === 1);
  const counterFeature = features.find((f) => f.id === 8);
  const envFeature = features.find((f) => f.id === 14);
  const loyaltyFeature = features.find((f) => f.id === 19);
  const speechFeature = features.find((f) => f.id === 18);
  const topQueued = useMemo(() => [...centers].sort((a, b) => b.queueSize - a.queueSize).slice(0, 10), [centers]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Footfall Today', value: totalFootfall.toLocaleString(), trend: '+12%', up: true, icon: <Users size={16} />, color: 'text-cyan-300' },
          { label: 'Avg Service Time', value: avgServiceTime, trend: '-8%', up: false, icon: <Clock size={16} />, color: 'text-amber-300' },
          { label: 'Queue Status', value: queueFeature?.value ?? '-', trend: '', up: true, icon: <BarChart3 size={16} />, color: 'text-cyan-300' },
          { label: 'Counter Utilisation', value: counterFeature?.value ?? '-', trend: '', up: false, icon: <Activity size={16} />, color: 'text-amber-300' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-cyan-400/40 transition">
            <div className="mb-2 flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">{stat.label}</span>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <p className="text-lg font-semibold text-slate-100 truncate">{stat.value}</p>
            {stat.trend && (
              <p className={`mt-1 flex items-center gap-1 text-xs ${stat.up ? 'text-cyan-400' : 'text-red-400'}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {stat.trend} vs yesterday
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Users size={15} className="text-cyan-300" /> Hourly Footfall (All Centers)</h3>
            <BarChart data={footfallData} color="bg-cyan-400/70" maxVal={300} unit=" ppl" />
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Siren size={15} className="text-red-400" /> Alerts Generated Per Hour</h3>
            <BarChart data={alertData} color="bg-red-400/70" maxVal={15} unit=" alerts" />
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><AlarmClock size={15} className="text-amber-300" /> Avg Service Time Per Hour (min)</h3>
            <BarChart data={serviceData} color="bg-amber-400/70" maxVal={12} unit="m" />
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Gauge size={15} className="text-amber-300" /> Top 10 Centers by Queue Size</h3>
            <div className="space-y-2">
              {topQueued.map((center) => (
                <div key={center.id} className="flex items-center gap-3 text-xs">
                  <span className="w-20 font-medium text-slate-200">Center {String(center.id).padStart(2, '0')}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-700">
                    <div className={`h-full rounded-full ${center.queueSize > 12 ? 'bg-red-500' : center.queueSize > 6 ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${(center.queueSize / 25) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-slate-300">{center.queueSize} ppl</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Smile size={15} className="text-cyan-300" /> Sentiment Analysis</h3>
            <p className="mb-4 text-xs text-slate-300">{sentimentFeature?.value}</p>
            {[{ label: 'Happy', pct: 61, color: 'bg-cyan-400' }, { label: 'Neutral', pct: 29, color: 'bg-slate-400' }, { label: 'Angry', pct: 10, color: 'bg-red-400' }].map(({ label, pct, color }) => (
              <div key={label} className="mb-2 flex items-center gap-2 text-xs">
                <span className="w-20 text-slate-300">{label}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-700"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div>
                <span className="w-8 text-right text-slate-400">{pct}%</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Zap size={15} className="text-cyan-300" /> AI Feature Health</h3>
            <div className="space-y-2 text-xs">
              {[{ name: 'Vision AI', health: 99.2 }, { name: 'WiFi DensePose', health: 97.8 }, { name: 'Threat Detection', health: 99.9 }, { name: 'Sentiment Engine', health: 96.4 }, { name: 'Health Monitor', health: 98.1 }].map(({ name, health }) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-32 text-slate-300">{name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-700"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${health}%` }} /></div>
                  <span className="text-cyan-200">{health}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold"><Star size={15} className="text-amber-300" /> Customer Insights</h3>
            <div className="flex items-center justify-between"><span className="text-slate-400">Loyalty Recognition</span><span className="text-cyan-200 text-right max-w-[55%] truncate">{loyaltyFeature?.value}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-400">Speech Logs</span><span className="text-cyan-200">{speechFeature?.value}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-400">Environment</span><span className="text-cyan-200">{envFeature?.value}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [thresholds, setThresholds] = useState({ queueMax: 15, waitMax: 10, noiseDB: 75 });
  const [modules, setModules] = useState({ visionAI: true, wifiDensePose: true, weaponDetection: true, fallDetection: true, sentimentAnalysis: true, loyaltyRecognition: true, speechLogs: true, antiTamper: true });
  const [notifications, setNotifications] = useState({ emailAlerts: true, smsAlerts: false, dashboardPush: true, criticalOnly: false });
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button type="button" onClick={onChange} className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${value ? 'bg-cyan-400' : 'bg-slate-700'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold"><Siren size={17} className="text-amber-300" /> Alert Thresholds</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          {([
            { key: 'queueMax', label: 'Max Queue Size', unit: 'people', min: 5, max: 50 },
            { key: 'waitMax', label: 'Max Wait Time', unit: 'minutes', min: 2, max: 30 },
            { key: 'noiseDB', label: 'Noise Alert Level', unit: 'dB', min: 50, max: 120 },
          ] as const).map(({ key, label, unit, min, max }) => (
            <div key={key}>
              <label className="mb-2 block text-xs text-slate-400">{label}</label>
              <div className="flex items-center gap-3">
                <input type="range" min={min} max={max} value={thresholds[key]} onChange={(e) => setThresholds((t) => ({ ...t, [key]: Number(e.target.value) }))} className="flex-1 accent-cyan-400" />
                <span className="min-w-[4.5rem] rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-center text-sm text-cyan-200">{thresholds[key]} {unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold"><Cpu size={17} className="text-cyan-300" /> AI Module Toggles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.entries(modules) as [keyof typeof modules, boolean][]).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <span className="text-sm text-slate-200 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <Toggle value={val} onChange={() => setModules((m) => ({ ...m, [key]: !val }))} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold"><Bell size={17} className="text-red-300" /> Notification Preferences</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <span className="text-sm text-slate-200 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <Toggle value={val} onChange={() => setNotifications((n) => ({ ...n, [key]: !val }))} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold"><Shield size={17} className="text-cyan-300" /> System Information</h3>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          {[
            ['Platform', 'Falcon Security Ltd. v4.2.1'],
            ['Hybrid AI Engine', 'Vision + WiFi DensePose (Active)'],
            ['Coverage', '105 Service Centers'],
            ['Data Residency', 'On-premise and Edge Nodes'],
            ['Last Full Sync', new Date().toLocaleString('en-GB')],
            ['Uptime', '99.97% (30-day rolling)'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
              <span className="text-xs uppercase tracking-wider text-slate-500">{k}</span>
              <span className="text-cyan-100">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={handleSave} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400">Save Configuration</button>
        {saved && <span className="flex items-center gap-1.5 text-sm text-cyan-300"><CheckCircle size={15} /> Saved successfully</span>}
      </div>
    </div>
  );
}

function FeaturePanel({ features }: { features: FeatureStatus[] }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Bot size={16} className="text-cyan-300" /> 20-Feature Status</h3>
      <div className="max-h-[470px] space-y-2 overflow-y-auto pr-1">
        {features.map((feature) => (
          <article key={feature.id} className={`rounded-xl border p-2.5 text-xs transition hover:-translate-y-0.5 ${sev(feature.severity)}`}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-medium">{featureIcons[feature.id]} F{feature.id}: {feature.name}</p>
              {feature.live && <span className="status-dot animate-pulse bg-cyan-300" />}
            </div>
            <p>{feature.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AlertFeed({ alertLogs }: { alertLogs: AlertLog[] }) {
  return (
    <section className="rounded-2xl border border-red-500/30 bg-slate-900/70 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-200"><Bell size={16} /> Live Alert Feed</h3>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {alertLogs.map((log) => (
          <article key={log.id} className={`rounded-xl border p-2.5 text-xs ${sev(log.severity)}`}>
            <p className="font-medium">Center {String(log.centerId).padStart(2, '0')}: {log.message}</p>
            <p className="mt-1 text-[10px] text-slate-300">{log.time}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModuleStatus() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-200"><Cpu size={16} /> Hybrid AI Modules</h3>
      <ul className="space-y-2">
        {['Queue Analytics', 'Threat Intelligence', 'Health and Accessibility', 'Sentiment Pipeline'].map((m) => (
          <li key={m} className="flex items-center justify-between"><span>{m}</span><span className="text-cyan-300">Running</span></li>
        ))}
      </ul>
    </section>
  );
}

// ─── Reports Page ─────────────────────────────────────────────────────────────
type Period = 'Daily' | 'Weekly' | 'Monthly';

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967295;
  };
}

interface CenterReportData {
  footage: { motionEvents: number; threatDetections: number; tamperAttempts: number; cameraUptime: number; recordedHrs: number; aiDetections: number };
  videoRecording: { clipsRecorded: number; totalDurationHrs: number; storageGB: number; avgResolution: string; corruptedClips: number; cloudBackupPct: number; continuousRecordingHrs: number };
  audioRecording: { capturedCount: number; totalDurationHrs: number; storageMB: number; flaggedCount: number; avgBitrateKbps: number; noiseReducedPct: number };
  facialExpression: { totalFacesScanned: number; uniqueIndividuals: number; expressionHappy: number; expressionNeutral: number; expressionAngry: number; expressionSurprised: number; expressionFearful: number; vipRecognitions: number; unknownFaces: number; avgConfidencePct: number; maskWearing: number };
  attendance: { totalFootfall: number; peakHour: string; avgQueueSize: number; peakQueueSize: number; walkOutWithoutService: number };
  voice: { speechInteractions: number; flaggedConversations: number; avgNoiseLevelDb: number; peakNoiseLevelDb: number; sentimentHappy: number; sentimentAngry: number; sentimentNeutral: number };
  service: { ticketsServed: number; ticketsAbandoned: number; avgWaitMin: number; avgServiceMin: number; serviceEfficiency: number; counterUtilisation: number; satisfactionScore: string };
  alerts: { critical: number; warning: number; info: number; topAlert: string };
  features: { active: number; degraded: number; healthPct: number };
  uptime: { uptimePct: number; incidentCount: number; longestDowntimeMin: number };
}

function genReport(centerId: number, period: Period): CenterReportData {
  const pMul = period === 'Daily' ? 1 : period === 'Weekly' ? 7 : 30;
  const pSeed = period === 'Daily' ? 1 : period === 'Weekly' ? 2 : 3;
  const rng = seededRand(centerId * 997 + pSeed * 1031);
  const r = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  const sh = r(50, 78), sa = r(5, 18);
  const resLabels: Record<number, string> = { 0: '720p', 1: '1080p', 2: '1080p', 3: '4K' };
  const bitrateLabels: Record<number, number> = { 0: 128, 1: 192, 2: 256, 3: 320 };
  const fh = r(42, 65), fn = r(18, 30), fa = r(5, 12), fs = r(3, 9), ff = r(1, 6);
  return {
    footage: { motionEvents: r(40, 180) * pMul, threatDetections: r(0, 4) * pMul, tamperAttempts: r(0, 2) * pMul, cameraUptime: r(93, 100), recordedHrs: Math.min(r(16, 24) * pMul, 24 * pMul), aiDetections: r(10, 60) * pMul },
    videoRecording: { clipsRecorded: r(20, 96) * pMul, totalDurationHrs: Math.min(r(18, 24) * pMul, 24 * pMul), storageGB: r(2, 8) * pMul, avgResolution: resLabels[r(0, 3)], corruptedClips: r(0, 2) * Math.ceil(pMul / 7), cloudBackupPct: r(88, 100), continuousRecordingHrs: Math.min(r(20, 24) * pMul, 24 * pMul) },
    audioRecording: { capturedCount: r(60, 350) * pMul, totalDurationHrs: r(6, 16) * pMul, storageMB: r(200, 800) * pMul, flaggedCount: r(0, 8) * pMul, avgBitrateKbps: bitrateLabels[r(0, 3)], noiseReducedPct: r(72, 98) },
    facialExpression: { totalFacesScanned: r(300, 1500) * pMul, uniqueIndividuals: r(180, 900) * pMul, expressionHappy: fh, expressionNeutral: fn, expressionAngry: fa, expressionSurprised: fs, expressionFearful: ff, vipRecognitions: r(0, 12) * pMul, unknownFaces: r(5, 40) * pMul, avgConfidencePct: r(87, 99), maskWearing: r(0, 15) * pMul },
    attendance: { totalFootfall: r(400, 1800) * pMul, peakHour: `${r(9, 15)}:00`, avgQueueSize: r(3, 18), peakQueueSize: r(15, 35), walkOutWithoutService: r(1, 8) * pMul },
    voice: { speechInteractions: r(80, 400) * pMul, flaggedConversations: r(0, 8) * pMul, avgNoiseLevelDb: r(45, 78), peakNoiseLevelDb: r(75, 95), sentimentHappy: sh, sentimentAngry: sa, sentimentNeutral: 100 - sh - sa },
    service: { ticketsServed: r(200, 900) * pMul, ticketsAbandoned: r(5, 30) * pMul, avgWaitMin: r(2, 14), avgServiceMin: r(3, 10), serviceEfficiency: r(75, 99), counterUtilisation: r(55, 95), satisfactionScore: (r(350, 500) / 5).toFixed(1) },
    alerts: { critical: r(0, 5) * pMul, warning: r(2, 18) * pMul, info: r(5, 30) * pMul, topAlert: ['Queue overflow', 'Noise threshold exceeded', 'Mood alert detected', 'Camera occlusion', 'Long wait time'][r(0, 4)] },
    features: { active: r(17, 20), degraded: r(0, 3), healthPct: r(92, 100) },
    uptime: { uptimePct: r(92, 100), incidentCount: r(0, 4) * Math.ceil(pMul / 7), longestDowntimeMin: r(0, 120) },
  };
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-xs text-slate-400">{pct}%</span>
    </div>
  );
}

function StatRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-100">{value}{sub && <span className="text-slate-400 text-[10px] ml-1">{sub}</span>}</span>
    </div>
  );
}

function ReportCard({ title, icon, children, accent = 'cyan' }: { title: string; icon: ReactNode; children: ReactNode; accent?: string }) {
  const accentCls = accent === 'red' ? 'text-red-300' : accent === 'amber' ? 'text-amber-300' : accent === 'violet' ? 'text-violet-300' : accent === 'green' ? 'text-green-300' : 'text-cyan-300';
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-3">
      <h3 className={`flex items-center gap-2 text-sm font-semibold ${accentCls}`}>{icon} {title}</h3>
      <div>{children}</div>
    </div>
  );
}

function ReportsPage() {
  const { centers } = useDashboard();
  const [selectedId, setSelectedId] = useState(1);
  const [period, setPeriod] = useState<Period>('Daily');
  const [search, setSearch] = useState('');
  const allIds = useMemo(() => Array.from({ length: 105 }, (_, i) => i + 1), []);
  const filteredIds = useMemo(() => !search ? allIds : allIds.filter((id) => String(id).padStart(2, '0').includes(search) || String(id).includes(search)), [search, allIds]);
  const liveCenter = centers.find((c) => c.id === selectedId);
  const report = useMemo(() => genReport(selectedId, period), [selectedId, period]);
  const totalAlerts = report.alerts.critical + report.alerts.warning + report.alerts.info;
  const pLabel = period === 'Daily' ? '24h' : period === 'Weekly' ? '7d' : '30d';
  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
          <Building2 size={15} className="text-cyan-300 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-16 bg-transparent text-xs outline-none placeholder:text-slate-500" />
          <select value={selectedId} onChange={(e) => { setSelectedId(Number(e.target.value)); setSearch(''); }} className="bg-transparent text-sm font-medium text-cyan-200 outline-none cursor-pointer">
            {filteredIds.map((id) => (
              <option key={id} value={id} className="bg-slate-900 text-slate-100">Center {String(id).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
        <div className="flex rounded-xl border border-slate-700 bg-slate-950/70 p-1">
          {(['Daily', 'Weekly', 'Monthly'] as Period[]).map((p) => (
            <button key={p} type="button" onClick={() => setPeriod(p)} className={`rounded-lg px-4 py-1.5 text-xs font-medium transition ${period === p ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400 hover:text-slate-200'}`}>{p}</button>
          ))}
        </div>
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${liveCenter?.online ? 'border-cyan-400/30 text-cyan-200' : 'border-red-500/30 text-red-300'}`}>
          <span className={`status-dot ${liveCenter?.online ? 'bg-cyan-300 animate-pulse' : 'bg-red-500'}`} />
          {liveCenter?.online ? 'Online' : 'Offline'} · Queue: {liveCenter?.queueSize ?? 0} ppl
        </div>
        <button
          type="button"
          onClick={() => exportCenterReportPDF({
            centerId: selectedId,
            period,
            online: liveCenter?.online ?? false,
            queueSize: liveCenter?.queueSize ?? 0,
            footage: {
              motionEvents: report.footage.motionEvents,
              threatDetections: report.footage.threatDetections,
              tamperAttempts: report.footage.tamperAttempts,
              cameraUptime: report.footage.cameraUptime,
              recordedHrs: report.footage.recordedHrs,
              aiDetections: report.footage.aiDetections,
              videoClips: report.videoRecording.clipsRecorded,
              storageGB: report.videoRecording.storageGB,
              resolution: report.videoRecording.avgResolution,
              cloudBackupPct: report.videoRecording.cloudBackupPct,
            },
            attendance: report.attendance,
            voice: {
              speechInteractions: report.voice.speechInteractions,
              flaggedConversations: report.voice.flaggedConversations,
              avgNoiseLevelDb: report.voice.avgNoiseLevelDb,
              peakNoiseLevelDb: report.voice.peakNoiseLevelDb,
              sentimentHappy: report.voice.sentimentHappy,
              sentimentAngry: report.voice.sentimentAngry,
              sentimentNeutral: report.voice.sentimentNeutral,
              audioCount: report.audioRecording.capturedCount,
              audioDurationHrs: report.audioRecording.totalDurationHrs,
              noiseReducedPct: report.audioRecording.noiseReducedPct,
            },
            service: report.service,
            alerts: report.alerts,
            features: report.features,
            facial: {
              totalFacesScanned: report.facialExpression.totalFacesScanned,
              uniqueIndividuals: report.facialExpression.uniqueIndividuals,
              vipRecognitions: report.facialExpression.vipRecognitions,
              unknownFaces: report.facialExpression.unknownFaces,
              avgConfidencePct: report.facialExpression.avgConfidencePct,
              happy: report.facialExpression.expressionHappy,
              neutral: report.facialExpression.expressionNeutral,
              angry: report.facialExpression.expressionAngry,
              surprised: report.facialExpression.expressionSurprised,
              fearful: report.facialExpression.expressionFearful,
            },
            uptime: report.uptime,
          })}
          className="ml-auto flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
        >
          <Download size={13} /> Export PDF
        </button>
      </div>

      {/* Summary banner */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-cyan-950/30 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Selected Center</p>
            <p className="text-2xl font-bold text-cyan-200">Center {String(selectedId).padStart(2, '0')}</p>
            <p className="text-xs text-slate-400">{period} Report ({pLabel}) · Falcon Security Network</p>
          </div>
          {[
            { label: 'Footfall', value: report.attendance.totalFootfall.toLocaleString(), icon: <Users size={13} />, color: 'text-cyan-300' },
            { label: 'Tickets', value: report.service.ticketsServed.toLocaleString(), icon: <ClipboardList size={13} />, color: 'text-amber-300' },
            { label: 'Faces Scanned', value: report.facialExpression.totalFacesScanned.toLocaleString(), icon: <ScanFace size={13} />, color: 'text-pink-300' },
            { label: 'Video Clips', value: report.videoRecording.clipsRecorded.toLocaleString(), icon: <Film size={13} />, color: 'text-violet-300' },
            { label: 'Uptime', value: `${report.uptime.uptimePct}%`, icon: <Activity size={13} />, color: 'text-green-400' },
            { label: 'Alerts', value: totalAlerts, icon: <Siren size={13} />, color: 'text-red-300' },
            { label: 'Satisfaction', value: `${report.service.satisfactionScore}/100`, icon: <Smile size={13} />, color: 'text-cyan-300' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-center">
              <div className={`flex items-center justify-center gap-1 text-[10px] mb-1 ${stat.color}`}>{stat.icon}<span>{stat.label}</span></div>
              <p className="text-lg font-bold text-slate-100">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6-card grid */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Footage */}
        <ReportCard title="Footage & Camera Records" icon={<Video size={15} />} accent="cyan">
          <StatRow label="Motion Events Detected" value={report.footage.motionEvents.toLocaleString()} />
          <StatRow label="AI Threat Detections" value={report.footage.threatDetections} />
          <StatRow label="Anti-Tamper Alerts" value={report.footage.tamperAttempts} />
          <StatRow label="AI Vision Detections" value={report.footage.aiDetections.toLocaleString()} />
          <StatRow label="Total Footage Recorded" value={`${report.footage.recordedHrs}h`} />
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Camera Uptime</p>
            <MiniBar value={report.footage.cameraUptime} max={100} color="bg-cyan-400" />
          </div>
          <div className="mt-3 rounded-xl border border-cyan-500/15 bg-slate-950/50 p-3">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-cyan-400/70 mb-2"><Film size={11} /> Video Recording Log</p>
            <StatRow label="Clips Recorded" value={report.videoRecording.clipsRecorded.toLocaleString()} />
            <StatRow label="Continuous Recording" value={`${report.videoRecording.continuousRecordingHrs}h`} />
            <StatRow label="Storage Used" value={`${report.videoRecording.storageGB} GB`} />
            <StatRow label="Avg Resolution" value={report.videoRecording.avgResolution} />
            <StatRow label="Corrupted Clips" value={report.videoRecording.corruptedClips} />
            <div className="pt-1.5">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Cloud Backup Progress</p>
              <MiniBar value={report.videoRecording.cloudBackupPct} max={100} color={report.videoRecording.cloudBackupPct > 95 ? 'bg-cyan-400' : 'bg-amber-400'} />
            </div>
          </div>
        </ReportCard>

        {/* Attendance */}
        <ReportCard title="Attendance & Footfall" icon={<Users size={15} />} accent="amber">
          <StatRow label="Total Footfall" value={report.attendance.totalFootfall.toLocaleString()} sub="visitors" />
          <StatRow label="Peak Hour" value={report.attendance.peakHour} />
          <StatRow label="Avg Queue Size" value={report.attendance.avgQueueSize} sub="ppl" />
          <StatRow label="Peak Queue Size" value={report.attendance.peakQueueSize} sub="ppl" />
          <StatRow label="Walk-Out Without Service" value={report.attendance.walkOutWithoutService} />
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Queue Load vs Capacity</p>
            <MiniBar value={report.attendance.avgQueueSize} max={20} color={report.attendance.avgQueueSize > 14 ? 'bg-red-500' : report.attendance.avgQueueSize > 8 ? 'bg-amber-400' : 'bg-cyan-400'} />
          </div>
        </ReportCard>

        {/* Voice & Audio */}
        <ReportCard title="Voice & Audio Records" icon={<Headphones size={15} />} accent="violet">
          <StatRow label="Speech Interactions" value={report.voice.speechInteractions.toLocaleString()} />
          <StatRow label="Flagged Conversations" value={report.voice.flaggedConversations} />
          <StatRow label="Avg Noise Level" value={`${report.voice.avgNoiseLevelDb} dB`} />
          <StatRow label="Peak Noise Level" value={`${report.voice.peakNoiseLevelDb} dB`} />
          <div className="pt-2 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Customer Sentiment Breakdown</p>
            {[
              { label: 'Positive', pct: report.voice.sentimentHappy, color: 'bg-cyan-400' },
              { label: 'Neutral', pct: report.voice.sentimentNeutral, color: 'bg-slate-400' },
              { label: 'Negative', pct: report.voice.sentimentAngry, color: 'bg-red-400' },
            ].map(({ label, pct, color }) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span className="w-16 text-slate-400">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-700"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div>
                <span className="w-8 text-right text-slate-400">{pct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-violet-500/15 bg-slate-950/50 p-3">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-violet-400/70 mb-2"><Mic2 size={11} /> Audio Recording Log</p>
            <StatRow label="Recordings Captured" value={report.audioRecording.capturedCount.toLocaleString()} />
            <StatRow label="Total Audio Duration" value={`${report.audioRecording.totalDurationHrs}h`} />
            <StatRow label="Storage Used" value={`${report.audioRecording.storageMB} MB`} />
            <StatRow label="Flagged Recordings" value={report.audioRecording.flaggedCount} />
            <StatRow label="Avg Bitrate" value={`${report.audioRecording.avgBitrateKbps} kbps`} />
            <div className="pt-1.5">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Noise Reduction Applied</p>
              <MiniBar value={report.audioRecording.noiseReducedPct} max={100} color="bg-violet-400" />
            </div>
          </div>
        </ReportCard>

        {/* Service Records */}
        <ReportCard title="Service Records" icon={<ClipboardList size={15} />} accent="green">
          <StatRow label="Tickets Served" value={report.service.ticketsServed.toLocaleString()} />
          <StatRow label="Tickets Abandoned" value={report.service.ticketsAbandoned} />
          <StatRow label="Avg Wait Time" value={`${report.service.avgWaitMin} min`} />
          <StatRow label="Avg Service Duration" value={`${report.service.avgServiceMin} min`} />
          <StatRow label="Customer Satisfaction" value={`${report.service.satisfactionScore}/100`} />
          <div className="pt-2 space-y-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Service Efficiency</p>
              <MiniBar value={report.service.serviceEfficiency} max={100} color={report.service.serviceEfficiency > 90 ? 'bg-cyan-400' : report.service.serviceEfficiency > 80 ? 'bg-amber-400' : 'bg-red-400'} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Counter Utilisation</p>
              <MiniBar value={report.service.counterUtilisation} max={100} color="bg-green-400" />
            </div>
          </div>
        </ReportCard>

        {/* Alert History */}
        <ReportCard title="Alert History" icon={<Siren size={15} />} accent="red">
          <div className="grid grid-cols-3 gap-3 py-2">
            {[
              { label: 'Critical', value: report.alerts.critical, cls: 'border-red-500/30 bg-red-500/10', txt: 'text-red-300' },
              { label: 'Warning', value: report.alerts.warning, cls: 'border-amber-400/30 bg-amber-400/10', txt: 'text-amber-200' },
              { label: 'Info', value: report.alerts.info, cls: 'border-cyan-400/30 bg-cyan-400/10', txt: 'text-cyan-200' },
            ].map(({ label, value, cls, txt }) => (
              <div key={label} className={`rounded-xl border p-3 text-center ${cls}`}>
                <p className={`text-2xl font-bold ${txt}`}>{value}</p>
                <p className={`text-[10px] uppercase tracking-wider ${txt} opacity-80`}>{label}</p>
              </div>
            ))}
          </div>
          <StatRow label="Most Frequent Alert" value={report.alerts.topAlert} />
          <StatRow label="Total Alert Events" value={totalAlerts} />
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Severity Distribution</p>
            <div className="h-3 w-full rounded-full overflow-hidden flex">
              <div className="bg-red-500" style={{ width: `${Math.round((report.alerts.critical / (totalAlerts || 1)) * 100)}%` }} />
              <div className="bg-amber-400" style={{ width: `${Math.round((report.alerts.warning / (totalAlerts || 1)) * 100)}%` }} />
              <div className="bg-cyan-400" style={{ width: `${Math.round((report.alerts.info / (totalAlerts || 1)) * 100)}%` }} />
            </div>
            <div className="flex gap-4 mt-1.5 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-500" />Critical</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-400" />Warning</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />Info</span>
            </div>
          </div>
        </ReportCard>

        {/* AI Feature Status */}
        <ReportCard title="AI Feature Status" icon={<Bot size={15} />} accent="cyan">
          <div className="grid grid-cols-3 gap-3 py-2">
            {[
              { label: 'Active', value: report.features.active, cls: 'border-cyan-400/30 bg-cyan-400/10', txt: 'text-cyan-200' },
              { label: 'Degraded', value: report.features.degraded, cls: 'border-amber-400/30 bg-amber-400/10', txt: 'text-amber-200' },
              { label: 'Offline', value: 20 - report.features.active - report.features.degraded, cls: 'border-red-500/30 bg-red-500/10', txt: 'text-red-300' },
            ].map(({ label, value, cls, txt }) => (
              <div key={label} className={`rounded-xl border p-3 text-center ${cls}`}>
                <p className={`text-2xl font-bold ${txt}`}>{value}</p>
                <p className={`text-[10px] uppercase tracking-wider ${txt} opacity-80`}>{label}</p>
              </div>
            ))}
          </div>
          <StatRow label="AI Features Total" value="20 modules" />
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Overall AI Health Score</p>
            <MiniBar value={report.features.healthPct} max={100} color={report.features.healthPct > 95 ? 'bg-cyan-400' : report.features.healthPct > 88 ? 'bg-amber-400' : 'bg-red-400'} />
          </div>
          <div className="pt-2 grid grid-cols-2 gap-1 text-[10px]">
            {['Vision AI', 'WiFi DensePose', 'Threat Detect', 'Sentiment AI', 'Health Monitor', 'Speech Engine'].map((f, idx) => (
              <div key={f} className="flex items-center gap-1.5">
                <span className={`status-dot ${idx < report.features.degraded ? 'bg-amber-400' : 'bg-cyan-300'}`} />
                <span className="text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      {/* Facial Expression Analysis full-width */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-pink-300"><ScanFace size={15} /> Facial Expression Analysis</h3>
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6 mb-5">
          {[
            { label: 'Faces Scanned', value: report.facialExpression.totalFacesScanned.toLocaleString(), sub: 'total', color: 'text-pink-300' },
            { label: 'Unique Individuals', value: report.facialExpression.uniqueIndividuals.toLocaleString(), sub: 'identified', color: 'text-cyan-300' },
            { label: 'VIP Recognitions', value: report.facialExpression.vipRecognitions, sub: 'loyalty members', color: 'text-amber-300' },
            { label: 'Unknown Faces', value: report.facialExpression.unknownFaces, sub: 'unregistered', color: 'text-red-300' },
            { label: 'Mask Wearing', value: report.facialExpression.maskWearing, sub: 'detected', color: 'text-slate-300' },
            { label: 'AI Confidence', value: `${report.facialExpression.avgConfidencePct}%`, sub: 'avg accuracy', color: 'text-cyan-300' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
              <p className={`text-[10px] uppercase tracking-wider mb-1 ${color} opacity-70`}>{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">Expression Breakdown (%)</p>
            <div className="space-y-2.5">
              {[
                { label: 'Happy 😊', pct: report.facialExpression.expressionHappy, color: 'bg-cyan-400' },
                { label: 'Neutral 😐', pct: report.facialExpression.expressionNeutral, color: 'bg-slate-400' },
                { label: 'Angry 😠', pct: report.facialExpression.expressionAngry, color: 'bg-red-400' },
                { label: 'Surprised 😮', pct: report.facialExpression.expressionSurprised, color: 'bg-amber-400' },
                { label: 'Fearful 😨', pct: report.facialExpression.expressionFearful, color: 'bg-purple-400' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className="w-28 text-slate-300">{label}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-700"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div>
                  <span className="w-8 text-right text-slate-400">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">Live Expression Event Log</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {Array.from({ length: 10 }, (_, i) => {
                const rng3 = seededRand(selectedId * 41 + i * 19 + (period === 'Daily' ? 0 : period === 'Weekly' ? 300 : 600));
                const rv = () => Math.floor(rng3() * 100);
                const expressions = ['Happy', 'Neutral', 'Angry', 'Surprised', 'Fearful'];
                const expr = expressions[rv() % 5] ?? 'Neutral';
                const conf = 85 + (rv() % 15);
                const hour = String(7 + (rv() % 12)).padStart(2, '0');
                const mins = String(rv() % 60).padStart(2, '0');
                const colorMap: Record<string, string> = { Happy: 'text-cyan-300', Neutral: 'text-slate-300', Angry: 'text-red-300', Surprised: 'text-amber-300', Fearful: 'text-purple-300' };
                const dotMap: Record<string, string> = { Happy: 'bg-cyan-400', Neutral: 'bg-slate-500', Angry: 'bg-red-400', Surprised: 'bg-amber-400', Fearful: 'bg-purple-400' };
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-1.5 text-[11px]">
                    <span className="text-slate-500 font-mono w-12">{hour}:{mins}</span>
                    <span className="flex items-center gap-1.5">
                      <span className={`status-dot ${dotMap[expr] ?? 'bg-slate-500'}`} />
                      <span className={`font-medium ${colorMap[expr] ?? 'text-slate-300'}`}>{expr}</span>
                    </span>
                    <span className="text-slate-400">Conf {conf}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Uptime full-width */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-300"><Activity size={15} /> System Uptime &amp; Reliability</h3>
        <div className="grid gap-4 sm:grid-cols-4 mb-4">
          {[
            { label: 'Uptime', value: `${report.uptime.uptimePct}%`, sub: 'availability', color: report.uptime.uptimePct > 99 ? 'text-cyan-300' : report.uptime.uptimePct > 95 ? 'text-amber-300' : 'text-red-300' },
            { label: 'Incidents', value: report.uptime.incidentCount, sub: `this ${period.toLowerCase()}`, color: report.uptime.incidentCount === 0 ? 'text-cyan-300' : report.uptime.incidentCount < 3 ? 'text-amber-300' : 'text-red-300' },
            { label: 'Longest Downtime', value: `${report.uptime.longestDowntimeMin}m`, sub: 'single incident', color: report.uptime.longestDowntimeMin < 15 ? 'text-cyan-300' : 'text-amber-300' },
            { label: 'SLA Target', value: report.uptime.uptimePct >= 99 ? 'Met ✓' : 'At Risk', sub: '99% SLA', color: report.uptime.uptimePct >= 99 ? 'text-cyan-300' : 'text-red-300' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Uptime Timeline ({pLabel} blocks — <span className="text-cyan-400">cyan = online</span>, <span className="text-red-400">red = incident</span>)</p>
        <div className="flex gap-0.5">
          {Array.from({ length: period === 'Daily' ? 24 : period === 'Weekly' ? 7 : 30 }, (_, i) => {
            const rng2 = seededRand(selectedId * 13 + i * 7 + (period === 'Daily' ? 0 : period === 'Weekly' ? 500 : 1000));
            const up = rng2() > 0.05;
            const lbl = period === 'Daily' ? `${String(i).padStart(2, '0')}:00` : period === 'Weekly' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `Day ${i + 1}`;
            return <div key={i} title={lbl} className={`flex-1 rounded-sm cursor-default transition ${up ? 'bg-cyan-400/70 hover:bg-cyan-400' : 'bg-red-500/70 hover:bg-red-500'}`} style={{ height: 28 }} />;
          })}
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 mt-1">
          <span>{period === 'Daily' ? '00:00' : period === 'Weekly' ? 'Mon' : 'Day 1'}</span>
          <span>{period === 'Daily' ? '23:00' : period === 'Weekly' ? 'Sun' : 'Day 30'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Media Vault Page ────────────────────────────────────────────────────────
const ALL_MEDIA = Array.from({ length: 240 }, (_, i) => {
  const rng = seededRand((i + 1) * 2311);
  const r = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  const type: 'video' | 'audio' = i % 3 === 2 ? 'audio' : 'video';
  const centerId = r(1, 105);
  const day = r(1, 25);
  const month = r(1, 3);
  const hour = String(r(7, 19)).padStart(2, '0');
  const min = String(r(0, 59)).padStart(2, '0');
  const resolutions = ['720p', '1080p', '1080p', '4K'];
  const bitrateKbps = [128, 192, 256, 320];
  const flagged = r(0, 10) > 8;
  const sentiments = ['Positive', 'Neutral', 'Negative'];
  return {
    id: `MV-${String(10000 + i).slice(1)}`,
    type,
    centerId,
    date: `2026-0${month}-${String(day).padStart(2, '0')}`,
    time: `${hour}:${min}`,
    durationSec: type === 'video' ? r(30, 300) : r(10, 120),
    sizeGB: type === 'video' ? (r(10, 80) / 10).toFixed(1) : undefined,
    sizeMB: type === 'audio' ? r(5, 80) : undefined,
    resolution: type === 'video' ? resolutions[r(0, 3)] : undefined,
    bitrateKbps: type === 'audio' ? bitrateKbps[r(0, 3)] : undefined,
    flagged,
    sentiment: type === 'audio' ? sentiments[r(0, 2)] : undefined,
    camera: type === 'video' ? `CAM-${r(1, 8)}` : undefined,
    noiseDb: type === 'audio' ? r(38, 85) : undefined,
    backupStatus: r(0, 10) > 2 ? 'Backed Up' : 'Pending',
  };
});

function MediaVaultPage() {
  const [tab, setTab] = useState<'all' | 'video' | 'audio' | 'text'>('all');
  const [centerFilter, setCenterFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Text file uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [txtFiles, setTxtFiles] = useState<Array<{ id: number; name: string; size: number; date: string; content: string; preview: string }>>([]);
  const [viewingFile, setViewingFile] = useState<null | number>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.name.endsWith('.txt') && file.type !== 'text/plain') return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) ?? '';
        setTxtFiles((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            date: new Date().toLocaleDateString('en-GB'),
            content,
            preview: content.slice(0, 120).replace(/\n/g, ' '),
          },
        ]);
      };
      reader.readAsText(file);
    });
  };

  const filtered = useMemo(() => {
    return ALL_MEDIA.filter((m) => {
      if (tab !== 'all' && m.type !== tab) return false;
      if (centerFilter && !String(m.centerId).includes(centerFilter)) return false;
      if (dateFilter && !m.date.includes(dateFilter)) return false;
      if (flaggedOnly && !m.flagged) return false;
      return true;
    });
  }, [tab, centerFilter, dateFilter, flaggedOnly]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const videoCount = ALL_MEDIA.filter((m) => m.type === 'video').length;
  const audioCount = ALL_MEDIA.filter((m) => m.type === 'audio').length;
  const flaggedCount = ALL_MEDIA.filter((m) => m.flagged).length;
  const totalVideoGB = ALL_MEDIA.filter((m) => m.type === 'video').reduce((s, m) => s + Number(m.sizeGB ?? 0), 0).toFixed(1);
  const totalAudioMB = ALL_MEDIA.filter((m) => m.type === 'audio').reduce((s, m) => s + Number(m.sizeMB ?? 0), 0);

  const sentColor: Record<string, string> = { Positive: 'text-cyan-300', Neutral: 'text-slate-300', Negative: 'text-red-300' };

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total Recordings', value: ALL_MEDIA.length, icon: <LibraryBig size={15} />, color: 'text-cyan-300' },
          { label: 'Video Clips', value: videoCount, icon: <Film size={15} />, color: 'text-violet-300' },
          { label: 'Audio Logs', value: audioCount, icon: <Mic2 size={15} />, color: 'text-violet-300' },
          { label: 'Flagged', value: flaggedCount, icon: <CircleAlert size={15} />, color: 'text-red-300' },
          { label: 'Storage Used', value: `${totalVideoGB} GB · ${totalAudioMB} MB`, icon: <HardDrive size={15} />, color: 'text-amber-300' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className={`mb-1 flex items-center gap-2 text-xs uppercase tracking-wider ${color} opacity-70`}>{icon} {label}</div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
        {/* Type tabs */}
        <div className="flex rounded-xl border border-slate-700 bg-slate-950/70 p-1">
          {(['all', 'video', 'audio'] as const).map((t) => (
            <button key={t} type="button" onClick={() => { setTab(t); setPage(1); }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                tab === t ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400 hover:text-slate-200'
              }`}>
              {t === 'video' ? <Film size={12} /> : t === 'audio' ? <Mic2 size={12} /> : <LibraryBig size={12} />}
              {t === 'all' ? 'All Media' : t === 'video' ? 'Video' : 'Audio'}
            </button>
          ))}
          <button type="button" onClick={() => { setTab('text'); setPage(1); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              tab === 'text' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400 hover:text-slate-200'
            }`}>
            <FileText size={12} /> Text Files
          </button>
        </div>
        {/* Center filter */}
        <div className="relative">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={centerFilter} onChange={(e) => { setCenterFilter(e.target.value); setPage(1); }}
            placeholder="Center #" className="w-24 rounded-xl border border-slate-700 bg-slate-950/70 py-2 pl-8 pr-3 text-xs outline-none focus:border-cyan-400" />
        </div>
        {/* Date filter */}
        <div className="relative">
          <CalendarDays size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            placeholder="Date (e.g. 2026-03)" className="w-44 rounded-xl border border-slate-700 bg-slate-950/70 py-2 pl-8 pr-3 text-xs outline-none focus:border-cyan-400" />
        </div>
        {/* Flagged toggle */}
        <button type="button" onClick={() => { setFlaggedOnly(!flaggedOnly); setPage(1); }}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition ${
            flaggedOnly ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-red-400/40'
          }`}>
          <Filter size={12} /> Flagged Only
        </button>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} records</span>
        <button
          type="button"
          onClick={() => exportMediaVaultPDF(
            filtered,
            `${tab === 'all' ? 'All Media' : tab === 'video' ? 'Video' : 'Audio'}${
              centerFilter ? ` · Center ${centerFilter}` : ''
            }${dateFilter ? ` · ${dateFilter}` : ''}${flaggedOnly ? ' · Flagged Only' : ''}`
          )}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
        >
          <Download size={13} /> Export PDF
        </button>
      </div>

      {/* Table — hidden when Text Files tab active */}
      {tab !== 'text' && (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-400">
          <span className="col-span-1">Type</span>
          <span className="col-span-1">ID</span>
          <span className="col-span-1">Center</span>
          <span className="col-span-2">Date &amp; Time</span>
          <span className="col-span-1">Duration</span>
          <span className="col-span-1">Size</span>
          <span className="col-span-1">Quality</span>
          <span className="col-span-1">Sentiment / dB</span>
          <span className="col-span-1">Backup</span>
          <span className="col-span-1">Flag</span>
          <span className="col-span-1">Action</span>
        </div>
        {/* Rows */}
        <div className="divide-y divide-slate-800/60">
          {pageItems.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-slate-500">No recordings match the current filters.</div>
          )}
          {pageItems.map((m) => (
            <div key={m.id} className={`grid grid-cols-12 gap-2 items-center px-4 py-3 text-xs transition hover:bg-slate-800/30 ${
              m.flagged ? 'border-l-2 border-red-500/50' : ''
            }`}>
              {/* Type icon */}
              <div className="col-span-1">
                {m.type === 'video'
                  ? <span className="flex items-center gap-1 text-violet-300"><Film size={13} /> Vid</span>
                  : <span className="flex items-center gap-1 text-violet-300"><Volume2 size={13} /> Aud</span>}
              </div>
              {/* ID */}
              <span className="col-span-1 font-mono text-slate-300">{m.id}</span>
              {/* Center */}
              <span className="col-span-1 text-slate-200">C-{String(m.centerId).padStart(2, '0')}</span>
              {/* Date & time */}
              <span className="col-span-2 text-slate-300">{m.date} {m.time}</span>
              {/* Duration */}
              <span className="col-span-1 text-slate-300">
                {m.durationSec >= 60 ? `${Math.floor(m.durationSec / 60)}m ${m.durationSec % 60}s` : `${m.durationSec}s`}
              </span>
              {/* Size */}
              <span className="col-span-1 text-slate-400">
                {m.type === 'video' ? `${m.sizeGB} GB` : `${m.sizeMB} MB`}
              </span>
              {/* Quality */}
              <span className="col-span-1 text-slate-400">
                {m.type === 'video' ? m.resolution : `${m.bitrateKbps} kbps`}
              </span>
              {/* Sentiment / dB */}
              <span className={`col-span-1 ${m.type === 'audio' ? (sentColor[m.sentiment ?? ''] ?? 'text-slate-300') : 'text-slate-600'}`}>
                {m.type === 'audio' ? `${m.sentiment} · ${m.noiseDb}dB` : `Cam ${m.camera}`}
              </span>
              {/* Backup */}
              <span className={`col-span-1 ${m.backupStatus === 'Backed Up' ? 'text-cyan-400' : 'text-amber-400'}`}>
                {m.backupStatus === 'Backed Up' ? '✓' : '⏳'} {m.backupStatus}
              </span>
              {/* Flag */}
              <span className="col-span-1">
                {m.flagged
                  ? <span className="rounded-full bg-red-500/20 border border-red-500/30 px-1.5 py-0.5 text-[10px] text-red-300">⚠ Flag</span>
                  : <span className="text-slate-600">—</span>}
              </span>
              {/* Action */}
              <div className="col-span-1">
                <button type="button" className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 text-[11px] text-cyan-300 hover:bg-cyan-500/20 transition">
                  <PlayCircle size={11} /> Play
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-4 py-2">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400/40 disabled:opacity-30">
                ← Prev
              </button>
              <button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400/40 disabled:opacity-30">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Text File Upload Panel */}
      {tab === 'text' && (
        <div className="space-y-4">
          {/* Drop / upload zone */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-400/30 bg-cyan-500/5 p-10 text-center transition hover:border-cyan-400/50 hover:bg-cyan-500/8 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
          >
            <UploadCloud size={36} className="mb-3 text-cyan-400/60" />
            <p className="text-sm font-medium text-slate-300">Drop .txt files here, or click to browse</p>
            <p className="mt-1 text-xs text-slate-500">Only plain text (.txt) files are accepted</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>

          {/* File list */}
          {txtFiles.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  <FileText size={14} /> Uploaded Text Files
                  <span className="ml-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300">{txtFiles.length}</span>
                </h3>
                <button type="button" onClick={() => { setTxtFiles([]); setViewingFile(null); }} className="text-xs text-slate-500 transition hover:text-red-300">Remove all</button>
              </div>
              <div className="divide-y divide-slate-800/60">
                {txtFiles.map((f) => (
                  <div key={f.id} className="group flex items-start gap-4 px-4 py-3 text-xs hover:bg-slate-800/30 transition">
                    <FileText size={20} className="mt-0.5 shrink-0 text-cyan-400/60" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 truncate">{f.name}</p>
                      <p className="mt-0.5 text-slate-400 truncate italic">{f.preview}{f.content.length > 120 ? '...' : ''}</p>
                      <p className="mt-1 text-slate-500">{(f.size / 1024).toFixed(1)} KB &middot; Added {f.date}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewingFile(viewingFile === f.id ? null : f.id)}
                        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        {viewingFile === f.id ? 'Close' : 'View'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setTxtFiles((prev) => prev.filter((x) => x.id !== f.id)); if (viewingFile === f.id) setViewingFile(null); }}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-400 transition hover:border-red-400/50 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {/* Inline viewer */}
                {viewingFile !== null && (() => {
                  const f = txtFiles.find((x) => x.id === viewingFile);
                  if (!f) return null;
                  return (
                    <div className="border-t border-slate-700 bg-slate-950/60 px-4 py-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">{f.name} — Contents</p>
                      <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-xs text-slate-300 font-mono leading-relaxed">{f.content}</pre>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {txtFiles.length === 0 && (
            <p className="text-center text-xs text-slate-500">No text files uploaded yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
const AGENT_CUSTOMERS = Array.from({ length: 60 }, (_, i) => {
  const rng = seededRand((i + 1) * 3571);
  const r = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  const firstNames = ['Aisha','Mohammed','Sara','Omar','Fatima','Khalid','Lina','Hassan','Nora','Tariq','Reem','Faisal','Hana','Yousuf','Dana','Abdulrahman','Maya','Ibrahim','Layla','Saad'];
  const lastNames = ['Al-Rashid','Al-Mansouri','Al-Farsi','Al-Jabri','Al-Sayed','Al-Hassan','Al-Khalidi','Al-Nasser','Al-Zahrani','Al-Otaibi'];
  const centers = r(1, 105);
  const expressions = ['Happy','Neutral','Angry','Surprised','Fearful'];
  const expr = expressions[r(0,4)] ?? 'Neutral';
  const genders = ['Male','Female'];
  const ages = r(18, 72);
  return {
    id: `FCL-${String(10000 + i).slice(1)}`,
    name: `${firstNames[r(0, firstNames.length - 1)]} ${lastNames[r(0, lastNames.length - 1)]}`,
    age: ages,
    gender: genders[r(0,1)],
    centerId: centers,
    visitCount: r(1, 48),
    lastSeen: `${String(r(7,18)).padStart(2,'0')}:${String(r(0,59)).padStart(2,'0')}`,
    lastExpression: expr,
    expressionConf: r(85,99),
    audioCount: r(1, 12),
    videoCount: r(1, 8),
    flagged: r(0, 3) > 1,
    vip: r(0, 10) > 8,
    maskWearing: r(0, 5) > 4,
    avatarHue: r(0, 360),
  };
});

type Customer = typeof AGENT_CUSTOMERS[0];

function AgentSearchPage() {
  const [query, setQuery] = useState('');
  const [imageSearchActive, setImageSearchActive] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'video' | 'audio' | 'face'>('profile');

  const results = useMemo(() => {
    if (!query && !imageSearchActive) return [];
    const q = query.toLowerCase();
    return AGENT_CUSTOMERS.filter((c) =>
      !query ||
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      String(c.centerId).includes(q) ||
      String(c.age).includes(q) ||
      c.gender.toLowerCase().includes(q)
    );
  }, [query, imageSearchActive]);

  const exprColor: Record<string, string> = { Happy: 'text-cyan-300', Neutral: 'text-slate-300', Angry: 'text-red-300', Surprised: 'text-amber-300', Fearful: 'text-purple-300' };
  const exprDot: Record<string, string> = { Happy: 'bg-cyan-400', Neutral: 'bg-slate-500', Angry: 'bg-red-400', Surprised: 'bg-amber-400', Fearful: 'bg-purple-400' };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-200"><FolderSearch size={15} /> Agent Customer Search</h3>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-60">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setImageSearchActive(false); setSelected(null); }}
              placeholder="Search by name, ID (FCL-XXXX), center #, age, gender..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          <button
            type="button"
            onClick={() => { setImageSearchActive(!imageSearchActive); setQuery(''); setSelected(null); }}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
              imageSearchActive ? 'border-pink-400/50 bg-pink-500/10 text-pink-200' : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-pink-400/40'
            }`}
          >
            <ScanFace size={15} /> Image / Face Search
          </button>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300"><IdCard size={13} /> By ID</span>
            <span className="flex items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300"><Contact size={13} /> By Name</span>
            <span className="flex items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300"><ScanFace size={13} /> By Face</span>
          </div>
        </div>
        {imageSearchActive && (
          <div className="mt-3 flex items-center justify-center rounded-xl border-2 border-dashed border-pink-400/30 bg-pink-500/5 p-8 text-center">
            <div>
              <UploadCloud size={32} className="mx-auto mb-2 text-pink-400/60" />
              <p className="text-sm text-slate-300">Drop a customer photo here or click to upload</p>
              <p className="text-xs text-slate-500 mt-1">AI facial recognition will match against all 105 centers</p>
              <button type="button" onClick={() => { setImageSearchActive(false); setResults_demo(); }} className="mt-3 rounded-xl bg-pink-500/20 border border-pink-400/30 px-4 py-2 text-xs text-pink-200 hover:bg-pink-500/30 transition">Simulate Match</button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        {/* Results list */}
        <div className={`space-y-2 ${selected ? 'xl:col-span-4' : 'xl:col-span-12'}`}>
          {results.length === 0 && !imageSearchActive && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
              <FolderSearch size={36} className="mx-auto mb-3 text-slate-600" />
              <p className="text-slate-400 text-sm">Enter a name, ID, center number, or upload an image to search customers</p>
            </div>
          )}
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { setSelected(c); setActiveTab('profile'); }}
              className={`w-full text-left rounded-2xl border p-3 transition hover:border-cyan-400/40 ${
                selected?.id === c.id ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: `hsl(${c.avatarHue}, 55%, 38%)` }}>
                  {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-100 truncate">{c.name}</p>
                    {c.vip && <span className="shrink-0 rounded-full bg-amber-400/20 border border-amber-400/30 px-1.5 text-[10px] text-amber-200">VIP</span>}
                    {c.flagged && <span className="shrink-0 rounded-full bg-red-500/20 border border-red-500/30 px-1.5 text-[10px] text-red-300">Flagged</span>}
                  </div>
                  <p className="text-xs text-slate-400">{c.id} · Center {String(c.centerId).padStart(2,'0')} · {c.age}y {c.gender}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-xs font-medium ${exprColor[c.lastExpression] ?? 'text-slate-300'}`}>{c.lastExpression}</p>
                  <p className="text-[10px] text-slate-500">{c.lastSeen}</p>
                </div>
                <ChevronRight size={14} className="shrink-0 text-slate-600" />
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="xl:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
            {/* Profile header */}
            <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950/80 to-cyan-950/30 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg" style={{ background: `hsl(${selected.avatarHue}, 55%, 38%)` }}>
                  {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-100">{selected.name}</h3>
                    {selected.vip && <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-xs text-amber-200">⭐ VIP</span>}
                    {selected.flagged && <span className="rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-xs text-red-300">⚠ Flagged</span>}
                  </div>
                  <p className="text-sm text-slate-400">{selected.id} · {selected.gender} · Age {selected.age} · Center {String(selected.centerId).padStart(2,'0')}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-300"><Film size={12} className="text-violet-300" /> {selected.videoCount} video clips</span>
                    <span className="flex items-center gap-1 text-slate-300"><Mic2 size={12} className="text-violet-300" /> {selected.audioCount} audio logs</span>
                    <span className="flex items-center gap-1 text-slate-300"><MapPin size={12} className="text-cyan-300" /> {selected.visitCount} visits</span>
                    <span className={`flex items-center gap-1 ${exprColor[selected.lastExpression] ?? 'text-slate-300'}`}>
                      <span className={`status-dot ${exprDot[selected.lastExpression] ?? 'bg-slate-500'}`} /> {selected.lastExpression} ({selected.expressionConf}%)
                    </span>
                  </div>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300 text-xl leading-none">✕</button>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              {([['profile','Profile','👤'],['video','Video Recordings','🎬'],['audio','Audio Logs','🎙️'],['face','Facial Expressions','😊']] as const).map(([tab, label, emoji]) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition ${
                    activeTab === tab ? 'border-cyan-400 text-cyan-200' : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}>
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
            {/* Tab content */}
            <div className="p-5">
              {activeTab === 'profile' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-0 rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
                    <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-cyan-400/70 border-b border-slate-800">Personal Info</p>
                    {[
                      ['Full Name', selected.name],
                      ['Customer ID', selected.id],
                      ['Age', selected.age],
                      ['Gender', selected.gender],
                      ['Status', selected.vip ? '⭐ VIP Member' : 'Standard'],
                      ['Flagged', selected.flagged ? '⚠ Yes — review required' : 'No'],
                      ['Mask Wearing', selected.maskWearing ? 'Yes' : 'No'],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="flex justify-between px-4 py-2 text-xs border-b border-slate-800/50 last:border-0">
                        <span className="text-slate-400">{k}</span>
                        <span className="text-slate-100 font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-0 rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
                    <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-cyan-400/70 border-b border-slate-800">Visit & Activity</p>
                    {[
                      ['Assigned Center', `Center ${String(selected.centerId).padStart(2,'0')}`],
                      ['Total Visits', selected.visitCount],
                      ['Last Seen', selected.lastSeen],
                      ['Video Clips', selected.videoCount],
                      ['Audio Logs', selected.audioCount],
                      ['Last Expression', selected.lastExpression],
                      ['AI Confidence', `${selected.expressionConf}%`],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="flex justify-between px-4 py-2 text-xs border-b border-slate-800/50 last:border-0">
                        <span className="text-slate-400">{k}</span>
                        <span className="text-slate-100 font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'video' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 mb-3">{selected.videoCount} recorded video clips — Center {String(selected.centerId).padStart(2,'0')}</p>
                  {Array.from({ length: selected.videoCount }, (_, i) => {
                    const rng4 = seededRand(selected.avatarHue * 13 + i * 71);
                    const rv4 = () => Math.floor(rng4() * 100);
                    const dur = 30 + rv4() % 180;
                    const h = String(7 + rv4() % 12).padStart(2,'0');
                    const m = String(rv4() % 60).padStart(2,'0');
                    const res = ['720p','1080p','1080p','4K'][rv4() % 4];
                    const flags = rv4() % 10 > 7;
                    return (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                        <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                          <Film size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-200">Clip #{String(i+1).padStart(2,'0')} — {h}:{m}</p>
                          <p className="text-[11px] text-slate-500">{res} · {dur}s duration · Center {String(selected.centerId).padStart(2,'0')}</p>
                        </div>
                        {flags && <span className="shrink-0 rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-[10px] text-red-300">Flagged</span>}
                        <button type="button" className="shrink-0 flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/20 transition">
                          <PlayCircle size={13} /> Play
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {activeTab === 'audio' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 mb-3">{selected.audioCount} audio recordings — Center {String(selected.centerId).padStart(2,'0')}</p>
                  {Array.from({ length: selected.audioCount }, (_, i) => {
                    const rng5 = seededRand(selected.avatarHue * 7 + i * 53);
                    const rv5 = () => Math.floor(rng5() * 100);
                    const dur = 10 + rv5() % 120;
                    const h = String(7 + rv5() % 12).padStart(2,'0');
                    const m = String(rv5() % 60).padStart(2,'0');
                    const noise = 40 + rv5() % 40;
                    const flagged = rv5() % 10 > 7;
                    const sentiments = ['Positive','Neutral','Negative'];
                    const sent = sentiments[rv5() % 3] ?? 'Neutral';
                    const sentColor: Record<string,string> = { Positive: 'text-cyan-300', Neutral: 'text-slate-300', Negative: 'text-red-300' };
                    return (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                          <Volume2 size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-200">Recording #{String(i+1).padStart(2,'0')} — {h}:{m}</p>
                          <p className="text-[11px] text-slate-500">{dur}s · {noise} dB avg · Sentiment: <span className={sentColor[sent]}>{sent}</span></p>
                        </div>
                        {flagged && <span className="shrink-0 rounded-full bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] text-amber-200">Flagged</span>}
                        <button type="button" className="shrink-0 flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20 transition">
                          <PlayCircle size={13} /> Play
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {activeTab === 'face' && (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
                    {[
                      { label: 'Total Scans', value: selected.visitCount * 3, color: 'text-pink-300' },
                      { label: 'Last Expression', value: selected.lastExpression, color: exprColor[selected.lastExpression] ?? 'text-slate-300' },
                      { label: 'AI Confidence', value: `${selected.expressionConf}%`, color: 'text-cyan-300' },
                      { label: 'Mask Wearing', value: selected.maskWearing ? 'Yes' : 'No', color: selected.maskWearing ? 'text-amber-300' : 'text-slate-300' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</p>
                        <p className={`text-base font-bold ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">Facial Expression Event History</p>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {Array.from({ length: Math.min(selected.visitCount * 2, 24) }, (_, i) => {
                      const rng6 = seededRand(selected.avatarHue * 23 + i * 37);
                      const rv6 = () => Math.floor(rng6() * 100);
                      const expressions = ['Happy','Neutral','Angry','Surprised','Fearful'];
                      const expr = expressions[rv6() % 5] ?? 'Neutral';
                      const conf = 85 + rv6() % 14;
                      const h = String(7 + rv6() % 12).padStart(2,'0');
                      const mn = String(rv6() % 60).padStart(2,'0');
                      return (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-[11px]">
                          <span className="text-slate-500 font-mono w-12">{h}:{mn}</span>
                          <span className="flex items-center gap-1.5">
                            <span className={`status-dot ${exprDot[expr] ?? 'bg-slate-500'}`} />
                            <span className={`font-medium ${exprColor[expr] ?? 'text-slate-300'}`}>{expr}</span>
                          </span>
                          <span className="text-slate-400">Conf {conf}%</span>
                          <span className="text-slate-600 text-[10px]">Center {String(selected.centerId).padStart(2,'0')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function setResults_demo() { setQuery('A'); setTimeout(() => setQuery(''), 50); }
}


export default function App() {
  const [activePage, setActivePage] = useState<Page>('Overview');
  const { activeAlerts } = useDashboard();
  const pageTitle: Record<Page, string> = {
    Overview: 'Command Overview',
    '105 Centers': '105 Service Centers',
    'AI Alerts': 'AI Alert Console',
    Analytics: 'Analytics and Insights',
    Settings: 'System Settings',
    Reports: 'Center Reports',
    'Agent Search': 'Agent Customer Search',
    'Media Vault': 'Audio & Video Vault',
  };
  return (
    <div className="flex min-h-screen w-full bg-[#0f172a] text-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-cyan-500/20 bg-slate-950/60 px-4 py-6 lg:flex sticky top-0 h-screen overflow-y-auto">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-lg bg-cyan-400/20 p-2 text-cyan-300 glow-cyan"><Shield size={22} /></div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300">Falcon Security</p>
            <h1 className="text-sm font-semibold leading-tight">Enterprise Command</h1>
          </div>
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <button key={item.label} type="button" onClick={() => setActivePage(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-cyan-500/10 hover:text-cyan-200 ${activePage === item.label ? 'bg-cyan-500/15 text-cyan-200 shadow-neon' : 'text-slate-400'}`}>
              {item.icon}
              {item.label}
              {item.label === 'AI Alerts' && activeAlerts > 0 && (
                <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{activeAlerts}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-cyan-100">
          <div className="mb-1.5 flex items-center gap-2"><span className="status-dot animate-pulse bg-cyan-300" /> Live Hybrid AI Monitoring</div>
          <p className="text-slate-400">Vision + WiFi DensePose active across all centers.</p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 m-4 mb-0 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/20 bg-slate-900/90 p-3 shadow-neon backdrop-blur-md">
          <h2 className="text-sm font-semibold text-slate-100 shrink-0">{pageTitle[activePage]}</h2>
          {/* Quick-access media buttons */}
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setActivePage('Media Vault')} title="Video Recordings" className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition ${ activePage === 'Media Vault' ? 'border-violet-400/50 bg-violet-500/15 text-violet-200' : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-violet-400/40 hover:text-violet-200' }`}>
              <Film size={13} /> <span className="hidden sm:inline">Video</span>
            </button>
            <button type="button" onClick={() => setActivePage('Media Vault')} title="Audio Recordings" className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition ${ activePage === 'Media Vault' ? 'border-violet-400/50 bg-violet-500/15 text-violet-200' : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-violet-400/40 hover:text-violet-200' }`}>
              <Mic2 size={13} /> <span className="hidden sm:inline">Audio</span>
            </button>
            <button type="button" onClick={() => setActivePage('Agent Search')} title="Facial Expressions" className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition ${ activePage === 'Agent Search' ? 'border-pink-400/50 bg-pink-500/15 text-pink-200' : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-pink-400/40 hover:text-pink-200' }`}>
              <ScanFace size={13} /> <span className="hidden sm:inline">Faces</span>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="relative hidden max-w-xs flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input placeholder="Search center, alert, token..." className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-2 pl-9 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" />
            </div>
            <button type="button" className="relative rounded-xl border border-slate-700 bg-slate-950/70 p-2.5 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200">
              <Bell size={16} />
              {activeAlerts > 0 && <span className="absolute right-1.5 top-1.5 inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />}
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2">
              <div className="rounded-lg bg-cyan-500/20 p-1.5 text-cyan-300"><UserCog size={14} /></div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-slate-400">Security Operator</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-4 mt-3 flex gap-1.5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 p-1.5 lg:hidden">
          {navItems.map((item) => (
            <button key={item.label} type="button" onClick={() => setActivePage(item.label)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition ${activePage === item.label ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400 hover:text-cyan-200'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        <main className="flex-1 p-4">
          {activePage === 'Overview' && <OverviewPage />}
          {activePage === '105 Centers' && <CentersPage />}
          {activePage === 'AI Alerts' && <AlertsPage />}
          {activePage === 'Analytics' && <AnalyticsPage />}
          {activePage === 'Settings' && <SettingsPage />}
          {activePage === 'Reports' && <ReportsPage />}
          {activePage === 'Agent Search' && <AgentSearchPage />}
          {activePage === 'Media Vault' && <MediaVaultPage />}
        </main>
      </div>
    </div>
  );
}
