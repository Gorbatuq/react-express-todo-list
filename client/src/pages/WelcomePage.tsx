import FeatureSection from "../features/welcome/components/FeatureSection";
import FinalSection from "../features/welcome/components/FinalSection";
import HeroSection from "../features/welcome/components/HeroSection";
import { WELCOME_FEATURES } from "../features/welcome/content";

export function WelcomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-[90%] border-x-2 border-slate-900 bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <HeroSection />

        <div className="mt-14 space-y-14">
          {WELCOME_FEATURES.map((feature, idx) => (
            <div key={feature.title} className="pt-4">
              <FeatureSection feature={feature} step={idx + 1} />
            </div>
          ))}
        </div>

        <FinalSection />
      </div>
    </div>
  );
}
