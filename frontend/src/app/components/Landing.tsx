import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Building2, Shield, Users, FileCheck, CheckCircle2, TrendingUp } from "lucide-react";

interface LandingProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Landing({ onLogin, onSignup }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full mb-6">
                <Building2 className="h-5 w-5" />
                <span className="text-sm">Government of India Initiative</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                Government Welfare Advisory System
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl">
                Discover government schemes tailored for you. Check your eligibility and access benefits designed to support citizens across the nation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={onSignup}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
                >
                  Get Started - Sign Up
                </Button>
                <Button
                  onClick={onLogin}
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6"
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-primary-foreground/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-accent flex-shrink-0" />
                    <div>
                      <h4 className="mb-1">24+ Welfare Schemes</h4>
                      <p className="text-sm text-primary-foreground/80">Access all government programs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-accent flex-shrink-0" />
                    <div>
                      <h4 className="mb-1">Instant Eligibility Check</h4>
                      <p className="text-sm text-primary-foreground/80">Know your benefits in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                    <Users className="h-8 w-8 text-accent flex-shrink-0" />
                    <div>
                      <h4 className="mb-1">2.4M+ Citizens Helped</h4>
                      <p className="text-sm text-primary-foreground/80">Join millions of beneficiaries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, transparent, and accessible welfare scheme information at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="bg-accent/10 p-4 rounded-full w-fit mx-auto mb-4">
                <FileCheck className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl mb-3">Check Eligibility</h3>
              <p className="text-muted-foreground">
                Complete a simple form to check which government schemes you qualify for based on your profile
              </p>
            </Card>

            <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Secure Application</h3>
              <p className="text-muted-foreground">
                Apply for schemes directly through our secure platform with all your information protected
              </p>
            </Card>

            <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="bg-secondary/30 p-4 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your application status in real-time and receive updates on your benefits
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl text-primary mb-2">2.4M+</h3>
              <p className="text-muted-foreground">Citizens Benefited</p>
            </div>
            <div>
              <h3 className="text-4xl text-primary mb-2">24+</h3>
              <p className="text-muted-foreground">Welfare Schemes</p>
            </div>
            <div>
              <h3 className="text-4xl text-primary mb-2">₹500Cr+</h3>
              <p className="text-muted-foreground">Benefits Disbursed</p>
            </div>
            <div>
              <h3 className="text-4xl text-primary mb-2">98%</h3>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Access Your Benefits?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join millions of citizens who have already discovered and accessed their government welfare benefits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onSignup}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-lg px-8 py-6"
            >
              Create Free Account
            </Button>
            <Button
              onClick={onLogin}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Already Have Account? Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-primary-foreground/70">
            © 2026 Government Welfare Advisory System. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/70 mt-2">
            A Government of India Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}
