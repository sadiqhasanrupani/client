import React, { Fragment, useState } from "react";
import {
  Dialog,
  Menu,
  Transition,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  ArchiveIcon,
  BellIcon,
  CogIcon,
  HomeIcon,
  XIcon,
  ChevronDownIcon,
  SearchIcon,
  BadgePlus,
  UserRoundCog,
  CalendarCog,
  NotebookPen,
  Users,
  UsersRound,
  Dot,
} from "lucide-react";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  {
    name: "Manage Users",
    href: "#",
    icon: UserRoundCog,
    current: false,
    children: [
      {
        name: "Teachers",
        href: "#",
        icon: Dot,
        current: false,
      },
      {
        name: "Students",
        href: "#",
        icon: Dot,
        current: false,
      },
    ],
  },
  { name: "Timetable", href: "#", icon: CalendarCog, current: false },
  { name: "Classroom", href: "#", icon: BadgePlus, current: false },
  { name: "Assign Classroom", href: "#", icon: NotebookPen, current: false },
];
const members = [
  { id: 2, name: "Teachers", href: "#", initial: "T", current: false },
  { id: 3, name: "Students", href: "#", initial: "W", current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubItem, setOpenSubItem] = useState(false);
  const [idx, setIdx] = useState<undefined | number>(undefined);

  const navigationItemClickHandler = (index: number) => {
    if (openSubItem) {
      setOpenSubItem(false);
      setIdx(undefined);
    } else {
      setOpenSubItem(true);
      setIdx(index);
    }
  };

  return (
    <>
      <div>
        <Transition show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[1000] lg:hidden top-0 h-full w-full"
            onClose={setSidebarOpen}
          >
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
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-green-600 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=white"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item, index) => (
                              <React.Fragment key={index}>
                                <li key={item.name}>
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      item.current
                                        ? "bg-green-700 text-white"
                                        : "text-green-200 hover:text-white hover:bg-green-700",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                    )}
                                    onClick={() =>
                                      navigationItemClickHandler(index)
                                    }
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.current
                                          ? "text-white"
                                          : "text-green-200 group-hover:text-white",
                                        "h-6 w-6 shrink-0",
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                                {openSubItem &&
                                  idx === index &&
                                  item.children?.map((subItem, index) => {
                                    return (
                                      <li key={index} className="px-2">
                                        <Link
                                          key={index}
                                          to={subItem.href}
                                          className={classNames(
                                            subItem.current
                                              ? "bg-green-700 text-white"
                                              : "text-green-200 hover:text-white hover:bg-green-700",
                                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                          )}
                                        >
                                          <subItem.icon
                                            className={classNames(
                                              subItem.current
                                                ? "text-white"
                                                : "text-green-200 group-hover:text-white",
                                              "h-6 w-6 shrink-0",
                                            )}
                                            aria-hidden="true"
                                          />
                                          {subItem.name}
                                        </Link>
                                      </li>
                                    );
                                  })}
                              </React.Fragment>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-green-200">
                            Your Members
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {members.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-green-700 text-white"
                                      : "text-green-200 hover:text-white hover:bg-green-700",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                  )}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-400 bg-green-500 text-[0.625rem] font-medium text-white">
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
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
                        </li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:absolute lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-green-600 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item, index) => (
                      <React.Fragment key={index}>
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-green-700 text-white"
                                : "text-green-200 hover:text-white hover:bg-green-700",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                            )}
                            onClick={() => navigationItemClickHandler(index)}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-white"
                                  : "text-green-200 group-hover:text-white",
                                "h-6 w-6 shrink-0",
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                        {openSubItem &&
                          idx === index &&
                          item.children?.map((subItem, index) => {
                            return (
                              <li key={index} className="px-2">
                                <Link
                                  key={index}
                                  to={subItem.href}
                                  className={classNames(
                                    subItem.current
                                      ? "bg-green-700 text-white"
                                      : "text-green-200 hover:text-white hover:bg-green-700",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                  )}
                                >
                                  <subItem.icon
                                    className={classNames(
                                      subItem.current
                                        ? "text-white"
                                        : "text-green-200 group-hover:text-white",
                                      "h-6 w-6 shrink-0",
                                    )}
                                    aria-hidden="true"
                                  />
                                  {subItem.name}
                                </Link>
                              </li>
                            );
                          })}
                      </React.Fragment>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-green-200">
                    Your teams
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {members.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-green-700 text-white"
                              : "text-green-200 hover:text-white hover:bg-green-700",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-400 bg-green-500 text-[0.625rem] font-medium text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
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
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <ArchiveIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <SearchIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                        aria-hidden="true"
                      >
                        Tom Cook
                      </span>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-gray-900",
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{/* Your content */}</div>
          </main>
        </div>
      </div>
    </>
  );
}
