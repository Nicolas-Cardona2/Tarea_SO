export const metadata = {
  title: "Mi aplicación",
  description: "Proyecto Entorno"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
