import { auth } from '@/auth';
import { NextRequest } from 'next/server';
 
type Handler = (req: NextRequest, context?: any) => Promise<Response>;
 
export function withAuthApi(handler: Handler): Handler {
  return async (req, context) => {
    const user = await auth();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return handler(req, context);
  };
}