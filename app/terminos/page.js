import LegalPage, { legalMetadata } from "@/components/legal/LegalPage";
import { terminos } from "@/data/legal";

export const metadata = legalMetadata(terminos);

export default function Terminos() {
  return <LegalPage doc={terminos} />;
}
