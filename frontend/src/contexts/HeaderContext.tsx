import { createContext, useContext, useState, type FC, type ReactNode } from 'react'

interface HeaderContextType {
  isMenuOpen: boolean
  toggleMenu: () => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export const HeaderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  return (
    <HeaderContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </HeaderContext.Provider>
  )
}

export const useHeader = () => {
  const context = useContext(HeaderContext)
  if (!context) throw new Error('useHeader must be used within HeaderProvider')
  return context
}
