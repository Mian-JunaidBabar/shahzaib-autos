"use client";

import { useState, useEffect, useMemo } from "react";
import { getPublicServicesAction } from "@/app/actions/serviceActions";
import { toast } from "sonner";
import { Clock, X, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Service = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: number;
};

interface ServiceUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServicesSelected: (serviceIds: string[]) => void;
}

export function ServiceUpsellModal({
  isOpen,
  onClose,
  onServicesSelected,
}: ServiceUpsellModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Fetch services when modal opens
  useEffect(() => {
    if (isOpen && services.length === 0) {
      loadServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadServices = async () => {
    setIsLoadingServices(true);
    try {
      const result = await getPublicServicesAction();
      if (result.success && result.data) {
        setServices(result.data);
      } else {
        toast.error("Failed to load services");
      }
    } catch (error) {
      console.error("Failed to load services:", error);
      toast.error("Failed to load services");
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Calculate total service cost
  const serviceTotal = useMemo(() => {
    return services
      .filter((s) => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + Number(s.price), 0);
  }, [selectedServices, services]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleAddServices = () => {
    onServicesSelected(selectedServices);
    onClose();
  };

  const handleSkip = () => {
    onServicesSelected([]);
    onClose();
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Need Professional Installation?
          </DialogTitle>
          <DialogDescription>
            Enhance your order with professional installation and services. Our
            expert technicians will ensure everything is done right.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isLoadingServices ? (
            // Loading skeletons
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border border-border rounded-lg"
                >
                  <Skeleton className="h-5 w-5 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              No services available at the moment.
            </div>
          ) : (
            // Service list
            services.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`flex gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`mt-1 h-4 w-4 shrink-0 rounded-sm border border-primary flex items-center justify-center ${
                      isSelected ? "bg-primary" : "bg-background"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-sm text-text-muted mt-1">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-text-subtle mt-2">
                          <Clock className="h-3 w-3" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary">
                          {formatPrice(Number(service.price))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Service total */}
        {selectedServices.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">
                Services Total ({selectedServices.length}{" "}
                {selectedServices.length === 1 ? "service" : "services"})
              </span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(serviceTotal)}
              </span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip Services
          </Button>
          <Button
            type="button"
            onClick={handleAddServices}
            disabled={selectedServices.length === 0}
            className="flex-1 bg-primary hover:opacity-90"
          >
            Add{" "}
            {selectedServices.length > 0 && `(${formatPrice(serviceTotal)})`}
          </Button>
        </div>

        <p className="text-xs text-text-subtle text-center mt-4">
          Selected services will be included in your order confirmation
        </p>
      </DialogContent>
    </Dialog>
  );
}
