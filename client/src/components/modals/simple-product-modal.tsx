import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Copy, TrendingUp, Eye, Trash2 } from "lucide-react";
import type { Product } from "@shared/schema";

interface SimpleProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: any) => void;
}

export function SimpleProductModal({ product, isOpen, onClose, onSave }: SimpleProductModalProps) {
  if (!product) return null;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View detailed information about {product.name}
            </DialogDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <TrendingUp className="h-4 w-4 mr-2" />
                Adjust Stock
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Base Price:</span>
              <p>{formatPrice(product.basePrice)}</p>
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
              <span className="text-sm font-medium">Total Stock:</span>
              <p>{(parseFloat(product.ngWarehouse || "0") + parseFloat(product.phWarehouse || "0") + parseFloat(product.reservedWarehouse || "0")).toFixed(1)} {product.unit}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {product.isActive && (
              <Badge variant="outline">Active</Badge>
            )}
            {product.tags && product.tags.length > 0 && (
              product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))
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