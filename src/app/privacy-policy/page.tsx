import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/policy-page";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Privacy Policy | Readr",
  description: policies.privacy.description,
};

export default function PrivacyPolicyPage() {
  return <PolicyPage policy={policies.privacy} />;
}
