import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export interface ApiHandlerOptions {
  requireAuth?: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export async function createApiHandler<T>(
  handler: (
    req: NextRequest,
    context: { userId: string }
  ) => Promise<NextResponse<T>>,
  options: ApiHandlerOptions = { requireAuth: true }
) {
  return async (request: NextRequest) => {
    try {
      // Check authentication if required
      if (options.requireAuth) {
        const { userId } = await auth();
        if (!userId) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
        }
        return handler(request, { userId });
      }

      return handler(request, { userId: "" });
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

export function createSuccessResponse<T>(
  data: T,
  statusCode = 200
): NextResponse<{ success: boolean; data: T }> {
  return NextResponse.json(
    { success: true, data },
    { status: statusCode }
  );
}

export function createErrorResponse(
  error: string,
  statusCode = 400
): NextResponse<{ success: boolean; error: string }> {
  return NextResponse.json(
    { success: false, error },
    { status: statusCode }
  );
}
