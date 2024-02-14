import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as venn from 'venn.js';

const VennDiagram = ({ data }) => {
  const vennRef = useRef(null);

  useEffect(() => {
    if (!vennRef.current) return;

    // Create Venn diagram
    const chart = venn.VennDiagram();
    d3.select(vennRef.current).datum(data).call(chart);
  }, [data]);

  return <div ref={vennRef}></div>;
};

export default VennDiagram;
