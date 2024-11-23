import {
  createClient,
  createServerClient,
} from "@/supabase/clients/createClients";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

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
  size?: {
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

const Orders = async () => {
  const supabase = createServerClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, quantity, variants(name, original_price, membership_price), shops(name, acronym), sizes(name, original_price, membership_price), order_statuses(paid, received, received_at, cancelled, cancelled_at, cancel_reason)",
    );
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-2xl font-bold text-emerald-800">My Orders</div>

      {orders ? (
        orders.map((order) => (
          <Card key={order.id}>
            <CardContent>{order.variants.name}</CardContent>
          </Card>
        ))
      ) : (
        <div>No Cart orders yet!</div>
      )}
    </div>
  );
};

export default Orders;
