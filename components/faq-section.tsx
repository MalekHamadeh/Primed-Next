"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = useMemo(
    () => [
      {
        question: "What is Primed?",
        answer:
          "Primed is Australia's easiest to use online platform which connects you to our experienced clinicians for access to treatments and medical programs. After a short online health evaluation, our doctors will determine if alternative healthcare is clinically appropriate for you, and provide you with a plan to help you reach your goals faster.\nWe are passionate about therapies and services for optimisation, performance and overall wellness, providing our patients with the highest standard of care with guidance every step of the way. ",
      },
      {
        question: "What do we offer?",
        answer:
          "We have an offering that others do not:\n• Free initial consultations\n• On-going assessments & consultations included in monthly healthcare cost\n• Personalised approach to healthcare\n• Better pricing than other providers\n• 7-Day Live Chat support\n• No lock-in contracts\n• No service charges or hidden fees",
      },
      {
        question: "How much does it cost to get started?",
        answer:
          "Getting started with Primed is $0.\nWe do not charge for any initial consultations or registration fees.",
      },
      {
        question: "How much does treatment cost?",
        answer:
          "Treatment costs will range from patient to patient, depending on a number of factors including the condition, frequency and dosages needed to achieve your personal goals. We understand healthcare should be affordable, which is why we are better priced than other providers. ‍\nOur personalised plans include the cost of the treatment, and also include the cost of monthly medical review and clinical support.\nThis includes streamlined delivery to your door – and all follow-up consultations and ongoing healthcare from our team of dedicated clinicians.",
      },
      {
        question: "How do I book an appointment with a doctor?",
        answer:
          "All you need to do is fill out the online Form here.\nOur clinicians will assess your medical information and use it in consultation to determine suitable treatments for you where appropriate. ‍\nExisting patients have access to their personal dashboard, where they can book consultations where needed, at no extra cost.",
      },
      {
        question: "How long does a treatment plan last?",
        answer:
          "Our plans are personalised and the duration is unique to each individual. \nYou will have access to free monthly medical reviews with our clinicians, who are available to support and guide you on your healthcare journey.\nOur clinicians can tailor and modify your plan on an as-needed basis without any hassle, and at no extra cost.\nYou can opt to cancel or pause your plan at any time..‍",
      },
      {
        question: "How do I access my treatment plan?",
        answer:
          "Treatment plans are securely available and accessible through your patient portal. You can view, download, and manage your health information at your convenience.",
      },
      {
        question: "Is shipping free? How is it handled for refrigerated items?",
        answer:
          "Yes, all orders include free shipping and can be tracked via your patient dashboard, or reach out to the Live Chat for direct assistance. Refrigerated items are packaged with thermal insulation and gel ice packs to ensure temperature stability throughout transit.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "You can choose to opt-out of our service at any time, for whatever reason, without any hidden fees. No lock-in contracts. No hidden fees.\nWe guarantee you have the freedom to be in control of the decisions you make with your health and therapy.",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left intro */}
        <div className="flex flex-col justify-center">
          <h4 className="text-[30px] font-semibold mb-6 max-w-[400px]">
            Get Answers To All{" "}
            <span className="text-primary">Your Questions</span>
          </h4>
          <p className="text-[15px] max-w-[430px] text-muted-foreground mb-6">
            Here you can find answers to all your question, feel free to contact
            us if you didn’t find the answers to your questions
            <Link
              href="/contact"
              className="text-primary"
            >
              {" "}
              here.
            </Link>
          </p>
          <Link
            href="/contact"
            scroll
          >
            <button className="bg-primary-dark text-white rounded-[4px] px-4 py-2 w-full max-w-[170px] hover:opacity-80">
              Contact Us
            </button>
          </Link>
        </div>

        {/* Right FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const lines = faq.answer
              .split("\n")
              .map((l) => l.trim())
              .filter((l) => l.length > 0);
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-md shadow-sm"
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-[18px] font-normal text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    size={22}
                  />
                </button>
                <div
                  className={`${
                    isOpen ? "block opacity-100" : "hidden opacity-0"
                  } px-5 pb-5 text-[15px] text-muted-foreground transition-opacity`}
                >
                  {lines.map((line, i) => (
                    <p
                      key={i}
                      className="mb-2"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
