import { supabase } from "../lib/supabaseClient";

/**
 * Main reconciliation pipeline
 */
export async function reconcilePayment(paymentId: string) {
  // 1. Get payment
  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (!payment) return;

  // 2. Find student by phone number
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("phone_number", payment.phone_number)
    .single();

  if (!student) {
    await supabase
      .from("payments")
      .update({ status: "unmatched_student" })
      .eq("id", paymentId);
    return;
  }

  // 3. Find unpaid invoice
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("student_id", student.id)
    .eq("status", "unpaid")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (!invoice) {
    await supabase
      .from("payments")
      .update({
        status: "no_invoice",
        student_id: student.id
      })
      .eq("id", paymentId);
    return;
  }

  // 4. Apply payment
  const newBalance = invoice.balance - payment.amount;

  await supabase.from("invoices").update({
    balance: newBalance,
    status: newBalance <= 0 ? "paid" : "partial"
  }).eq("id", invoice.id);

  // 5. Mark payment as reconciled
  await supabase.from("payments").update({
    status: "reconciled",
    student_id: student.id,
    invoice_id: invoice.id
  }).eq("id", paymentId);
}