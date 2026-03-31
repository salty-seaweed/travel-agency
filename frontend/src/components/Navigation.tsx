import React, { useState, useEffect, useCallback } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  HomeIcon,
  StarIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  InformationCircleIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useTranslation } from '../i18n';
import logo from '../assets/logo.svg';
import { CurrencySelector } from './CurrencySelector';
import { cn } from '../styles/design-system';

type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface NavigationItem {
  name: string;
  href: string;
  icon: NavIcon;
  featured?: boolean;
}

const NAV_LINK_BASE =
  'relative inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1';

function NavLinkButton({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        NAV_LINK_BASE,
        active ? 'bg-sky-50 text-sky-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
      )}
      aria-label={`Navigate to ${label} page`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
      {active ? (
        <span
          className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-sky-600"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

export const Navigation = React.memo(() => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, customerData, logout } = useCustomerAuth();
  const { t } = useTranslation();

  const navigation: NavigationItem[] = [
    { name: t('navigation.home'), href: '/', icon: HomeIcon },
    { name: t('navigation.packages'), href: '/packages', icon: StarIcon, featured: true },
    { name: t('navigation.resorts'), href: '/resorts', icon: BuildingOfficeIcon, featured: true },
    { name: t('navigation.boats'), href: '/boats', icon: SparklesIcon, featured: true },
    { name: t('navigation.gallery', 'Gallery'), href: '/gallery', icon: PhotoIcon, featured: true },
    {
      name: t('navigation.maldivesInfo', 'Maldives Info'),
      href: '/maldives-info',
      icon: InformationCircleIcon,
      featured: true,
    },
    { name: t('navigation.about'), href: '/about', icon: InformationCircleIcon },
  ];

  const primaryNav = navigation.slice(0, 4);
  const secondaryNav = navigation.slice(4);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  const secondaryActive = secondaryNav.some((i) => isActive(i.href));

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-200',
          isScrolled ? 'border-gray-200 bg-white/95 shadow-md' : 'border-gray-100 bg-white/90 shadow-sm',
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:px-4 lg:h-16 lg:px-6">
          <div className="flex min-w-0 shrink-0 items-center">
            <Link
              to="/"
              aria-label="Thread Travels home"
              className="flex min-w-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-80 sm:gap-2.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 md:h-12 md:w-12">
                <img
                  src={logo}
                  alt=""
                  className="h-full w-full object-contain"
                  width={48}
                  height={48}
                />
              </span>
              <span className="hidden min-w-0 flex-col justify-center gap-0.5 sm:flex">
                <span className="truncate font-display text-[1.05rem] font-semibold leading-tight tracking-tight text-slate-900 sm:text-lg md:text-xl md:font-medium">
                  Thread Travels
                </span>
                <span className="hidden max-w-[14rem] truncate font-sans text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.14em] text-sky-800/55 md:block">
                  Travels & Tours Maldives
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden min-h-0 min-w-0 flex-1 items-center justify-center px-2 lg:flex xl:px-6">
            <div
              className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 lg:gap-x-3 xl:gap-x-4"
              role="navigation"
              aria-label="Main"
            >
              {primaryNav.map((item) => (
                <NavLinkButton
                  key={item.href}
                  href={item.href}
                  label={item.name}
                  active={isActive(item.href)}
                />
              ))}
              <Menu>
                <MenuButton
                  className={cn(
                    NAV_LINK_BASE,
                    'cursor-pointer border-0 bg-transparent text-left',
                    secondaryActive
                      ? 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  )}
                >
                  <span className="shrink-0">{t('navigation.more', 'More')}</span>
                  <ChevronDownIcon
                    className="h-4 w-4 shrink-0 text-current opacity-60"
                    aria-hidden
                  />
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom"
                  modal={false}
                  className="z-[100] mt-1 min-w-[12rem] origin-top rounded-xl border border-gray-200 bg-white py-1 shadow-lg outline-none [--anchor-gap:6px] data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  {secondaryNav.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <MenuItem key={item.href}>
                        {({ focus }) => (
                          <Link
                            to={item.href}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 text-sm',
                              focus && 'bg-gray-50',
                              active ? 'bg-sky-50 font-semibold text-sky-800' : 'font-medium text-gray-800',
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                            {item.name}
                          </Link>
                        )}
                      </MenuItem>
                    );
                  })}
                </MenuItems>
              </Menu>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="relative rounded-2xl p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" aria-hidden />
                </button>
                <Menu>
                  <MenuButton className="flex items-center gap-2 rounded-2xl px-2 py-1.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 md:px-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <UserIcon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="hidden max-w-[7rem] truncate md:inline">
                      {customerData?.user?.first_name ?? 'User'}
                    </span>
                    <ChevronDownIcon className="hidden h-4 w-4 shrink-0 md:block" aria-hidden />
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom end"
                    modal={false}
                    className="z-[100] mt-1 w-48 origin-top-right rounded-2xl border border-gray-200 bg-white py-1 shadow-xl outline-none [--anchor-gap:6px] data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/customer/dashboard"
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 text-sm text-gray-800',
                            focus && 'bg-gray-50',
                          )}
                        >
                          <UserIcon className="h-4 w-4" aria-hidden />
                          Dashboard
                        </Link>
                      )}
                    </MenuItem>
                    <div className="my-1 border-t border-gray-100" role="separator" />
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className={cn(
                            'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600',
                            focus && 'bg-red-50',
                          )}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden />
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
                <CurrencySelector compact showLabel={false} variant="outline" size="sm" />
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <CurrencySelector compact showLabel={false} variant="outline" size="sm" />
                <Link
                  to="/packages"
                  className="inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-1 lg:px-4"
                  aria-label="Browse and book travel packages"
                >
                  {t('ui.buttons.bookNow')}
                </Link>
              </div>
            )}

            <button
              type="button"
              className="rounded-2xl p-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <Dialog open={mobileOpen} onClose={() => setMobileOpen(false)} className="relative z-[60] lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 transition data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex justify-end overflow-hidden">
          <DialogPanel
            transition
            className="flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition duration-200 ease-out data-[closed]:translate-x-full"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
              <DialogTitle className="flex min-w-0 items-center gap-2">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <img src={logo} alt="" className="h-full w-full object-contain" width={48} height={48} />
                </span>
                <span className="min-w-0 flex-col gap-0.5">
                  <span className="block truncate font-display text-lg font-semibold leading-tight text-slate-900">
                    Thread Travels
                  </span>
                  <span className="block truncate font-sans text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.14em] text-sky-800/55">
                    Travels & Tours Maldives
                  </span>
                </span>
              </DialogTitle>
              <button
                type="button"
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                        active ? 'bg-sky-50 text-sky-700' : 'text-gray-700 hover:bg-gray-100',
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="my-8 border-t border-gray-200" role="separator" />

              <p className="mb-2 px-1 text-sm font-semibold text-gray-700">Currency</p>
              <CurrencySelector size="md" variant="outline" showLabel />

              <div className="my-8 border-t border-gray-200" role="separator" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <p className="px-1 text-sm font-semibold text-gray-700">
                    Welcome, {customerData?.user?.first_name ?? 'User'}
                  </p>
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-800 hover:bg-gray-100"
                  >
                    <UserIcon className="h-5 w-5" aria-hidden />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/packages"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Book Now
                </Link>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
