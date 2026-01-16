export default function PimRow({ count = 8 }: { count?: number }) {
  return (
    <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="group relative h-20 w-20 cursor-pointer">
          <img
            src="/Pim.webp"
            alt="Pim"
            className="absolute inset-0 h-full w-full object-contain p-1 transition-opacity group-hover:opacity-0"
            draggable={false}
            loading="lazy"
          />
          <img
            src="/Pim-2.webp"
            alt="Pim (alt)"
            className="absolute inset-0 h-full w-full object-contain p-1 opacity-0 transition-opacity group-hover:opacity-100"
            draggable={false}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
