import Link from "next/link";
import { clickedBookAtom } from "@/app/lib/atoms";
import { useAtomValue } from "jotai";

export default function Page() {
  const clickedBook = useAtomValue(clickedBookAtom);

  return <div></div>;
}
