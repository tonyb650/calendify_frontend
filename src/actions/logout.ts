'use server'

import { signOut } from '@/auth'

export const logout = async ()=> {
  // can perform db updates here if needed  
  await signOut()
}