import Image from "next/image";
import PolicyList from "./PolicyList";

interface Politician {
  name: string;
  image: string;
  party: string;
  state: string;
  policies: Array<{ topic: string; stance: string }>;
}

export default function PoliticianProfile({
  politician,
}: {
  politician: Politician;
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-8">
        <Image
          src={politician.image}
          alt={politician.name}
          width={200}
          height={200}
          className="rounded-full mr-8"
        />
        <div>
          <h1 className="text-3xl font-bold">{politician.name}</h1>
          <p className="text-xl">
            {politician.party} - {politician.state}
          </p>
        </div>
      </div>
      <PolicyList policies={politician.policies} />
    </div>
  );
}
