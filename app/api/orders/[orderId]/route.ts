// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId?: string } }
) {
  try {
    // Access URL params through the URL itself to avoid the synchronous params issue
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const orderId = pathSegments[pathSegments.length - 1]; // Get the last segment
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Call AWS API Gateway to fetch order from DynamoDB
    const apiUrl = process.env.API_GATEWAY_URL || 'https://3mbrdg00ck.execute-api.us-east-1.amazonaws.com/prod';
    const response = await fetch(`${apiUrl}/orders/${orderId}`, {
      headers: {
        'x-api-key': process.env.API_KEY || ''
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to retrieve order' },
        { status: response.status }
      );
    }
    
    const order = await response.json();
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error retrieving order:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order details', details: error.message },
      { status: 500 }
    );
  }
}