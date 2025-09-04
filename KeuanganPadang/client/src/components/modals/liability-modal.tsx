import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertLiabilitySchema, type InsertLiability } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LiabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const liabilityTypes = [
  { value: "utang-supplier", label: "Utang Supplier" },
  { value: "pinjaman-bank", label: "Pinjaman Bank" },
  { value: "utang-gaji", label: "Utang Gaji" },
  { value: "utang-pajak", label: "Utang Pajak" },
  { value: "utang-sewa", label: "Utang Sewa" },
  { value: "lainnya", label: "Lainnya" },
];

const liabilityStatuses = [
  { value: "pending", label: "Belum Bayar" },
  { value: "partial", label: "Sebagian Bayar" },
  { value: "paid", label: "Lunas" },
];

export default function LiabilityModal({ open, onOpenChange }: LiabilityModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertLiability>({
    resolver: zodResolver(insertLiabilitySchema),
    defaultValues: {
      type: "",
      creditor: "",
      amount: "0",
      dueDate: new Date(),
      status: "pending",
      notes: "",
    },
  });

  const createLiabilityMutation = useMutation({
    mutationFn: async (data: InsertLiability) => {
      const response = await apiRequest("POST", "/api/liabilities", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liabilities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-summary"] });
      toast({
        title: "Berhasil!",
        description: "Data kewajiban telah disimpan",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan data kewajiban",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertLiability) => {
    createLiabilityMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="liability-modal">
        <DialogHeader>
          <DialogTitle>Tambah Kewajiban</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kewajiban</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-liability-type">
                        <SelectValue placeholder="Pilih Jenis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {liabilityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="creditor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kreditur/Deskripsi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama kreditur atau deskripsi"
                      {...field}
                      data-testid="input-creditor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Rp 0"
                      {...field}
                      data-testid="input-liability-amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-due-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-liability-status">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {liabilityStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Catatan kewajiban..."
                      {...field}
                      data-testid="textarea-liability-notes"
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
                data-testid="button-cancel-liability"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-destructive text-destructive-foreground"
                disabled={createLiabilityMutation.isPending}
                data-testid="button-submit-liability"
              >
                {createLiabilityMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
