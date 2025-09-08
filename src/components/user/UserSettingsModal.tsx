import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useCurrentUser from '@/hooks/useCurrentUser';
import { PropsWithChildren, SetStateAction } from 'react';
import UserAvatar from './UserAvatar';

type UserSettingsModalProps = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

const UserSettingsModal = ({isOpen, setIsOpen, children}: PropsWithChildren<UserSettingsModalProps>) => {
  const user = useCurrentUser()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <UserAvatar user={user}/>
            User Settings: {user?.name} {user?.email} {user?.earliest} {user?.latest}
          </DialogTitle>
          <DialogDescription>
            Calendar availability:
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default UserSettingsModal