// Core components that exist
export { default as Section } from './Section';
export { default as Container } from './Container';
export { ReportCard } from './components/ReportCard';
export { ReportsGrid } from './components/ReportsGrid';
export { SearchFilterBar } from './components/SearchFilterBar';
export { default as Table } from './Table';
export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from './components/ui/pagination';
export { default as SearchBar } from './SearchBar';
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from './components/ui/breadcrumb';

// UI Components
export { Button } from './components/ui/button';
export { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from './components/ui/card';
export { Badge } from './components/ui/badge';
export { Input } from './components/ui/input';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
export { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './components/ui/sheet';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from './components/ui/dropdown-menu';

// Extended UI Components
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from './components/ui/alert-dialog';
export { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
export { AspectRatio } from './components/ui/aspect-ratio';
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/ui/collapsible';
export { Separator } from './components/ui/separator';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
export { Skeleton } from './components/ui/skeleton';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './components/ui/dialog';
export { Label } from './components/ui/label';
export { Textarea } from './components/ui/textarea';
export { RadioGroup, RadioGroupItem } from './components/ui/radio-group';

// Report Components
export { ReportHero } from './components/reports/report-hero';
export { ReportSidebar } from './components/reports/report-sidebar';
export { ReportContent } from './components/reports/report-content';

// Common Components
export { ImageWithFallback } from './components/common/image-with-fallback';

// Icons
export {
  TechnologyIcon,
  HealthcareIcon,
  FinanceIcon,
  EnergyIcon,
  AutomotiveIcon,
  FoodBeveragesIcon,
  ConsumerGoodsIcon,
  ManufacturingIcon,
  AerospaceDefenseIcon,
  DefaultCategoryIcon
} from './components/icons/CategoryIcons';

// Templates
export { ListingTemplate } from './templates/ListingTemplate';

// Export component types for TypeScript
export type { InputProps } from './components/ui/input';
export type { TextareaProps } from './components/ui/textarea';

// Re-export utility functions
export { cn } from './components/ui/utils';
