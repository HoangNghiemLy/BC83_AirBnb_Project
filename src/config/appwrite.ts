import { Client, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("68754cd8000c46bd6c80");

export const account = new Account(client);
