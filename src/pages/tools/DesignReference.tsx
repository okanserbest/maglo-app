export default function DesignReference() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="rounded-2xl border bg-white p-4 shadow-card h-[85vh]">
        <h2 className="text-lg font-semibold mb-2">Figma (PDF)</h2>
        <iframe title="figma-pdf" src="/figma/dashboard-reference.pdf" className="w-full h-[calc(85vh-3rem)] rounded-lg border" />
      </section>
      <section className="rounded-2xl border bg-white p-4 shadow-card h-[85vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Figma (PNG)</h2>
        <img src="/figma/dashboard-reference.png" alt="Figma Dashboard" className="max-w-full h-auto rounded-lg" />
      </section>
    </div>
  );
}
