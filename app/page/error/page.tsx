import Head from "next/head";

export default function GenericErrorPage() {
  return (
    <div>
      <Head>
        <title>Primed Clinic | Error</title>
      </Head>
      <section className="bg-[#1e6f59] min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-[640px] mx-auto py-16">
            <h1 className="text-[64px] font-black leading-none m-0">Oops</h1>
            <p className="text-2xl mt-2">Something went wrong</p>
            <p className="text-white/80 mt-4">
              Please try again later or contact support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
