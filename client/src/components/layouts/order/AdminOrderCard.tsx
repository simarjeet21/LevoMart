"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { OrderStatus, SellerOrder } from "@/types/order";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface AdminOrderCardProps {
  order: SellerOrder;
  handleStatusChange: (itemId: string, newStatus: string) => void;
  statusOptions: OrderStatus[];
}

export default function AdminOrderCard({
  order,
  handleStatusChange,
  statusOptions,
}: AdminOrderCardProps) {
  return (
    <Card key={order.orderId} className="bg-white border rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="font-semibold text-lg text-olive">
          Order ID: {order.orderId}
        </div>
        <div className="text-sm text-olive/70">Buyer: {order.buyerName}</div>

        {order.items.map((item) => (
          <div
            key={item.itemId}
            className="border-t pt-4 mt-4 flex justify-between items-center"
          >
            <div>
              <div className="text-olive font-medium">{item.productName}</div>
              <div className="text-sm text-olive/60">
                Quantity: {item.quantity}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Status</Label>
              <Select
                value={item.status}
                onValueChange={(val) => handleStatusChange(item.itemId, val)}
              >
                <SelectTrigger className="w-[120px] text-olive border-olive">
                  {item.status}
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
