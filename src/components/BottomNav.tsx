import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/auth';
import { Home, Compass, FileText, ShieldCheck, Bookmark } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { shortlist } = useAuthStore();

  const navItems = [
    {
      to: '/',
      label: t('nav.home'),
      icon: Home,
      exact: true,
    },
    {
      to: '/results',
      label: t('nav.results'),
      icon: Compass,
      exact: false,
    },
    {
      to: '/shortlist',
      label: 'Documents',
      icon: FileText,
      badge: shortlist.length > 0 ? shortlist.length : undefined,
      exact: false,
    },
    {
      to: '/privacy',
      label: 'Privacy',
      icon: ShieldCheck,
      exact: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden py-1.5 px-2 safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative select-none ${
                isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
