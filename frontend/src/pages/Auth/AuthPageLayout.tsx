import type { ReactNode } from 'react'

const AuthPageLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8 text-white">
        <h1 className="text-3xl font-bold">Aling Rosa&apos;s</h1>
        <p className="text-orange-100 mt-1">
          Sari-Sari, Street Food &amp; Shakes
        </p>
        <p className="text-sm text-orange-200 mt-1">Roxas City, Capiz</p>
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Store Management Login
        </h2>
        {children}
      </div>
    </div>
  </div>
)

export default AuthPageLayout
