import Image from "next/image";

export function TulayLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/tulay-logo.png"
      alt="TULAY"
      width={160}
      height={56}
      priority
      unoptimized
      className={`h-10 w-[114px] object-cover object-[center_44%] sm:h-14 sm:w-40 ${className}`}
    />
  );
}
