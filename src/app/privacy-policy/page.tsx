import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | College Circle AI",
  description:
    "At College Circle AI, we prioritize your privacy and the protection of your data. Learn how we protect, process, and respect your academic data.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
