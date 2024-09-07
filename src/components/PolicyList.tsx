interface Policy {
  topic: string;
  stance: string;
}

export default function PolicyList({ policies }: { policies: Policy[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Policies</h2>
      <ul className="space-y-4">
        {policies.map((policy, index) => (
          <li key={index} className="border-b pb-2">
            <h3 className="font-semibold">{policy.topic}</h3>
            <p>{policy.stance}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
