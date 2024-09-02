import { Dela_Gothic_One } from "next/font/google";

const delaGothicOne = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
});

export default function StanceTitle() {
  return (
    <h1 className={`${delaGothicOne.className} text-6xl text-center mb-12`}>
      STANCE
    </h1>
  );
}
