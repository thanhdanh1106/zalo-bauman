import { useToasterContext } from "@shared/components/ToasterContext";
import { RootState } from "@shared/store";
import { setStatus, setUser } from "@shared/store/slices/authSlice";
import { userProps, UserRoles } from "@shared/types/user";
import { getUserLoggedIn } from "@shared/utils/Auth";
import { deleteCookie, getCookie, hasAnyRole } from "@shared/utils/Hooks";
import message from "@shared/utils/message.json";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useAuth(roles: UserRoles[] | null) {
    const token = getCookie('li_at');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, user } = useSelector((state: RootState) => state.auth) 
    const { showMessage } = useToasterContext();

    async function handleGetUserInformation() {
        try {
            const response = await getUserLoggedIn();
            if (response && !response.error) {
                // If backend returns the user object directly as response
                const userData = response.data || response; 
                if (userData && userData.id) {
                    dispatch(setUser(userData));
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            } else {
                deleteCookie('li_at');
                showMessage('error', message.auth.unauthorized);
                navigate('/login');
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        if(token){
            handleGetUserInformation()
        } else {
            dispatch(setStatus('loaded'))
        }
    }, [])

   useEffect(() => {
      if(status == 'loaded' && roles){
        if (user) {
            if (!hasAnyRole(user.role, roles)) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
      }
    }, [status, user, roles]);

  return null;
}