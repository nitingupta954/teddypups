import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isAdminRequest } from "@/lib/admin-auth";
import { listEnquiries } from "@/lib/db";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false, follow: false } };

const dateFormat = new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" });

async function EnquiryTable() {
  // Defence in depth: proxy.ts challenges the browser, but the data is only
  // read after this page verifies the credentials itself.
  if (!isAdminRequest((await headers()).get("authorization"))) notFound();
  const enquiries = await listEnquiries();

  if (!enquiries.length) return <p className="mt-8 text-cocoa-soft">No enquiries yet.</p>;
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border-2 border-cocoa/20 bg-milk">
      <table className="w-full min-w-[56rem] text-left text-sm">
        <thead className="bg-honey-soft">
          <tr>
            {["Received", "Name", "Phone", "Email", "Area", "Puppy", "Message"].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enquiries.map((e) => (
            <tr key={e.id} className="border-t border-cocoa/10 align-top">
              <td className="px-4 py-3 whitespace-nowrap">{dateFormat.format(new Date(e.createdAt))}</td>
              <td className="px-4 py-3 font-semibold">{e.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <a className="link-ink" href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  {e.phone}
                </a>
              </td>
              <td className="px-4 py-3">{e.email && <a className="link-ink" href={`mailto:${e.email}`}>{e.email}</a>}</td>
              <td className="px-4 py-3">{e.area}</td>
              <td className="px-4 py-3">{e.puppyLabel}</td>
              <td className="max-w-md px-4 py-3 whitespace-pre-line">{e.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPage() {
  return (
    <section className="gutter mx-auto max-w-[110rem] pt-[calc(var(--header-h)+3rem)] pb-24">
      <h1 className="font-plush text-big">Enquiries</h1>
      <Suspense fallback={<p className="mt-8 text-cocoa-soft">Loading…</p>}>
        <EnquiryTable />
      </Suspense>
    </section>
  );
}
