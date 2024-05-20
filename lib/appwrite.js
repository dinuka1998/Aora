import { Client, Account, ID, Avatars, Databases } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.syntrasolutions.aora",
  projectId: "6648d0940012c0a53241",
  databaseId: "6648d232002929035280",
  userCollectionId: "6648d25f0026303d2c69",
  videoCollectionId: "6648d28a002b13a01362",
  storageId: "6648d3ce000b491cbf99",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccout = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccout) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccout.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(emial, password) {
  try {
    const session = await account.createEmailPasswordSession(emial, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
