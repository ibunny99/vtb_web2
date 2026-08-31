import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_PRODUCTS, ProductItem } from '@/lib/shop-data';

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), 'data', 'site-content.json');

function readLocalData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (e) {
    console.error('Error reading data file:', e);
  }
  return null;
}

function writeLocalData(data: any) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing data file:', e);
    return false;
  }
}

export async function GET() {
  try {
    const data = readLocalData() || {};
    const products = Array.isArray(data.products) && data.products.length > 0
      ? data.products
      : DEFAULT_PRODUCTS;

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching products', products: DEFAULT_PRODUCTS },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = readLocalData() || {};
    const currentProducts: ProductItem[] = Array.isArray(currentData.products) && currentData.products.length > 0
      ? currentData.products
      : [...DEFAULT_PRODUCTS];

    if (body.products && Array.isArray(body.products)) {
      // Bulk update/replace
      currentData.products = body.products;
    } else if (body.product) {
      // Single create or update
      const prod = body.product as ProductItem;
      const index = currentProducts.findIndex((p) => p.id === prod.id || p.slug === prod.slug);
      if (index > -1) {
        currentProducts[index] = { ...currentProducts[index], ...prod };
      } else {
        currentProducts.unshift(prod);
      }
      currentData.products = currentProducts;
    }

    writeLocalData(currentData);

    return NextResponse.json({
      success: true,
      message: 'Product saved successfully!',
      products: currentData.products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to save product' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
    }

    const currentData = readLocalData() || {};
    const currentProducts: ProductItem[] = Array.isArray(currentData.products) && currentData.products.length > 0
      ? currentData.products
      : [...DEFAULT_PRODUCTS];

    currentData.products = currentProducts.filter((p) => p.id !== id && p.slug !== id);
    writeLocalData(currentData);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully!',
      products: currentData.products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
