"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export default function EmailForm() {
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
        },
      );

      if (response.ok) {
        setFormStatus("Thanks for your message! I'll get back to you soon.");
        form.reset();
      } else {
        setFormStatus(
          "Oops! There was a problem sending your message. Please try again.",
        );
      }
    } catch (error) {
      setFormStatus(
        "Oops! There was a problem sending your message. Please try again.",
      );
      console.error(error);
    }
  };

  return (
    <>
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
            className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 px-4 py-2 text-base font-medium shadow-sm transform hover:scale-105 transition-transform duration-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-purple-700 dark:via-indigo-800 dark:to-blue-900"
            title="Send Message"
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
    </>
  );
}
