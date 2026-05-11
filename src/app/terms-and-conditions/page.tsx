import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/policy-page";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Terms and Conditions | Readr",
  description: policies.terms.description,
};

export default function TermsAndConditionsPage() {
  return <PolicyPage policy={policies.terms} />;
}
