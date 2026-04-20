interface Props {
  label: string;
  value: string;
  detail: string;
}

export default function KPICard({ label, value, detail }: Props) {
  return (
    <article className="panel p-5">
      <p className="label">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold text-brown">{value}</h3>
      <p className="subtle mt-2">{detail}</p>
    </article>
  );
}
