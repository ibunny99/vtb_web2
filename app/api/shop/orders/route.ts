import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { OrderItem } from '@/lib/shop-data';

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
    const orders: OrderItem[] = Array.isArray(data.orders) ? data.orders : [];

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching orders', orders: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = readLocalData() || {};
    const orders: OrderItem[] = Array.isArray(currentData.orders) ? currentData.orders : [];

    const orderNumber = `VTB-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: body.customer || { fullName: 'Anonymous', email: '' },
      items: body.items || [],
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      discountCode: body.discountCode || undefined,
      shippingFee: Number(body.shippingFee) || 0,
      total: Number(body.total) || 0,
      paymentMethod: body.paymentMethod || 'khqr',
      paymentStatus: body.paymentStatus || 'paid', // Simulated immediate confirmation
      orderStatus: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    currentData.orders = orders;
    writeLocalData(currentData);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully! / បញ្ជាទិញបានជោគជ័យ',
      order: newOrder,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to place order' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, orderStatus, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing order ID' }, { status: 400 });
    }

    const currentData = readLocalData() || {};
    const orders: OrderItem[] = Array.isArray(currentData.orders) ? currentData.orders : [];
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (orderStatus) orders[index].orderStatus = orderStatus;
    if (paymentStatus) orders[index].paymentStatus = paymentStatus;
    orders[index].updatedAt = new Date().toISOString();

    currentData.orders = orders;
    writeLocalData(currentData);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully!',
      order: orders[index],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing order ID' }, { status: 400 });
    }

    const currentData = readLocalData() || {};
    const orders: OrderItem[] = Array.isArray(currentData.orders) ? currentData.orders : [];

    currentData.orders = orders.filter((o) => o.id !== id && o.orderNumber !== id);
    writeLocalData(currentData);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
