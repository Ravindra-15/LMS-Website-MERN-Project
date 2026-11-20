import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "./Contact";
import PageHeader from "./PageHeader";

const LAST_UPDATED = "20 November 2026";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information we collect",
    content: (
      <>
        <p>When you use E-Learning we collect:</p>
        <ul>
          <li>
            <strong>Account details</strong>: your name, email address and a
            securely hashed version of your password.
          </li>
          <li>
            <strong>Profile photo</strong>: if you choose to upload one.
          </li>
          <li>
            <strong>Learning activity</strong>: the courses you enrol in and
            which lectures you have completed.
          </li>
          <li>
            <strong>Purchase records</strong>: which courses you bought, the
            amount and the payment status. Card details are handled entirely by
            our payment provider and never reach our servers.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How we use your information",
    content: (
      <ul>
        <li>To create and manage your account and keep you signed in.</li>
        <li>To give you access to the courses you have purchased.</li>
        <li>To save and show your course progress.</li>
        <li>To process payments and keep purchase records.</li>
        <li>To respond to messages you send us.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "3. Cookies",
    content: (
      <p>
        We use a single essential cookie to keep you signed in. It is marked
        HTTP-only so it cannot be read by scripts in the page, and it is removed
        when you log out. We also remember your light/dark theme choice in your
        browser&apos;s local storage. We do not use advertising or tracking
        cookies.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "4. Third-party services",
    content: (
      <>
        <p>We rely on trusted providers to run the platform:</p>
        <ul>
          <li>
            <strong>Stripe</strong> processes course payments.
          </li>
          <li>
            <strong>Cloudinary</strong> stores profile photos, course
            thumbnails and lecture videos.
          </li>
          <li>
            <strong>MongoDB</strong> hosts our database.
          </li>
        </ul>
        <p>We do not sell your personal information to anyone.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "5. Data security",
    content: (
      <p>
        Passwords are hashed before they are stored, and sign-in tokens are kept
        in secure, HTTP-only cookies. No system is perfectly secure, but we take
        reasonable steps to protect your data.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "6. Your rights",
    content: (
      <p>
        You can view and update your name and profile photo at any time on your{" "}
        <Link to="/profile">Profile</Link> page. To request a copy of your data
        or to delete your account, contact us using the details below.
      </p>
    ),
  },
  {
    id: "changes",
    title: "7. Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. When we do, we will change
        the &quot;last updated&quot; date at the top of this page.
      </p>
    ),
  },
  {
    id: "contact",
    title: "8. Contact us",
    content: (
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use our{" "}
        <Link to="/contact">contact page</Link>.
      </p>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="Privacy policy"
        title="Your privacy matters"
        subtitle={`Last updated: ${LAST_UPDATED}`}
      />

      <div className="max-w-6xl mx-auto px-4 py-16 grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* Table of contents — sticks below the fixed navbar on large screens */}
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-2 text-sm">
            <p className="font-semibold mb-3">On this page</p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </nav>

        <article
          className="space-y-10 text-muted-foreground leading-relaxed
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_p]:mb-3
            [&_strong]:text-foreground
            [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a:hover]:underline"
        >
          <p>
            This policy explains what information E-Learning collects when you
            use the website, how we use it, and the choices you have.
          </p>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
