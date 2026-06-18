import { useEffect, useMemo, useState } from "react";
import { DAY_MS, SECOND_MS } from "../../../../shared/constants/time";

const GROUP_STALE_AFTER_MS = 7 * DAY_MS;
const GROUP_STALE_CHECK_INTERVAL_MS = SECOND_MS;

const isGroupStale = (updatedAt: string, now: number) => {
  const updatedTime = new Date(updatedAt).getTime();
  if (!Number.isFinite(updatedTime)) return false;

  return now - updatedTime >= GROUP_STALE_AFTER_MS;
};

type Props = {
  updatedAt: string;
  dismissed: boolean;
};

export const GroupCobwebOverlay = ({ updatedAt, dismissed }: Props) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(
      () => setNow(Date.now()),
      GROUP_STALE_CHECK_INTERVAL_MS,
    );
    return () => window.clearInterval(timerId);
  }, []);

  const isStale = useMemo(() => isGroupStale(updatedAt, now), [now, updatedAt]);

  if (dismissed || !isStale) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-2xl"
    >
      <img
        src="/spider-web.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top opacity-80"
      />
    </div>
  );
};
