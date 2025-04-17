// app/layout.tsx
export const metadata = {
  title: 'Madison Events Calendar',
  description: 'Discover upcoming events in Madison, WI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
