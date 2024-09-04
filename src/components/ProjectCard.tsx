"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  imageSrc: string;
  link: string;
}

export default function ProjectCard({
  title,
  imageSrc,
  link,
}: ProjectCardProps) {
  return (
    <Link href={link}>
      <motion.div
        className="w-[400px] h-[200px] bg-white rounded-lg shadow-md border border-black overflow-hidden cursor-pointer relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
      </motion.div>
    </Link>
  );
}
