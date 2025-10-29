import { Target, Lightbulb, TrendingUp, Award } from "lucide-react";

const AboutInfluencia = () => {
  const benefits = [
    {
      icon: Target,
      title: "Clear Vision",
      description: "Develop a strategic roadmap for your personal and professional growth",
    },
    {
      icon: Lightbulb,
      title: "Practical Insights",
      description: "Learn actionable strategies from real-world success stories",
    },
    {
      icon: TrendingUp,
      title: "Accelerated Growth",
      description: "Fast-track your journey to excellence with proven methodologies",
    },
    {
      icon: Award,
      title: "Elite Network",
      description: "Connect with ambitious leaders and entrepreneurs",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 space-y-4 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">
              About <span className="text-primary">Influencia</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A transformative workshop designed to unlock your potential and elevate your influence in today's competitive world
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Featured Speaker */}
          <div className="mt-20 p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="text-center space-y-4">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                Led By
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Dr. Rashid Gazzali
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Renowned leadership consultant and transformational speaker with over two decades of experience in personal development and organizational excellence
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfluencia;
