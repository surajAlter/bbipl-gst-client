import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const About = (props) => {
  return (
    <div id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Image Section */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <Swiper
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="rounded-lg shadow-lg"
            >
              <SwiperSlide>
                <img
                  src="/assets/about/about1.png"
                  className="w-full h-auto rounded-lg"
                  alt="Slide 1"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="/assets/about/about2.png"
                  className="w-full h-auto rounded-lg"
                  alt="Slide 2"
                />
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 pl-0 md:pl-10">
            <h2 className="text-4xl font-bold text-blue-700 mb-6">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Formally known as Universal Map Solutions, BUSINESS BASKET
              specializes in Remote Sensing (RS), Geographic Information
              System (GIS), and Global Positioning System (GPS) technologies,
              combined with conventional techniques to optimize exploration,
              judicious exploitation, and maximum utilization of natural
              resources.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              BUSINESS BASKET also focuses on disaster management, risk
              assessment, land information systems, environmental and climatic
              studies, management information systems (MIS), and urban planning,
              offering a comprehensive suite of services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              With a team of experienced professionals, BUSINESS BASKET delivers
              high-quality data, timely project deliveries, and cost-effective
              solutions. Capacity building, training, and empowering grassroots
              workers remain key priorities.
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Why Choose Us?
            </h3>
            <div className="flex flex-wrap">
              <div className="w-full sm:w-1/2 mb-4">
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {props.data
                    ? props.data.Why.map((d, i) => (
                        <li key={`${d}-${i}`}>{d}</li>
                      ))
                    : "Loading..."}
                </ul>
              </div>
              <div className="w-full sm:w-1/2 mb-4">
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {props.data
                    ? props.data.Why2.map((d, i) => (
                        <li key={`${d}-${i}`}>{d}</li>
                      ))
                    : "Loading..."}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
