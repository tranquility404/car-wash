export interface WashPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  services: string[];
  isActive: boolean;
}