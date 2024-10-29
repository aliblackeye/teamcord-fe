import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <div className="min-h-[63px] gap-2 flex-col border-r h-16 flex items-center justify-end">
      <Link href="/">
        <div className="min-w-10 min-h-10 text-2xl font-bold text-center flex justify-center items-center rounded-full bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-300/80 dark:hover:bg-neutral-700 transition-colors ease-in-out">
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={32}
            height={32}
          />
        </div>
      </Link>
      <hr className="w-8 h-1" />
    </div>
  );
};
