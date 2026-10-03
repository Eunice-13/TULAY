import Image from "next/image";

export function TulayLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/tulay-logo.png"
      alt="TULAY"
      width={160}
      height={56}
      priority
      className={`h-10 w-auto sm:h-14 ${className}`}
    />
  );
}
