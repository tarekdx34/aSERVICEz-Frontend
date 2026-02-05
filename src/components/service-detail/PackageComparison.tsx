import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';

interface PackageFeature {
  label: string;
  labelEn: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}

interface Package {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  deliveryDays: number;
  revisions: number;
}

interface PackageComparisonProps {
  packages: Package[];
  features: PackageFeature[];
  selectedPackage: string;
  onSelectPackage: (id: string) => void;
  isRTL?: boolean;
}

export function PackageComparison({
  packages,
  features,
  selectedPackage,
  onSelectPackage,
  isRTL = true,
}: PackageComparisonProps) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-teal-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-sm font-medium text-gray-900">{value}</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📦 {isRTL ? 'مقارنة الباقات' : 'Package Comparison'}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-700">
                {isRTL ? 'المميزات' : 'Features'}
              </th>
              {packages.map((pkg) => (
                <th key={pkg.id} className="p-4">
                  <div className="space-y-2">
                    <div className={`text-base font-bold ${pkg.id === selectedPackage ? 'text-teal-600' : 'text-gray-900'}`}>
                      {isRTL ? pkg.name : pkg.nameEn}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${pkg.price}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Delivery & Revisions */}
            <tr className="border-b border-gray-100">
              <td className="p-4 text-gray-700 font-medium">
                {isRTL ? 'مدة التسليم' : 'Delivery time'}
              </td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {pkg.deliveryDays} {isRTL ? 'أيام' : 'days'}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-100">
              <td className="p-4 text-gray-700 font-medium">
                {isRTL ? 'عدد المراجعات' : 'Number of revisions'}
              </td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {pkg.revisions}
                  </span>
                </td>
              ))}
            </tr>

            {/* Custom Features */}
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="p-4 text-gray-700">
                  {isRTL ? feature.label : feature.labelEn}
                </td>
                <td className="p-4 text-center">
                  {renderCell(feature.basic)}
                </td>
                <td className="p-4 text-center">
                  {renderCell(feature.standard)}
                </td>
                <td className="p-4 text-center">
                  {renderCell(feature.premium)}
                </td>
              </tr>
            ))}

            {/* Action Buttons */}
            <tr>
              <td className="p-4"></td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4 text-center">
                  <Button
                    onClick={() => onSelectPackage(pkg.id)}
                    className={`w-full ${
                      pkg.id === selectedPackage
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {pkg.id === selectedPackage 
                      ? (isRTL ? 'محدد ✓' : 'Selected ✓')
                      : (isRTL ? 'اختر' : 'Select')
                    }
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
