import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { db } from '../db';
import { FileParser } from '../utils/fileParser';
import * as schema from '../../shared/schema';
import { z } from 'zod';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Template definitions for each data type
const templates = {
  customers: {
    headers: ['customerCode', 'name', 'email', 'phone', 'country', 'shippingAddress', 'city', 'province', 'postalCode', 'priceCategory'],
    sample: {
      customerCode: 'CUST001',
      name: 'Sample Customer',
      email: 'customer@example.com',
      phone: '+1234567890',
      country: 'USA',
      shippingAddress: '123 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      priceCategory: 'REGULAR'
    }
  },
  products: {
    headers: ['name', 'sku', 'hairType', 'texture', 'length', 'color', 'weight', 'unit', 'basePrice', 'ngWarehouse', 'phWarehouse'],
    sample: {
      name: '8" Machine Weft Single Drawn',
      sku: 'MW-8-SD-ST',
      hairType: 'human',
      texture: 'straight',
      length: 8,
      color: 'natural black',
      weight: '100g',
      unit: 'bundle',
      basePrice: 150.00,
      ngWarehouse: 50,
      phWarehouse: 30
    }
  },
  assets: {
    headers: ['name', 'assetTag', 'assetType', 'serialNumber', 'manufacturer', 'model', 'purchasePrice', 'currentValue', 'condition'],
    sample: {
      name: 'Dell OptiPlex Desktop',
      assetTag: 'IT-2024-001',
      assetType: 'equipment',
      serialNumber: 'SN123456789',
      manufacturer: 'Dell',
      model: 'OptiPlex 7090',
      purchasePrice: 1200.00,
      currentValue: 900.00,
      condition: 'good'
    }
  },
  categories: {
    headers: ['name', 'slug', 'type', 'description', 'displayOrder', 'isActive'],
    sample: {
      name: 'Office Equipment',
      slug: 'office-equipment',
      type: 'equipment',
      description: 'Office computers and equipment',
      displayOrder: 1,
      isActive: true
    }
  },
  warehouses: {
    headers: ['code', 'name', 'description', 'isActive'],
    sample: {
      code: 'NG',
      name: 'Nigeria Warehouse',
      description: 'Main warehouse in Nigeria',
      isActive: true
    }
  }
};

// Generate template endpoint
router.get('/export/template/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv' } = req.query;
    
    const template = templates[type as keyof typeof templates];
    if (!template) {
      return res.status(400).json({ error: 'Invalid data type' });
    }

    // Create sample data array with one example row
    const sampleData = [template.sample];

    let filename: string;
    let contentType: string;
    let data: Buffer | string;

    switch (format) {
      case 'xlsx':
        filename = `${type}_template.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        data = FileParser.generateExcel(sampleData, type);
        break;
      case 'csv':
      default:
        filename = `${type}_template.csv`;
        contentType = 'text/csv';
        data = FileParser.generateCSV(sampleData, template.headers);
        break;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    res.send(data);
  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({ error: 'Failed to generate template' });
  }
});

// Export data endpoint
router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv' } = req.query;

    let data: any[] = [];
    
    // Fetch data based on type
    switch (type) {
      case 'customers':
        data = await db.select().from(schema.customers);
        break;
      case 'products':
        data = await db.select().from(schema.products);
        break;
      case 'assets':
        data = await db.select().from(schema.assets);
        break;
      case 'categories':
        data = await db.select().from(schema.categories);
        break;
      case 'warehouses':
        data = await db.select().from(schema.warehouses);
        break;
      case 'quotations':
        data = await db.select().from(schema.quotations);
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }

    let filename: string;
    let contentType: string;
    let responseData: Buffer | string;

    const timestamp = new Date().toISOString().slice(0, 10);
    
    switch (format) {
      case 'xlsx':
        filename = `${type}_export_${timestamp}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        responseData = FileParser.generateExcel(data, type);
        break;
      case 'json':
        filename = `${type}_export_${timestamp}.json`;
        contentType = 'application/json';
        responseData = FileParser.generateJSON(data);
        break;
      case 'csv':
      default:
        filename = `${type}_export_${timestamp}.csv`;
        contentType = 'text/csv';
        responseData = FileParser.generateCSV(data);
        break;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    res.send(responseData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Import data endpoint
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No file uploaded' 
    });
  }

  try {
    const { type } = req.body;
    const parsedData = await FileParser.parseFile(req.file.buffer, req.file.mimetype);
    
    if (parsedData.rows.length === 0) {
      return res.json({ 
        success: false, 
        message: 'No data found in file',
        imported: 0,
        failed: 0
      });
    }

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process each row based on type
    for (const [index, row] of parsedData.rows.entries()) {
      try {
        switch (type) {
          case 'customers':
            // Generate a secure random password for imported customers
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const customerData = {
              ...row,
              password: row.password || randomPassword,
              emailVerified: false,
              status: 'active'
            };
            await db.insert(schema.customers).values(customerData);
            // Note: In production, send password reset email to customer
            break;
            
          case 'products':
            const productData = {
              ...row,
              isActive: true,
              createdAt: new Date()
            };
            await db.insert(schema.products).values(productData);
            break;
            
          case 'assets':
            const assetData = {
              ...row,
              isActive: true,
              ngWarehouse: parseInt(row.ngWarehouse) || 0,
              phWarehouse: parseInt(row.phWarehouse) || 0,
              reservedWarehouse: parseInt(row.reservedWarehouse) || 0,
              redWarehouse: parseInt(row.redWarehouse) || 0,
              adminWarehouse: parseInt(row.adminWarehouse) || 0,
              wipWarehouse: parseInt(row.wipWarehouse) || 0,
              createdAt: new Date()
            };
            await db.insert(schema.assets).values(assetData);
            break;
            
          case 'categories':
            const categoryData = {
              ...row,
              displayOrder: parseInt(row.displayOrder) || 0,
              isActive: row.isActive === 'true' || row.isActive === true,
              createdAt: new Date()
            };
            await db.insert(schema.categories).values(categoryData);
            break;
            
          case 'warehouses':
            const warehouseData = {
              ...row,
              isActive: row.isActive === 'true' || row.isActive === true,
              createdAt: new Date()
            };
            await db.insert(schema.warehouses).values(warehouseData);
            break;
            
          default:
            throw new Error('Unsupported import type');
        }
        imported++;
      } catch (error) {
        failed++;
        errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        if (errors.length >= 10) {
          errors.push('... and more errors');
          break;
        }
      }
    }

    res.json({
      success: imported > 0,
      message: imported > 0 
        ? `Successfully imported ${imported} records${failed > 0 ? `, ${failed} failed` : ''}`
        : 'No records were imported',
      imported,
      failed,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process file',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    });
  }
});

export { router as importExportRouter };