import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";

export default function NotFound() {
  return (
    <section className="gutter mx-auto grid min-h-[80vh] max-w-[60rem] place-items-center pt-[calc(var(--header-h)+3rem)] pb-24 text-center">
      <div>
        <PupBuddy pose="sit" className="mx-auto w-52" label="Teddy, tilting his head" />
        <h1 className="font-plush mt-6 text-big">This page wandered off.</h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-cocoa-soft">We couldn&apos;t find what you were looking for. Our puppies are right this way.</p>
        <Link href="/puppies" className="btn btn-primary mt-8">
          See available puppies
        </Link>
      </div>
    </section>
  );
}
