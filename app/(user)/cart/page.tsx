"use client";

import Image from "next/image";
import useClientGetData from "./useClientGetData";
import { useEffect, useRef, useState } from "react";
import { deleteCartOrder, handleOrderSubmit, updateCart } from "./functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CartOrder {
  id: number;
  user_id: string;
  quantity: number;
  variant_id: number;
  size_id: number | null;
  merchandises: {
    id: number;
    name: string;
    online_payment: boolean;
    physical_payment: boolean;
    receiving_information: string;
    variants: {
      id: number;
      name: string;
      picture_url: string;
      original_price: number;
      membership_price: number;
      sizes?: {
        id: number;
        name: string;
        original_price: number;
        membership_price: number;
      }[];
    }[];
  };
  shops: {
    id: number;
    acronym: string;
  };
}

interface PaymentOptions {
  [key: string]: string;
}

interface PaymentReceipts {
  [key: string]: File;
}

const Cart = () => {
  const [cartOrders, setCartOrders] = useClientGetData(
    "cart_orders",
    `
      id,
      user_id,
      quantity,
      variant_id,
      merchandises(id, name, online_payment, physical_payment, receiving_information, variants(id, name, picture_url, original_price, membership_price, sizes(id, name, original_price, membership_price))),
      shops!inner(id, acronym),
      size_id
    `,
    { con: { key: "user_id" } },
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptions>({});
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipts>({});

  const handleVariantChange = (targetOrder: CartOrder, value: number) => {
    setCartOrders(
      (prevOrders) =>
        prevOrders?.map((order) =>
          order.id === targetOrder.id
            ? { ...order, variant_id: value, size_id: null }
            : order,
        ) || [],
    );
  };

  const handleSizeChange = (targetOrder: CartOrder, value: number) => {
    setCartOrders(
      (prevOrders) =>
        prevOrders?.map((order) =>
          order.id === targetOrder.id ? { ...order, size_id: value } : order,
        ) || [],
    );
    updateCart({ ...targetOrder, size_id: value });
  };

  const handleQuantityChange = (targetOrder: CartOrder, value: number) => {
    if (value < 1) return;

    setCartOrders(
      (prevOrders) =>
        prevOrders?.map((order) =>
          order.id === targetOrder.id ? { ...order, quantity: value } : order,
        ) || [],
    );
    updateCart({ ...targetOrder, quantity: value });
  };

  const deleteOrder = (id: number) => {
    deleteCartOrder(id);
    setCartOrders(
      (prevOrders) => prevOrders?.filter((order) => order.id !== id) || [],
    );
  };

  const getVariant = (order: CartOrder, variantId: number) => {
    return order.merchandises.variants.find(
      (variant) => variant.id === variantId,
    );
  };

  const getSize = (order: CartOrder, variantId: number, sizeId: number) => {
    const variant = getVariant(order, variantId);
    return variant?.sizes?.find((size) => size.id === sizeId);
  };

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      }
      return [...prev, orderId];
    });
  };

  const handleSubmitOrders = () => {
    if (!cartOrders) return;

    selectedOrders.forEach((orderId) => {
      const order = cartOrders.find((o) => o.id.toString() === orderId);
      if (!order) return;

      handleOrderSubmit(
        order,
        paymentOptions[orderId],
        () => {},
        paymentReceipts[orderId] || null,
      );
      deleteOrder(order.id);
    });
  };

  const calculatePrice = (order: CartOrder) => {
    const variant = getVariant(order, order.variant_id);
    if (!variant) return 0;

    if (order.size_id != null) {
      const size = getSize(order, order.variant_id, order.size_id);
      return (size?.original_price || 0) * order.quantity;
    }
    return variant.original_price * order.quantity;
  };

  if (!cartOrders || cartOrders.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-lg">Your shopping cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold text-emerald-800">My Shopping Cart</h1>

      <form ref={formRef} className="w-full max-w-3xl space-y-4">
        {cartOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="flex items-center gap-4 p-4">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={selectedOrders.includes(order.id.toString())}
                onChange={() => handleCheckboxChange(order.id.toString())}
              />

              <div className="flex flex-1 gap-4">
                {getVariant(order, order.variant_id)?.picture_url && (
                  <Image
                    src={getVariant(order, order.variant_id)!.picture_url}
                    alt={order.merchandises.name}
                    width={112}
                    height={112}
                    className="object-cover"
                  />
                )}

                <div className="flex flex-1 flex-col gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {order.merchandises.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.shops.acronym}
                    </p>
                    <p className="text-lg font-semibold text-emerald-800">
                      ${calculatePrice(order).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="space-y-2">
                      <Label>Variant</Label>
                      <Select
                        value={order.variant_id?.toString()}
                        onValueChange={(val) =>
                          handleVariantChange(order, parseInt(val))
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {order.merchandises.variants.map((variant) => (
                            <SelectItem
                              key={variant.id}
                              value={variant.id.toString()}
                            >
                              {variant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {getVariant(order, order.variant_id)?.sizes && (
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Select
                          value={order.size_id?.toString()}
                          onValueChange={(val) =>
                            handleSizeChange(order, parseInt(val))
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getVariant(order, order.variant_id)?.sizes?.map(
                              (size) => (
                                <SelectItem
                                  key={size.id}
                                  value={size.id.toString()}
                                >
                                  {size.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={order.quantity}
                        onChange={(e) =>
                          handleQuantityChange(order, parseInt(e.target.value))
                        }
                        className="w-[120px]"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteOrder(order.id)}
                >
                  <MdDelete className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={selectedOrders.length === 0}>
              Checkout ({selectedOrders.length} items)
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {selectedOrders.map((orderId) => {
                const order = cartOrders.find(
                  (o) => o.id.toString() === orderId,
                );
                if (!order) return null;

                const variant = getVariant(order, order.variant_id);
                if (!variant) return null;

                return (
                  <div key={order.id} className="space-y-4 border-b pb-4">
                    <div className="flex gap-4">
                      <Image
                        src={variant.picture_url}
                        alt={order.merchandises.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {order.merchandises.name}
                        </h3>
                        <p>Variant: {variant.name}</p>
                        <p>Quantity: {order.quantity}</p>
                        <p className="font-semibold">
                          Price: ${calculatePrice(order).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.merchandises.receiving_information}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.merchandises.physical_payment && (
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`payment-${order.id}`}
                            value="irl"
                            checked={paymentOptions[order.id] === "irl"}
                            onChange={() =>
                              setPaymentOptions((prev) => ({
                                ...prev,
                                [order.id]: "irl",
                              }))
                            }
                          />
                          In-Person Payment
                        </label>
                      )}

                      {order.merchandises.online_payment && (
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`payment-${order.id}`}
                            value="online"
                            checked={paymentOptions[order.id] === "online"}
                            onChange={() =>
                              setPaymentOptions((prev) => ({
                                ...prev,
                                [order.id]: "online",
                              }))
                            }
                          />
                          Online Payment
                        </label>
                      )}

                      {paymentOptions[order.id] === "online" && (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPaymentReceipts((prev) => ({
                                  ...prev,
                                  [order.id]: file,
                                }));
                              }
                            }}
                            required
                          />

                          {paymentReceipts[order.id] && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Preview:</p>
                              <Image
                                src={URL.createObjectURL(
                                  paymentReceipts[order.id],
                                )}
                                alt="Receipt"
                                width={100}
                                height={100}
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <Button
                className="w-full"
                onClick={handleSubmitOrders}
                disabled={selectedOrders.some(
                  (orderId) =>
                    !paymentOptions[orderId] ||
                    (paymentOptions[orderId] === "online" &&
                      !paymentReceipts[orderId]),
                )}
              >
                Complete Purchase
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
};

export default Cart;
