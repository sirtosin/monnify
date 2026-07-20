"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { logout, setCredentials } from "@/lib/store/slices/auth-slice"
import { useRouter } from "next/navigation"

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  )

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const handleLogin = (token: string, user: any) => {
    dispatch(setCredentials({ token, user }))
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
    login: handleLogin,
  }
}
