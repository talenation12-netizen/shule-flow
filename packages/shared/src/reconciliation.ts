import { createClient } from "@supabase/supabase-js";

export async function reconcilePayment(
  supabase: ReturnType<typeof createClient>,
  paymentId: string
) {
  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (!payment) return;

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

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("student_id", student.id)
    .eq("status", "unpaid")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (!invoice) return;

  const newBalance = invoice.balance - payment.amount;

  await supabase.from("invoices").update({
    balance: newBalance,
    status: newBalance <= 0 ? "paid" : "partial"
  }).eq("id", invoice.id);

  await supabase.from("payments").update({
    status: "reconciled",
    student_id: student.id,
    invoice_id: invoice.id
  }).eq("id", paymentId);
}