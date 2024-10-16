import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/Logo_Loopin.svg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0 p-1 bg-white rounded" aria-label="Loopin">
      <Image src={logo} alt="Loopin" width={96} height={96} />
    </Link>
  );
}
