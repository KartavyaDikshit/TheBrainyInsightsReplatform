import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./ImageWithFallback";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export function ServiceCard({ 
  title, 
  description, 
  imageUrl
}: ServiceCardProps) {
  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-80 md:flex-shrink-0">
            <div className="aspect-video md:aspect-square overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
              <ImageWithFallback
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                fill
              />
            </div>
          </div>
          <div className="flex-1 p-6 md:p-8">
            <h3 className="mb-4 text-slate-900 text-lg font-medium">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
