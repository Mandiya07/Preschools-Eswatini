import { useState, useMemo, ReactNode } from "react";
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend,
  ReferenceLine
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, RotateCcw, TrendingUp, BarChart3, LineChart as LineIcon, AreaChart as AreaIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalyticsDataPoint {
  [key: string]: any;
}

export interface MetricConfig {
  key: string;
  label: string;
  color: string;
  type?: "line" | "bar" | "area";
}

export interface AnalyticsCardProps {
  title: string;
  description?: string;
  id?: string;
  data: AnalyticsDataPoint[];
  metrics: MetricConfig[];
  xAxisKey: string;
  dateKey?: string; // Optional custom date-parsing key if different from xAxisKey
  defaultRange?: "7D" | "30D" | "90D" | "ALL";
  prefix?: string; // Prefix for metric values (e.g. "E" for currency)
  suffix?: string; // Suffix for metric values (e.g. "%")
  headerAction?: ReactNode;
  showToggleChartType?: boolean;
}

export function AnalyticsCard({
  title,
  description,
  id = "analytics-card-root",
  data = [],
  metrics = [],
  xAxisKey,
  dateKey,
  defaultRange = "ALL",
  prefix = "",
  suffix = "",
  headerAction,
  showToggleChartType = true
}: AnalyticsCardProps) {
  // State variables for routing metrics and views
  const [rangePreset, setRangePreset] = useState<string>(defaultRange);
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [userSelectedType, setUserSelectedType] = useState<Record<string, "line" | "bar" | "area">>({});
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // 1. Prepare data with date metadata for filtering
  const processedData = useMemo(() => {
    return data.map((item, index) => {
      const rawDateVal = item[dateKey || xAxisKey];
      let dateObj: Date | null = null;
      if (rawDateVal) {
        const parsed = Date.parse(rawDateVal);
        if (!isNaN(parsed)) {
          dateObj = new Date(parsed);
        }
      }
      return {
        ...item,
        $originalIndex: index,
        $parsedDate: dateObj,
      };
    });
  }, [data, dateKey, xAxisKey]);

  // 2. Perform Filtering
  const filteredData = useMemo(() => {
    let result = [...processedData];

    // Check if custom calendar picker limits are defined
    if (customStartDate || customEndDate) {
      if (customStartDate) {
        const start = new Date(customStartDate);
        result = result.filter(item => item.$parsedDate ? item.$parsedDate >= start : true);
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        result = result.filter(item => item.$parsedDate ? item.$parsedDate <= end : true);
      }
      return result;
    }

    // Apply quick presets otherwise
    if (rangePreset !== "ALL") {
      const hasValidDates = result.some(item => item.$parsedDate !== null);

      if (hasValidDates) {
        // Find latest valid date in dataset to use as starting anchor point
        let anchor = new Date();
        const validDates = result.map(i => i.$parsedDate).filter(d => d !== null) as Date[];
        if (validDates.length > 0) {
          anchor = new Date(Math.max(...validDates.map(d => d.getTime())));
        }

        const cutoff = new Date(anchor);
        if (rangePreset === "7D") {
          cutoff.setDate(anchor.getDate() - 7);
        } else if (rangePreset === "30D") {
          cutoff.setDate(anchor.getDate() - 30);
        } else if (rangePreset === "90D") {
          cutoff.setDate(anchor.getDate() - 90);
        }

        result = result.filter(item => item.$parsedDate ? item.$parsedDate >= cutoff : true);
      } else {
        // Fallback layout index slicing for months/arbitrary labels (e.g. "Jan", "Feb")
        const totalPoints = result.length;
        if (rangePreset === "7D") {
          result = result.slice(Math.max(0, totalPoints - 3));
        } else if (rangePreset === "30D") {
          result = result.slice(Math.max(0, totalPoints - 6));
        } else if (rangePreset === "90D") {
          result = result.slice(Math.max(0, totalPoints - 12));
        }
      }
    }

    return result;
  }, [processedData, rangePreset, customStartDate, customEndDate]);

  // 3. Compute live summary statistics based on current filtered view range
  const rangeSummaries = useMemo(() => {
    return metrics.map(mt => {
      let sum = 0;
      let count = 0;
      let maxVal = -Infinity;
      
      filteredData.forEach(item => {
        const v = Number(item[mt.key]);
        if (!isNaN(v)) {
          sum += v;
          count++;
          if (v > maxVal) maxVal = v;
        }
      });

      const avg = count > 0 ? sum / count : 0;
      return {
        key: mt.key,
        label: mt.label,
        color: mt.color,
        sum: sum,
        avg: parseFloat(avg.toFixed(1)),
        peak: maxVal === -Infinity ? 0 : maxVal
      };
    });
  }, [filteredData, metrics]);

  // Reset helper
  const handleResetFilters = () => {
    setRangePreset("ALL");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  // Determine actual drawing types
  const getChartType = (metricKey: string, defaultType: "line" | "bar" | "area" = "area") => {
    return userSelectedType[metricKey] || defaultType;
  };

  // Toggle chart type for a specific metric
  const toggleChartType = (metricKey: string, current: "line" | "bar" | "area") => {
    const nextMap: Record<"line" | "bar" | "area", "line" | "bar" | "area"> = {
      area: "bar",
      bar: "line",
      line: "area"
    };
    setUserSelectedType(prev => ({
      ...prev,
      [metricKey]: nextMap[current]
    }));
  };

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-col h-full font-sans" id={id}>
      <CardHeader className="pb-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600 shrink-0" />
            {title}
          </CardTitle>
          {description && <CardDescription className="text-xs pt-1">{description}</CardDescription>}
        </div>

        {/* Filters and actions row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick preset chips */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {["7D", "30D", "90D", "ALL"].map(pr => (
              <button
                key={pr}
                onClick={() => {
                  setRangePreset(pr);
                  setCustomStartDate("");
                  setCustomEndDate("");
                }}
                className={cn(
                  "text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all",
                  rangePreset === pr && !customStartDate && !customEndDate
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                )}
                type="button"
              >
                {pr}
              </button>
            ))}
          </div>

          {/* Calendar Picker Toggle Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "h-9 rounded-xl text-xs font-semibold px-3.5",
              (customStartDate || customEndDate || showDatePicker) ? "border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100" : "border-slate-200"
            )}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Custom
          </Button>

          {/* Reset button shown if filtered */}
          {(customStartDate || customEndDate || rangePreset !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
              onClick={handleResetFilters}
              title="Reset all range parameters"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          {headerAction}
        </div>
      </CardHeader>

      {/* Slide-out Custom Date range inputs */}
      {showDatePicker && (
        <div className="bg-slate-50/70 p-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-end animate-in slide-in-from-top duration-200">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Start Date</label>
            <Input 
              type="date"
              className="bg-white rounded-xl h-10 border-slate-200 text-xs focus-visible:ring-1 focus-visible:ring-blue-500"
              value={customStartDate}
              onChange={(e) => {
                setCustomStartDate(e.target.value);
                setRangePreset(""); // Deactivate presets
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">End Date</label>
            <Input 
              type="date"
              className="bg-white rounded-xl h-10 border-slate-200 text-xs focus-visible:ring-1 focus-visible:ring-blue-500"
              value={customEndDate}
              min={customStartDate}
              onChange={(e) => {
                setCustomEndDate(e.target.value);
                setRangePreset(""); // Deactivate presets
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-10 text-xs font-bold rounded-xl flex-1 border-slate-200 bg-white"
              onClick={() => {
                setCustomStartDate("");
                setCustomEndDate("");
              }}
            >
              Clear
            </Button>
            <Button 
              className="h-10 text-xs font-bold rounded-xl flex-1 bg-slate-900 hover:bg-black text-white"
              onClick={() => setShowDatePicker(false)}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      )}

      {/* Summary boxes calculations block */}
      <div className="bg-slate-50/50 p-4 border-b border-slate-100/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {rangeSummaries.map((summary) => (
          <div key={summary.key} className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">{summary.label}</span>
              <div className="flex gap-1.5">
                {showToggleChartType && (
                  <button
                    onClick={() => toggleChartType(summary.key, getChartType(summary.key))}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    title={`Change rendering to ${getChartType(summary.key) === "area" ? "Bar" : getChartType(summary.key) === "bar" ? "Line" : "Area"}`}
                  >
                    {getChartType(summary.key) === "bar" && <BarChart3 className="h-3.5 w-3.5 text-blue-500" />}
                    {getChartType(summary.key) === "line" && <LineIcon className="h-3.5 w-3.5 text-indigo-500" />}
                    {getChartType(summary.key) === "area" && <AreaIcon className="h-3.5 w-3.5 text-emerald-500" />}
                  </button>
                )}
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: summary.color }} />
              </div>
            </div>
            
            <div className="mt-2.5 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold block">{rangePreset || "Subset"} Summary:</span>
                <span className="text-lg font-black text-slate-900">
                  {prefix}{summary.sum.toLocaleString()}{suffix}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">Avg. Performance:</span>
                <span className="text-xs font-black text-slate-600">
                  {prefix}{summary.avg.toLocaleString()}{suffix}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Recharts Canvas wrapper */}
      <CardContent className="pt-6 flex-1 flex flex-col min-h-[300px]">
        {filteredData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2">
            <Filter className="h-8 w-8 text-slate-300 animate-pulse" />
            <h5 className="font-extrabold text-sm text-slate-800">No data records in range</h5>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              No metrics match the current filters. Set quick preset to 'ALL' or choose a broader calendar threshold.
            </p>
          </div>
        ) : (
          <div className="w-full h-[320px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              {/* Note: In Recharts we can stack or superimpose multiple drawing configurations inside the same container.
                  Because AreaChart, BarChart and LineChart interfaces can also be rendered using <ComposedChart> or 
                  simply matching the container type, standard design is using responsive composed rendering or 
                  evaluating the predominant chart elements. Here we compose our visualizer. */}
              
              {/* Using a general Responsive Bar/Line/Area layout or matching the config */}
              {/* To allow line, bar, area components to be drawn concurrently across multiple keys,
                  we can compile area shapes, lines, or bars directly. By using AreaChart as the main tag, 
                  recharts gracefully parses <Area>, <Bar>, and <Line> components inside it perfectly! Or we can use ComposedChart imports to keep it super secure.
                  Let's see if Recharts imports ComposedChart as well. It does! Recharts ComposedChart is the absolute best container for combining multiple drawing models.
              */}
              
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  {metrics.map(mt => (
                    <linearGradient key={`grad-${mt.key}`} id={`grad-${mt.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={mt.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={mt.color} stopOpacity={0.0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey={xAxisKey} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.4)', stroke: '#cbd5e1', strokeDasharray: '2 2' }}
                  contentStyle={{ 
                    borderRadius: '14px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                  formatter={(value: any, name: any) => [
                    `${prefix}${Number(value).toLocaleString()}${suffix}`, 
                    metrics.find(m => m.key === name)?.label || name
                  ]}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#64748b'
                  }}
                />

                {/* Draw metrics based on user or parent configs */}
                {metrics.map((mt) => {
                  const drawType = getChartType(mt.key, mt.type || "area");

                  if (drawType === "bar") {
                    return (
                      <Bar 
                        key={mt.key} 
                        dataKey={mt.key} 
                        fill={mt.color} 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={45}
                      />
                    );
                  }
                  if (drawType === "line") {
                    return (
                      <Line 
                        key={mt.key} 
                        type="monotone" 
                        dataKey={mt.key} 
                        stroke={mt.color} 
                        strokeWidth={2.5}
                        dot={{ r: 3, strokeWidth: 1.5, fill: "#fff" }}
                        activeDot={{ r: 5 }}
                      />
                    );
                  }
                  // Defaults to Area view
                  return (
                    <Area 
                      key={mt.key} 
                      type="monotone" 
                      dataKey={mt.key} 
                      stroke={mt.color} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill={`url(#grad-${mt.key})`}
                      dot={{ r: 1.5, strokeWidth: 1, fill: mt.color }}
                      activeDot={{ r: 5 }}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
