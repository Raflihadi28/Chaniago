import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertAssetSchema, type InsertAsset } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const assetTypes = [
  { value: "kas", label: "Kas" },
  { value: "bank", label: "Bank" },
  { value: "peralatan", label: "Peralatan" },
  { value: "inventori", label: "Inventori" },
  { value: "properti", label: "Properti" },
  { value: "kendaraan", label: "Kendaraan" },
];

export default function AssetModal({ open, onOpenChange }: AssetModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertAsset>({
    resolver: zodResolver(insertAssetSchema),
    defaultValues: {
      type: "",
      name: "",
      value: "0",
      acquisitionDate: new Date(),
      description: "",
    },
  });

  const createAssetMutation = useMutation({
    mutationFn: async (data: InsertAsset) => {
      const response = await apiRequest("POST", "/api/assets", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-summary"] });
      toast({
        title: "Berhasil!",
        description: "Data asset telah disimpan",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan data asset",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAsset) => {
    createAssetMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="asset-modal">
        <DialogHeader>
          <DialogTitle>Tambah Asset</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-asset-type">
                        <SelectValue placeholder="Pilih Jenis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetTypes.map((type) => (
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Asset</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama asset"
                      {...field}
                      data-testid="input-asset-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nilai</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Rp 0"
                      {...field}
                      data-testid="input-asset-value"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acquisitionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Akuisisi</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      data-testid="input-acquisition-date"
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
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Deskripsi asset..."
                      {...field}
                      data-testid="textarea-asset-description"
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
                data-testid="button-cancel-asset"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground"
                disabled={createAssetMutation.isPending}
                data-testid="button-submit-asset"
              >
                {createAssetMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
