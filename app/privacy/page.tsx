export default function PrivacyPage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Privacy Policy
        </h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">
            Your privacy matters. This page outlines how we collect, use, and
            protect your data.
          </p>
          <h2>Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email, and
            health-related details you choose to share when using our services.
          </p>
          <h2>How We Use Information</h2>
          <p>
            We use your information to provide and improve our services,
            communicate with you, and meet legal and regulatory obligations.
          </p>
          <h2>Data Security</h2>
          <p>
            We implement technical and organisational measures to protect your
            data against unauthorised access, alteration, disclosure, or
            destruction.
          </p>
          <h2>Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            data, subject to applicable law.
          </p>
          <h2>Contact</h2>
          <p>For privacy enquiries, contact: privacy@primedclinic.com</p>
        </div>
      </main>
    </div>
  );
}
