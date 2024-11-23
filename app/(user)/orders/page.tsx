import { createServerClient } from "@/supabase/clients/createClients";
import React from "react";
import OrderCard from "@/components/order-card";

const Orders = async () => {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      "id, quantity, variants(name, original_price, membership_price, picture_url), shops(name, acronym), sizes(name, original_price, membership_price), order_statuses(paid, received, received_at, cancelled, cancelled_at, cancel_reason)",
    )
    .eq("user_id", user.id);
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-2xl font-bold text-emerald-800">My Orders</div>

      {orders ? (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      ) : (
        <div>No Cart orders yet!</div>
      )}
    </div>
  );
};

export default Orders;
