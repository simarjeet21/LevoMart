"use client";
import { Label } from "@radix-ui/react-label";

import { OrderResponse, OrderStatus } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface SellerOrderCardProps {
  order: OrderResponse;
  handleStatusChange: (itemId: string, newStatus: string) => void;
  statusOptions: OrderStatus[];
}

export default function SellerOrderCard({
  order,
  handleStatusChange,
  statusOptions,
}: SellerOrderCardProps) {
  return (
    <Card key={order.id} className="bg-white border rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="font-semibold text-lg text-olive">
          Order ID: {order.id}
        </div>
        <div className="text-sm text-olive/70">Buyer: {order.userId}</div>

        {order.orderItems.map((item) => (
          <div
            key={item.productId}
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
                value={order.status}
                onValueChange={(val) => handleStatusChange(item.orderId, val)}
              >
                <SelectTrigger className="w-[120px] text-olive border-olive">
                  {order.status}
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
