import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log("📩 MPESA webhook received:", body);

    const { error } = await supabase.from("payments").insert({
      mpesa_receipt: body?.TransID,
      amount: body?.TransAmount,
      phone_number: body?.MSISDN,
      raw_payload: body,
      status: "processed"
    });

    if (error) {
      console.error("DB error:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}