"use client";

import Section from "@/components/Section";
import { Send } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        "https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setFormStatus("Thanks for your message! I'll get back to you soon.");
        form.reset();
      } else {
        setFormStatus(
          "Oops! There was a problem sending your message. Please try again."
        );
      }
    } catch (error) {
      setFormStatus(
        "Oops! There was a problem sending your message. Please try again."
      );
    }
  };

  return (
    <Section id="contact" title="Contact Me">
      <div className="mx-auto max-w-lg">
        <p className="mb-6 text-gray-600">
          Feel free to reach out to me for any inquiries or opportunities. I'll
          get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </button>
          </div>
        </form>
        {formStatus && (
          <div className="mt-4 rounded-md bg-green-100 p-4 text-green-700">
            {formStatus}
          </div>
        )}
      </div>
    </Section>
  );
}
