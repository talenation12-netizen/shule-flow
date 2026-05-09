import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { reconciliationQueue } from "../../../lib/queue";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log("📦 creating payment...");

    const fakePayment = {
      mpesa_receipt: `TEST-${Date.now()}`,
      amount: 1000,
      phone_number: "254700000000",
      status: "queued",
    };

    const { data, error } = await supabase
      .from("payments")
      .insert(fakePayment)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("📡 queueing...");

    const job = await reconciliationQueue.add("reconcile-payment", {
      paymentId: data.id,
    });

    return NextResponse.json({
      success: true,
      paymentId: data.id,
      jobId: job.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}