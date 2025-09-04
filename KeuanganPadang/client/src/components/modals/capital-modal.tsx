import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertCapitalSchema, type InsertCapital } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CapitalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const capitalSources = [
  { value: "pribadi", label: "Modal Pribadi" },
  { value: "investor", label: "Investor" },
  { value: "pinjaman", label: "Pinjaman Bank" },
  { value: "reinvestasi", label: "Reinvestasi Profit" },
  { value: "hibah", label: "Hibah" },
];

export default function CapitalModal({ open, onOpenChange }: CapitalModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCapital>({
    resolver: zodResolver(insertCapitalSchema),
    defaultValues: {
      source: "",
      amount: "0",
      date: new Date(),
      description: "",
    },
  });

  const createCapitalMutation = useMutation({
    mutationFn: async (data: InsertCapital) => {
      const response = await apiRequest("POST", "/api/capital", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capital"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-summary"] });
      toast({
        title: "Berhasil!",
        description: "Data modal telah disimpan",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan data modal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCapital) => {
    createCapitalMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="capital-modal">
        <DialogHeader>
          <DialogTitle>Tambah Modal</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sumber Modal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-capital-source">
                        <SelectValue placeholder="Pilih Sumber" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {capitalSources.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Modal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Rp 0"
                      {...field}
                      data-testid="input-capital-amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-capital-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Keterangan modal..."
                      {...field}
                      data-testid="textarea-capital-description"
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
                data-testid="button-cancel-capital"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-secondary text-secondary-foreground"
                disabled={createCapitalMutation.isPending}
                data-testid="button-submit-capital"
              >
                {createCapitalMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
