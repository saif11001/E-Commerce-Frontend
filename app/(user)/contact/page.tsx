import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-14 text-center">
        <h1 className="text-3xl font-extrabold text-black sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
          Have a question about an order, a product, or just want to say hi?
          We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <ContactInfoCard
            icon={<Mail size={20} />}
            title="Email us"
            value="saifeldeen409@gmail.com"
          />
          <ContactInfoCard
            icon={<Phone size={20} />}
            title="Call us"
            value="+20 112 861 1001"
          />
          <ContactInfoCard
            icon={<MapPin size={20} />}
            title="Visit us"
            value="123 Fashion Ave, Cairo, Egypt"
          />

          <div className="rounded-3xl bg-linear-to-b from-gray-800 via-gray-700 to-black p-6 text-white">
            <h3 className="text-lg font-bold">Support hours</h3>
            <p className="mt-2 text-sm text-gray-300">
              Sunday – Thursday: 9:00 AM – 6:00 PM
            </p>
            <p className="text-sm text-gray-300">
              Friday – Saturday: Closed
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white">
            <MessageCircle size={26} />
          </div>

          <h3 className="mt-6 text-xl font-bold text-black">
            Chat with our support team
          </h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Get real-time help with your orders, products, or account —
            usually replies within a few minutes.
          </p>

          <Link
            href="/support"
            className="mt-8 rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-10 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Start a Conversation
          </Link>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

function ContactInfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-black">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-black">{title}</p>
        <p className="text-sm text-gray-500">{value}</p>
      </div>
    </div>
  );
}