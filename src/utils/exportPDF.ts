import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Brand colours (hex) ──────────────────────────────────────────────────────
const CYAN   = [0, 210, 220]   as [number, number, number];
const DARK   = [15,  23,  42]  as [number, number, number];
const MID    = [30,  41,  59]  as [number, number, number];
const LIGHT  = [148, 163, 184] as [number, number, number];
const WHITE  = [241, 245, 249] as [number, number, number];
const RED    = [239,  68,  68] as [number, number, number];
const AMBER  = [251, 191,  36] as [number, number, number];

// ── Shared helpers ───────────────────────────────────────────────────────────
function addHeader(doc: jsPDF, title: string, subtitle: string) {
  const W = doc.internal.pageSize.getWidth();

  // background bar
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 28, 'F');

  // accent stripe
  doc.setFillColor(...CYAN);
  doc.rect(0, 0, 4, 28, 'F');

  // logo text
  doc.setTextColor(...CYAN);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('FALCON SECURITY LIMITED', 12, 11);

  // title
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 12, 19);

  // subtitle / date
  doc.setTextColor(...LIGHT);
  doc.setFontSize(7.5);
  doc.text(subtitle, 12, 24.5);

  // right-side timestamp
  const ts = new Date().toLocaleString('en-GB');
  doc.text(`Generated: ${ts}`, W - 12, 24.5, { align: 'right' });
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  doc.setFillColor(...MID);
  doc.rect(0, H - 10, W, 10, 'F');
  doc.setTextColor(...LIGHT);
  doc.setFontSize(7);
  doc.text('Confidential — Falcon Security Ltd. Internal Use Only', 12, H - 3.5);
  doc.text(`Page ${pageNum} of ${totalPages}`, W - 12, H - 3.5, { align: 'right' });
}

function sectionTitle(doc: jsPDF, text: string, y: number): number {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...MID);
  doc.roundedRect(8, y, W - 16, 8, 1, 1, 'F');
  doc.setTextColor(...CYAN);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(text.toUpperCase(), 12, y + 5.5);
  return y + 12;
}

// ── Report PDF ───────────────────────────────────────────────────────────────
export interface ReportExportData {
  centerId: number;
  period: string;
  online: boolean;
  queueSize: number;
  footage: {
    motionEvents: number; threatDetections: number; tamperAttempts: number;
    cameraUptime: number; recordedHrs: number; aiDetections: number;
    videoClips: number; storageGB: number; resolution: string; cloudBackupPct: number;
  };
  attendance: {
    totalFootfall: number; peakHour: string; avgQueueSize: number;
    peakQueueSize: number; walkOutWithoutService: number;
  };
  voice: {
    speechInteractions: number; flaggedConversations: number;
    avgNoiseLevelDb: number; peakNoiseLevelDb: number;
    sentimentHappy: number; sentimentAngry: number; sentimentNeutral: number;
    audioCount: number; audioDurationHrs: number; noiseReducedPct: number;
  };
  service: {
    ticketsServed: number; ticketsAbandoned: number; avgWaitMin: number;
    avgServiceMin: number; serviceEfficiency: number; counterUtilisation: number;
    satisfactionScore: string;
  };
  alerts: { critical: number; warning: number; info: number; topAlert: string };
  features: { active: number; degraded: number; healthPct: number };
  facial: {
    totalFacesScanned: number; uniqueIndividuals: number; vipRecognitions: number;
    unknownFaces: number; avgConfidencePct: number;
    happy: number; neutral: number; angry: number; surprised: number; fearful: number;
  };
  uptime: { uptimePct: number; incidentCount: number; longestDowntimeMin: number };
}

