import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertSalesSchema, type InsertSales } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SalesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { value: "rendang", label: "Rendang" },
  { value: "gulai-kambing", label: "Gulai Kambing" },
  { value: "ayam-pop", label: "Ayam Pop" },
  { value: "sambal-ijo", label: "Sambal Ijo" },
  { value: "dendeng-batokok", label: "Dendeng Batokok" },
  { value: "gulai-tunjang", label: "Gulai Tunjang" },
];

const salesCategories = [
  { value: "dine-in", label: "Dine In" },
  { value: "takeaway", label: "Takeaway" },
  { value: "online", label: "Online" },
  { value: "catering", label: "Catering" },
];

export default function SalesModal({ open, onOpenChange }: SalesModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSales>({
    resolver: zodResolver(insertSalesSchema),
    defaultValues: {
      menuItem: "",
      category: "dine-in",
      quantity: 1,
      price: "0",
      total: "0",
      datetime: new Date(),
      notes: "",
    },
  });

  const createSalesMutation = useMutation({
    mutationFn: async (data: InsertSales) => {
      const response = await apiRequest("POST", "/api/sales", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-summary"] });
      toast({
        title: "Berhasil!",
        description: "Data penjualan telah disimpan",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan data penjualan",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSales) => {
    // Calculate total
    const calculatedTotal = parseFloat(data.price) * data.quantity;
    createSalesMutation.mutate({
      ...data,
      total: calculatedTotal.toString(),
    });
  };

  // Watch quantity and price to calculate total
  const quantity = form.watch("quantity");
  const price = form.watch("price");
  const total = (parseFloat(price) || 0) * (quantity || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="sales-modal">
        <DialogHeader>
          <DialogTitle>Tambah Penjualan</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="menuItem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-menu-item">
                        <SelectValue placeholder="Pilih Menu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {menuItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Penjualan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-sales-category">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {salesCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Masukkan jumlah"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      data-testid="input-quantity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga per Item</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Rp 0"
                      {...field}
                      data-testid="input-price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="text-sm font-medium text-foreground">Total</Label>
              <Input
                type="number"
                value={total}
                readOnly
                className="bg-muted text-muted-foreground mt-2"
                data-testid="input-total"
              />
            </div>

            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal & Waktu</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-datetime"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Catatan tambahan..."
                      {...field}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-sales"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground"
                disabled={createSalesMutation.isPending}
                data-testid="button-submit-sales"
              >
                {createSalesMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
