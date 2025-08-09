// Job Order API endpoints for exact JO PDF format
import { Express } from "express";
import { db } from "./db";

export function addJobOrderRoutes(app: Express) {
  // Get Job Order receipt matching PDF format
  app.get("/api/job-orders/receipt/:jobOrderNumber", async (req, res) => {
    try {
      const { jobOrderNumber } = req.params;
      
      // Fetch from exact tables
      const jobOrder = await db.query(`
        SELECT * FROM job_orders_exact 
        WHERE job_order_number = $1
      `, [jobOrderNumber]);
      
      if (!jobOrder.rows || jobOrder.rows.length === 0) {
        return res.status(404).json({ message: "Job Order not found" });
      }
      
      const jobOrderData = jobOrder.rows[0];
      
      const items = await db.query(`
        SELECT * FROM job_order_items_exact 
        WHERE job_order_id = $1
        ORDER BY order_item
      `, [jobOrderData.id]);
      
      // Format exactly like JO PDF
      const receipt = {
        title: "JOB ORDER FORM",
        jobOrderNumber: jobOrderData.job_order_number,
        revision: jobOrderData.revision_number,
        createdBy: jobOrderData.created_by,
        hairTag: jobOrderData.hair_tag,
        date: new Date(jobOrderData.order_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        dueDate: new Date(jobOrderData.due_date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        orderInstructions: jobOrderData.order_instructions.split('\n'),
        
        orderItems: items.rows.map(item => ({
          orderItem: item.order_item,
          specification: item.specification || "",
          quantity: parseFloat(item.quantity).toString(),
          shipments: {
            "1": item.shipment_1 > 0 ? item.shipment_1.toString() : "",
            "2": item.shipment_2 > 0 ? item.shipment_2.toString() : "",
            "3": item.shipment_3 > 0 ? item.shipment_3.toString() : "",
            "4": item.shipment_4 > 0 ? item.shipment_4.toString() : "",
            "5": item.shipment_5 > 0 ? item.shipment_5.toString() : "",
            "6": item.shipment_6 > 0 ? item.shipment_6.toString() : "",
            "7": item.shipment_7 > 0 ? item.shipment_7.toString() : "",
            "8": item.shipment_8 > 0 ? item.shipment_8.toString() : ""
          },
          orderBalance: item.order_balance.toString(),
          shipped: item.shipped.toString(),
          reserved: item.reserved.toString(),
          ready: item.ready.toString(),
          toProduce: item.to_produce.toString()
        })),
        
        summary: {
          totalItems: items.rows.length,
          totalQuantity: items.rows.reduce((sum, item) => sum + parseFloat(item.quantity), 0),
          totalToProduce: items.rows.reduce((sum, item) => sum + parseFloat(item.to_produce), 0)
        }
      };
      
      res.json(receipt);
    } catch (error) {
      console.error('Job Order receipt error:', error);
      res.status(500).json({ message: "Failed to generate Job Order receipt" });
    }
  });

  // Get all Job Orders
  app.get("/api/job-orders/exact", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT jo.*, COUNT(joi.id) as item_count
        FROM job_orders_exact jo
        LEFT JOIN job_order_items_exact joi ON jo.id = joi.job_order_id
        GROUP BY jo.id
        ORDER BY jo.order_date DESC
      `);
      
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Job Orders" });
    }
  });
}