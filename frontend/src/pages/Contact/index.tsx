import ContactForm from "@shared/components/ContactForm";

import React, { Fragment } from "react";
import {
  FaBeer,
  FaClock,
  FaComments,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFacebook,
  FaInstagram,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";

const ContactPage: React.FC = () => {
  const storeInfo = {
    name:
      import.meta.env.VITE_COMPANY_NAME ||
      "KAN SOLUTION",
    address:
      import.meta.env.VITE_COMPANY_ADDRESS ||
      "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM",
    phone: import.meta.env.VITE_COMPANY_PHONE || "0931207702",
    email: import.meta.env.VITE_COMPANY_EMAIL || "info@appbase.vn",
    taxCode: import.meta.env.VITE_COMPANY_TAX_CODE || "0314282517",
    hours: "8:00 - 22:00 (Thứ 2 - Chủ Nhật)",
    description:
      "Chuyên cung cấp các loại bia cao cấp, bia nhập khẩu chính hãng với giá tốt nhất thị trường.",
  };

  const contactMethods = [
    {
      icon: FaPhone,
      title: "Gọi điện trực tiếp",
      description: "Liên hệ ngay để được tư vấn",
      value: storeInfo.phone,
      action: () => window.open(`tel:${storeInfo.phone}`),
      color: "bg-red-600",
    },
    {
      icon: FaWhatsapp,
      title: "Chat WhatsApp",
      description: "Nhắn tin qua WhatsApp",
      value: "Chat ngay",
      action: () =>
        window.open(`https://wa.me/84${storeInfo.phone.substring(1)}`),
      color: "bg-green-600",
    },
    {
      icon: FaFacebook,
      title: "Facebook Messenger",
      description: "Nhắn tin qua Facebook",
      value: "@alphax",
      action: () =>
        window.open(
          import.meta.env.VITE_COMPANY_FACEBOOK || "https://facebook.com/alphax"
        ),
      color: "bg-blue-600",
    },
  ];

  const handleContactSuccess = () => {
    console.log("Contact form submitted successfully");
  };

  return (
    <Fragment>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#181a1b] via-[#2a2d2e] to-[#181a1b] py-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#cbb27c] to-transparent blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-gradient-to-l from-[#cbb27c] to-transparent blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-primary font-serif mb-3 leading-tight">
              Liên Hệ <span className="text-primary">Với Chúng Tôi</span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn về các sản phẩm
              bia cao cấp
            </p>

            {/* Quick Contact Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={method.action}
                  className={`inline-flex items-center px-3 py-3 rounded-full ${method.color} text-white font-medium hover:scale-105 hover:shadow-lg transform transition-all duration-300 gap-2 text-sm`}
                >
                  <method.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-6 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Contact Information */}
            <div className="bg-background rounded-2xl p-5 md:p-6 border border-[#eee] h-fit">
              <div className="flex items-center gap-2 mb-4">
                <FaComments className="text-lg text-primary" />
                <h2 className="text-lg md:text-xl font-bold text-primary font-serif">
                  Thông Tin Liên Hệ
                </h2>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {storeInfo.description}
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: FaMapMarkerAlt,
                    label: "Địa chỉ công ty",
                    value: storeInfo.address,
                  },
                  {
                    icon: FaPhone,
                    label: "Số điện thoại",
                    value: storeInfo.phone,
                  },
                  { icon: FaEnvelope, label: "Email", value: storeInfo.email },
                  {
                    icon: FaBeer,
                    label: "Mã số thuế",
                    value: storeInfo.taxCode,
                  },
                  {
                    icon: FaClock,
                    label: "Giờ làm việc",
                    value: storeInfo.hours,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-surface border border-[#eee] rounded-full flex items-center justify-center border border-[#eee] flex-shrink-0">
                      <item.icon className="text-primary text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary font-serif mb-0.5">
                        {item.label}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-primary font-serif mb-3">
                  Kết nối với chúng tôi
                </h3>
                <div className="flex gap-2">
                  {[
                    {
                      icon: FaFacebook,
                      color: "hover:bg-blue-600",
                      href:
                        import.meta.env.VITE_COMPANY_FACEBOOK ||
                        "https://facebook.com/alphax",
                    },
                    {
                      icon: FaInstagram,
                      color: "hover:bg-pink-600",
                      href: "https://instagram.com/alphax",
                    },
                    {
                      icon: FaWhatsapp,
                      color: "hover:bg-green-600",
                      href:
                        import.meta.env.VITE_COMPANY_ZALO ||
                        `https://wa.me/84${storeInfo.phone.substring(1)}`,
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 bg-surface border border-[#eee] rounded-full flex items-center justify-center border border-[#eee] text-gray-500 ${social.color} hover:text-white hover:scale-110 transition-all duration-300`}
                    >
                      <social.icon className="text-sm" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background rounded-2xl p-5 md:p-6 border border-[#eee]">
              <ContactForm
                onSuccess={handleContactSuccess}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-6 md:py-12 bg-[#1c1f22]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaLocationArrow className="text-lg text-primary" />
              <h2 className="text-lg md:text-xl font-bold text-primary font-serif">
                Vị Trí Cửa Hàng
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              Tìm đường đến cửa hàng của chúng tôi dễ dàng với bản đồ chi tiết
            </p>
          </div>

          <div className="bg-background rounded-2xl overflow-hidden border border-[#eee] h-[300px] md:h-[400px] relative">
            <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
              <div className="text-center">
                <FaMapMarkerAlt className="text-3xl md:text-4xl text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-primary font-serif mb-2">
                  Google Maps
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                  Bản đồ sẽ được tích hợp tại đây để bạn có thể dễ dàng tìm
                  đường đến cửa hàng
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#cbb27c] text-primary font-medium rounded-lg hover:bg-primary hover:text-[#181a1b] transition-all duration-300 text-sm">
                  <FaExternalLinkAlt className="w-3 h-3" />
                  Xem trên Google Maps
                </button>
              </div>
            </div>
          </div>

          {/* Store Hours & Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl p-4 border border-[#eee] text-center">
              <FaClock className="text-lg text-primary mb-2 mx-auto" />
              <h3 className="text-sm font-semibold text-primary font-serif mb-1">
                Giờ Mở Cửa
              </h3>
              <p className="text-xs text-gray-500">{storeInfo.hours}</p>
            </div>
            <div className="bg-background rounded-xl p-4 border border-[#eee] text-center">
              <FaPhone className="text-lg text-primary mb-2 mx-auto" />
              <h3 className="text-sm font-semibold text-primary font-serif mb-1">
                Hotline
              </h3>
              <p className="text-xs text-gray-500">{storeInfo.phone}</p>
            </div>
            <div className="bg-background rounded-xl p-4 border border-[#eee] text-center">
              <FaEnvelope className="text-lg text-primary mb-2 mx-auto" />
              <h3 className="text-sm font-semibold text-primary font-serif mb-1">
                Email
              </h3>
              <p className="text-xs text-gray-500">{storeInfo.email}</p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default ContactPage;


