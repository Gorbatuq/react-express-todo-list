import { HeroStatItem, WelcomeFeature } from "../types";

export const WELCOME_FEATURES: WelcomeFeature[] = [
  {
    side: "right",
    title: "Summon a Task",
    text: "Type it. Name it. Pretend you’ll do it. (We won’t judge. Much.)",
    src: "/welcome-asset-1.png",
  },
  {
    side: "left",
    title: "Survive the Night Mode",
    text: "When the screen goes dark, your focus becomes… mildly heroic.",
    src: "/welcome-asset-2.png",
  },
  {
    side: "right",
    title: "Tiny Changes, Big Destiny",
    text: "One checkbox today — tomorrow you’re basically a legend.",
    src: "/welcome-asset-3.png",
  },
];

export const HERO_STATS: HeroStatItem[] = [
  { label: "Fast", value: "zero clutter" },
  { label: "Dark", value: "night mode" },
  { label: "Clean", value: "simple flow" },
];
