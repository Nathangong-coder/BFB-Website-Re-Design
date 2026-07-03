import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.SMARTCOMPS_BACKEND_URL || "http://127.0.0.1:5001";

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string; path: string[] }> }
) {
  try {
    const { tool, path } = await params;
    const pathString = path.join("/");
    
    // Dynamically forward to the corresponding Python blueprint prefix
    const targetUrl = `${BACKEND_URL}/api/${tool}/${pathString}`;
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("host", new URL(BACKEND_URL).host);

    const init: RequestInit = {
      method: request.method,
      headers: requestHeaders,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const bodyText = await request.text();
      init.body = bodyText;
    }

    const response = await fetch(targetUrl, init);

    const responseHeaders = new Headers(response.headers);
    // Remove headers that might interfere
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to connect to the valuation backend. Please ensure the Python server is running on port 5001." 
      },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tool: string; path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ tool: string; path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ tool: string; path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ tool: string; path: string[] }> }
) {
  return proxyRequest(request, context);
}
