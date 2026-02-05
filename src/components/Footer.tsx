import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  isRTL: boolean;
}

export function Footer({ isRTL }: FooterProps) {
  const columns = isRTL ? {
    col1: {
      title: 'عن الموقع',
      links: ['من نحن', 'كيف يعمل', 'الأسئلة الشائعة', 'الوظائف'],
    },
    col2: {
      title: 'القانونية',
      links: ['الشروط والأحكام', 'سياسة الخصوصية', 'ضمان الحقوق', 'سياسة الاسترجاع'],
    },
    col3: {
      title: 'الدعم',
      links: ['اتصل بنا', 'مركز المساعدة', 'المدونة', 'منتدى المجتمع'],
    },
  } : {
    col1: {
      title: 'About',
      links: ['About Us', 'How It Works', 'FAQ', 'Careers'],
    },
    col2: {
      title: 'Legal',
      links: ['Terms & Conditions', 'Privacy Policy', 'Copyright', 'Refund Policy'],
    },
    col3: {
      title: 'Support',
      links: ['Contact Us', 'Help Center', 'Blog', 'Community Forum'],
    },
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">a</span>
              </div>
              <span className="text-white text-xl font-semibold">aSERVICEa</span>
            </div>
            <p className="text-sm text-gray-400 mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
              {isRTL 
                ? 'منصة رائدة للخدمات الرقمية المصغرة في العالم العربي'
                : 'Leading digital micro-services marketplace in the Arab world'
              }
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{columns.col1.title}</h4>
            <ul className="space-y-2">
              {columns.col1.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-teal-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{columns.col2.title}</h4>
            <ul className="space-y-2">
              {columns.col2.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-teal-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{columns.col3.title}</h4>
            <ul className="space-y-2">
              {columns.col3.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-teal-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>
            {isRTL 
              ? '© 2026 aSERVICEa. جميع الحقوق محفوظة'
              : '© 2026 aSERVICEa. All rights reserved'
            }
          </p>
        </div>
      </div>
    </footer>
  );
}