export function exportCenterReportPDF(data: ReportExportData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const centerLabel = `Center ${String(data.centerId).padStart(2, '0')}`;
  const subtitle = `${data.period} Performance Report  ·  ${centerLabel}  ·  Status: ${data.online ? 'Online' : 'Offline'}  ·  Queue: ${data.queueSize} ppl`;

  addHeader(doc, `${centerLabel} — ${data.period} Report`, subtitle);

  let y = 34;

  // ── Summary KPIs ──
  y = sectionTitle(doc, 'Summary', y);
  const kpis = [
    ['Footfall', data.attendance.totalFootfall.toLocaleString()],
    ['Tickets Served', data.service.ticketsServed.toLocaleString()],
    ['Faces Scanned', data.facial.totalFacesScanned.toLocaleString()],
    ['Video Clips', data.footage.videoClips.toString()],
    ['Uptime', `${data.uptime.uptimePct}%`],
    ['Satisfaction', `${data.service.satisfactionScore}/100`],
    ['AI Health', `${data.features.healthPct}%`],
    ['Total Alerts', `${data.alerts.critical + data.alerts.warning + data.alerts.info}`],
  ];
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value', 'Metric', 'Value']],
    body: [
      [kpis[0][0], kpis[0][1], kpis[1][0], kpis[1][1]],
      [kpis[2][0], kpis[2][1], kpis[3][0], kpis[3][1]],
      [kpis[4][0], kpis[4][1], kpis[5][0], kpis[5][1]],
      [kpis[6][0], kpis[6][1], kpis[7][0], kpis[7][1]],
    ],
    styles: { fontSize: 8, cellPadding: 3, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { textColor: LIGHT }, 2: { textColor: LIGHT } },
    margin: { left: 8, right: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // ── Footage & Video ──
  y = sectionTitle(doc, 'Footage & Video Recording', y);
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Motion Events', data.footage.motionEvents.toLocaleString()],
      ['AI Threat Detections', data.footage.threatDetections.toString()],
      ['Anti-Tamper Alerts', data.footage.tamperAttempts.toString()],
      ['AI Vision Detections', data.footage.aiDetections.toLocaleString()],
      ['Total Footage Recorded', `${data.footage.recordedHrs}h`],
      ['Camera Uptime', `${data.footage.cameraUptime}%`],
      ['Video Clips Recorded', data.footage.videoClips.toLocaleString()],
      ['Storage Used', `${data.footage.storageGB} GB`],
      ['Avg Resolution', data.footage.resolution],
      ['Cloud Backup', `${data.footage.cloudBackupPct}%`],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 80, textColor: LIGHT } },
    margin: { left: 8, right: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // ── Attendance ──
  y = sectionTitle(doc, 'Attendance & Footfall', y);
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Footfall', data.attendance.totalFootfall.toLocaleString()],
      ['Peak Hour', data.attendance.peakHour],
      ['Avg Queue Size', `${data.attendance.avgQueueSize} ppl`],
      ['Peak Queue Size', `${data.attendance.peakQueueSize} ppl`],
      ['Walk-Out Without Service', data.attendance.walkOutWithoutService.toString()],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 80, textColor: LIGHT } },
    margin: { left: 8, right: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // new page if getting close to bottom
  if (y > 230) { doc.addPage(); y = 14; }

  // ── Voice & Audio ──
  y = sectionTitle(doc, 'Voice & Audio Records', y);
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Speech Interactions', data.voice.speechInteractions.toLocaleString()],
      ['Flagged Conversations', data.voice.flaggedConversations.toString()],
      ['Avg Noise Level', `${data.voice.avgNoiseLevelDb} dB`],
      ['Peak Noise Level', `${data.voice.peakNoiseLevelDb} dB`],
      ['Sentiment — Positive', `${data.voice.sentimentHappy}%`],
      ['Sentiment — Neutral', `${data.voice.sentimentNeutral}%`],
      ['Sentiment — Negative', `${data.voice.sentimentAngry}%`],
      ['Audio Recordings Captured', data.voice.audioCount.toLocaleString()],
      ['Total Audio Duration', `${data.voice.audioDurationHrs}h`],
      ['Noise Reduction Applied', `${data.voice.noiseReducedPct}%`],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 80, textColor: LIGHT } },
    margin: { left: 8, right: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  if (y > 220) { doc.addPage(); y = 14; }

  // ── Service Records ──
  y = sectionTitle(doc, 'Service Records', y);
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Tickets Served', data.service.ticketsServed.toLocaleString()],
      ['Tickets Abandoned', data.service.ticketsAbandoned.toString()],
      ['Avg Wait Time', `${data.service.avgWaitMin} min`],
      ['Avg Service Duration', `${data.service.avgServiceMin} min`],
      ['Service Efficiency', `${data.service.serviceEfficiency}%`],
      ['Counter Utilisation', `${data.service.counterUtilisation}%`],
      ['Customer Satisfaction', `${data.service.satisfactionScore}/100`],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 80, textColor: LIGHT } },
    margin: { left: 8, right: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  if (y > 220) { doc.addPage(); y = 14; }

  // ── Facial Expressions ──
  y = sectionTitle(doc, 'Facial Expression Analysis', y);
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Faces Scanned', data.facial.totalFacesScanned.toLocaleString()],
      ['Unique Individuals', data.facial.uniqueIndividuals.toLocaleString()],
      ['VIP Recognitions', data.facial.vipRecognitions.toString()],
      ['Unknown Faces', data.facial.unknownFaces.toString()],
      ['AI Confidence', `${data.facial.avgConfidencePct}%`],
      ['Expression — Happy', `${data.facial.happy}%`],
      ['Expression — Neutral', `${data.facial.neutral}%`],
      ['Expression — Angry', `${data.facial.angry}%`],
      ['Expression — Surprised', `${data.facial.surprised}%`],
      ['Expression — Fearful', `${data.facial.fearful}%`],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 80, textColor: LIGHT } },
    margin: { left: 8, right: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  if (y > 220) { doc.addPage(); y = 14; }

  // ── Alerts ──
  y = sectionTitle(doc, 'Alert History', y);
  autoTable(doc, {
    startY: y,
    head: [['Severity', 'Count', 'Details']],
    body: [
      ['Critical', data.alerts.critical.toString(), ''],
      ['Warning', data.alerts.warning.toString(), ''],
      ['Info', data.alerts.info.toString(), ''],
      ['Most Frequent', '', data.alerts.topAlert],
      ['Total', `${data.alerts.critical + data.alerts.warning + data.alerts.info}`, ''],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fillColor: DARK },
    willDrawCell: (hookData) => {
      if (hookData.section === 'body' && hookData.column.index === 0) {
        const txt = String(hookData.cell.raw);
        if (txt === 'Critical') hookData.cell.styles.textColor = RED;
        else if (txt === 'Warning') hookData.cell.styles.textColor = AMBER;
      }
    },
    margin: { left: 8, right: 8 },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  if (y > 220) { doc.addPage(); y = 14; }

  // ── AI Features + Uptime ──
  y = sectionTitle(doc, 'AI Feature Status & Uptime', y);
  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Active AI Features', `${data.features.active} / 20`],
      ['Degraded Features', data.features.degraded.toString()],
      ['Offline Features', `${20 - data.features.active - data.features.degraded}`],
      ['Overall AI Health', `${data.features.healthPct}%`],
      ['System Uptime', `${data.uptime.uptimePct}%`],
      ['Incidents', data.uptime.incidentCount.toString()],
      ['Longest Downtime', `${data.uptime.longestDowntimeMin} min`],
      ['SLA (99%) Target', data.uptime.uptimePct >= 99 ? 'Met ✓' : 'At Risk ⚠'],
    ],
    styles: { fontSize: 8, cellPadding: 2.5, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { cellWidth: 80, textColor: LIGHT } },
    margin: { left: 8, right: 8 },
  });

  // add footer to all pages
  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`Falcon_Center${String(data.centerId).padStart(2, '0')}_${data.period}_Report.pdf`);
}

