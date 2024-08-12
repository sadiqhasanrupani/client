import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Cookies from "js-cookie";

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";

import {
  HomeIcon,
  XIcon,
  ChevronDownIcon,
  BadgePlus,
  UserRoundCog,
  CalendarCog,
  Dot,
  Menu,
  LogOutIcon,
} from "lucide-react";

import ChevronBreadCrumb from "@/components/bread-crumbs/chevron-crumbs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LightLogo from "@/components/svg/logos/light-logo";
import { verifyToken } from "@/http/get";
import { getInitials, HttpError } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Member, NavigationItem, RoleEnum, VerifyTokenPayload } from "@/types";
import Spinner from "@/components/loaders/spinner";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { userDetailAction } from "@/store/slice/user-detail.slice";

const sidebarWidth = "18rem";

function classNames(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function RootLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [members, setMembers] = useState<Member[]>([]);
  const [navigation, setNavigations] = useState<NavigationItem[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubItem, setOpenSubItem] = useState(false);
  const [subItemIdx, setSubItemIdx] = useState<undefined | number>(undefined);

  const lgMatches = useMediaQuery({
    query: "(min-width: 1024px)",
  });

  const {
    data: verifyTokenData,
    isLoading: verifyTokenIsLoading,
    isRefetching: verifyTokenIsRefetching,
    isError: verifyTokenIsError,
    error: verifyTokenError,
  } = useQuery<VerifyTokenPayload, HttpError>({
    queryKey: ["verify-token", { navigate }],
    queryFn: () => verifyToken(),
    retry: 2,
  });

  useEffect(() => {
    if (verifyTokenIsError) {
      if (verifyTokenError?.code === 401) {
        navigate("/login");
      } else {
        toast.error(verifyTokenError.message);
      }
    }

    let memberList: Member[] = [];
    let navigationLists: NavigationItem[] = [];

    if (!verifyTokenIsLoading || !verifyTokenIsRefetching) {
      if (verifyTokenData && verifyTokenData.role) {
        const role: RoleEnum = verifyTokenData.role;

        dispatch(userDetailAction.set({ role: verifyTokenData.role }));

        if (role === "principle") {
          memberList = [
            {
              id: 2,
              name: "Teachers",
              to: "/members/teachers",
              initial: "T",
              current: false,
            },
            {
              id: 3,
              name: "Students",
              to: "/members/students",
              initial: "S",
              current: false,
            },
          ];
          navigationLists = [
            { name: "Dashboard", to: "/", icon: HomeIcon },
            {
              name: "Manage Users",
              to: "/manage-users",
              icon: UserRoundCog,
              children: [
                {
                  name: "Teachers",
                  to: "/manage-users/teachers",
                  icon: Dot,
                },
                {
                  name: "Students",
                  to: "/manage-users/students",
                  icon: Dot,
                },
              ],
            },
            { name: "Timetable", to: "/timetables", icon: CalendarCog },
            { name: "Manage Classrooms", to: "/classrooms", icon: BadgePlus },
            // {
            //   name: "Assign Classroom",
            //   to: "/assign-classrooms",
            //   icon: NotebookPen,
            // },
          ];
        } else if (role === "teacher") {
          // Handle other roles if needed
          memberList = [
            {
              id: 3,
              name: "Students",
              to: "/members/students",
              initial: "S",
              current: false,
            },
          ];
          navigationLists = [
            { name: "Dashboard", to: "/", icon: HomeIcon },
            { name: "Timetable", to: "/timetables", icon: CalendarCog },
          ];
        }
      } else {
        // Default case if verifyTokenData is undefined or role is undefined
        navigationLists = [
          { name: "Dashboard", to: "/", icon: HomeIcon },
          { name: "Timetable", to: "/timetables", icon: CalendarCog },
        ];

        memberList = [
          {
            id: 3,
            name: "Students",
            to: "/members/students",
            initial: "S",
            current: false,
          },
        ];
      }
    }

    setMembers(memberList);
    setNavigations(navigationLists);

    // eslint-disable-next-line
  }, [verifyTokenData, verifyTokenIsError, verifyTokenError, navigate, verifyTokenIsRefetching, verifyTokenIsLoading]);

  const navigationItemClickHandler = (index: number) => {
    if (openSubItem) {
      setOpenSubItem(false);
      setSubItemIdx(undefined);
    } else {
      setOpenSubItem(true);
      setSubItemIdx(index);
    }
    setSidebarOpen(false);
  };

  function signOutHandler() {
    Cookies.remove("authToken");
    navigate("/login");
  }

  const userNavigation = [
    // { name: "Your profile", to: "/profile", navigation: true },
    { name: "Sign out", navigate: false, handler: signOutHandler },
  ];

  return (
    <>
      {verifyTokenIsLoading ? (
        <div className="w-100 h-screen flex items-center justify-center">
          <Spinner className="w-[10rem] h-[15]" />
        </div>
      ) : (
        verifyTokenData?.role && (
          <div>
            <Transition show={sidebarOpen} as={Fragment}>
              <Dialog as="div" className="relative z-50 lg:hidden top-0 h-full w-full" onClose={setSidebarOpen}>
                <TransitionChild
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {/* Change position  absolute to Fixed  */}
                  <div className="fixed inset-0 top-0 bg-gray-900/80 h-screen w-full" />
                </TransitionChild>

                <div className="fixed inset-0 flex h-screen">
                  <TransitionChild
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                      <TransitionChild
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                          <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                            <span className="sr-only">Close sidebar</span>
                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                          </button>
                        </div>
                      </TransitionChild>
                      {/* Sidebar component, swap this element with another sidebar if you like */}
                      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-green-600 px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                          <LightLogo className="w-10 h-10" />
                        </div>
                        <nav className="flex flex-1 flex-col">
                          <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                              <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item, index) => (
                                  <React.Fragment key={index}>
                                    <li key={item.name}>
                                      <NavLink
                                        to={item.to}
                                        className={({ isActive }) => {
                                          return classNames(
                                            isActive
                                              ? "bg-green-700 text-white"
                                              : "text-green-200 hover:text-white hover:bg-green-700",
                                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                          );
                                        }}
                                        onClick={() => navigationItemClickHandler(index)}
                                      >
                                        <item.icon aria-hidden="true" />
                                        {item.name}
                                      </NavLink>
                                    </li>
                                    {openSubItem &&
                                      subItemIdx === index &&
                                      item.children?.map((subItem, index) => {
                                        return (
                                          <li key={index} className="px-2">
                                            <NavLink
                                              key={index}
                                              to={subItem.to}
                                              className={({ isActive }) => {
                                                return classNames(
                                                  isActive
                                                    ? "bg-green-700 text-white"
                                                    : "text-green-200 hover:text-white hover:bg-green-700",
                                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                                );
                                              }}
                                            >
                                              <subItem.icon aria-hidden="true" />
                                              {subItem.name}
                                            </NavLink>
                                          </li>
                                        );
                                      })}
                                  </React.Fragment>
                                ))}
                              </ul>
                            </li>
                            <li>
                              <div className="text-xs font-semibold leading-6 text-green-200">Your Members</div>
                              <ul role="list" className="-mx-2 mt-2 space-y-1">
                                {members.map((team, index) => (
                                  <li key={index}>
                                    <NavLink
                                      to={team.to}
                                      className={({ isActive }) =>
                                        classNames(
                                          isActive
                                            ? "bg-green-700 text-white"
                                            : "text-green-200 hover:text-white hover:bg-green-700",
                                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                        )
                                      }
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-400 bg-green-500 text-[0.625rem] font-medium text-white">
                                        {team.initial}
                                      </span>
                                      <span className="truncate">{team.name}</span>
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </li>
                            {/* <li className="mt-auto">
                          <a
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-green-200 hover:bg-green-700 hover:text-white"
                          >
                            <CogIcon
                              className="h-6 w-6 shrink-0 text-green-200 group-hover:text-white"
                              aria-hidden="true"
                            />
                            Settings
                          </a>
                        </li> */}
                          </ul>
                        </nav>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </Dialog>
            </Transition>

            {/* Static sidebar for desktop */}
            <div
              style={{ width: sidebarWidth }}
              className={classNames(`hidden lg:fixed lg:inset-y-0 lg:h-screen lg:z-50 lg:flex lg:flex-col`)}
            >
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <LightLogo className="w-10 h-10" />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item, index) => (
                          <React.Fragment key={index}>
                            <li key={item.name}>
                              <NavLink
                                to={item.to}
                                className={({ isActive }) => {
                                  return classNames(
                                    isActive
                                      ? "bg-green-700 text-white"
                                      : "text-green-200 hover:text-white hover:bg-green-700",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                  );
                                }}
                                onClick={() => navigationItemClickHandler(index)}
                              >
                                <item.icon aria-hidden="true" />
                                {item.name}
                              </NavLink>
                            </li>
                            {openSubItem &&
                              subItemIdx === index &&
                              item.children?.map((subItem, index) => {
                                return (
                                  <li key={index} className="px-2">
                                    <NavLink
                                      key={index}
                                      to={subItem.to}
                                      className={({ isActive }) => {
                                        return classNames(
                                          isActive
                                            ? "bg-green-700 text-white"
                                            : "text-green-200 hover:text-white hover:bg-green-700",
                                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                        );
                                      }}
                                    >
                                      <subItem.icon aria-hidden="true" />
                                      {subItem.name}
                                    </NavLink>
                                  </li>
                                );
                              })}
                          </React.Fragment>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs font-semibold leading-6 text-green-200">Your Memebers</div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {members.map((team) => (
                          <li key={team.name}>
                            <NavLink
                              to={team.to}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "bg-green-700 text-white"
                                    : "text-green-200 hover:text-white hover:bg-green-700",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                )
                              }
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-400 bg-green-500 text-[0.625rem] font-medium text-white">
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    {/* <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-green-200 hover:bg-green-700 hover:text-white"
                  >
                    <CogIcon
                      className="h-6 w-6 shrink-0 text-green-200 group-hover:text-white"
                      aria-hidden="true"
                    />
                    Settings
                  </a>
                </li> */}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="lg:pl-72">
              <div
                style={lgMatches ? { width: `calc(100% - ${sidebarWidth})` } : { width: "100%" }}
                className="fixed top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8"
              >
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                  <div className="relative flex flex-1 items-center text-lg">
                    <p className="hidden lg:block">
                      {`Welcome, `} <span className="font-semibold text-xl">{`${verifyTokenData.name}!`}</span>
                    </p>
                    {/* <label htmlFor="search-field" className="sr-only">
                      Search
                    </label>
                    <SearchIcon
                      className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                      aria-hidden="true"
                    /> */}
                    {/* <Input
                      id="search-field"
                      className="block h-full w-full border-0 focus:border-0 focus-visible:ring-0 shadow-none active:border-0 focus:outline-0 ring-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      type="search"
                      name="search"
                    /> */}
                  </div>
                  <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">View notifications</span>
                      {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                    </button>

                    {/* Separator */}
                    {/* <div
                      className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                      aria-hidden="true"
                    /> */}

                    {/* Profile dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="-m-1.5 flex items-center p-1.5 cursor-pointer">
                          <span className="sr-only">Open user menu</span>
                          <Avatar>
                            <AvatarFallback>{getInitials(verifyTokenData.name || "JD")}</AvatarFallback>
                          </Avatar>
                          <span className="hidden lg:flex lg:items-center">
                            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                              {verifyTokenData.name || "John Doe"}
                            </span>
                            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-full">
                        {userNavigation.map((item, index) => (
                          <DropdownMenuItem key={index} className={"flex items-center gap-2"} onClick={item.handler}>
                            <LogOutIcon className="text-red-500 w-4" />
                            <span>{item.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <main className="bg-slate-100 min-h-screen pt-[4rem]">
                <ChevronBreadCrumb />
                <div className="p-6 sm:px-6 lg:px-8 flex flex-col gap-6">
                  <div>
                    <Outlet />
                  </div>
                </div>
              </main>
            </div>
          </div>
        )
      )}
    </>
  );
}
