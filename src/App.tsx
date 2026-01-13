import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { useThemeStore } from '@/stores/themeStore'

function App() {
  const { theme } = useThemeStore()
  
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])
  
  return <AppRouter />
}

export default App
