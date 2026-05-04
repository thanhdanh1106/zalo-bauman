import PageLoading from '@shared/components/PageLoading';

import { useToasterContext } from '@shared/components/ToasterContext';
import { Fragment, useState } from 'react';
import { 
  FaCheckCircle, 
  FaBeer, 
  FaUsers, 
  FaAward, 
  FaShippingFast, 
  FaHeart, 
  FaGlobe, 
  FaLeaf,
  FaQuoteLeft,
  FaPlus,
  FaMinus,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaHandshake,
  FaRocket
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  description: string;
  experience: string;
}

export interface Statistic {
  id: number;
  number: string;
  label: string;
  icon: any;
}

export interface Value {
  id: number;
  title: string;
  description: string;
  icon: any;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pageInit, setPageInit] = useState(false);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      position: "Giám đốc điều hành",
      image: "/api/placeholder/300/300",
      description: "Với hơn 15 năm kinh nghiệm trong ngành đồ uống, anh An đã đưa công ty trở thành một trong những nhà phân phối bia hàng đầu.",
      experience: "15+ năm kinh nghiệm"
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      position: "Chuyên gia bia",
      image: "/api/placeholder/300/300",
      description: "Chuyên gia hàng đầu về các loại bia thủ công và nhập khẩu, với chứng chỉ quốc tế về bia học.",
      experience: "12+ năm kinh nghiệm"
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      position: "Quản lý bán hàng",
      image: "/api/placeholder/300/300",
      description: "Chuyên gia tư vấn và hỗ trợ khách hàng, đảm bảo mọi nhu cầu được đáp ứng một cách hoàn hảo.",
      experience: "8+ năm kinh nghiệm"
    },
    {
      id: 4,
      name: "Phạm Thu Dung",
      position: "Chăm sóc khách hàng",
      image: "/api/placeholder/300/300",
      description: "Đảm bảo dịch vụ khách hàng tốt nhất với sự tận tâm và chuyên nghiệp trong từng chi tiết.",
      experience: "6+ năm kinh nghiệm"
    }
  ];

  const statistics: Statistic[] = [
    { id: 1, number: "500+", label: "Sản phẩm bia", icon: FaBeer },
    { id: 2, number: "10,000+", label: "Khách hàng hài lòng", icon: FaUsers },
    { id: 3, number: "50+", label: "Thương hiệu bia", icon: FaAward },
    { id: 4, number: "24/7", label: "Hỗ trợ khách hàng", icon: FaShippingFast }
  ];

  const values: Value[] = [
    {
      id: 1,
      title: "Chất lượng cao",
      description: "Chúng tôi chỉ cung cấp những sản phẩm bia chính hãng, chất lượng cao từ các thương hiệu uy tín trên toàn thế giới.",
      icon: FaAward
    },
    {
      id: 2,
      title: "Đa dạng sản phẩm",
      description: "Bộ sưu tập bia phong phú từ khắp nơi trên thế giới, đáp ứng mọi sở thích từ bia nhẹ đến bia mạnh.",
      icon: FaGlobe
    },
    {
      id: 3,
      title: "Dịch vụ tận tâm",
      description: "Đội ngũ nhân viên chuyên nghiệp, nhiệt tình tư vấn và hỗ trợ khách hàng 24/7 với sự tận tâm tuyệt đối.",
      icon: FaHeart
    },
    {
      id: 4,
      title: "Giao hàng nhanh",
      description: "Hệ thống giao hàng toàn quốc, đảm bảo sản phẩm đến tay khách hàng trong thời gian nhanh nhất.",
      icon: FaShippingFast
    },
    {
      id: 5,
      title: "Giá cả hợp lý",
      description: "Cam kết mang đến những sản phẩm chất lượng với mức giá cạnh tranh và nhiều chương trình ưu đãi.",
      icon: FaHandshake
    },
    {
      id: 6,
      title: "Đổi mới liên tục",
      description: "Không ngừng cập nhật những sản phẩm mới nhất, xu hướng bia mới từ khắp nơi trên thế giới.",
      icon: FaRocket
    }
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "Tôi có thể đặt hàng online như thế nào?",
      answer: "Bạn có thể đặt hàng trực tuyến thông qua website của chúng tôi 24/7. Chỉ cần chọn sản phẩm, thêm vào giỏ hàng và thanh toán. Chúng tôi sẽ giao hàng tận nơi trong thời gian nhanh nhất."
    },
    {
      id: 2,
      question: "Chính sách đổi trả như thế nào?",
      answer: "Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên vẹn và chưa sử dụng. Với các trường hợp sản phẩm bị lỗi từ nhà sản xuất, chúng tôi sẽ đổi mới 100%."
    },
    {
      id: 3,
      question: "Tôi có thể thanh toán bằng những hình thức nào?",
      answer: "Chúng tôi hỗ trợ nhiều hình thức thanh toán: tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ, ví điện tử (MoMo, ZaloPay, ShopeePay)."
    },
    {
      id: 4,
      question: "Có phí giao hàng không?",
      answer: "Miễn phí giao hàng cho đơn hàng từ 500.000đ trong nội thành. Với các đơn hàng dưới 500.000đ hoặc giao hàng ngoại thành, phí giao hàng từ 20.000đ - 50.000đ tùy khu vực."
    },
    {
      id: 5,
      question: "Sản phẩm có được bảo quản tốt không?",
      answer: "Tất cả sản phẩm đều được bảo quản trong kho lạnh với nhiệt độ và độ ẩm phù hợp. Quá trình vận chuyển cũng được thực hiện cẩn thận để đảm bảo chất lượng sản phẩm."
    },
    {
      id: 6,
      question: "Tôi có thể mua sỉ được không?",
      answer: "Có, chúng tôi có chính sách giá sỉ đặc biệt cho khách hàng mua số lượng lớn. Vui lòng liên hệ trực tiếp với chúng tôi để được tư vấn giá và chính sách ưu đãi."
    }
  ];

  if (pageInit) {
    return <PageLoading height={500} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#181a1b] via-[#2a2d2e] to-[#181a1b] py-8 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              Về Chúng Tôi
            </div>
            <h1 className="text-4xl lg:text-4xl font-bold text-primary font-serif mb-6">
              Bia Ngon - Niềm Đam Mê <span className="text-primary">Bia Chất Lượng</span>
            </h1>
            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Với hơn 15 năm kinh nghiệm, chúng tôi tự hào là nhà cung cấp bia chất lượng cao hàng đầu Việt Nam. 
              Sứ mệnh của chúng tôi là mang đến cho khách hàng những trải nghiệm bia tuyệt vời nhất từ khắp nơi trên thế giới.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-primary hover:bg-[#d4b995] text-[#181a1b] px-3 py-2 rounded-lg text-sm uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Khám Phá Sản Phẩm
              </Link>
              <Link
                to="/contact"
                className="border border-[#cbb27c] text-primary hover:bg-primary hover:text-[#181a1b] px-3 py-2 rounded-lg text-sm uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Liên Hệ Ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8 bg-background border-b border-[#eee]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.id} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-2xl text-primary" />
                  </div>
                  <div className="text-2xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-500 text-sm lg:text-base">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-4xl font-bold text-primary font-serif mb-6">
                Câu Chuyện <span className="text-primary">Của Chúng Tôi</span>
              </h2>
              <div className="space-y-6 text-gray-500 leading-relaxed">
                <p>
                  Bia Ngon được thành lập vào năm 2008 với khát vọng mang đến cho người Việt Nam những trải nghiệm bia tuyệt vời nhất. 
                  Bắt đầu từ một cửa hàng nhỏ, chúng tôi đã không ngừng phát triển và mở rộng.
                </p>
                <p>
                  Ngày nay, Bia Ngon đã trở thành một trong những nhà phân phối bia uy tín nhất với hơn 500 sản phẩm từ 50 thương hiệu nổi tiếng thế giới. 
                  Chúng tôi tự hào phục vụ hơn 10,000 khách hàng trên toàn quốc.
                </p>
                <p>
                  Với đội ngũ chuyên gia bia giàu kinh nghiệm, chúng tôi không chỉ bán bia mà còn chia sẻ kiến thức, 
                  giúp khách hàng hiểu rõ hơn về văn hóa bia và tìm ra những sản phẩm phù hợp nhất.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/api/placeholder/300/200" 
                  alt="Cửa hàng bia" 
                  className="w-full rounded-lg"
                />
                <img 
                  src="/api/placeholder/300/300" 
                  alt="Sản phẩm bia" 
                  className="w-full rounded-lg"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/api/placeholder/300/300" 
                  alt="Đội ngũ nhân viên" 
                  className="w-full rounded-lg"
                />
                <img 
                  src="/api/placeholder/300/200" 
                  alt="Kho hàng" 
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background border-t border-[#eee]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold text-primary font-serif mb-6">
              Giá Trị <span className="text-primary">Cốt Lõi</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Những giá trị này định hình nên cách chúng tôi phục vụ khách hàng và phát triển doanh nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={value.id} 
                  className="bg-background border border-[#eee] rounded-xl p-6 hover:border-[#cbb27c] transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                    <IconComponent className="text-2xl text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary font-serif mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="hidden py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold text-primary font-serif mb-6">
              Đội Ngũ <span className="text-primary">Chuyên Nghiệp</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Gặp gỡ những người đang làm nên sự khác biệt tại Bia Ngon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="bg-background border border-[#eee] rounded-xl overflow-hidden hover:border-[#cbb27c] transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-[#181a1b] px-3 py-1 rounded-full text-xs font-medium">
                    {member.experience}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary font-serif mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background border-t border-[#eee]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl lg:text-4xl font-bold text-primary font-serif mb-6">
                Câu Hỏi <span className="text-primary">Thường Gặp</span>
              </h2>
              <p className="text-lg text-gray-500">
                Những thông tin hữu ích mà khách hàng thường quan tâm
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div 
                  key={faq.id}
                  className="bg-background border border-[#eee] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface border border-[#eee] transition-all duration-300"
                  >
                    <span className="text-primary font-serif font-medium">{faq.question}</span>
                    <div className="text-primary">
                      {openFaq === faq.id ? <FaMinus /> : <FaPlus />}
                    </div>
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-background border-t border-[#eee]">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1a1d20] to-[#2a2d2e] rounded-2xl p-8 lg:p-12 text-center border border-[#eee]">
            <h2 className="text-2xl lg:text-4xl font-bold text-primary font-serif mb-6">
              Sẵn Sàng Khám Phá <span className="text-primary">Thế Giới Bia?</span>
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Hãy liên hệ với chúng tôi để được tư vấn và trải nghiệm những sản phẩm bia tuyệt vời nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-primary hover:bg-[#d4b995] text-[#181a1b] px-3 py-2 rounded-lg text-sm uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaPhone />
                Liên Hệ Ngay
              </Link>
              <Link
                to="/products"
                className="border border-[#cbb27c] text-primary hover:bg-primary hover:text-[#181a1b] px-3 py-2 rounded-lg text-sm uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                Xem Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

