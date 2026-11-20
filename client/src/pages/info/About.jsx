import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  LineChart,
  PlayCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader";

const features = [
  {
    icon: BookOpen,
    title: "Curated courses",
    text: "Structured courses built by instructors, from first steps to advanced topics.",
  },
  {
    icon: PlayCircle,
    title: "Learn by watching",
    text: "Bite-sized video lectures you can pause, rewatch and take at your own pace.",
  },
  {
    icon: LineChart,
    title: "Track your progress",
    text: "Mark lectures complete and pick up exactly where you left off.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "Purchases are processed by Stripe. We never see or store your card details.",
  },
  {
    icon: GraduationCap,
    title: "Lifetime access",
    text: "Once you buy a course it stays in My Learning, ready whenever you are.",
  },
  {
    icon: Users,
    title: "Built for everyone",
    text: "Students, career switchers and working professionals all learn here.",
  },
];

const About = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="About us"
        title="Learning that fits your life"
        subtitle="E-Learning helps anyone pick up new skills online, with practical courses taught by people who use those skills every day."
      />

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Our mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Good education shouldn&apos;t depend on where you live or when you
            are free. We bring focused, hands-on courses online so you can
            learn at your own pace, on any device.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Instructors publish courses and lectures, and students enrol, watch
            and track their progress, all in one place.
          </p>
        </div>
        <Card className="bg-card">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-semibold">How it works</h3>
            <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
              <li>Browse or search for a course that interests you.</li>
              <li>Preview the course details and first lecture.</li>
              <li>Enrol and get instant access in My Learning.</li>
              <li>Watch lectures and mark them complete as you go.</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="bg-muted/40 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Why learners choose us
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon, title, text }) => { const Icon = icon; return (
              <Card
                key={title}
                className="bg-card transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="w-11 h-11 rounded-lg bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center">
                    <Icon className="text-blue-600 dark:text-blue-400" size={22} />
                  </div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {text}
                  </p>
                </CardContent>
              </Card>
            ); })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Ready to start learning?</h2>
        <p className="text-muted-foreground">
          Explore the catalogue and find your next course today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => navigate("/course/search?query")}>
            Explore courses
          </Button>
          {!user && (
            <Button variant="outline" onClick={() => navigate("/login")}>
              Create an account
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
