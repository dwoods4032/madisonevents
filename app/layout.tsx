export const metadata = {
  title: "Madison Events Dashboard",
  description: "Find Madison events powered by Isthmus RSS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
