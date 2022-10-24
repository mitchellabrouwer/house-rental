import {
  axisBottom,
  axisLeft,
  format,
  max,
  scaleBand,
  scaleLinear,
  select,
  timeFormat,
} from "d3";
import { useD3 } from "../hooks/useD3";
const height = 500;
const width = 500;

function Chart({ title, data }) {
  const ref = useD3(
    (svg) => {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const xTicks = 5;
      const yTicks = 5;
      const formatTime = timeFormat("%b %y");
      const tickDistance = Math.round(data.length / xTicks);
      const barColour = "#3E505B";
      const hoverColour = "#A2B6C3";

      const x = scaleBand()
        .domain(data.map((d) => d.label))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.2);

      const y = scaleLinear()
        // @ts-ignore, couldnt get ts to pick up types for max
        .domain([0, max(data, (d) => d.value)])
        .rangeRound([height - margin.bottom, margin.top]);

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          axisLeft(y).ticks(yTicks).tickFormat(format(".1s")).tickSizeOuter(0)
        );

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          axisBottom(x)
            .tickValues(
              data
                .map((d, i) => i % tickDistance === 0 && d.label)
                .filter((item) => item)
            )
            .tickFormat((d) => formatTime(new Date(d)))
            .tickSizeOuter(0)
        );

      const onMouseOver = (event, d) => {
        // const [x, y] = pointer(event);
        select(event.currentTarget).style("fill", hoverColour);

        select("#tooltip")
          .classed("hidden", false)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");

        select("#tooltip-label").text(`${formatTime(new Date(d.label))}`);
        select("#tooltip-value").text(`${format("~s")(d.value)}`);
      };

      const onMouseOut = (event, d) => {
        select(event.currentTarget).style("fill", barColour);
        select("#tooltip").classed("hidden", true);
      };

      const onMouseMove = (event, d) => {
        select("#tooltip")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      };

      svg
        .select(".plot-area")
        .attr("fill", barColour)
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.label))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => y(0) - y(d.value))
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseOut)
        .on("mouseover", onMouseOver);
    },
    [data.length]
  );

  return (
    <>
      <h2 className="mt-0 mb-2 text-center text-2xl font-medium leading-tight text-white">
        {title}
      </h2>
      <svg
        ref={ref}
        viewBox={`0 0 ${height} ${width}`}
        style={{
          height: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <div id="tooltip" className="hidden">
        <p>
          <strong id="tooltip-label">Label</strong>
        </p>
        <p>
          <span id="tooltip-value">100</span>
        </p>
      </div>
    </>
  );
}

export default Chart;
