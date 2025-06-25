// import  { useEffect, useRef } from 'react';
// import { Network, DataSet, Node, Edge } from 'vis-network/standalone';
// import * as UMAP from 'umap-js';
// import { qdrantClient } from "../../../server/src/utils/src/qdrant";

// // Type definitions for Qdrant API responses
// interface QdrantVector {
//   [key: string]: number[] | number[][] | undefined;
// }

// interface QdrantPoint {
//   id: string | number;
//   vector?: number[] | QdrantVector | null; // Support dense, named, or sparse vectors
//   payload?: Record<string, any> | null;
//   shard_key?: string | number | null;
//   order_value?: number | null;
// }

// interface ScrollResponse {
//   points: QdrantPoint[];
// }

// interface SearchResult {
//   id: string | number;
//   score: number;
//   payload?: Record<string, any> | null;
//   vector?: number[] | QdrantVector | null;
// }

// // Type definitions for vis.js
// interface GraphNode extends Node {
//   id: string | number;
//   label: string;
//   x: number;
//   y: number;
// }

// interface GraphEdge extends Edge {
//   from: string | number;
//   to: string | number;
// }

// export function VectorGraph (){
//   const graphRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchAndVisualize = async () => {
//       try {
//         // Step 1: Fetch vectors from Qdrant collection
//         const collectionName = 'your_collection_name';
//         // @ts-ignore
//         const response: ScrollResponse = await qdrantClient.scroll(collectionName, {
//           limit: 100,
//           with_vector: true,
//           with_payload: true,
//         });

//         const points: QdrantPoint[] = response.points.filter(
//           (point): point is QdrantPoint => point.vector !== null && Array.isArray(point.vector)
//         ); // Filter points with valid dense vectors
//         const vectors: number[][] = points.map((point) => point.vector as number[]);
//         const payloads: (Record<string, any> | null | undefined)[] = points.map(
//           (point) => point.payload
//         );

//         // Step 2: Reduce dimensions using UMAP
//         const umap = new UMAP.UMAP({ nComponents: 2, nNeighbors: 5 });
//         const embeddings2D: number[][] = umap.fit(vectors);

//         // Step 3: Fetch nearest neighbors to simulate HNSW connections
//         const nodes: GraphNode[] = points.map((point, i) => ({
//           id: point.id,
//           label: payloads[i]?.name || `Node ${i}`,
//           x: embeddings2D[i][0] * 100,
//           y: embeddings2D[i][1] * 100,
//         }));

//         const edges: GraphEdge[] = [];
//         for (let i = 0; i < points.length; i++) {
//             // @ts-ignore
//           const searchResponse: SearchResult[] = await qdrantClient.search(collectionName, {
//             vector: vectors[i],
//             limit: 3,
//             with_payload: false,
//           });
//           searchResponse.forEach((result) => {
//             if (result.id !== points[i].id) {
//               edges.push({ from: points[i].id, to: result.id });
//             }
//           });
//         }

//         // Step 4: Render graph using vis.js
//         const data = {
//           nodes: new DataSet<GraphNode>(nodes),
//           edges: new DataSet<GraphEdge>(edges),
//         };
//         const options = {
//           nodes: { shape: 'dot', size: 10, font: { size: 12 } },
//           edges: { width: 1, color: { color: '#848484' } },
//           physics: { enabled: true, stabilization: true },
//         };
//         if (graphRef.current) {
//           new Network(graphRef.current, data, options);
//         }
//       } catch (error) {
//         console.error('Error fetching or visualizing vectors:', error);
//       }
//     };

//     fetchAndVisualize();
//   }, []);

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#f7f7f8]">
//         <div ref={graphRef} style={{ height: '500px', border: '1px solid #ccc' }} />
//       </div>
//     </div>
//   );
// };

// export default VectorGraph;