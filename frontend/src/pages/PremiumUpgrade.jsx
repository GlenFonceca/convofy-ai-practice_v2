import { useState } from "react";
import {
  Check,
  Crown,
  Star,
  MessageCircle,
  Users,
  Infinity,
  Shield,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import {getPaymentURL } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

const PremiumUpgrade = () => {
  const {authUser} = useAuthUser();
  //Testing
  //console.log(authUser)

  const plans = [
    {
      name: "Free",
      plan: "none",
      description: "Perfect for getting started",
      price: { monthly: 0, annual: 0 },
      popular: false,
      features: [
        "Basic language matching",
        "Community chat rooms",
        "Standard support",
      ],
      limitations: ["No AI practice sessions", "No progress tracking"],
      isSubscribed: true,
    },
    {
      name: "Convofy Pro",
      plan: "monthly",
      description: "Most popular for serious learners",
      price: { monthly: 9.99, annual: 99.99 },
      popular: true,
      features: [
        "Unlimited AI Practice",
        "Priority chat support",
        "Voice message practice",
        "Progress tracking & analytics",
        "Ad-free experience",
      ],
      badge: "Most Popular",
      isSubscribed: authUser.subscriptionType === "monthly",
    },
    {
      name: "Convofy Pro Annual",
      plan: "annual",
      description: "Best value for committed learners",
      price: { monthly: 8.33, annual: 99.99 },
      popular: false,
      features: [
        "Everything in Monthly Pro",
        "2 months free (save 17%)",
        "Ad-free experience",
      ],
      badge: "Best Value",
      savings: "Save $20/year",
      isSubscribed: authUser.subscriptionType === "annual",
    },
  ];

  const handleUpgrade = async (planName) => {
    try {
      const stripeLink = await getPaymentURL({
        email: authUser.email,
        plan: planName,
      });

      //Testing
      //console.log(stripeLink);
      
      if (stripeLink?.url) {
        window.location.href = stripeLink.url;
      } else {
        alert("Upgrade link is not available.");
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Something went wrong while upgrading.");
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-primary-content">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Crown className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Unlock Your Language Potential
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of successful language learners with premium features
            designed to accelerate your progress
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`card ${
                plan.popular
                  ? "bg-primary text-primary-content drop-shadow-base-content drop-shadow-xl/10 scale-105 border-4 border-primary"
                  : "bg-base-200 drop-shadow-base-content drop-shadow-xl/10"
              } transition-all duration-300 relative overflow-hidden h-fit`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 ${
                    plan.popular ? "bg-accent" : "bg-secondary"
                  } text-accent-content px-4 py-2 rounded-bl-xl font-semibold`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="card-body p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3">
                    {plan.name === "Free" && (
                      <Users className="w-10 h-10 opacity-70" />
                    )}
                    {plan.name === "Convofy Pro" && (
                      <Star className="w-10 h-10" />
                    )}
                    {plan.name === "Convofy Pro Annual" && (
                      <Crown className="w-10 h-10" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p
                    className={`text-sm ${
                      plan.popular ? "opacity-90" : "opacity-70"
                    } mb-4`}
                  >
                    {plan.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">
                        ${plan.price.monthly}
                      </span>
                      <span
                        className={`text-sm ${
                          plan.popular ? "opacity-90" : "opacity-70"
                        }`}
                      >
                        {plan.price.monthly > 0 ? "/month" : "Free"}
                      </span>
                    </div>

                    {plan.name === "Convofy Pro Annual" && (
                      <div className="text-xs mt-1 opacity-80">
                        Billed annually at $99.99
                      </div>
                    )}

                    {plan.savings && (
                      <div className="badge badge-success mt-2 text-xs">
                        {plan.savings}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6 flex-1">
                  {plan.features.slice(0, 6).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "text-accent" : "text-success"
                        }`}
                      />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}

                  {plan.features.length > 6 && (
                    <div className="text-xs opacity-70 text-center pt-2">
                      +{plan.features.length - 6} more features
                    </div>
                  )}

                  {plan.limitations && (
                    <div className="pt-3 border-t border-base-300">
                      {plan.limitations.slice(0, 2).map((limitation, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 opacity-60"
                        >
                          <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center text-xs">
                            —
                          </span>
                          <span className="text-xs">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Button */}

                <button
                  onClick={() => handleUpgrade(plan.plan)}
                  className={`btn btn-sm w-full ${
                    plan.name === "Free"
                      ? "btn-outline"
                      : plan.popular
                      ? "btn-accent"
                      : "btn-primary"
                  }`}
                  disabled={plan.isSubscribed === true}
                >
                  {plan.isSubscribed === true ? (
                    "Current Plan"
                  ) : (
                    <>
                      Upgrade to {plan.name}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Showcase */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Convofy Pro?</h2>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              Experience the difference with premium features designed for
              serious language learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Infinity className="w-8 h-8" />,
                title: "Unlimited Practice",
                description: "Chat with AI tutors 24/7 without limits",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Real Conversations",
                description: "Practice with native speakers worldwide",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Priority Support",
                description: "Get help when you need it most",
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Progress Tracking",
                description: "Detailed analytics and insights",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary text-primary-content rounded-full p-4">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="opacity-70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="collapse collapse-plus bg-base-100 mb-4">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-lg font-medium">
                Can I cancel my subscription anytime?
              </div>
              <div className="collapse-content">
                <p>
                  Yes, you can cancel your subscription at any time. Your
                  premium features will remain active until the end of your
                  billing period.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                What's the difference between monthly and annual plans?
              </div>
              <div className="collapse-content">
                <p>
                  Annual plans offer the same features as monthly plans but at a
                  discounted rate. You save 17% with annual billing plus get
                  exclusive perks like priority support and early access to new
                  features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgrade;
