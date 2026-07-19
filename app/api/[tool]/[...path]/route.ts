import { NextRequest, NextResponse } from "next/server";

// Training can take several minutes, so give this function room to wait on
// the Python backend instead of Vercel cutting the connection early.
export const maxDuration = 300;

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
    const isTimeout = error instanceof Error && /timeout|timed out|aborted/i.test(error.message);
    return NextResponse.json(
      {
        status: "error",
        message: isTimeout
          ? "The valuation backend took too long to respond. Training large feature sets can take several minutes — please try again, or try a smaller feature set."
          : "Failed to connect to the valuation backend. Please ensure the Python server is running and reachable.",
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
