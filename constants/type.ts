export type Shop = {
  id: number;
  acronym: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Merch = {
  id: number;
  name: string;
  created_at: string;
  merchandise_pictures: {
    picture_url: string;
  }[];
  variants: {
    original_price: number;
    membership_price: number;
  }[];
  shops: {
    id: number;
    acronym: string;
  };
  merchandise_categories: {
    id: number;
    cat_id: number;
  }[];
};

export type FullMerch = {
  id: number;
  name: string;
  created_at: string;
  description: string;
  receiving_information: string;
  online_payment: boolean;
  physical_payment: boolean;
  variant_name: string;
  merchandise_pictures: {
    id: number;
    picture_url: string;
  }[];
  variants: {
    id: number;
    name: string;
    original_price: number;
    membership_price: number;
  }[];
  shops: {
    id: number;
    name: string;
    acronym: string;
    logo_url: string;
  };
};
