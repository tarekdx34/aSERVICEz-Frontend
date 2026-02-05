interface CategoryHeroProps {
  categoryName: string;
  categoryNameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  serviceCount: number;
  isRTL?: boolean;
}

export function CategoryHero({
  categoryName,
  categoryNameEn,
  description,
  descriptionEn,
  icon,
  serviceCount,
  isRTL = true,
}: CategoryHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-xl overflow-hidden mb-8">
      <div className="relative z-10 px-8 py-12">
        <div className="max-w-4xl">
          {/* Icon */}
          <div className="text-6xl mb-4">
            {icon}
          </div>

          {/* Category Name */}
          <h1 className="text-4xl font-bold mb-3">
            {isRTL ? categoryName : categoryNameEn}
          </h1>

          {/* Description */}
          <p className="text-lg text-teal-50 mb-4 max-w-2xl">
            {isRTL ? description : descriptionEn}
          </p>

          {/* Service Count */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm font-medium">
              {isRTL 
                ? `${serviceCount.toLocaleString('ar-SA')} خدمة متاحة` 
                : `${serviceCount.toLocaleString('en-US')} services available`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
