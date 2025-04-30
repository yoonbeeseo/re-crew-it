import { useRef } from "react";
import { LuChevronRight } from "react-icons/lu";
import { Link } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const ref = useRef<Slider>(null);

  // const
  return (
    <div>
      <div className="h-screen justify-center items-center bg-theme text-white">
        <div className="gap-5">
          <h1 className="flex flex-col font-black text-4xl text-center gap-2">
            <span className="font-extralight" style={{ fontWeight: 100 }}>
              나에게는 항해사가 필요해,
            </span>
            내 배를 이끌어줘!
          </h1>
          <p>항해사, 검사, 도적 등 다양한 직군들과 팀빌딩을 해보세요.</p>
          <Link to="/crew" className="submit px-2 bg-white text-theme">
            크루 등록하기
          </Link>
        </div>
      </div>
      <div className="h-screen">
        <h2>프리랜서 해적 이력서</h2>
        <Link to="/individual">
          더보기 <LuChevronRight />
        </Link>
        {/* slide */}
        <Slider
          slidesToShow={2}
          slidesToScroll={1}
          className="border p-2"
          autoplay
          autoplaySpeed={3000}
          ref={ref}
        >
          <div className="border">slide 1</div>
          <div className="border">slide 2</div>
          <div className="border">slide 3</div>
          <div className="border">slide 4</div>
          <div className="border">slide 5</div>
          <div className="border">slide 6</div>
        </Slider>
        <div className="flex-row gap-2">
          <button
            className="size-5 rounded-full bg-theme text-white"
            onClick={() => ref.current?.slickGoTo(0)}
          >
            1
          </button>
          <button className="size-5 rounded-full bg-theme text-white">2</button>
          <button className="size-5 rounded-full bg-theme text-white">3</button>
        </div>
      </div>
      <div className="h-screen">2</div>
    </div>
  );
}
