import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, type Product } from "@/lib/shop";

export function OrderModal({
  open,
  products,
  initialProduct,
  onClose,
}: {
  open: boolean;
  products: Product[];
  initialProduct: Product | null;
  onClose: () => void;
}) {
  const [productId, setProductId] = useState<string>("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const product = products.find((p) => p.id === productId) ?? null;

  useEffect(() => {
    if (open) {
      const p = initialProduct ?? products[0] ?? null;
      setProductId(p?.id ?? "");
      setSize(p?.sizes[0] ?? "");
    }
  }, [open, initialProduct, products]);

  useEffect(() => {
    if (product && !product.sizes.includes(size)) setSize(product.sizes[0] ?? "");
  }, [product, size]);

  const total = product ? Number(product.price) * quantity : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) {
      toast.error("Please choose a cake");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in your details");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      product_id: product.id,
      product_name: product.name,
      quantity,
      size,
      custom_message: message || null,
      customer_name: name.trim(),
      phone: phone.trim(),
      delivery_address: address.trim(),
      delivery_date: date || null,
      total_price: total,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not place order. Please try again.");
      return;
    }
    toast.success("Order placed! We'll call you shortly to confirm.");
    setMessage(""); setName(""); setPhone(""); setAddress(""); setDate(""); setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-chocolate">Place Your Order</DialogTitle>
          <DialogDescription>Tell us what you'd like and where to deliver it.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Cake</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Choose a cake" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Size" /></SelectTrigger>
                <SelectContent>
                  {(product?.sizes ?? []).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qty">Quantity</Label>
              <Input id="qty" type="number" min={1} max={50} value={quantity} className="h-11 rounded-xl"
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="msg">Message on cake (optional)</Label>
            <Input id="msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Happy Birthday, Ayesha!" className="h-11 rounded-xl" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="addr">Delivery address</Label>
            <Textarea id="addr" value={address} onChange={(e) => setAddress(e.target.value)} required rows={2} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date">Delivery date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
            <span className="text-sm font-semibold text-muted-foreground">Estimated total</span>
            <span className="font-display text-2xl font-semibold text-primary">{formatPrice(total)}</span>
          </div>
          <Button type="submit" variant="rose" size="xl" className="w-full" disabled={submitting}>
            {submitting ? "Placing order..." : "Place Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
