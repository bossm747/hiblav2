import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';

export interface ParsedData {
  headers: string[];
  rows: Record<string, any>[];
}

export class FileParser {
  static async parseFile(buffer: Buffer, mimeType: string): Promise<ParsedData> {
    if (mimeType === 'text/csv') {
      return this.parseCSV(buffer);
    } else if (
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return this.parseExcel(buffer);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  private static parseCSV(buffer: Buffer): ParsedData {
    const content = buffer.toString('utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: true,
      cast_date: false
    });

    if (records.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = Object.keys(records[0]);
    return { headers, rows: records };
  }

  private static parseExcel(buffer: Buffer): ParsedData {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false,
      dateNF: 'yyyy-mm-dd'
    });

    if (jsonData.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = Object.keys(jsonData[0] as any);
    return { headers, rows: jsonData as Record<string, any>[] };
  }

  static generateCSV(data: any[], headers?: string[]): string {
    if (data.length === 0) {
      return headers ? headers.join(',') + '\n' : '';
    }

    const keys = headers || Object.keys(data[0]);
    const csvHeaders = keys.join(',');
    
    const csvRows = data.map(row => {
      return keys.map(key => {
        const value = row[key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  static generateExcel(data: any[], sheetName: string = 'Sheet1'): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  static generateJSON(data: any[]): string {
    return JSON.stringify(data, null, 2);
  }
}