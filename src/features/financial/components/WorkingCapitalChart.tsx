import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkingCapital } from '../../financial/api';
import { Skeleton } from '../../../components/ui/Skeleton';
import moreIcon from '../../../assets/icons/ic-expand-more.png';

export default function WorkingCapitalChart() {
  // Data fetch
  const { data, isLoading } = useQuery({
    queryKey: ['working-capital'],
    queryFn: fetchWorkingCapital,
  });

  // Dynamic width (avoid text distortion and keep hover alignment)
  const VIEW_H = 288; // ~ h-72
  const [vw, setVw] = useState<number>(716);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setVw(w);
      }
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) setVw(rect.width);
    return () => ro.disconnect();
  }, []);

  // Derive rows from response
  const d = data?.data as any;
  const rows: Array<any> = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];

  // Layout/scales
  const PAD = { left: 56, right: 16, top: 12, bottom: 36 };
  const plotW = Math.max(0, vw - PAD.left - PAD.right);
  const plotH = VIEW_H - PAD.top - PAD.bottom;

  const N = rows.length;
  const incomeVals = rows.map((r) => Number(r.income || 0));
  const expenseVals = rows.map((r) => Number(r.expense || 0));
  const yMaxRaw = Math.max(1, ...incomeVals, ...expenseVals);
  const yMax = Math.ceil(yMaxRaw / 10000) * 10000; // round to 10k

  const x = (i: number) => (N <= 1 ? PAD.left + plotW / 2 : PAD.left + (i * plotW) / (N - 1));
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  // Smoothing path
  function smoothPath(points: Array<{ x: number; y: number }>): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    const d: string[] = [];
    d.push(`M ${points[0].x} ${points[0].y}`);
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const t = 0.2;
      const cp1x = p1.x + ((p2.x - p0.x) / 6) * t * 6;
      const cp1y = p1.y + ((p2.y - p0.y) / 6) * t * 6;
      const cp2x = p2.x - ((p3.x - p1.x) / 6) * t * 6;
      const cp2y = p2.y - ((p3.y - p1.y) / 6) * t * 6;
      d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
    }
    return d.join(' ');
  }

  const incomePts = rows.map((_: any, i: number) => ({ x: x(i), y: y(incomeVals[i]) }));
  const expensePts = rows.map((_: any, i: number) => ({ x: x(i), y: y(expenseVals[i]) }));
  const incomePath = useMemo(() => smoothPath(incomePts), [N, yMax, vw]);
  const expensePath = useMemo(() => smoothPath(expensePts), [N, yMax, vw]);

  // Ticks/formatter
  const vTicks = 5;
  const yTicks = Array.from({ length: vTicks }, (_, i) => Math.round((i * yMax) / (vTicks - 1)));
  const formatK = (v: number) => (v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`);

  // Hover state
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || N <= 1) return;
      const rect = svgRef.current.getBoundingClientRect();
      const viewX = ((e.clientX - rect.left) * vw) / rect.width;
      const step = plotW / (N - 1);
      const idx = Math.round((viewX - PAD.left) / step);
      const clamped = Math.max(0, Math.min(N - 1, idx));
      setHoverIdx(clamped);
    },
    [N, PAD.left, plotW, vw]
  );
  const clearHover = useCallback(() => setHoverIdx(null), []);

  // Render
  return (
    <div className="p-5 bg-white shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-800 font-['Kumbh_Sans']">Working Capital</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-2 text-gray-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 font-['Kumbh_Sans']" /> Income
            </span>
            <span className="inline-flex items-center gap-2 text-gray-600">
              <span className="h-2 w-2 rounded-full bg-lime-400" /> Expenses
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm px-3 py-1.5 bg-stone-50 text-gray-800 select-none rounded-lg font-['Kumbh_Sans']">Last 6 Months</div>
            <img src={moreIcon} alt="more" className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div ref={containerRef} className="h-72">
        {isLoading || rows.length === 0 ? (
          <Skeleton className="h-full" />
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${vw} ${VIEW_H}`}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={clearHover}
          >
            <rect x={0} y={0} width={vw} height={VIEW_H} fill="white" />
            {rows.map((_: any, i: number) => (
              <line key={`v-${i}`} x1={x(i)} x2={x(i)} y1={PAD.top} y2={PAD.top + plotH} stroke="#F3F4F6" strokeWidth={1} />
            ))}
            {yTicks.map((t, i) => (
              <text key={`yt-${i}`} x={PAD.left - 28} y={y(t)} dominantBaseline="middle" className="fill-gray-400 text-[10px] font-normal">
                {formatK(t)}
              </text>
            ))}
            {rows.map((r: any, i: number) => {
              const selected = hoverIdx === i;
              return (
                <text
                  key={`xt-${i}`}
                  x={x(i)}
                  y={PAD.top + plotH + 16}
                  textAnchor="middle"
                  className={selected ? 'fill-gray-800 text-[10px] font-semibold' : 'fill-gray-400 text-[10px] font-normal'}
                >
                  {r.month}
                </text>
              );
            })}
            <path d={expensePath} fill="none" stroke="#C8EE44" strokeWidth={2.5} strokeLinecap="round" />
            <path d={incomePath} fill="none" stroke="#29A073" strokeWidth={2.5} strokeLinecap="round" />
            {hoverIdx != null && (
              <g>
                <rect
                  x={x(hoverIdx) - (N > 1 ? plotW / (N - 1) / 2 : 0)}
                  y={PAD.top}
                  width={N > 1 ? plotW / (N - 1) : plotW}
                  height={plotH}
                  fill="#EEF2FF"
                  opacity={0.55}
                  rx={2}
                />
                <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={PAD.top} y2={PAD.top + plotH} stroke="#CBD5E1" strokeDasharray="2 3" />
                <circle cx={x(hoverIdx)} cy={y(expenseVals[hoverIdx])} r={4} fill="#C8EE44" stroke="#ffffff" strokeWidth={2} />
                <circle cx={x(hoverIdx)} cy={y(incomeVals[hoverIdx])} r={4} fill="#29A073" stroke="#ffffff" strokeWidth={2} />
                {(() => {
                  const tx = x(hoverIdx);
                  const ty = Math.min(y(incomeVals[hoverIdx]), y(expenseVals[hoverIdx])) - 10;
                  const val = Math.round(incomeVals[hoverIdx]).toLocaleString('en-US');
                  const tipW = 64;
                  const tipH = 24;
                  const tipX = Math.min(Math.max(tx - tipW / 2, PAD.left), PAD.left + plotW - tipW);
                  const tipY = Math.max(ty - tipH, PAD.top + 4);
                  return (
                    <g>
                      <rect x={tipX} y={tipY} rx={6} ry={6} width={tipW} height={tipH} fill="#111827" opacity={0.9} />
                      <text x={tipX + tipW / 2} y={tipY + tipH / 2 + 1} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[10px] font-medium">
                        {val}
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
