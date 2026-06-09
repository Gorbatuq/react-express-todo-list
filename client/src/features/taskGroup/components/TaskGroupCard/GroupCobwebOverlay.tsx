import { useEffect, useMemo, useState } from "react";

const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const TICK_MS = 1000;

const isGroupStale = (updatedAt: string, now: number) => {
  const updatedTime = new Date(updatedAt).getTime();
  if (!Number.isFinite(updatedTime)) return false;

  return now - updatedTime >= STALE_AFTER_MS;
};

type Props = {
  updatedAt: string;
  dismissed: boolean;
};

export const GroupCobwebOverlay = ({ updatedAt, dismissed }: Props) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timerId);
  }, []);

  const isStale = useMemo(() => isGroupStale(updatedAt, now), [now, updatedAt]);

  if (dismissed || !isStale) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
    >
      <img
        src="/spider-web.png"
        alt=""
        className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 object-contain object-top opacity-80"
      />
    </div>
  );
};
