import { motion, useReducedMotion } from "framer-motion";
import { Side, WelcomeFeature } from "../types";

const VIEWPORT = { once: true, amount: 0.35 } as const;
const SWORD_SRC = "/pixel_sword_spin_pixel2.png";

type XY = string | number;

type SwordPose = {
  x: XY;
  y: XY;
  rotate: number;
};

type SwordDef = {
  key: string;
  /**
   * Base layout for the RIGHT side. LEFT is derived by mirroring unless classNameLeft is provided.
   */
  classNameRight: string;
  /**
   * Optional explicit LEFT layout. If omitted, it will be auto-mirrored from classNameRight.
   */
  classNameLeft?: string;
  idle: SwordPose;
  hover: SwordPose;
};

const SWORDS: readonly SwordDef[] = [
  {
    key: "top",
    classNameRight:
      "left-1/4 sm:left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
    idle: { x: "-60%", y: "-60%", rotate: 173 },
    hover: { x: "-58%", y: "-59%", rotate: 180 },
  },
  {
    key: "side",
    // view bugs. Fix later
    classNameRight: "right-200 xl:right-0 top-1/4 translate-x-1/2",
    idle: { x: "63%", y: "30%", rotate: 265 },
    hover: { x: "60%", y: "30%", rotate: 270 },
  },
  {
    key: "bottom",
    classNameRight: "right-10 bottom-0 translate-y-1/2",
    idle: { x: 0, y: "66%", rotate: -5 },
    hover: { x: 0, y: "64%", rotate: -2 },
  },
] as const;

/**
 * Negates numbers and percentage strings (e.g. "63%" -> "-63%").
 * Used to mirror X offsets while keeping the authoring format (number or "%").
 */
function flipPercent(v: XY): XY {
  if (typeof v === "number") return -v;
  const s = v.trim();
  if (!s.endsWith("%")) return v;
  const n = Number(s.slice(0, -1));
  if (Number.isNaN(n)) return v;
  return `${-n}%`;
}

/**
 * Mirrors rotation across the vertical axis (X mirror). For a simple sprite, negating degrees is enough.
 */
function mirrorRotate(deg: number) {
  return 0 - deg;
}

/**
 * Small Tailwind-class mirroring helper for the concrete classes used in this component.
 * This is intentionally minimal: it only rewrites the patterns you actually use here.
 */
function mirrorClassNameRightToLeft(cls: string) {
  return cls
    .replace(/\bright-0\b/g, "left-0")
    .replace(/\bright-10\b/g, "left-10")
    .replace(/\btranslate-x-1\/2\b/g, "-translate-x-1/2");
}

/**
 * Resolves a sword definition into a concrete "side-aware" configuration:
 * - If the feature is RIGHT: use the base (classNameRight, idle/hover as authored).
 * - If the feature is LEFT: mirror className (unless explicitly provided) + mirror X offsets + mirror rotation.
 */
function resolveSword(def: SwordDef, side: Side) {
  if (side === "right") {
    return {
      className: def.classNameRight,
      idle: def.idle,
      hover: def.hover,
    };
  }

  const className =
    def.classNameLeft ?? mirrorClassNameRightToLeft(def.classNameRight);

  return {
    className,
    idle: {
      x: flipPercent(def.idle.x),
      y: def.idle.y,
      rotate: mirrorRotate(def.idle.rotate),
    },
    hover: {
      x: flipPercent(def.hover.x),
      y: def.hover.y,
      rotate: mirrorRotate(def.hover.rotate),
    },
  };
}

export default function FeatureSection({
  feature,
  step,
}: {
  feature: WelcomeFeature;
  step: number;
}) {
  const reduce = useReducedMotion();
  const side: Side = feature.side;
  const isRight = side === "right";

  const textCol = isRight
    ? "relative lg:order-2 lg:col-span-6"
    : "relative lg:col-span-6";

  const imageCol = isRight ? "lg:order-1 lg:col-span-6" : "lg:col-span-6";

  /**
   * Base rotation adds slight per-step variation and flips direction by side.
   * Hover rotation is subtle and also depends on side.
   * Reduced-motion disables these transforms.
   */
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

        <div className="flex justify-end pt-10">
          <div className="h-1 w-56 rounded-full bg-amber-400/80 shadow-[0_2px_0_rgba(2,6,23,0.18)]" />
        </div>
      </div>

      <div className={imageCol}>
        <motion.div
          className="relative mx-auto w-full max-w-3xl "
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        >
          <div
            className={[
              "cartoon-surface cartoon-shadow-md absolute z-30 -translate-y-1/2 px-3 py-1 text-xs font-extrabold",
              isRight ? "left-0 -rotate-[16deg]" : "right-0 rotate-[8deg]",
            ].join(" ")}
            style={{ top: 0 }}
          >
            omg {step}
          </div>

          {/**
           * Single hover container drives BOTH:
           * - swords via variants (idle/hover)
           * - card via whileHover
           * This keeps hover logic consistent and prevents desync between elements.
           */}
          <motion.div
            className="relative"
            initial="idle"
            animate="idle"
            whileHover="hover"
          >
            {!reduce &&
              SWORDS.map((def) => {
                const s = resolveSword(def, side);
                return (
                  <motion.img
                    key={def.key}
                    src={SWORD_SRC}
                    alt=""
                    draggable={false}
                    className={[
                      "pointer-events-none absolute z-10 h-36 select-none [image-rendering:pixelated]",
                      s.className,
                    ].join(" ")}
                    style={{ transformOrigin: "50% 50%" }}
                    variants={{
                      idle: { x: s.idle.x, y: s.idle.y, rotate: s.idle.rotate },
                      hover: {
                        x: s.hover.x,
                        y: s.hover.y,
                        rotate: s.hover.rotate,
                      },
                    }}
                    transition={{
                      x: { type: "spring", stiffness: 260, damping: 18 },
                      y: { type: "spring", stiffness: 260, damping: 18 },
                      rotate: { type: "spring", stiffness: 260, damping: 18 },
                    }}
                  />
                );
              })}

            <motion.div
              className="cartoon-surface cartoon-shadow-xl overflow-hidden rounded-[26px] relative z-20"
              style={{ rotate: baseRot }}
              whileHover={reduce ? undefined : { rotate: hoverRot, y: -4 }}
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
        </motion.div>
      </div>
    </section>
  );
}
