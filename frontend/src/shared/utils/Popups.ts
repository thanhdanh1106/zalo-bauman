import { instance as axios } from './axiosInstance';

export async function findActivePopup() {
    try {
        const response = await axios.get('/popups/active');
        return response.data;
    } catch (error) {
        return { error: true, message: 'Could not fetch active popup' };
    }
}
