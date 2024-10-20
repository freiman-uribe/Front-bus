import { ROLES } from "@/constants/Rol";
import { useSession } from "@/hooks/useSession";
import { router } from "expo-router";
import { useEffect } from "react";

interface RedirectRouterProps {
  children: React.ReactNode
}
export const RedirectRouter:React.FC<RedirectRouterProps> = ({children}) => {
  const {session} = useSession();
  
  useEffect(() => {
    console.log(session, 'session')
    if (session) {
      console.log(session, 'session')
      const cases = {
        [ROLES.ADMIN]: '/(admin)',
        [ROLES.STUDENT]: '/(student)',
        [ROLES.DRIVER_BUS]: '/(driver)',
      }
      router.replace(cases[session.rol] || '/(auths)' as any);
    }
  }, [session])

  return children
}