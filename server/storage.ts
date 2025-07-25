import {
  type Client,
  type InsertClient,
  type Service,
  type InsertService,
  type Staff,
  type InsertStaff,
  type Appointment,
  type InsertAppointment,
  type Product,
  type InsertProduct,
  type Supplier,
  type InsertSupplier,
  type InventoryTransaction,
  type InsertInventoryTransaction,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  // Services
  getService(id: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Staff
  getStaff(id: string): Promise<Staff | undefined>;
  getAllStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaff(id: string): Promise<boolean>;

  // Appointments
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Suppliers
  getSupplier(id: string): Promise<Supplier | undefined>;
  getSuppliers(): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;

  // Inventory Transactions
  getInventoryTransaction(id: string): Promise<InventoryTransaction | undefined>;
  getInventoryTransactions(): Promise<InventoryTransaction[]>;
  getInventoryTransactionsByProduct(productId: string): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  updateInventoryTransaction(id: string, transaction: Partial<InsertInventoryTransaction>): Promise<InventoryTransaction | undefined>;
  deleteInventoryTransaction(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private clients: Map<string, Client>;
  private services: Map<string, Service>;
  private staff: Map<string, Staff>;
  private appointments: Map<string, Appointment>;
  private products: Map<string, Product>;
  private suppliers: Map<string, Supplier>;
  private inventoryTransactions: Map<string, InventoryTransaction>;

  constructor() {
    this.clients = new Map();
    this.services = new Map();
    this.staff = new Map();
    this.appointments = new Map();
    this.products = new Map();
    this.suppliers = new Map();
    this.inventoryTransactions = new Map();
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      id,
      name: insertClient.name,
      email: insertClient.email,
      phone: insertClient.phone || null,
      address: insertClient.address || null,
      dateOfBirth: insertClient.dateOfBirth || null,
      notes: insertClient.notes || null,
      status: insertClient.status || "active",
      totalVisits: 0,
      totalSpent: "0",
      lastVisit: null,
      createdAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;

    const updatedClient = { ...client, ...clientUpdate };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Services
  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      id,
      name: insertService.name,
      description: insertService.description || null,
      category: insertService.category,
      duration: insertService.duration,
      price: insertService.price,
      isActive: insertService.isActive !== undefined ? insertService.isActive : true,
      createdAt: new Date(),
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;

    const updatedService = { ...service, ...serviceUpdate };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }

  // Staff
  async getStaff(id: string): Promise<Staff | undefined> {
    return this.staff.get(id);
  }

  async getAllStaff(): Promise<Staff[]> {
    return Array.from(this.staff.values());
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const id = randomUUID();
    const staff: Staff = {
      id,
      name: insertStaff.name,
      email: insertStaff.email,
      phone: insertStaff.phone || null,
      role: insertStaff.role,
      specialties: insertStaff.specialties || null,
      experience: insertStaff.experience || null,
      isActive: insertStaff.isActive !== undefined ? insertStaff.isActive : true,
      createdAt: new Date(),
    };
    this.staff.set(id, staff);
    return staff;
  }

  async updateStaff(id: string, staffUpdate: Partial<InsertStaff>): Promise<Staff | undefined> {
    const staff = this.staff.get(id);
    if (!staff) return undefined;

    const updatedStaff = { ...staff, ...staffUpdate };
    this.staff.set(id, updatedStaff);
    return updatedStaff;
  }

  async deleteStaff(id: string): Promise<boolean> {
    return this.staff.delete(id);
  }

  // Appointments
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.date === date
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      id,
      clientId: insertAppointment.clientId,
      serviceId: insertAppointment.serviceId,
      staffId: insertAppointment.staffId || null,
      date: insertAppointment.date,
      time: insertAppointment.time,
      duration: insertAppointment.duration,
      status: insertAppointment.status || "confirmed",
      notes: insertAppointment.notes || null,
      totalAmount: insertAppointment.totalAmount || null,
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, appointmentUpdate: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    const updatedAppointment = { ...appointment, ...appointmentUpdate };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.currentStock !== null && product.minStockLevel !== null && 
      product.currentStock <= product.minStockLevel
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      id,
      name: insertProduct.name,
      description: insertProduct.description || null,
      category: insertProduct.category,
      brand: insertProduct.brand || null,
      sku: insertProduct.sku || null,
      barcode: insertProduct.barcode || null,
      costPrice: insertProduct.costPrice,
      retailPrice: insertProduct.retailPrice || null,
      currentStock: insertProduct.currentStock || 0,
      minStockLevel: insertProduct.minStockLevel || 10,
      maxStockLevel: insertProduct.maxStockLevel || null,
      unit: insertProduct.unit || "pcs",
      supplierId: insertProduct.supplierId || null,
      isActive: insertProduct.isActive !== undefined ? insertProduct.isActive : true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Suppliers
  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = {
      id,
      name: insertSupplier.name,
      contactPerson: insertSupplier.contactPerson || null,
      email: insertSupplier.email || null,
      phone: insertSupplier.phone || null,
      address: insertSupplier.address || null,
      notes: insertSupplier.notes || null,
      isActive: insertSupplier.isActive !== undefined ? insertSupplier.isActive : true,
      createdAt: new Date(),
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, supplierUpdate: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;

    const updatedSupplier = { ...supplier, ...supplierUpdate };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Inventory Transactions
  async getInventoryTransaction(id: string): Promise<InventoryTransaction | undefined> {
    return this.inventoryTransactions.get(id);
  }

  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values());
  }

  async getInventoryTransactionsByProduct(productId: string): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values()).filter(
      (transaction) => transaction.productId === productId
    );
  }

  async createInventoryTransaction(insertTransaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const id = randomUUID();
    const transaction: InventoryTransaction = {
      id,
      productId: insertTransaction.productId,
      type: insertTransaction.type,
      quantity: insertTransaction.quantity,
      unitCost: insertTransaction.unitCost || null,
      totalCost: insertTransaction.totalCost || null,
      reason: insertTransaction.reason || null,
      reference: insertTransaction.reference || null,
      staffId: insertTransaction.staffId || null,
      createdAt: new Date(),
    };
    this.inventoryTransactions.set(id, transaction);

    // Update product stock based on transaction type
    const product = this.products.get(insertTransaction.productId);
    if (product) {
      let newStock = product.currentStock || 0;
      if (insertTransaction.type === 'purchase' || insertTransaction.type === 'adjustment') {
        newStock += insertTransaction.quantity;
      } else if (insertTransaction.type === 'sale' || insertTransaction.type === 'waste') {
        newStock -= insertTransaction.quantity;
      }
      const updatedProduct = { ...product, currentStock: Math.max(0, newStock) };
      this.products.set(insertTransaction.productId, updatedProduct);
    }

    return transaction;
  }

  async updateInventoryTransaction(id: string, transactionUpdate: Partial<InsertInventoryTransaction>): Promise<InventoryTransaction | undefined> {
    const transaction = this.inventoryTransactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...transactionUpdate };
    this.inventoryTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteInventoryTransaction(id: string): Promise<boolean> {
    return this.inventoryTransactions.delete(id);
  }
}

export const storage = new MemStorage();
