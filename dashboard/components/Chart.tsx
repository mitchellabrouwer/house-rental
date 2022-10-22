import {
  axisBottom,
  axisLeft,
  extent,
  format,
  max,
  pointer,
  scaleBand,
  scaleLinear,
  select,
  ticks,
} from "d3";
import { useD3 } from "../hooks/useD3";

const height = 500;
const width = 500;
const gap = 6;
function Chart({ data }) {
  const ref = useD3(
    (svg) => {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const x = scaleBand()
        .domain(data.map((d) => d.label))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

      const y = scaleLinear()
        // @ts-ignore, couldnt get ts to pick up types
        .domain([0, max(data, (d) => d.value)])
        .rangeRound([height - margin.bottom, margin.top]);

      // const xAxis = (g) =>
      // g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      //   d3
      //     .axisBottom(x)
      //     .tickValues(
      //       d3
      //         .ticks(...d3.extent(x.domain()), width / 40)
      //         .filter((v) => x(v) !== undefined)
      //     )
      //     .tickSizeOuter(0)
      // );

      // const yAxis = (g) =>
      //   g
      //     .attr("transform", `translate(${margin.left},0)`)
      //     .style("color", "steelblue")
      //     .call(d3.axisLeft(y1).ticks(null, "s"))
      //     .call((g) => g.select(".domain").remove())
      //     .call((g) =>
      //       g
      //         .append("text")
      //         .attr("x", -margin.left)
      //         .attr("y", 10)
      //         .attr("fill", "currentColor")
      //         .attr("text-anchor", "start")
      //         .text(data.y1)
      //     );

      // svg.select(".x-axis").call(xAxis);
      // svg.select(".y-axis").call(yAxis);
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(axisLeft(y).ticks(null, "s"));

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          axisBottom(x).tickValues(
            ticks(...extent(x.domain()), width / 40).filter(
              (v) => x(v) !== undefined
            )
          )
          // .tickSizeOuter(0)
        );

      const onMouseOver = (event, d) => {
        const [x, y] = pointer(event);
        select(event.currentTarget).style("fill", "red");

        select("#tooltip")
          .classed("hidden", false)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");

        select("#tooltip-label").text(`${d.label}`);
        select("#tooltip-value").text(`${format("~s")(d.value)}`);
      };

      const onMouseOut = (event, d) => {
        select(event.currentTarget).style("fill", "steelblue");
        select("#tooltip").classed("hidden", true);
      };

      const onMouseMove = (event, d) => {
        select("#tooltip")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      };

      svg
        .select(".plot-area")
        .attr("fill", "steelblue")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.label))
        .attr("width", x.bandwidth() - gap / 2)
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
