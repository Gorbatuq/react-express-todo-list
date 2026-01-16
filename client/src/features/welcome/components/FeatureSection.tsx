import { motion, useReducedMotion } from "framer-motion";
import { WelcomeFeature } from "../types";

const VIEWPORT = { once: true, amount: 0.35 } as const;

export default function FeatureSection({
  feature,
  step,
}: {
  feature: WelcomeFeature;
  step: number;
}) {
  const reduce = useReducedMotion();
  const isRight = feature.side === "right";

  const textCol = isRight
    ? "relative lg:order-2 lg:col-span-6"
    : "relative lg:col-span-6";
  const imageCol = isRight ? "lg:order-1 lg:col-span-6" : "lg:col-span-6";

  const baseRot = reduce ? 0 : (isRight ? 1 : -1) * (1.4 + step * 0.2);
  const hoverRot = reduce ? 0 : isRight ? -0.6 : 0.6;

  return (
    <section className="grid items-center gap-20 lg:grid-cols-12">
      <div className={textCol}>
        <div className="cartoon-surface inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          ACT {step}
        </div>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
          {feature.title}
        </h2>
        <p className="mt-2 text-sm text-slate-700">{feature.text}</p>

        <div className="flex justify-end pt-20">
          <div className="h-1 w-56 rounded-full bg-amber-400/80 shadow-[0_2px_0_rgba(2,6,23,0.18)]" />
        </div>
      </div>

      <div className={imageCol}>
        <motion.div
          className="relative mx-auto w-full max-w-3xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        >
          <div
            className={[
              "cartoon-surface cartoon-shadow-md absolute z-20 -translate-y-1/2 px-3 py-1 text-xs font-extrabold",
              isRight ? "left-0 -rotate-[8deg]" : "right-0 rotate-[8deg]",
            ].join(" ")}
            style={{ top: 0 }}
          >
            omg {step}
          </div>

          <motion.div
            className="cartoon-surface cartoon-shadow-xl overflow-hidden rounded-[26px]"
            style={{ rotate: baseRot }}
            whileHover={{ rotate: hoverRot, y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <div className="relative aspect-[16/9] w-full">
              <img
                src={feature.src}
                alt={feature.title}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
