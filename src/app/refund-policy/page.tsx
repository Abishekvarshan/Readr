import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/policy-page";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Refund Policy | Readr",
  description: policies.refund.description,
};

export default function RefundPolicyPage() {
  return <PolicyPage policy={policies.refund} />;
}
