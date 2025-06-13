import { ID, Query } from "node-appwrite"
import { users } from "../appwrite.config"

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