"use client";

import { useState } from "react";
import { contact, isPlaceholder } from "@/lib/content";
import { FORM_ENDPOINT } from "@/lib/site";
import s from "./Contact.module.scss";

type Status = "idle" | "sending" | "sent" | "error";

// A static export has no API routes. The form posts to an external
// endpoint if one is configured, otherwise it opens a pre-filled mail
// client. With neither, it says so rather than silently discarding input.
const hasEndpoint = FORM_ENDPOINT.length > 0;
const hasEmail = !isPlaceholder(contact.email);
const wired = hasEndpoint || hasEmail;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (hasEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        setStatus(res.ok ? "sent" : "error");
        if (res.ok) form.reset();
      } catch {
        setStatus("error");
      }
      return;
    }

    if (hasEmail) {
      const subject = `Voiceover enquiry — ${data.get("projectType") ?? ""}`;
      const body = [
        `Name: ${data.get("name") ?? ""}`,
        `Email: ${data.get("email") ?? ""}`,
        `Project type: ${data.get("projectType") ?? ""}`,
        "",
        `${data.get("brief") ?? ""}`,
      ].join("\n");
      window.location.href =
        `mailto:${contact.email}?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    }
  }

  return (
    <form className={s.card} onSubmit={onSubmit} noValidate={false}>
      <div className={s.row}>
        <div className={s.field}>
          <label htmlFor="f-name">Name</label>
          <input id="f-name" name="name" type="text" required placeholder="Your name" className={s.input} />
        </div>
        <div className={s.field}>
          <label htmlFor="f-email">Email</label>
          <input id="f-email" name="email" type="email" required placeholder="you@studio.com" className={s.input} />
        </div>
      </div>

      <div className={s.field}>
        <label htmlFor="f-type">Project type</label>
        <select id="f-type" name="projectType" className={s.input} defaultValue={contact.projectTypes[0]}>
          {contact.projectTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className={s.field}>
        <label htmlFor="f-brief">The brief</label>
        <textarea
          id="f-brief"
          name="brief"
          rows={5}
          required
          placeholder="Script length, tone, deadline, budget if you have one."
          className={`${s.input} ${s.textarea}`}
        />
      </div>

      <button type="submit" className={s.submit} disabled={!wired || status === "sending"}>
        {status === "sending" ? "Sending…" : "Send the brief"}
      </button>

      {status === "sent" && (
        <p className={s.ok} role="status">
          Thanks — that&rsquo;s through. You&rsquo;ll get a reply shortly.
        </p>
      )}
      {status === "error" && (
        <p className={s.err} role="alert">
          That didn&rsquo;t send. Try again, or email directly.
        </p>
      )}
      {!wired && (
        <p className={s.notice} role="note">
          Form not connected yet — set <code>FORM_ENDPOINT</code> or a real
          email in <code>src/lib/site.ts</code>. This notice disappears once
          either is filled in.
        </p>
      )}
    </form>
  );
}
