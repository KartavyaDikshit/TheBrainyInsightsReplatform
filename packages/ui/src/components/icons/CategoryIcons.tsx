import React from 'react';

interface IconProps {
  className?: string;
}

// Technology Icon
export const TechnologyIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="48" height="32" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <rect x="12" y="16" width="40" height="24" fill="currentColor" opacity="0.1"/>
    <line x1="20" y1="48" x2="44" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="28" y1="44" x2="28" y2="48" stroke="currentColor" strokeWidth="2.5"/>
    <line x1="36" y1="44" x2="36" y2="48" stroke="currentColor" strokeWidth="2.5"/>
  </svg>
);

// Healthcare Icon
export const HealthcareIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <rect x="28" y="18" width="8" height="28" rx="1" fill="currentColor"/>
    <rect x="18" y="28" width="28" height="8" rx="1" fill="currentColor"/>
  </svg>
);

// Finance Icon
export const FinanceIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1"/>
    <path d="M32 18 L32 46 M24 28 L32 22 L40 28 M24 36 L40 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Energy Icon
export const EnergyIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 8 L20 32 L32 32 L26 56 L44 28 L32 28 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// Automotive Icon
export const AutomotiveIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 38 L16 26 L20 22 L44 22 L48 26 L52 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="10" y="38" width="44" height="8" rx="2" fill="currentColor" opacity="0.2"/>
    <circle cx="20" cy="46" r="5" fill="currentColor"/>
    <circle cx="44" cy="46" r="5" fill="currentColor"/>
    <rect x="18" y="26" width="8" height="12" rx="1" fill="currentColor" opacity="0.3"/>
    <rect x="38" y="26" width="8" height="12" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Food & Beverage Icon
export const FoodIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Plate */}
    <circle cx="32" cy="36" r="20" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1"/>
    <circle cx="32" cy="36" r="14" stroke="currentColor" strokeWidth="2" fill="none"/>
    {/* Fork */}
    <path d="M18 12 L18 24 M14 12 L14 20 M22 12 L22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="18" y1="24" x2="18" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Knife */}
    <path d="M46 12 L46 28 M46 12 L48 14 L46 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Consumer Goods Icon
export const ConsumerGoodsIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shopping bag */}
    <path d="M16 20 L12 52 L52 52 L48 20 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M16 20 L48 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Handle */}
    <path d="M22 20 Q22 12 32 12 Q42 12 42 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Tag/label */}
    <rect x="28" y="32" width="8" height="10" rx="1" fill="currentColor" opacity="0.4"/>
  </svg>
);

// Manufacturing Icon
export const ManufacturingIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="32" width="16" height="20" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
    <rect x="28" y="24" width="16" height="28" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
    <rect x="48" y="16" width="8" height="36" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
    <rect x="12" y="12" width="8" height="12" fill="currentColor"/>
    <rect x="32" y="8" width="8" height="12" fill="currentColor"/>
  </svg>
);

// Machinery & Equipment Icon
export const MachineryIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tower Crane - Made clearer */}
    {/* Crane base */}
    <rect x="4" y="32" width="10" height="4" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    {/* Main tower */}
    <rect x="7" y="10" width="4" height="22" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    {/* Horizontal boom (long arm) */}
    <rect x="9" y="8" width="30" height="3" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    {/* Counter-jib (short arm) */}
    <rect x="2" y="8" width="9" height="3" fill="currentColor" opacity="0.6"/>
    {/* Support cable */}
    <path d="M11 10 L15 8 M11 10 L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    {/* Hanging cable with hook */}
    <line x1="28" y1="11" x2="28" y2="22" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
    <path d="M26 22 L28 24 L30 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    
    {/* Excavator 1 */}
    <rect x="16" y="44" width="14" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="19" cy="51" r="2.5" fill="currentColor"/>
    <circle cx="27" cy="51" r="2.5" fill="currentColor"/>
    {/* Arm */}
    <path d="M26 44 L30 36 L34 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Bucket */}
    <path d="M34 38 L36 36 L38 38 L36 40 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Excavator 2 */}
    <rect x="42" y="46" width="14" height="7" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="45" cy="53" r="2.5" fill="currentColor"/>
    <circle cx="53" cy="53" r="2.5" fill="currentColor"/>
    {/* Arm */}
    <path d="M52 46 L56 38 L60 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Bucket */}
    <path d="M60 40 L62 38 L64 40 L62 42 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Agriculture Icon
