import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";

type Order = {
  id: number;
  quantity: number;
  variants: {
    picture_url: string;
    name: string;
    original_price?: number;
    membership_price?: number;
  };
  shops: {
    name: string;
    acronym: string;
  };
  sizes?: {
    name: string;
    original_price?: number;
    membership_price?: number;
  };
  order_statuses: {
    paid: boolean;
    received: boolean;
    received_at?: string;
    cancelled?: boolean;
    cancelled_at?: string;
    cancel_reason?: string;
  };
};

const OrderCard = ({ order }: { order: Order }) => {
  // Determine which price to show based on whether sizes exists
  const originalPrice =
    order.sizes?.original_price ?? order.variants.original_price;
  console.log(order.sizes?.original_price ?? order.variants.original_price);
  const displayPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(originalPrice * order.quantity);

  // Determine order status
  const getOrderStatus = () => {
    if (order.order_statuses.cancelled) {
      return {
        label: "Cancelled",
        color: "text-red-500",
        details: order.order_statuses.cancel_reason,
      };
    }
    if (order.order_statuses.received) {
      return {
        label: "Received",
        color: "text-green-500",
        details: `Received on ${new Date(order.order_statuses.received_at).toLocaleDateString()}`,
      };
    }
    if (order.order_statuses.paid) {
      return {
        label: "Paid",
        color: "text-blue-500",
      };
    }
    return {
      label: "Pending",
      color: "text-yellow-500",
    };
  };

  const status = getOrderStatus();
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Order #{order.id}</CardTitle>
          <span className={`font-medium ${status.color}`}>{status.label}</span>
        </div>
        <CardDescription>
          {order.shops.name} ({order.shops.acronym})
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Image
              src={order.variants.picture_url}
              alt={order.variants.name}
              width={20}
              height={20}
              className="h-20 w-20 rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium">{order.variants.name}</h3>
              {order.sizes && (
                <p className="text-sm text-gray-500">
                  Size: {order.sizes.name}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Quantity: {order.quantity}
              </p>
              <p className="mt-1 font-medium">{displayPrice}</p>
            </div>
          </div>

          {status.details && (
            <div className="text-sm text-gray-500">{status.details}</div>
          )}
        </div>
      </CardContent>

      <CardFooter className="text-sm text-gray-500">
        Order ID: {order.id}
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
