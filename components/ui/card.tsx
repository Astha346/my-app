"use client";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border rounded-xl p-4 bg-white ${className}`}>
      {children}
    </div>
  );
}