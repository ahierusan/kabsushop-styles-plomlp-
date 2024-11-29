import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FullMerch } from "@/constants/type";

export const ShopCard = ({ merch }: { merch: FullMerch }) => {
  return (
    <Card className={cn("w-full")}>
      <CardHeader className="flex-row items-center space-x-4 space-y-0">
        <Image
          src={merch.shops.logo_url}
          alt={`${merch.shops.name} logo`}
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <CardTitle className="flex items-center">
            <Link
              href={`/shop/${merch.shops.id}`}
              className="mr-2 hover:underline"
            >
              {merch.shops.name}
            </Link>
            {merch.shops.acronym && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {merch.shops.acronym}
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ShopCard;
