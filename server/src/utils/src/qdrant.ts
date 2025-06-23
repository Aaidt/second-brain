import { QdrantClient } from '@qdrant/js-client-rest'


export const qdrantClient = new QdrantClient({ url: "http://localhost:6333" });


async function initialiseDb() {
    try {
        await qdrantClient.createCollection("thoughts", {
            vectors: {
                size: 768,
                distance: "Cosine"
            }
        })
    } catch (err) {
        console.log(err)
    }

}


initialiseDb()