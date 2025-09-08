import { updateUserSettingsAction } from '@/actions/users';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useSession } from 'next-auth/react';
import { useActionState, useEffect, useState } from 'react';
import { FormGroup } from '../FormGroup';
import { Button } from '../ui/button';
import { DEFAULT_EARLIEST_TIME, DEFAULT_LATEST_TIME } from '@/constants';

/* TIME_OPTIONS is for the dropdowns. Array of options that look like: { value: 0, label: "12:00 AM" } */
const TIME_OPTIONS = Array(48)
.fill(null)
.map((_, i) => {
  let hour = String(Math.floor(i / 2) % 12).padStart(2, "0");
  if (hour === "00") hour = "12"; // Convert 0 to 12 for AM/PM format
  const minute = i % 2 === 0 ? "00" : "30";
  return { value: i, label: `${hour}:${minute} ${i < 24 ? "AM" : "PM"}` };
})

type UserSettingsFormProps = {
  onClose: () => void
}

const UserSettingsForm = ({ onClose }: UserSettingsFormProps) => {
  const user = useCurrentUser()
  const {update} = useSession()
  const [earliest, setEarliest] = useState<number>(user?.earliest || DEFAULT_EARLIEST_TIME)
  const [latest, setLatest] = useState<number>(user?.latest || DEFAULT_LATEST_TIME)
  
  /* useActionState has three parameters
  1) our function that will be called by the returned formAction function
  2) the previous state of our 'response' (here is type of: UserActionResponse)
  3) optionally permalink
  */
 // (alias) function updateEventAction(prevState: UserActionResponse, formData: FormData): Promise<UserActionResponse>

  const [response, formAction, isPending] = useActionState(updateUserSettingsAction, {})

  useEffect(() => {
    const updateSession = async () => {
      await update() // <-- Sync session with DB after successful DB update
    }
    if (response.success) {
      updateSession()
      onClose()
    }
  }, [response, onClose, update])



  return (
    <form className="form" action={formAction}>
      <FormGroup>
        <label htmlFor="earliest">Earliest Start:</label>
        <select
          name="earliest"
          id="earliest"
          value={earliest}
          onChange={(e) => setEarliest(Number(e.target.value))}
        >
          {TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormGroup>
      <FormGroup>
        <label htmlFor="latest">Latest End:</label>
        <select
          name="latest"
          id="latest"
          value={latest}
          onChange={(e) => setLatest(Number(e.target.value))}
        >
          {TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormGroup>
      
      <div className='flex justify-end gap-4'>
        <Button type="button" variant={"outline"} onClick={onClose}>Cancel</Button>
        <Button type="submit" >{isPending ? "Updating..." : "Update"}</Button>
      </div>
    </form>
  )
}

export default UserSettingsForm