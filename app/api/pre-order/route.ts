import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await getMongoDb();
    
    const preOrder = {
      ...data,
      plan: data.plan || "premium",
      createdAt: new Date(),
      status: "pending"
    };

    const result = await db.collection("pre_orders").insertOne(preOrder);

    revalidatePath("/admin/pre-orders");

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error("Error creating pre-order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getMongoDb();
    const preOrders = await db.collection("pre_orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(preOrders);
  } catch (error: any) {
    console.error("Error fetching pre-orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
