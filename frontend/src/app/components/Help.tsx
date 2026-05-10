import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Phone, Mail, MapPin, MessageCircle, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I check my eligibility for welfare schemes?",
    answer: "Click on the 'Eligibility Check' option in the sidebar and complete the step-by-step form. Our system will automatically match you with relevant schemes based on your information.",
  },
  {
    question: "What documents do I need to apply for schemes?",
    answer: "Generally, you'll need: Aadhaar Card, Income Certificate, Age Proof, Bank Account details, and Category Certificate (if applicable). Specific schemes may require additional documents.",
  },
  {
    question: "How long does it take to process an application?",
    answer: "Processing time varies by scheme. Typically, it takes 15-30 working days. You can track your application status in the 'History' section.",
  },
  {
    question: "Can I apply for multiple schemes at once?",
    answer: "Yes, you can apply for multiple schemes simultaneously as long as you meet the eligibility criteria for each scheme.",
  },
  {
    question: "What should I do if my application is rejected?",
    answer: "If your application is rejected, you'll receive detailed reasons. You can appeal the decision or reapply after addressing the issues mentioned in the rejection notice.",
  },
  {
    question: "How do I update my profile information?",
    answer: "Click on your profile icon in the top navigation bar to access your account settings where you can update your information.",
  },
];

export function Help() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get in touch with our support team
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow text-center">
          <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2">Phone Support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Mon-Fri: 9AM - 6PM
          </p>
          <p className="text-primary">95974-69159</p>
        </Card>

        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow text-center">
          <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2">Email Support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Response within 24 hours
          </p>
          <p className="text-primary break-all">support@welfare.gov.in</p>
        </Card>

        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow text-center">
          <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2">Live Chat</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Instant assistance available
          </p>
          <Button size="sm" className="bg-accent hover:bg-accent/90">
            Start Chat
          </Button>
        </Card>
      </div>

      {/* FAQs */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-xl">Frequently Asked Questions</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Regional Offices */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-xl">Regional Office Locations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Mumbai Office</h4>
            <p className="text-sm text-muted-foreground">
              123 Government Complex, Mumbai - 400001
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Delhi Office</h4>
            <p className="text-sm text-muted-foreground">
              456 Central Office, New Delhi - 110001
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Bangalore Office</h4>
            <p className="text-sm text-muted-foreground">
              789 State Building, Bangalore - 560001
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Chennai Office</h4>
            <p className="text-sm text-muted-foreground">
              321 District Center, Chennai - 600001
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
