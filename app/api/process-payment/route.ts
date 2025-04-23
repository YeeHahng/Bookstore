// app/api/process-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateCSRFToken } from '@/utils/csrf';
import { cookies } from 'next/headers';
import { sanitizeText } from '@/utils/sanitize';

export async function POST(request: NextRequest) {
  try {
    // Get API Gateway URL - hardcoded for testing
    const apiUrl = 'https://3mbrdg00ck.execute-api.us-east-1.amazonaws.com/prod';
    const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;
    
    // Parse the request body
    const body = await request.json();
    const { paymentDetails, orderDetails, customerInfo, csrfToken } = body;
    
    // Validate CSRF token
    const cookieStore = await cookies();
    const storedToken = cookieStore.get('csrfToken')?.value;
    
    if (!storedToken || !validateCSRFToken(csrfToken, storedToken)) {
      return NextResponse.json(
        { error: 'Invalid request token' },
        { status: 403 }
      );
    }
    
    // Call AWS API Gateway
    try {
      console.log("Calling API Gateway:", apiUrl);
      
      const response = await fetch(`${apiUrl}/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-api-key': apiKey } : {})
        },
        body: JSON.stringify({
          paymentDetails: {
            cardNumber: paymentDetails.cardNumber.replace(/\s+/g, ''),
            expiryDate: paymentDetails.expiryDate,
            cvv: paymentDetails.cvv,
            cardholderName: paymentDetails.cardholderName
          },
          orderDetails: {
            totalAmount: orderDetails.totalAmount,
            items: orderDetails.items
          },
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            zipCode: customerInfo.zipCode
          }
        })
      });
      
      // Get the response as text first for debugging
      const responseText = await response.text();
      console.log("API Response Text:", responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        return NextResponse.json(
          { error: 'Invalid response from payment processor', rawResponse: responseText },
          { status: 500 }
        );
      }
      
      if (!response.ok) {
        console.error("API error response:", result);
        return NextResponse.json(
          { error: result.message || 'Payment processing failed', details: result },
          { status: response.status }
        );
      }
      
      return NextResponse.json({
        success: true,
        orderId: result.orderId,
        message: 'Payment processed successfully'
      });
      
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: 'Error connecting to payment service', details: fetchError instanceof Error ? fetchError.message : String(fetchError) },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: 'Payment processing failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}