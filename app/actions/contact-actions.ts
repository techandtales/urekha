"use server";

import { getMongoDb } from "@/lib/mongodb";

export async function submitContactForm(formData: { name: string; email: string; message: string }) {
  try {
    const db = await getMongoDb();
    const collection = db.collection("contact_messages");

    const result = await collection.insertOne({
      ...formData,
      status: "new",
      createdAt: new Date(),
    });

    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    return { success: false, error: "System failure. Please try again later." };
  }
}

export async function getContactMessages() {
  try {
    const db = await getMongoDb();
    const collection = db.collection("contact_messages");

    const messages = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return { 
        success: true, 
        messages: messages.map(m => ({
            ...m,
            _id: m._id.toString(),
            createdAt: m.createdAt.toISOString()
        }))
    };
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return { success: false, error: "Failed to load messages." };
  }
}

export async function updateMessageStatus(id: string, status: "read" | "replied" | "archived") {
    // We'll need ObjectId for this
    const { ObjectId } = require("mongodb");
    try {
        const db = await getMongoDb();
        const collection = db.collection("contact_messages");
        
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );
        return { success: true };
    } catch (error) {
        console.error("Failed to update message status:", error);
        return { success: false };
    }
}
