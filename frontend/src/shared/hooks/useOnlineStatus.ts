// hooks/useOnlineStatus.ts
import { sendUserStatusToServer } from '@shared/utils/Users';
import { useEffect } from 'react';

export const useOnlineStatus = () => {
  async function handleUpdateStatus(){
    const response: {status: string} = await sendUserStatusToServer();
  }
  useEffect(() => {
    handleUpdateStatus();
    const interval = setInterval(() => {
      handleUpdateStatus();
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
};