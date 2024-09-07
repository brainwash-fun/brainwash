import { Dela_Gothic_One } from "next/font/google";
import { stanceTheme } from "@/styles/theme";

const delaGothicOne = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
});

export default function StanceTitle() {
  return (
    <h1
      className={`${delaGothicOne.className} text-6xl text-center mb-12`}
      style={{ color: stanceTheme.palette.secondary.main }}
    >
      STANCE
    </h1>
  );
}