// ── Media Vault PDF ──────────────────────────────────────────────────────────
export interface MediaItem {
  id: string;
  type: 'video' | 'audio';
  centerId: number;
  date: string;
  time: string;
  durationSec: number;
  sizeGB?: string;
  sizeMB?: number;
  resolution?: string;
  bitrateKbps?: number;
  flagged: boolean;
  sentiment?: string;
  camera?: string;
  noiseDb?: number;
  backupStatus: string;
}

export function exportMediaVaultPDF(items: MediaItem[], filterLabel: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const subtitle = `${filterLabel}  ·  ${items.length} records  ·  Generated ${new Date().toLocaleDateString('en-GB')}`;
  addHeader(doc, 'Media Vault — Audio & Video Archive', subtitle);

  autoTable(doc, {
    startY: 34,
    head: [['Type', 'ID', 'Center', 'Date', 'Time', 'Duration', 'Size', 'Quality', 'Sentiment/Camera', 'Backup', 'Flagged']],
    body: items.map((m) => [
      m.type === 'video' ? 'VIDEO' : 'AUDIO',
      m.id,
      `C-${String(m.centerId).padStart(2, '0')}`,
      m.date,
      m.time,
      m.durationSec >= 60 ? `${Math.floor(m.durationSec / 60)}m ${m.durationSec % 60}s` : `${m.durationSec}s`,
      m.type === 'video' ? `${m.sizeGB} GB` : `${m.sizeMB} MB`,
      m.type === 'video' ? (m.resolution ?? '-') : `${m.bitrateKbps} kbps`,
      m.type === 'audio' ? `${m.sentiment} · ${m.noiseDb}dB` : `Cam ${m.camera}`,
      m.backupStatus,
      m.flagged ? 'YES' : 'No',
    ]),
    styles: { fontSize: 7, cellPadding: 2, textColor: WHITE, fillColor: DARK, lineColor: MID },
    headStyles: { fillColor: MID, textColor: CYAN, fontStyle: 'bold', fontSize: 7 },
    alternateRowStyles: { fillColor: [20, 30, 48] as [number, number, number] },
    willDrawCell: (hookData) => {
      if (hookData.section === 'body') {
        const row = hookData.row.raw as string[];
        if (row[10] === 'YES') hookData.cell.styles.textColor = RED;
        if (row[0] === 'VIDEO') hookData.cell.styles.textColor = [167, 139, 250] as [number, number, number];
        if (row[0] === 'AUDIO') hookData.cell.styles.textColor = [139, 92, 246] as [number, number, number];
        if (hookData.column.index === 0) return; // keep type colour
        hookData.cell.styles.textColor = WHITE;
        if (row[10] === 'YES' && hookData.column.index === 10) hookData.cell.styles.textColor = RED;
      }
    },
    margin: { left: 8, right: 8 },
  });

  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  doc.save(`Falcon_MediaVault_${new Date().toISOString().slice(0, 10)}.pdf`);
}
