"use client";

import { Roboto_Flex } from "next/font/google";
import styles from "./Title.module.css";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
});

export default function Title() {
  const title = "Brainwash";

  return (
    <div className={styles.wrapper}>
      <h1 className={`${robotoFlex.variable} ${styles.container}`}>
        {title.split("").map((char, index) => (
          <span
            key={index}
            className={styles.char}
            style={{ "--char-index": index } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
