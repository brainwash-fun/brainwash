import { getPoliticianData } from "@/lib/api";
import PoliticianProfile from "@/components/PoliticianProfile";

export default async function PoliticianPage({
  params,
}: {
  params: { name: string };
}) {
  const politicianData = await getPoliticianData(params.name);

  return <PoliticianProfile politician={politicianData} />;
}
