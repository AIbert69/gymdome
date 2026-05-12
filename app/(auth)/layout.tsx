export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col px-6 pb-10 pt-16">
      {children}
    </main>
  );
}