export const AgricultureIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wheat stalks */}
    <path d="M24 48 L24 20 M20 26 Q18 26 18 24 M28 26 Q30 26 30 24 M20 32 Q18 32 18 30 M28 32 Q30 32 30 24 M20 38 Q18 38 18 36 M28 38 Q30 38 30 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M40 48 L40 20 M36 26 Q34 26 34 24 M44 26 Q46 26 46 24 M36 32 Q34 32 34 30 M44 32 Q46 32 46 30 M36 38 Q34 38 34 36 M44 38 Q46 38 46 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Ground */}
    <line x1="12" y1="48" x2="52" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Aerospace Icon
export const AerospaceIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12 L44 28 L54 30 L54 38 L44 40 L32 56 L20 40 L10 38 L10 30 L20 28 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <circle cx="32" cy="32" r="6" fill="currentColor"/>
    <path d="M32 12 L32 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Chemicals Icon
export const ChemicalsIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12 L24 28 L20 40 Q20 48 28 48 L36 48 Q44 48 44 40 L40 28 L40 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="24" y="8" width="16" height="4" fill="currentColor"/>
    <circle cx="28" cy="36" r="3" fill="currentColor" opacity="0.4"/>
    <circle cx="36" cy="40" r="2.5" fill="currentColor" opacity="0.4"/>
  </svg>
);

// Telecommunications Icon
export const TelecommunicationsIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="16" width="16" height="40" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1"/>
    <rect x="28" y="20" width="8" height="30" rx="1" fill="currentColor" opacity="0.2"/>
    <circle cx="32" cy="52" r="2" fill="currentColor"/>
    <path d="M16 24 Q12 28 12 32 Q12 36 16 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M48 24 Q52 28 52 32 Q52 36 48 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

// Retail Icon (same as Consumer Goods but alternative)
export const RetailIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20 L18 12 L46 12 L52 20 L52 52 L12 52 Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M12 20 L52 20 L52 28 Q48 32 44 32 Q40 32 36 28 Q32 32 28 32 Q24 32 20 28 Q16 32 12 28 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// Pharmaceutical Icon
export const PharmaceuticalIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="12" width="24" height="40" rx="12" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1"/>
    <line x1="32" y1="20" x2="32" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="24" y1="32" x2="40" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Electronics Icon
export const ElectronicsIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="16" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1"/>
    <circle cx="24" cy="28" r="4" fill="currentColor"/>
    <circle cx="40" cy="28" r="4" fill="currentColor"/>
    <circle cx="32" cy="36" r="4" fill="currentColor"/>
    <path d="M24 32 L28 36 M40 32 L36 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Generic/Default Icon
export const DefaultCategoryIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1"/>
    <path d="M22 28 L32 22 L42 28 L42 42 L22 42 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// Helper function to get icon by category name
export const getCategoryIcon = (categoryTitle?: string, className?: string) => {
  const category = categoryTitle?.toLowerCase() || '';
  
  if (category.includes('technology') || category.includes('tech') || category.includes('semiconductor')) {
    return <TechnologyIcon className={className} />;
  }
  if (category.includes('healthcare') || category.includes('health') || category.includes('medical')) {
    return <HealthcareIcon className={className} />;
  }
  if (category.includes('finance') || category.includes('financial') || category.includes('banking')) {
    return <FinanceIcon className={className} />;
  }
  if (category.includes('energy') || category.includes('power')) {
    return <EnergyIcon className={className} />;
  }
  if (category.includes('automotive') || category.includes('vehicle') || category.includes('transportation')) {
    return <AutomotiveIcon className={className} />;
  }
  if (category.includes('food') || category.includes('beverage')) {
    return <FoodIcon className={className} />;
  }
  if (category.includes('agriculture') || category.includes('farming') || category.includes('agri')) {
    return <AgricultureIcon className={className} />;
  }
  if (category.includes('machinery') || category.includes('equipment')) {
    return <MachineryIcon className={className} />;
  }
  if (category.includes('consumer') || category.includes('goods')) {
    return <ConsumerGoodsIcon className={className} />;
  }
  if (category.includes('retail')) {
    return <RetailIcon className={className} />;
  }
  if (category.includes('manufacturing') || category.includes('industrial')) {
    return <ManufacturingIcon className={className} />;
  }
  if (category.includes('aerospace') || category.includes('defense') || category.includes('defence') || category.includes('aviation')) {
    return <AerospaceIcon className={className} />;
  }
  if (category.includes('chemical') || category.includes('material')) {
    return <ChemicalsIcon className={className} />;
  }
  if (category.includes('telecommunication') || category.includes('telecom') || category.includes('5g')) {
    return <TelecommunicationsIcon className={className} />;
  }
  if (category.includes('pharmaceutical') || category.includes('pharma') || category.includes('drug')) {
    return <PharmaceuticalIcon className={className} />;
  }
  if (category.includes('electronic')) {
    return <ElectronicsIcon className={className} />;
  }
  
  return <DefaultCategoryIcon className={className} />;
};

