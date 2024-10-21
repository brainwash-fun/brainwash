// import { getPoliticianData } from "@/lib/api";
import PoliticianProfile from "@/components/PoliticianProfile";
import { Politician } from "@/components/PoliticianProfile";

export default async function PoliticianPage({
  params,
}: {
  params: { name: string };
}) {
  const politicianData: Politician = {
    name: "John Doe",
    image: "https://example.com/john-doe.jpg",
    party: "Democrat",
    state: "California",
    policies: [
      { topic: "Healthcare", stance: "Support" },
      { topic: "Education", stance: "Oppose" },
    ],
  };

  return <PoliticianProfile politician={politicianData} />;
}
