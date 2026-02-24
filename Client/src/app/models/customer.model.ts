export class Customer {
  _id?: string; // MongoDB יוצר אוטומטית
  id?: number; // Optional - השרת יוצר אוטומטית
  fullName!: string;
  password!: string;
  phone!: string;
  street!: string;
  houseNumber!: string;
  city!: string;
  email!: string;
  role?: 'user' | 'admin'; // role של המשתמש
}
