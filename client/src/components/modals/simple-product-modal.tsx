import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface SimpleProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: any) => void;
}

export function SimpleProductModal({ product, isOpen, onClose, onSave }: SimpleProductModalProps) {
  if (!product) return null;

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numPrice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Price:</span>
              <p>{formatPrice(product.price)}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Hair Type:</span>
              <p>{product.hairType}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Color:</span>
              <p>{product.color}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Stock:</span>
              <p>{product.currentStock}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {product.isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            {product.isActive && (
              <Badge variant="outline">Active</Badge>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onSave && (
            <Button onClick={() => onSave(product)}>
              Save Changes
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}