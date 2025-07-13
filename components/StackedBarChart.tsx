export interface BarSegment {
  label: string; // item name
  valuePerItem: number;
  itemCount: number;
  color: `${string}`; // Hex color code
}

export interface BarData {
  label: string;
  unit: string;
  target: number;
  segments: BarSegment[];
}

export default function StackedBarChart({ bars }: { bars: BarData[] }) {
  return (
    <div class="w-full space-y-6">
      {bars.map((bar) => (
        <Bar
          key={bar.label}
          bar={bar}
          maxVal={Math.max(sumSegmentTotal(bar.segments), bar.target * 1.2)}
        />
      ))}
    </div>
  );
}

function Bar({ bar, maxVal }: { bar: BarData; maxVal: number }) {
  const total = sumSegmentTotal(bar.segments);
  const barPercent = (total / maxVal) * 100;
  const targetPercent = (bar.target / maxVal) * 100;
  const showTargetLine = total < bar.target;

  return (
    <div>
      <BarTotalsText bar={bar} total={total} />
      <div class="relative overflow-visible">
        <div class="relative h-8 bg-white/10 backdrop-blur-xs rounded flex overflow-visible">
          <BarSegments segments={bar.segments} maxVal={maxVal} />
          <BarTargetLine
            targetPercent={targetPercent}
            barPercent={barPercent}
            showTargetLine={showTargetLine}
          />
        </div>
        <BarSegmentLabels segments={bar.segments} maxVal={maxVal} />
      </div>
    </div>
  );
}

function BarTotalsText(
  { bar, total }: { bar: BarData; total: number },
) {
  return (
    <div class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-200">
        {bar.label} ({bar.unit})
      </span>
      <div>
        <span class="text-sm text-gray-200">
          {Math.round(total)}
          {bar.unit} {" "}
        </span>
        <span class="text-sm text-gray-400">
          ({diffString(total, bar.target)}
          {bar.unit} vs {Math.round(bar.target)}
          {bar.unit})
        </span>
      </div>
    </div>
  );
}

function BarSegments(
  { segments, maxVal }: { segments: BarSegment[]; maxVal: number },
) {
  return (
    <>
      {segments.map((seg) =>
        Array.from({ length: seg.itemCount }).map((_, idx) => (
          <div
            class={`h-8 border border-black rounded`}
            style={{
              width: `${(seg.valuePerItem / maxVal) * 100}%`,
              backgroundColor: seg.color,
            }}
            title={`${seg.label}: ${seg.itemCount * seg.valuePerItem}`}
            key={`${seg.label}-${idx}`}
          />
        ))
      )}
    </>
  );
}

function BarSegmentLabels(
  { segments, maxVal }: { segments: BarSegment[]; maxVal: number },
) {
  const labelPositions = getSegmentLabelPositions(segments, maxVal);

  return (
    <div class="flex relative mt-1 h-8 items-start">
      {labelPositions.map(({ label, width, left }) => (
        <div
          class="absolute flex flex-col items-center"
          style={{
            left: `${left}%`,
            width: `${width}%`,
          }}
          key={label}
        >
          <BarSegmentLabelLine />
          <div class="mt-3 px-1 text-xs w-full text-gray-400 line-clamp-2">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function BarSegmentLabelLine() {
  return (
    <svg
      class="absolute top-0 left-0 w-full h-full mt-1 px-1"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M0,0 L100,0"
        stroke="white"
        stroke-width="4"
        fill="none"
      />
    </svg>
  );
}

function BarTargetLine(
  { targetPercent, barPercent, showTargetLine }: {
    targetPercent: number;
    barPercent: number;
    showTargetLine: boolean;
  },
) {
  if (!showTargetLine) return null;
  return (
    <>
      <div
        class="absolute border-l-2 border-red-400 h-full"
        style={{
          left: `${targetPercent}%`,
          top: 0,
        }}
      />
      <div
        class="absolute border-t border-dotted border-red-400"
        style={{
          left: `${barPercent}%`,
          width: `${targetPercent - barPercent}%`,
          top: "50%",
        }}
      />
    </>
  );
}

function getSegmentLabelPositions(
  segments: BarSegment[],
  maxVal: number,
): { label: string; left: number; width: number }[] {
  const positions = [];
  let cumulative = 0;
  for (const seg of segments) {
    const totalVal = seg.valuePerItem * seg.itemCount;
    const left = (cumulative / maxVal) * 100;
    const width = (totalVal / maxVal) * 100;
    positions.push({
      label: seg.label,
      left,
      width,
    });
    cumulative += totalVal;
  }
  return positions;
}

function sumSegmentTotal(segments: BarSegment[]) {
  return segments.reduce(
    (acc, seg) => acc + seg.valuePerItem * seg.itemCount,
    0,
  );
}

function diffString(value: number, target: number) {
  const diff = Math.round(value - target);
  return diff >= 0 ? `+${diff}` : `${diff}`;
}
