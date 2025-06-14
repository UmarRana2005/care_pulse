import * as sdk from 'node-appwrite';

export const {
  NEXT_PUBLIC_APPWRITE_PROJECT_KEY,
  NEXT_PUBLIC_API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT
} = process.env;

// ✅ Validate env vars before using
if (!NEXT_PUBLIC_ENDPOINT || !NEXT_PUBLIC_APPWRITE_PROJECT_KEY || !NEXT_PUBLIC_API_KEY) {
  throw new Error("Appwrite config error: Missing NEXT_ENDPOINT, APPWRITE_PROJECT_KEY, or API_KEY.");
}

const client = new sdk.Client();

client
  .setEndpoint(NEXT_PUBLIC_ENDPOINT)
  .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_KEY)
  .setKey(NEXT_PUBLIC_API_KEY);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
