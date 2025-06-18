'use server';
import { ID, Query } from "node-appwrite"
import { DATABASE_ID, databases, NEXT_PUBLIC_APPWRITE_PROJECT_KEY, NEXT_PUBLIC_BUCKET_ID, NEXT_PUBLIC_ENDPOINT, PATIENT_COLLECTION_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";
import { IdentificationTypes } from "@/constants";
import {InputFile} from  "node-appwrite/file"
import { stringify } from "querystring";
export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        console.log("User created successfully:", {newUser});
        return parseStringify(newUser);
    } catch ( error :any) {
        if(error && error?.code === 409) {
            // User already exists
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])
            return documents?.users[0];
        }
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        return parseStringify(user);
    } catch (error: any) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patient = await databases.listDocuments(
            DATABASE_ID!, 
            PATIENT_COLLECTION_ID!, 
            [Query.equal('userId', [userId])]
        );
        return parseStringify(patient.documents[0]);
    } catch (error: any) {
        console.error("Error fetching patient:", error);
        throw error;
    }
}


export const registerPatient = async ({identificationDocument, ... patient}:RegisterUserParams)=>{
    try{
        let file;
        if(identificationDocument){
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get("blobFile") as Blob,
                identificationDocument?.get("fileName") as string
            )

            file = await storage.createFile(NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile)
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${NEXT_PUBLIC_APPWRITE_PROJECT_KEY}`,...patient
            }
        )
        return parseStringify(newPatient)
    } catch(error){
        console.log(error);
    }
}