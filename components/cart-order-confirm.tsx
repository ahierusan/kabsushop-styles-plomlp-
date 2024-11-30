"use client";

import { CartOrder } from "@/constants/type";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/clients/createClient";

const CartOrderConfirmCard = ({
  order,
  handleOrderSubmit,
}: {
  order: CartOrder;
  handleOrderSubmit: () => void;
}) => {
  const [paymentOption, setPaymentOption] = useState<string>("");
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [membership, setMembership] = useState<boolean>(false);

  useEffect(() => {
    const getStatus = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("memberships")
        .select()
        .eq("user_id", user?.id)
        .eq("shop_id", order.shops.id);

      setMembership(error != null);
    };
    getStatus();
  });

  const merch = order.merchandises;
  const selectedVariant = merch.variants.findIndex(
    (variant) => variant.id === order.variant_id,
  );

  const getPrice = (discount: boolean, quantity?: number) => {
    const variant = merch.variants[selectedVariant];
    const price = discount ? variant.membership_price : variant.original_price;
    return `₱${(price * (quantity || order.quantity)).toFixed(2)}`;
  };

  return (
    <div>
      <DialogHeader>
        <div className="flex gap-4">
          <div>
            <Image
              src={merch.merchandise_pictures[0].picture_url}
              alt={merch.name}
              width={150}
              height={150}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold">{merch.name}</p>
            <p>
              <span className="font-semibold">{merch.variant_name}:</span>{" "}
              {merch.variants[selectedVariant].name}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {order.quantity}
            </p>
            <p>
              <span className="font-semibold">Price: </span>
              {getPrice(membership)}
            </p>
          </div>
        </div>
        <p>
          <span className="font-semibold">Pick up at:</span>{" "}
          {merch.receiving_information}
        </p>

        <div className="flex flex-col space-y-2">
          {merch.physical_payment && (
            <label className="inline-flex items-center">
              <input
                type="radio"
                value=""
                checked={paymentOption === "irl"}
                onChange={() => setPaymentOption("irl")}
                className="mr-2"
              />
              <span>In-Person Payment</span>
            </label>
          )}

          {merch.online_payment && (
            <label className="inline-flex items-center">
              <input
                type="radio"
                value=""
                checked={paymentOption === "online"}
                onChange={() => setPaymentOption("online")}
                className="mr-2"
              />
              <span>GCash Payment</span>
            </label>
          )}

          {paymentOption == "online" && (
            <div className="space-y-2">
              <Label htmlFor="gcash-receipt" className="font-semibold">
                GCash Receipt
              </Label>
              <Input
                id="gcash-receipt"
                type="file"
                onChange={(e) => setPaymentReceipt(e.target.files?.[0] || null)}
                accept="image/*"
                required
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleOrderSubmit}
          disabled={
            paymentOption == "none" ||
            (paymentOption == "online" && paymentReceipt == null)
          }
          className="w-full"
        >
          Confirm Purchase
        </Button>
      </DialogHeader>
    </div>
  );
};

export default CartOrderConfirmCard;
