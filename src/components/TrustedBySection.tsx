'use client';

const clients = [
  { name: "TechVision Corp", logo: "TV", industry: "Technology" },
  { name: "GlobalRetail Solutions", logo: "GR", industry: "Retail" },
  { name: "Innovation Labs", logo: "IL", industry: "R&D" },
  { name: "HealthcarePro", logo: "HP", industry: "Healthcare" },
  { name: "FinanceGroup International", logo: "FG", industry: "Financial Services" },
  { name: "StartupSuccess", logo: "SS", industry: "Startup" },
  { name: "Energy Dynamics", logo: "ED", industry: "Energy" },
  { name: "AutoTech Industries", logo: "AT", industry: "Automotive" },
  { name: "Pharma Innovations", logo: "PI", industry: "Pharmaceutical" },
  { name: "Digital Marketing Pro", logo: "DM", industry: "Marketing" },
  { name: "Manufacturing Elite", logo: "ME", industry: "Manufacturing" },
  { name: "Food & Beverage Co", logo: "FB", industry: "Food & Beverage" }
];

export function TrustedBySection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-container {
            animation: scroll-left 30s linear infinite;
          }
          .scroll-container:hover {
            animation-play-state: paused;
          }
        `
      }} />
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
        </div>

        {/* Auto-scrolling Clients */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex gap-6 scroll-container">
              {/* Duplicate the clients array twice for seamless loop */}
              {[...clients, ...clients].map((client, index) => (
                <div key={index} className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 min-w-[140px] flex-shrink-0">
                  <div className="w-12 h-12 mb-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{client.logo}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 text-center">
                    {client.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

