interface MetaItemProps {
  label: string;
  value: string;
}

export const MetaItem = ({ label, value }: MetaItemProps) => (
  <div className="rounded-xl bg-surface-container p-3">
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-on-surface">{value}</p>
  </div>
);
