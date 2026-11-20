import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "./PageHeader";

// Change this to the inbox that should receive messages from the contact form.
export const CONTACT_EMAIL = "support@e-learning.com";

const initialForm = { name: "", email: "", subject: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }

    // There is no contact API on the server yet, so open the visitor's
    // email app with the message pre-filled.
    const body = `${message}\n\n— ${name} (${email})`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject.trim() || "Message from E-Learning website"
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    toast.success("Opening your email app to send the message.");
    setForm(initialForm);
  };

  const textareaClasses =
    "flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="Contact us"
        title="We'd love to hear from you"
        subtitle="Questions about a course, a payment or your account? Send us a message and we'll get back to you."
      />

      <section className="max-w-6xl mx-auto px-4 py-16 grid gap-8 lg:grid-cols-3">
        {/* Contact details */}
        <div className="space-y-6">
          {[
            {
              icon: Mail,
              title: "Email",
              body: (
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              ),
            },
            {
              icon: Clock,
              title: "Response time",
              body: "We usually reply within 1–2 business days.",
            },
            {
              icon: MessageSquare,
              title: "Course questions",
              body: "Include the course name so we can help faster.",
            },
          ].map(({ icon, title, body }) => { const Icon = icon; return (
            <Card key={title} className="bg-card">
              <CardContent className="p-5 flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center">
                  <Icon className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{title}</h3>
                  <div className="text-sm text-muted-foreground">{body}</div>
                </div>
              </CardContent>
            </Card>
          ); })}
        </div>

        {/* Form */}
        <Card className="bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
            <CardDescription>
              Fields marked * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={changeHandler}
                    placeholder="Your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={changeHandler}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={changeHandler}
                  placeholder="What is this about?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message *</Label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={changeHandler}
                  placeholder="Write your message..."
                  className={textareaClasses}
                />
              </div>
              <div>
                <Button type="submit">Send message</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;
