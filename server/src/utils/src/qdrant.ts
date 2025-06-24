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

async function fetch() {
    try {
        const result = await qdrantClient.getCollections();
        console.log('List of collections:', result.collections);
    } catch (err) {
        console.error('Could not get collections:', err);
    }
}
fetch()

// import { QdrantClient } from '@qdrant/js-client-rest'


// export const qdrantClient = new QdrantClient({ url: "http://localhost:6333" });
// async function initialiseDb() {
//     try {
//         await qdrantClient.createCollection("thoughts", {
//             vectors: {
//                 size: 768,
//                 distance: "Cosine"
//             }
//         })
//     } catch (err) {
//         console.log(err)
//     }

// }


// initialiseDb()