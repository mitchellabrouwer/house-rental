import {
  axisBottom,
  axisLeft,
  ScaleBand,
  scaleBand,
  ScaleLinear,
  scaleLinear,
  select,
} from "d3";
import { useEffect, useRef } from "react";
import { SalesData } from "../types";

interface BarChartProps {
  data: SalesData[];
}

interface AxisBottomProps {
  scale: ScaleBand<string>;
  transform: string;
}

interface AxisLeftProps {
  scale: ScaleLinear<number, number, never>;
}

interface BarsProps {
  data: BarChartProps["data"];
  height: number;
  scaleX: AxisBottomProps["scale"];
  scaleY: AxisLeftProps["scale"];
}

function AxisBottom({ scale, transform }: AxisBottomProps) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisBottom(scale));
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

function AxisLeft({ scale }: AxisLeftProps) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisLeft(scale));
    }
  }, [scale]);

  return <g ref={ref} />;
}

function Bars({ data, height, scaleX, scaleY }: BarsProps) {
  return (
    <>
      {data.map(({ value, label }) => (
        <rect
          key={`bar-${label}`}
          x={scaleX(label)}
          y={scaleY(value)}
          width={scaleX.bandwidth()}
          height={height - scaleY(value)}
          fill="teal"
        />
      ))}
    </>
  );
}

export function BarChart({ data }: BarChartProps) {
  const margin = { top: 10, right: 0, bottom: 20, left: 30 };
  const width = 500 - margin.left - margin.right;
  const height = 1000 - margin.top - margin.bottom;
  const chartRef = useRef<SVGSVGElement>(null);
  const scaleX = scaleBand()
    .domain(data.map(({ label }) => label))
    .range([0, width])
    .padding(0.5);
  const scaleY = scaleLinear()
    .domain([0, Math.max(...data.map(({ value }) => value))])
    .range([height, 0]);

  useEffect(() => {
    if (!chartRef) {
      return;
    }

    console.log(chartRef.current.getBoundingClientRect());
  }, []);

  // width = bounds.width - margin.left - margin.right,
  // height = bounds.height - margin.top - margin.bottom;
  return (
    <svg
      // width={width + margin.left + margin.right}
      // height={height + margin.top + margin.bottom}
      // viewBox={`0 0 ${width} ${height}`}
      // preserveAspectRatio="xMinYMin meet"
      width="100%"
      ref={chartRef}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
        <AxisLeft scale={scaleY} />
        <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
      </g>
    </svg>
  );
}
