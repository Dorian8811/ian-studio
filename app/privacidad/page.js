import LegalPage, { legalMetadata } from "@/components/legal/LegalPage";
import { privacidad } from "@/data/legal";

export const metadata = legalMetadata(privacidad);

export default function Privacidad() {
  return <LegalPage doc={privacidad} />;
}
