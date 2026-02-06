import { Search, Bell, Globe, Menu, User, Settings, ShoppingBag, LogOut, ChevronDown, Package, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import logo from "figma:asset/5641928ebf37f4553480c47d5388ea1a15d27a75.png";
import { useState } from "react";

interface NavbarProps {
  isRTL: boolean;
  onLanguageToggle: () => void;
}

export function Navbar({
  isRTL,
  onLanguageToggle,
}: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src={logo}
                alt="aSERVICEz"
                className="h-14 w-auto object-contain"
              />
            </a>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/browse"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              {isRTL ? "تصفح الخدمات" : "Browse Services"}
            </Link>
            <Link
              to="#add"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              {isRTL ? "أضف خدمة" : "Add Service"}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={onLanguageToggle}
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center space-x-3 space-x-reverse">
              {isAuthenticated ? (
                <>
                  {user?.role === 'expert' && (
                    <Link to="/add-service">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                        {isRTL ? '+ إضافة خدمة' : '+ Add Service'}
                      </Button>
                    </Link>
                  )}
                  
                  {/* User Avatar Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowUserMenu(false)}
                        ></div>
                        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden`}>
                          {/* User Info Header */}
                          <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-gray-200">
                            <p className="font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                user?.role === 'expert' 
                                  ? 'bg-teal-100 text-teal-700' 
                                  : user?.role === 'admin'
                                  ? 'bg-red-100 text-red-700'
                                  : user?.role === 'customer_service'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {user?.role === 'expert' 
                                  ? (isRTL ? '👑 خبير' : '👑 Expert') 
                                  : user?.role === 'admin'
                                  ? (isRTL ? '🛡️ مسؤول' : '🛡️ Admin')
                                  : user?.role === 'customer_service'
                                  ? (isRTL ? '🎧 خدمة عملاء' : '🎧 Support')
                                  : (isRTL ? '👤 عميل' : '👤 Customer')}
                              </span>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <User className="w-4 h-4 text-gray-500" />
                              <span>{isRTL ? 'الملف الشخصي' : 'View Profile'}</span>
                            </Link>

                            <Link
                              to={
                                user?.role === 'expert' ? '/expert-dashboard'
                                : user?.role === 'admin' ? '/admin-dashboard'
                                : user?.role === 'customer_service' ? '/customer-service'
                                : '/'
                              }
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <LayoutDashboard className="w-4 h-4 text-gray-500" />
                              <span>{isRTL ? 'لوحة التحكم' : 'Dashboard'}</span>
                            </Link>

                            {user?.role === 'expert' && (
                              <Link
                                to="/my-services"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <Package className="w-4 h-4 text-gray-500" />
                                <span>{isRTL ? 'خدماتي' : 'My Services'}</span>
                              </Link>
                            )}

                            <Link
                              to="/orders"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <ShoppingBag className="w-4 h-4 text-gray-500" />
                              <span>{isRTL ? 'طلباتي' : 'My Orders'}</span>
                            </Link>

                            <Link
                              to="/settings"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="w-4 h-4 text-gray-500" />
                              <span>{isRTL ? 'الإعدادات' : 'Settings'}</span>
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-200">
                            <button
                              onClick={() => {
                                logout();
                                setShowUserMenu(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-700">
                      {isRTL ? "تسجيل الدخول" : "Login"}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      {isRTL ? "إنشاء حساب" : "Sign Up"}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button className="md:hidden p-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}