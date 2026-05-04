import PageLoading from "@shared/components/PageLoading";
import { useToasterContext } from "@shared/components/ToasterContext";
import CounterBox from "@/Templates/CounterBox";
import { mediaProps } from "@shared/types/media";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { getPageSetting } from "@shared/utils/Settings";
import React, { Fragment, useEffect, useState } from "react";
import {
  FaAward,
  FaBeer,
  FaCheckCircle,
  FaCogs,
  FaHandshake,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ServicePosts from "./ServicePosts";

export interface Root {
  brands: any[];
  feature_vehicles: any[];
  introduce: Introduce;
  types: any[];
  slider: any[];
  banner: any[];
  page_header: PageHeader;
  icon_box: IconBox[];
  agents: any[];
  agent_section: AgentSection;
  mission: Mission;
  counter_box: CounterBoxProps[];
  commitment: Commitment;
  faqs_section: FaqsSection;
  cta: FinalCta;
}

export interface FinalCta {
  title: string;
  content: string;
  button: string;
  name: string;
  thumbnail: mediaProps;
}

export interface FaqsSection {
  subtitle: string;
  title: string;
  faqs: Faq[];
  content: string;
}

export interface Faq {
  ask: string;
  answer: string;
}

export interface Introduce {
  features: any[];
  subtitle: string;
  title: string;
  description: string;
  thumbnail: mediaProps;
}

export interface HowItsWork {
  icon_box: any[];
}

export interface PageHeader {
  title: string;
  description: string;
  subtitle: string;
  thumbnail: mediaProps;
}

export interface IconBox {
  thumbnail: mediaProps;
  title: string;
  description: string;
}

export interface AgentSection {
  subtitle: string;
  title: string;
  agents: Agent[];
}

export interface Agent {
  title: string;
  description: string;
  thumbnail: mediaProps;
  facebook: string;
  instagram: string;
  x: string;
  website: string;
}

export interface Mission {
  subtitle: string;
  title: string;
  content: string;
  button: string;
  name: string;
  features: Feature[];
  image: mediaProps;
}

export interface Feature {
  title: string;
}

export interface CounterBoxProps {
  counter: string;
  affix: string;
  description: string;
}

export interface Commitment {
  subtitle: string;
  title: string;
  content: string;
  button: string;
  name: string;
  image: mediaProps;
  features: Feature2[];
}

export interface Feature2 {
  title: string;
}

// Main App Component (Blog Page)
const index: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [data, setData] = useState<Root | null>(null);
  const [pageInit, setPageInit] = useState(false);
  const { startProgress, completeProgress } = useToasterContext();

  async function handleGetData() {
    try {
      startProgress();
      const response: { body: Root } = await getPageSetting({
        template: "service_page",
      });
      setData(response.body);
    } finally {
      setPageInit(true);
      completeProgress();
    }
  }

  useEffect(() => {
    handleGetData();
  }, []);

  if (!pageInit) {
    return <PageLoading height={"100vh"} />;
  }

  return (
    <Fragment>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-10 right-10 text-amber-300/20 text-6xl">
          <FaCogs />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-600/30 p-4 rounded-full">
              <FaHandshake className="text-5xl text-amber-200" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-amber-300 uppercase tracking-wider mb-4">
            {data?.page_header.subtitle || "Dịch vụ chuyên nghiệp"}
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {data?.page_header.title || "Dịch vụ bia cao cấp"}
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
            {data?.page_header.description ||
              "Chúng tôi cung cấp các dịch vụ chuyên nghiệp về bia cao cấp với chất lượng tốt nhất"}
          </p>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-8 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-amber-600 p-3 rounded-full mr-4">
                  <FaAward className="text-2xl text-white" />
                </div>
                <span className="text-amber-600 font-semibold uppercase tracking-wide">
                  {data?.introduce.subtitle || "Giới thiệu dịch vụ"}
                </span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {data?.introduce.title || "Dịch vụ bia chuyên nghiệp"}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {data?.introduce.description ||
                  "Chúng tôi cung cấp các dịch vụ chuyên nghiệp về bia cao cấp với đội ngũ chuyên gia giàu kinh nghiệm và cam kết chất lượng tốt nhất."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaShieldAlt className="text-amber-600 mr-3" />
                  <span className="text-gray-700">Chất lượng đảm bảo</span>
                </div>
                <div className="flex items-center">
                  <FaBeer className="text-amber-600 mr-3" />
                  <span className="text-gray-700">Bia cao cấp</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-amber-200 rounded-lg"></div>
              <img
                src={getThumbnailUrl(data?.introduce?.thumbnail)}
                alt="Dịch vụ bia cao cấp"
                className="relative z-10 w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Posts */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-600 p-3 rounded-full">
                <FaCogs className="text-2xl text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Các dịch vụ của chúng tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các dịch vụ chuyên nghiệp về bia cao cấp
            </p>
          </div>
          <ServicePosts />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-amber-300/20 text-6xl">
            <FaBeer />
          </div>
          <div className="absolute bottom-10 right-10 text-amber-300/20 text-8xl">
            <FaHandshake />
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              {data?.cta.title || "Liên hệ với chúng tôi"}
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              {data?.cta.content ||
                "Hãy liên hệ để được tư vấn về các dịch vụ bia cao cấp tốt nhất"}
            </p>
            <Link
              to={data?.cta.name || "/contact"}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-amber-600 font-semibold rounded-lg shadow-lg hover:bg-amber-50 transition-colors duration-300"
            >
              {data?.cta.button || "Liên hệ ngay"}
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-8 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-amber-600 p-2 rounded-full mr-3">
                  <FaAward className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {data?.mission.subtitle || "Sứ mệnh của chúng tôi"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                {data?.mission.title || "Mang đến trải nghiệm bia tuyệt vời"}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {data?.mission.content ||
                  "Chúng tôi cam kết cung cấp những sản phẩm bia chất lượng cao và dịch vụ tốt nhất cho khách hàng."}
              </p>
              <div className="space-y-4 mb-8">
                {data?.mission?.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-amber-600 p-1 rounded-full mr-3">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {feature?.title}
                    </span>
                  </div>
                )) || [
                  <div key="default1" className="flex items-center">
                    <div className="bg-amber-600 p-1 rounded-full mr-3">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Chất lượng cao
                    </span>
                  </div>,
                  <div key="default2" className="flex items-center">
                    <div className="bg-amber-600 p-1 rounded-full mr-3">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Dịch vụ chuyên nghiệp
                    </span>
                  </div>,
                ]}
              </div>
              <Link
                to={data?.mission.name || "/contact"}
                className="inline-flex items-center justify-center px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:bg-amber-700 transition-colors duration-300"
              >
                {data?.mission.button || "Tìm hiểu thêm"}
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-amber-200 rounded-lg"></div>
              <img
                src={getThumbnailUrl(data?.mission.image)}
                alt="Sứ mệnh của chúng tôi"
                className="relative z-10 w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Thành tựu của chúng tôi
            </h2>
            <p className="text-amber-100">
              Những con số ấn tượng về dịch vụ bia cao cấp
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.counter_box.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <CounterBox data={stat} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default index;


