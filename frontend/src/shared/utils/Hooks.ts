import { mediaProps } from "@shared/types/media";
import { userProps } from "@shared/types/user";
import { openChat } from 'zmp-sdk/apis';

const APP_URL = import.meta.env.VITE_API_URL;

interface Role {
  name: 'administrator' | 'manager' | 'dealer' | 'private' | 'user' | null;
}

export const openChatScreen = (message: string) => {
    openChat({
        type: 'oa',
        id: import.meta.env.VITE_OA_ID,
        message: message ? message : 'Xin Chào',
        success: () => { },
        fail: (err) => {
            console.error('err', err);
        }
    })
}

export function hasAnyRole(userRole: Role['name'], requiredRoles: Array<Role['name']>): boolean {
  if (!userRole) {
    return false;
  }
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  return requiredRoles.includes(userRole);
}

export const formatCurrency = (value?: number) => {
  if (value === undefined || isNaN(value)) return 'N/A';
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  
  // Remove any trailing .00 that might appear
  return formatted.replace(/,00\s*₫$/, '₫').replace(/\.00\s*₫$/, '₫');
};

export function formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function renderText(template: string, values: Record<string, string>): string {
    return template.replace(/{(.*?)}/g, (match, key: string) => values[key] || `{${key}}`);
}

export function extractKeys(template: string): Record<string, string> {
    const matches = template.match(/{(.*?)}/g) || [];
    const keys = matches.map(match => match.slice(1, -1));
    const result = keys.reduce((acc, key) => {
      acc[key] = ""; // Gán giá trị mặc định là chuỗi rỗng
      return acc;
    }, {} as Record<string, string>);
    return result;
}

export function getValueFromText(text: string, obj: Record<string, any>): string {
    return text.replace(/{(.*?)}/g, (match, key: string) => {
      const keys = key.split('.'); // Tách thành mảng nếu có "tree1.id"
      let value = obj;
      for (const k of keys) {
        value = value[k];
        if (value === undefined) break;
      }
      return value !== undefined ? String(value) : `{${key}}`; // Trả về giá trị hoặc nguyên chuỗi nếu không tìm thấy
    });
}

export function formatString(input: string): string {
    if (!input || input === "") return "";
    return input
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}

export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void => {
    let timeoutId: NodeJS.Timeout | undefined;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

export function numberWithCommas(x: number | string): string {
    if (!x) { return "0"; }
    x = x.toString();
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

export function setCookie(name: string, value: string, expires_in: number): void {
    document.cookie = `${name}=${value}; max-age=${expires_in}; path=/`;
}

export function deleteCookie(name: string): void {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function getCookie(name: string): string | null {
    const cookieArray = document.cookie.split(';');
    for (const cookie of cookieArray) {
        let [cookieName, cookieValue] = cookie.split('=');
        cookieName = cookieName.trim();
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

export function getInitials(fullName: string): string {
    // Kiểm tra nếu fullName không phải là chuỗi hoặc là chuỗi rỗng
    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
        return 'MV'; // Trả về chuỗi rỗng nếu không hợp lệ
    }

    // Loại bỏ khoảng trắng thừa và tách chuỗi thành các từ
    const words = fullName.trim().split(/\s+/);

    // Nếu có nhiều từ, lấy ký tự đầu tiên của từ đầu tiên và từ thứ hai
    if (words.length > 1) {
        const firstInitial = words[0][0].toUpperCase();
        const secondInitial = words[1][0].toUpperCase();
        return firstInitial + secondInitial;
    }

    // Nếu chỉ có một từ, lấy hai chữ cái đầu tiên của từ đó
    return words[0].slice(0, 2).toUpperCase();
}


/**
 * Constructs filter parameters by filtering out null or undefined values.
 * @param filter - The filter object containing potential parameters.
 * @returns An object with only defined values for use in API calls.
 */
export function filterParams(filter: Record<string, any>): Record<string, any> {
    const params: Record<string, any> = {};
    for (const key in filter) {
        if (Object.hasOwnProperty.call(filter, key)) {
            const value = filter[key];
            if (value !== "" && value !== null && value !== "null" && value !== undefined) {
                params[key] = value;
            }
        }
    }
    return params;
}

export function getThumbnailUrl(data: any) {
    if (!data) return "https://placehold.co/600x400?text=No+Image";
    
    // Handle both object with original_url/url and direct string URL
    const url = typeof data === 'string' ? data : (data?.original_url || data?.url);
    
    if (!url) return "https://placehold.co/600x400?text=No+Image";
    
    // If it's already a full URL or data URI, return as is
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    
    // Ensure APP_URL doesn't have trailing slash for consistency
    const baseUrl = APP_URL?.endsWith('/') ? APP_URL.slice(0, -1) : APP_URL;
    
    // Handle relative paths
    if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
    }
    
    return `${baseUrl}/${url}`;
}

export function getRandomString(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getUserFullName(user: userProps | null){
  if(!user) {
      return null
  }
  return [user?.information?.first_name, user?.information?.last_name].filter(Boolean).join(' ');
}

export function cleanTiptapJson(node: any): any {
  if (Array.isArray(node)) {
    return node
      .map(cleanTiptapJson)
      .filter((n) => n !== null && n !== undefined);
  }

  if (typeof node === 'object' && node !== null) {
    if (node.type === 'text' && node.text == null) {
      return null;
    }

    const cleanedNode: Record<string, any> = {};

    for (const key in node) {
      const cleaned = cleanTiptapJson(node[key]);

      if (cleaned !== null && cleaned !== undefined) {
        cleanedNode[key] = cleaned;
      }
    }

    return cleanedNode;
  }

  return node;
}

