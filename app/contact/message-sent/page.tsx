import Head from "next/head";

export default function ContactMessageSentPage() {
  return (
    <div>
      <Head>
        <title>Primed Clinic | Message Sent</title>
      </Head>
      <section className="bg-linear-to-tr from-[#007b7f] to-[#009999]">
        <div className="container mx-auto px-4">
          <div className="py-20 md:py-24 text-center text-white max-w-[540px] mx-auto">
            <h2 className="text-[41px] font-bold mb-4">Message Sent</h2>
            <p className="font-light text-white/95">
              Thank you for contacting us. We&#39;ll be with you shortly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
