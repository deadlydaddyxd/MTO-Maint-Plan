import './globals.css'

export const metadata = {
  title: 'MTO Maintenance Plan',
  description: 'Military Transport Operations Maintenance Planning System',
  keywords: 'maintenance, military, transport, operations, vehicles',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="__next">
          {children}
        </div>
      </body>
    </html>
  )
}