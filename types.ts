export enum CompanyStatus {
  UNKNOWN = 'UNKNOWN',
  SMALL = 'SMALL',
  MEDIUM_LARGE = 'MEDIUM_LARGE',
}

export type Receipt = {
  id: string;
  fileName: string;
  vatAmount: number;
  date: string;
};

export type PayeResult = {
  paye: number;
  pension: number;
  nhf: number;
  netPay: number;
};

// Represents the different features/modules in the app
export enum Feature {
  CLASSIFIER = 'classifier',
  VAT = 'vat',
  LEVY = 'levy',
  PAYE = 'paye',
  REPORTS = 'reports',
  ADMIN = 'admin',
}

// Represents the different user roles in the system
export enum Role {
    ADMIN = 'Admin',
    ACCOUNTANT = 'Accountant',
    EMPLOYEE = 'Employee',
}

// Represents a user in the system
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};