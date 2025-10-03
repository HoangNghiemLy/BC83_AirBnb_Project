import React from "react";
import videoBanner from "../../assets/image/videoplayback.mp4";

import airbnbLogo from "../../assets/image/logoAirbnb.png";

const Carousel: React.FC = () => {
  return (
    <div className="w-full relative flex flex-col items-center h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh]">
      {/* Video Background */}
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={videoBanner as string} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </div>

      {/* Logo and Text */}
      <div className="absolute z-10 md:block hidden text-white px-4 text-center lg:text-left lg:left-[10%] top-[16%] sm:top-[21%] md:top-[26%] lg:top-[31%]">
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex items-center space-x-4">
            <img
              data-aos="fade-up"
              data-aos-duration="1000"
              src={airbnbLogo as string}
              alt="Airbnb Logo"
              className="h-12 sm:h-14 md:h-16 lg:h-20"
            />
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              airbnb
            </h1>
          </div>
          <p
            className="text-xl sm:text-1xl md:text-3xl lg:text-4xl mt-2"
            data-aos="fade-up"
            data-aos-duration="2000"
          >
            You'll Never Walk Alone
          </p>
        </div>
      </div>      
    </div>
  );
};

export default Carousel;
