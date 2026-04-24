"use server";

import { getMongoDb } from "@/lib/mongodb";

export async function getSampleUsers() {
  const db = await getMongoDb();
  const collection = db.collection("sample_users");
  
  // Sort by createdAt descending
  const users = await collection.find({}).sort({ createdAt: -1 }).toArray();
  
  // Convert _id to string for serialization
  return users.map(user => ({
    ...user,
    _id: user._id.toString()
  }));
}

export async function createSampleUser(data: any) {
  const db = await getMongoDb();
  const collection = db.collection("sample_users");
  
  const payload = {
    ...data,
    createdAt: new Date().toISOString()
  };
  
  await collection.insertOne(payload);
  return { success: true, user: payload };
}
