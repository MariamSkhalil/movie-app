import { Client, Databases, ID, Query } from "appwrite"

const DATABASE_ID= import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID= import.meta.env.VITE_APPWRITE_COLLECTION_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT

const client= new Client()
.setEndpoint(ENDPOINT)
.setProject(PROJECT_ID)

const database= new Databases(client)

export const updateWatchlistCount = async (movie) => {
  try {
    // check if this movie already exists in DB
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("movie_id", movie.id)]
    );

    if (result.documents.length > 0) {
      // already exists → increment count
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      // doesn’t exist → create it
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export const getTrendingMovies =async()=>{
    try {
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,
            [Query.limit(5), Query.orderDesc("count") ])
        return result.documents
    } catch (error) {
        console.error(error)
    }
}