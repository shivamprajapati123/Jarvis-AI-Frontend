import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { loginWithRetry } from '../utils/axios'
import Home from './pages/Home'
import { useDispatch } from 'react-redux'
import { setUserdata } from './redux/userSlice'

function App() {

const dispatch=useDispatch()
useEffect(()=>{
  let isMounted = true
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      if (isMounted) dispatch(setUserdata(null))
      return
    }

    try {
      const token = await firebaseUser.getIdToken()
      const { data } = await loginWithRetry(token)
      if (isMounted) dispatch(setUserdata(data))
    } catch (error) {
      console.error("Unable to restore the authenticated session", error)
      if (isMounted) dispatch(setUserdata(null))
    }
  })

  return () => {
    isMounted = false
    unsubscribe()
  }
},[dispatch])

  return (
   <>
   <Home/>
   </>
  )
}

export default App
