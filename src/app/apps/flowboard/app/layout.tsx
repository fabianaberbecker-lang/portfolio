'use client';

export default function FlowBoardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-flowboard min-h-screen bg-[#0b0d1a] text-[#e8eaf6]">
      {children}
    </div>
  );
}
