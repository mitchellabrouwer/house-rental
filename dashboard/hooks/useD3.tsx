import { select } from "d3";
import React from "react";

export const useD3 = (renderChartFn, dependencies) => {
  const ref = React.useRef();

  React.useEffect(() => {
    renderChartFn(select(ref.current));
    return () => {};
  }, dependencies);
  return ref;
};
