import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const callback = payload?.Body?.stkCallback;

    const items = callback?.CallbackMetadata?.Item || [];

    const getValue = (name: string) =>
      items.find((i: any) => i.Name === name)?.Value;

    const mpesaReceipt =
      getValue("MpesaReceiptNumber") || callback?.CheckoutRequestID;

    const amount = getValue("Amount");
    const phone = getValue("PhoneNumber");

    if (!mpesaReceipt) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // store payment
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        mpesa_receipt: mpesaReceipt,
        amount: Number(amount),
        phone_number: phone,
        raw_payload: payload,
        status: "queued"
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "DB insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}