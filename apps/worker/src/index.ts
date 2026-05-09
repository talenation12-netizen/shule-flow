import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { createClient } from "@supabase/supabase-js";
import { reconcilePayment } from "@repo/shared";

const connection = new IORedis(process.env.REDIS_URL!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const worker = new Worker(
  "reconciliation",
  async (job) => {
    console.log("⚡ processing job:", job.data);

    const { paymentId } = job.data;
    await reconcilePayment(supabase, paymentId);
  },
  { connection }
);

// Startup confirmation
console.log("🔥 worker is alive");