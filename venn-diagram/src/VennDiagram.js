import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as venn from "venn.js";

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

// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import * as venn from "venn.js";

// const VennDiagram = ({ sets }) => {
//   const vennRef = useRef(null);

//   useEffect(() => {
//     if (!vennRef.current || sets.length !== 3) return;

//     // Create Venn diagram
//     const chart = venn.VennDiagram();
//     d3.select(vennRef.current).datum(sets).call(chart);

//     // Extract sizes of sets
//     const [setA, setB, setC] = sets;
//     const sizeA = setA.size || 0;
//     const sizeB = setB.size || 0;
//     const sizeC = setC.size || 0;

//     // Display sizes of sets
//     d3.select(vennRef.current)
//       .selectAll("text.sizeA")
//       .data([sizeA])
//       .enter()
//       .append("text")
//       .attr("x", setA.x)
//       .attr("y", setA.y + 20)
//       .attr("dy", ".35em")
//       .style("text-anchor", "middle")
//       .style("fill", "black")
//       .text((d) => `Size: ${d}`);

//     d3.select(vennRef.current)
//       .selectAll("text.sizeB")
//       .data([sizeB])
//       .enter()
//       .append("text")
//       .attr("x", setB.x)
//       .attr("y", setB.y + 20)
//       .attr("dy", ".35em")
//       .style("text-anchor", "middle")
//       .style("fill", "black")
//       .text((d) => `Size: ${d}`);

//     d3.select(vennRef.current)
//       .selectAll("text.sizeC")
//       .data([sizeC])
//       .enter()
//       .append("text")
//       .attr("x", setC.x)
//       .attr("y", setC.y + 20)
//       .attr("dy", ".35em")
//       .style("text-anchor", "middle")
//       .style("fill", "black")
//       .text((d) => `Size: ${d}`);
//   }, [sets]);

//   return <div ref={vennRef}></div>;
// };

// export default VennDiagram;
