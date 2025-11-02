"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+61 ",
    assistance: "",
    additionalInfo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    if (!formData.firstName) formErrors.firstName = "First name is required";
    if (!formData.lastName) formErrors.lastName = "Last name is required";
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      formErrors.email = "Invalid email address";
    }
    if (!formData.phone || formData.phone === "+61 ") {
      formErrors.phone = "Phone number is required";
    } else if (!formData.phone.startsWith("+61 4")) {
      formErrors.phone = "Phone number must start with '4' or '04'.";
    } else if (formData.phone.replace(/\s/g, "").length < 12) {
      formErrors.phone = "Invalid Phone number";
    }
    if (!formData.assistance) formErrors.assistance = "Please select an option";
    if (!formData.additionalInfo)
      formErrors.additionalInfo = "Please explain your problem";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let input = value;

    if (!input.startsWith("+61 ")) {
      input = "+61 ";
    }

    let numberPart = input.slice(4).replace(/[^0-9]/g, "");

    if (numberPart.startsWith("0") && numberPart.length > 1) {
      numberPart = numberPart[1] + numberPart.slice(2);
    }

    if (numberPart.length > 9) {
      numberPart = numberPart.slice(0, 9);
    }

    const formattedNumber =
      "+61 " + numberPart.replace(/(\d{3})(\d{3})(\d{3})?/, "$1 $2 $3").trim();

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "This field cannot be empty." }));
    }

    setFormData((prev) => ({ ...prev, phone: formattedNumber }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "This field cannot be empty." }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          assistance_type: formData.assistance,
          message: formData.additionalInfo,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (
        response.ok &&
        (data?.message === "Contact request submitted successfully" ||
          response.ok)
      ) {
        router.push("/contact/message-sent");
        return;
      }
      router.push("/page/error");
    } catch {
      router.push("/page/error");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div>
      <Head>
        <title>Primed Clinic | Contact Our Team</title>
      </Head>

      {/* Hero */}
      <section className="bg-linear-to-tr from-[#007b7f] to-[#009999]">
        <div className="container mx-auto px-4">
          <div className="py-20 md:py-24 text-center text-white max-w-[540px] mx-auto">
            <h2 className="text-[41px] font-bold mb-4">Get In Touch Today</h2>
            <p className="font-light text-white/95">
              If you&#39;d like to get in touch with our team here at Primed
              Clinic, fill out the form and we&#39;ll be with you shortly.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <main>
        <section className="bg-secondary">
          <div className="container mx-auto px-4">
            <div className="py-16">
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-[600px] mx-auto bg-card border border-border rounded-lg p-6 md:p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full rounded-md px-3 py-3 bg-background text-foreground border ${
                        errors.firstName
                          ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                          : "border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full rounded-md px-3 py-3 bg-background text-foreground border ${
                        errors.lastName
                          ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                          : "border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-md px-3 py-3 bg-background text-foreground border ${
                      errors.email
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                        : "border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="+61 4XX XXX XXX"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full rounded-md px-3 py-3 bg-background text-foreground border ${
                      errors.phone
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                        : "border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="assistance"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    How can we assist you?
                  </label>
                  <select
                    id="assistance"
                    name="assistance"
                    value={formData.assistance}
                    onChange={handleChange}
                    className={`w-full rounded-md px-3 py-3 bg-background text-foreground border ${
                      errors.assistance
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                        : "border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    }`}
                  >
                    <option value="">Open this select menu</option>
                    <option value="General Health Inquiry">
                      General Health Inquiry
                    </option>
                    <option value="Ask About Our Services">
                      Ask About Our Services
                    </option>
                    <option value="Billing & Payment Inquiries">
                      Billing & Payment Inquiries
                    </option>
                    <option value="Update Personal or Medical Information">
                      Update Personal or Medical Information
                    </option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Submit a Complaint">
                      Submit a Complaint
                    </option>
                  </select>
                  {errors.assistance && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.assistance}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="additionalInfo"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Additional information to assist you
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows={4}
                    placeholder="Write down your message"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className={`w-full rounded-md px-3 py-3 bg-background text-foreground border ${
                      errors.additionalInfo
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                        : "border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    }`}
                  />
                  {errors.additionalInfo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.additionalInfo}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[4px] px-4 py-3 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-70"
                >
                  {loading ? "Sending..." : "SUBMIT"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
