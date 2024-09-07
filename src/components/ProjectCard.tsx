"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  imageSrc: string;
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, imageSrc, link }) => {
  return (
    <Link href={link}>
      <motion.div
        className="w-[400px] h-[200px] bg-white rounded-lg shadow-md border border-black overflow-hidden cursor-pointer relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 150 }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </motion.div>
    </Link>
  );
};

export default ProjectCard;
