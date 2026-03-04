import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be under 255 characters"),
  subject: z.enum(["General Inquiry", "Job Opportunity", "Collaboration", "Other"]),
  message: z.string().trim().min(1, "Message is required").max(1500, "Message must be under 1500 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const contactMethods = [
  {
    title: "Email",
    value: "hello@ameetpandey.in",
    actionLabel: "Send Email",
    href: "mailto:hello@ameetpandey.in",
    icon: Mail,
  },
  {
    title: "LinkedIn",
    value: "linkedin.com/in/ameetpandey",
    actionLabel: "View Profile",
    href: "https://linkedin.com/in/ameetpandey",
    icon: Linkedin,
  },
  {
    title: "GitHub",
    value: "github.com/ameetpandey",
    actionLabel: "View Repositories",
    href: "https://github.com/ameetpandey",
    icon: Github,
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    },
  });

  const onSubmit = async (_values: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Message sent", description: "Thanks for reaching out. I will get back to you soon." });
      form.reset({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="site-container space-y-6">
        <header className="surface-card p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl">Get In Touch</h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            Interested in discussing GRC projects or opportunities? Feel free to reach out.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" autoComplete="name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                            <SelectItem value="Job Opportunity">Job Opportunity</SelectItem>
                            <SelectItem value="Collaboration">Collaboration</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Message <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="How can I help you?" className="min-h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Sending..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.title}>
                  <CardContent className="flex items-center justify-between gap-4 p-6">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Icon className="h-4 w-4" />
                        {method.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{method.value}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={method.href} target={method.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {method.actionLabel}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            <Card>
              <CardHeader>
                <CardTitle>Additional Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <a href="/resume.pdf" download className="block hover:underline">
                  Download Resume
                </a>
                <Link to="/grc-projects" className="block hover:underline">
                  View Portfolio Projects
                </Link>
                <Link to="/blog" className="block hover:underline">
                  Blog / Writeups
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
