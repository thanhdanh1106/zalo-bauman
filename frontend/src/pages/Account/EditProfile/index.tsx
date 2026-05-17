import React, { useState, useEffect } from "react";
import { Page, Icon, Input, Select, Button, Box, Header, DatePicker, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@shared/store";
import { getUserPoints } from "@shared/utils/Rewards";
import { updateUserLoggedin } from "@shared/utils/Auth";
import { setUser } from "@shared/store/slices/authSlice";
import { instance } from "@shared/utils/axiosInstance";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import api from "zmp-sdk";
const { chooseImage, uploadFile } = api;

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [membership, setMembership] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || user?.avatar || "");
  const [uploading, setUploading] = useState(false);

  // Helper to parse date
  const getInitialBirthday = () => {
    if (user?.birthday) {
      // Assuming backend returns YYYY-MM-DD
      const parts = user.birthday.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return user.birthday;
    }
    return "15/08/1995";
  };

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "+84 901 234 567",
    email: user?.email || "",
    birthday: getInitialBirthday(),
    gender: user?.gender || "female",
  });

  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    try {
      const res = await getUserPoints();
      if (res && !res.error) {
        setMembership(res.data?.membership);
      }
    } catch (error) {
      console.error("Error fetching membership:", error);
    }
  };

  const handleUpdateAvatarNative = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await instance.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const responseData = res.data;

      if (responseData && !responseData.error) {
        setAvatarUrl(responseData.data.url);
        const updatedUser = { ...user, avatar_url: responseData.data.url };
        dispatch(setUser(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        alert(responseData.message || "Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Lỗi kết nối khi tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Format date from DD/MM/YYYY to YYYY-MM-DD for backend
      let formattedBirthday = formData.birthday;
      if (formattedBirthday.includes('/')) {
        const parts = formattedBirthday.split('/');
        if (parts.length === 3) {
          formattedBirthday = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      const payload = {
        ...formData,
        birthday: formattedBirthday
      };

      const res = await updateUserLoggedin(payload);
      if (res) {
        dispatch(setUser(res));
        localStorage.setItem('user', JSON.stringify(res));
        alert("Cập nhật thông tin thành công!");
        navigate(-1);
      } else {
        alert("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="bg-white min-h-screen">
      <Box className="px-6 pt-8 pb-32 space-y-8">
        {/* Avatar Section */}
        <Box className="flex flex-col items-center space-y-4">
          <Box className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm bg-gray-100 relative">
              <img
                src={avatarUrl ? getThumbnailUrl(avatarUrl) : "https://lh3.googleusercontent.com/aida/ADBb0uiZcunpRn4Wavs-U_I1mnSMvFdBKcrhIqztzw7iox55Z4-LnNQPvmFefGsbFMd8XB9fswLGCyrsyEUv2NyPY5wgOFVDdLbBfgPghZH-2oGTCM5e6pnjI5YbcW3NoQQkvsHkPFDIQdRIUnPmSIXsEYVXRkvlrBCALKkO59kH1sZDtFq64wroM17w0geVKHJspDkg6BwrroEGVoklRHYfmvCHQU5kfZ4ZofckNOt26iXEkMmqZHtQ158AvmV-4YxA3b-W_pD7dNZ4xA"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-1">
              <label
                htmlFor="avatar-upload"
                className={`bg-[#8f0012] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white active:scale-95 transition-transform cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpdateAvatarNative}
                disabled={uploading}
              />
            </div>
          </Box>
          <Text className="text-[#8f0012] font-bold text-[14px] tracking-wider uppercase">CẬP NHẬT ẢNH ĐẠI DIỆN</Text>
        </Box>

        {/* Form Fields */}
        <Box className="space-y-5">
          <Box className="space-y-2">
            <Text className="text-[14px] font-semibold text-gray-700 ml-1">Họ và tên</Text>
            <Box className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">person</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#8f0012] focus:ring-1 focus:ring-[#8f0012] outline-none transition-all"
                placeholder="Nhập họ và tên"
              />
            </Box>
          </Box>

          <Box className="space-y-2">
            <Text className="text-[14px] font-semibold text-gray-700 ml-1">Số điện thoại</Text>
            <Box className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">smartphone</span>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#8f0012] focus:ring-1 focus:ring-[#8f0012] outline-none transition-all"
                placeholder="Nhập số điện thoại"
              />
            </Box>
          </Box>

          <Box className="space-y-2">
            <Text className="text-[14px] font-semibold text-gray-700 ml-1">Email</Text>
            <Box className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#8f0012] focus:ring-1 focus:ring-[#8f0012] outline-none transition-all"
                placeholder="Nhập email"
              />
            </Box>
          </Box>

          <Box className="flex space-x-4">
            <Box className="flex-1 space-y-2">
              <Text className="text-[14px] font-semibold text-gray-700 ml-1">Ngày sinh</Text>
              <Box className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">calendar_today</span>
                <input
                  type="text"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#8f0012] focus:ring-1 focus:ring-[#8f0012] outline-none transition-all"
                  placeholder="DD/MM/YYYY"
                />
              </Box>
            </Box>
            <Box className="flex-1 space-y-2">
              <Text className="text-[14px] font-semibold text-gray-700 ml-1">Giới tính</Text>
              <Box className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">group</span>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#8f0012] focus:ring-1 focus:ring-[#8f0012] outline-none transition-all appearance-none"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </Box>
            </Box>
          </Box>
        </Box>


        {/* Actions */}
        <Box className="space-y-4 pt-4">
          <Button
            fullWidth
            loading={loading}
            onClick={handleSave}
            className="bg-[#8f0012] h-14 rounded-2xl text-[16px] font-bold shadow-lg active:scale-[0.98] transition-transform"
          >
            Lưu thay đổi
          </Button>
          <Button
            fullWidth
            variant="tertiary"
            onClick={() => navigate(-1)}
            className="bg-gray-50 text-gray-600 h-14 rounded-2xl text-[16px] font-bold border border-gray-100 active:scale-[0.98] transition-transform"
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default EditProfilePage;
