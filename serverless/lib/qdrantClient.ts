import { QdrantClient } from '@qdrant/js-client-rest';
import * as dotenv from "dotenv"
dotenv.config()

const QDRANT_API_KEY = process.env.QDRANT_API_KEY
const QDRANT_CLOUD_URL = process.env.QDRANT_CLOUD_URL
if (!QDRANT_API_KEY || !QDRANT_CLOUD_URL) {
   throw new Error('Gemini api key/cloud URL not provided.')
}


export const qdrantClient = new QdrantClient({
   url: QDRANT_CLOUD_URL,
   apiKey: QDRANT_API_KEY
});

// async function fetch() {
//    try {
//       const result = await qdrantClient.getCollections();
//       console.log('List of collections:', result.collections);
//    } catch (err) {
//       console.error('Could not get collections:', err);
//    }
// }
// fetch()

// import { QdrantClient } from '@qdrant/js-client-rest'

// async function createIndex() {
//    const response = await qdrantClient.createPayloadIndex("second-brain", {
//       field_name: "userId",
//       field_schema: "keyword"  // or "uuid" if your IDs are UUIDs
//    });
//    console.log(response)
// }
//
// createIndex()
// async function initialiseDb() {
//    try {
//       await qdrantClient.createCollection("second-brain", {
//          vectors: {
//             size: 1024,
//             distance: "Cosine"
//          }
//       })
//    } catch (err) {
//       console.log(err)
//    }
//
// }
//
//
// initialiseDb()
