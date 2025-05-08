import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router";
import { LuChevronRight } from "react-icons/lu";

type Props = {
  title: string;
  href: string;
} & Settings;

export default function LandingSlide({ title, href, ...props }: Props) {
  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    ...props,
  };
  return (
    <div className="min-h-screen text-center justify-center overflow-hidden gap-5">
      <h1 className="font-semibold text-xl">{title}</h1>
      <Link to={href} className="text-gray-500 hover:text-theme">
        더보기 <LuChevronRight />
      </Link>
      <div className="">
        <Slider {...settings} className="px-2"></Slider>
      </div>
    </div>
  );
}
