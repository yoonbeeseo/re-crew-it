import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import {
  LuAlignCenter,
  LuHouse,
  LuUserPlus,
  LuUser,
  LuLogOut,
  LuFileCode2,
  LuFileLock2,
  LuFileHeart,
  LuSearch,
  LuX,
} from "react-icons/lu";
import { IconType } from "react-icons";
import { useModal } from "../ui";
import LoginBox from "./LoginBox";

type Props = {
  user: null | any;
};

export default function AppLayout({ user }: Props) {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const getScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", getScroll);

    return () => {
      window.removeEventListener("scroll", getScroll);
    };
  }, []);

  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const handleMenuShowing = useCallback(
    () => setIsMenuShowing((prev) => !prev),
    []
  );

  type Menu = {
    path: string;
    name: string;
    Icon: IconType;
  };
  const menus = useMemo<Menu[]>(() => {
    const items: Menu[] = [
      { Icon: LuHouse, name: "홈", path: "/" },
      { Icon: LuSearch, name: "크루 찾기", path: "/crew" },
      { Icon: LuSearch, name: "프리랜서 찾기", path: "/individual" },
    ];

    if (!user) {
      items.push(
        { Icon: LuUser, name: "로그인", path: "" },
        { Icon: LuUserPlus, name: "회원가입", path: "/signup" }
      );
    } else {
      items.push(
        { Icon: LuFileCode2, name: "이력서", path: "/resume" },
        { Icon: LuFileLock2, name: "크루정보", path: "/crewinfo" },
        { Icon: LuFileHeart, name: "스크랩", path: "/scrap" },
        { Icon: LuLogOut, name: "로그아웃", path: "" }
      );
    }

    return items;
  }, [user]);

  const location = useLocation();
  const navi = useNavigate();

  const Login = useModal();

  return (
    <>
      <header
        className={twMerge(
          "fixed top-0 w-full z-10 bg-theme",
          scroll > 100 && "shadow-md"
        )}
      >
        <div className="con h-15 flex-row justify-between border border-transparent">
          <Link
            onClick={() => setIsMenuShowing(false)}
            to={"/"}
            className="text-white font-black text-2xl pl-3"
          >
            내 동료가 되어라!
          </Link>
          <button
            onClick={handleMenuShowing}
            className="size-15 text-white text-3xl"
          >
            <LuAlignCenter />
          </button>
        </div>
      </header>
      {isMenuShowing && (
        <nav className="flex overflow-hidden fixed top-0 right-0 z-[11] w-full justify-end">
          <span
            className="absolute top-0 left-0 bg-black/10 h-screen w-full -z-10"
            onClick={handleMenuShowing}
          />
          <div className="emerge right bg-white max-h-screen overflow-y-auto h-screen border-l border-border">
            <ul className="px-3">
              <li>
                <button
                  className="w-full justify-end py-5 px-2 text-xl"
                  onClick={handleMenuShowing}
                >
                  <LuX />
                </button>
              </li>
              {menus.map((menu) => (
                <li key={menu.name}>
                  <button
                    className={twMerge(
                      "w-full justify-start p-3 pr-10 text-gray-500 hover:text-sky-500",
                      menu.path === location.pathname &&
                        "bg-gray-50 rounded-md text-theme font-semibold"
                    )}
                    onClick={() => {
                      handleMenuShowing();
                      if (menu.path.length > 0) {
                        return navi(menu.path);
                      }

                      //! menu.path 가 없는곳
                      switch (menu.name) {
                        case "로그인":
                          return Login.show();
                      }
                    }}
                  >
                    <menu.Icon />
                    {menu.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      <Login.Modal>
        <LoginBox hide={Login.hide} />
      </Login.Modal>
      <main className="pt-15 con">
        <Outlet />
      </main>
    </>
  );
}
