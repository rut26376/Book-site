export class OrderItem {
  bookId!: number;
  bookName!: string;
  quantity!: number;
  price!: number;
}

export class Order {
  _id?: string; // MongoDB יוצר אוטומטית
  id?: number; // Optional - השרת יוצר אוטומטית
  custId!: number; // Customer ID (המספר הסדרתי של הלקוח)
  date!: Date;
  status!: "חדש" | "בטיפול" | "הושלם";
  items!: OrderItem[];
  totalPrice!: number;
  shippingCost!: number;
  totalAmount!: number;
  street!: string;
  houseNumber!: string;
  city!: string;
  email!: string;
  phone!: string;
  notes!: string;
}
