export default function BarMatchAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-nightlife min-h-screen bg-[#0c0a14] text-white">
      {children}
    </div>
  );
}
