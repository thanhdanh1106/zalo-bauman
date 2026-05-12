import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store";
import { Page } from "zmp-ui";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "@shared/utils/Account";
import { useToasterContext } from "@shared/components/ToasterContext";

interface AddressData {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  type: "home" | "office" | "other";
  isDefault: boolean;
}

interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  type: "home" | "office" | "other";
  isDefault: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case "home":
      return "home";
    case "office":
      return "apartment";
    default:
      return "location_on";
  }
};

const AccountAddresses: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { showMessage } = useToasterContext();
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    type: "home",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    setIsLoading(true);
    const response = await getAddresses();
    if (response && !response.error) {
      const mappedData = (response.data || []).map((addr: any) => ({
        id: addr.id,
        name: addr.name || "",
        phone: addr.phone || "",
        address: addr.street || addr.address || "",
        city: addr.city || "",
        state: addr.state || "",
        type: addr.type || "home",
        isDefault: !!addr.is_default,
      }));
      setAddresses(mappedData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenModal = (address?: AddressData) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        type: address.type,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        name: user?.name || "",
        phone: user?.information?.phone || "",
        address: "",
        city: user?.information?.city || "",
        state: user?.information?.district || user?.information?.state || "",
        type: "home",
        isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData({ name: "", phone: "", address: "", city: "", state: "", type: "home", isDefault: false });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      showMessage("error", "Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        type: formData.type,
        isDefault: formData.isDefault,
      };
      if (editingAddress) {
        const response = await updateAddress(editingAddress.id, payload);
        if (response && !response.error) {
          showMessage("success", "Cập nhật địa chỉ thành công");
          fetchAddresses();
          handleCloseModal();
        } else {
          showMessage("error", response.message || "Không thể cập nhật địa chỉ");
        }
      } else {
        const response = await createAddress(payload);
        if (response && !response.error) {
          showMessage("success", "Thêm địa chỉ mới thành công");
          fetchAddresses();
          handleCloseModal();
        } else {
          showMessage("error", response.message || "Không thể thêm địa chỉ");
        }
      }
    } catch (err) {
      showMessage("error", "Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const response = await updateAddress(id, { isDefault: true });
      if (response && !response.error) {
        showMessage("success", "Đã đặt làm địa chỉ mặc định");
        fetchAddresses();
      }
    } catch (err) {
      showMessage("error", "Không thể thiết lập mặc định");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAddress(id);
      if (response && !response.error) {
        showMessage("success", "Đã xóa địa chỉ");
        fetchAddresses();
      } else {
        showMessage("error", "Không thể xóa địa chỉ");
      }
    } catch (err) {
      showMessage("error", "Có lỗi xảy ra khi xóa");
    }
  };

  if (isLoading) {
    return (
      <Page className="bg-[#f6f3f2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8f0012] mx-auto mb-4"></div>
          <p className="text-[#8f0012] font-serif text-sm">Đang tải địa chỉ...</p>
        </div>
      </Page>
    );
  }

  return (
    <Page className="bg-[#f6f3f2] min-h-screen pb-36">
      <main className="max-w-md mx-auto px-4 pt-5 space-y-5">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8f0012] to-[#b32025] p-5 text-white shadow-[0_10px_30px_-5px_rgba(143,0,18,0.12)]">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative z-10">
            <h2 className="text-[16px] font-bold mb-1">
              Quản lý địa chỉ giao hàng của bạn
            </h2>
            <p className="text-[12px] opacity-80">
              Thêm và chỉnh sửa các địa chỉ nhận hàng
            </p>
          </div>
        </section>

        {/* Address List */}
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`relative bg-white rounded-2xl border transition-all duration-200 ${address.isDefault ? "border-[#b32025]/30 shadow-sm" : "border-gray-100"
              }`}
          >
            {/* Default Badge - absolute top right */}
            {address.isDefault && (
              <span className="absolute -top-2.5 right-4 bg-[#b32025] text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm z-10">
                Mặc định
              </span>
            )}

            <div className="p-4">
              {/* Top row: Icon + Name + Phone */}
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-[#8f0012] text-[24px] mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {getIcon(address.type)}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#1c1b1b]">
                      {address.name}
                    </span>
                    <span className="text-[#5a403e] text-[13px]">|</span>
                    <span className="text-[13px] text-[#5a403e]">
                      {address.phone}
                    </span>
                  </div>

                  {/* Address text */}
                  <p className="text-[13px] text-[#5a403e] leading-relaxed mt-2">
                    {[address.address, address.state, address.city].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-end gap-4 mt-3 pt-3 border-t border-gray-50">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-[12px] text-[#5a403e] font-medium hover:text-[#8f0012] transition-colors"
                  >
                    Thiết lập mặc định
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(address)}
                  className="flex items-center gap-1 text-[12px] text-[#8f0012] font-semibold hover:opacity-70 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Sửa
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <span
              className="material-symbols-outlined text-gray-300 text-[56px] mb-4"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_off
            </span>
            <h3 className="text-[16px] font-bold text-[#1c1b1b] mb-2">
              Chưa có địa chỉ nào
            </h3>
            <p className="text-[13px] text-[#5a403e] mb-6">
              Thêm địa chỉ giao hàng để tiện mua sắm
            </p>
          </div>
        )}
      </main>

      {/* Sticky Add Button */}
      <div className="fixed bottom-5 left-0 right-0 px-4 z-40 max-w-md mx-auto">
        <button
          onClick={() => handleOpenModal()}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#8f0012] text-white rounded-2xl text-[15px] font-bold shadow-[0_8px_30px_-5px_rgba(143,0,18,0.35)] active:scale-[0.98] transition-transform"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add_location_alt
          </span>
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-[17px] font-bold text-[#1c1b1b]">
                {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-gray-500">
                  close
                </span>
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5a403e] uppercase tracking-wider mb-2">
                  Loại địa chỉ
                </label>
                <div className="flex gap-2">
                  {([
                    { key: "home", label: "Nhà riêng", icon: "home" },
                    { key: "office", label: "Văn phòng", icon: "apartment" },
                    { key: "other", label: "Khác", icon: "location_on" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setFormData({ ...formData, type: opt.key })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold border transition-all ${formData.type === opt.key
                        ? "bg-[#8f0012]/10 border-[#8f0012]/30 text-[#8f0012]"
                        : "bg-white border-gray-200 text-[#5a403e]"
                        }`}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {opt.icon}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5a403e] uppercase tracking-wider mb-2">
                  Họ và tên <span className="text-[#b32025]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f6f3f2] border border-gray-200 rounded-xl text-[14px] text-[#1c1b1b] focus:border-[#8f0012] focus:outline-none focus:ring-1 focus:ring-[#8f0012]/20 transition-all"
                  placeholder="Nhập họ và tên người nhận"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5a403e] uppercase tracking-wider mb-2">
                  Số điện thoại <span className="text-[#b32025]">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f6f3f2] border border-gray-200 rounded-xl text-[14px] text-[#1c1b1b] focus:border-[#8f0012] focus:outline-none focus:ring-1 focus:ring-[#8f0012]/20 transition-all"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5a403e] uppercase tracking-wider mb-2">
                  Địa chỉ chi tiết <span className="text-[#b32025]">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f6f3f2] border border-gray-200 rounded-xl text-[14px] text-[#1c1b1b] focus:border-[#8f0012] focus:outline-none focus:ring-1 focus:ring-[#8f0012]/20 transition-all resize-none"
                  placeholder="Số nhà, tên đường (Chi tiết trước xát nhập)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#5a403e] uppercase tracking-wider mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-gray-200 rounded-xl text-[14px] text-[#1c1b1b] focus:border-[#8f0012] focus:outline-none focus:ring-1 focus:ring-[#8f0012]/20 transition-all"
                    placeholder="Nhập tỉnh/thành phố"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#5a403e] uppercase tracking-wider mb-2">
                    Xã/Phường
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-gray-200 rounded-xl text-[14px] text-[#1c1b1b] focus:border-[#8f0012] focus:outline-none focus:ring-1 focus:ring-[#8f0012]/20 transition-all"
                    placeholder="Nhập xã/phường"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-3 p-3 bg-[#f6f3f2] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 text-[#8f0012] bg-white border-gray-300 rounded focus:ring-[#8f0012] focus:ring-2"
                />
                <span className="text-[13px] font-medium text-[#1c1b1b]">
                  Đặt làm địa chỉ mặc định
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="p-5 pt-2 pb-8 flex gap-3 border-t border-gray-100">
              {editingAddress && (
                <button
                  onClick={() => {
                    handleDelete(editingAddress.id);
                    handleCloseModal();
                  }}
                  className="px-4 py-3.5 border border-red-200 text-[#b32025] rounded-xl text-[13px] font-semibold hover:bg-red-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3.5 bg-gray-100 text-[#5a403e] rounded-xl text-[14px] font-semibold active:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3.5 bg-[#8f0012] text-white rounded-xl text-[14px] font-bold active:bg-[#6e000e] transition-colors shadow-sm"
              >
                {editingAddress ? "Cập nhật" : "Lưu địa chỉ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default AccountAddresses;
