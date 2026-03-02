import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
// Service Role key is safer to insert regardless of RLS, fall back to anon key if not provided
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Very basic in-memory rate limiting to prevent simple DDoS spam
const rateLimit = new Map<string, { count: number; lastTime: number }>();

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate Limiting: max 5 requests per 30 seconds
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    if (rateLimit.has(ip)) {
        const data = rateLimit.get(ip)!;
        if (now - data.lastTime < 30000) {
            if (data.count > 5) return res.status(429).json({ error: 'Too many requests. Please slow down.' });
            rateLimit.set(ip, { count: data.count + 1, lastTime: data.lastTime });
        } else {
            rateLimit.set(ip, { count: 1, lastTime: now });
        }
    } else {
        rateLimit.set(ip, { count: 1, lastTime: now });
    }

    try {
        const { items, total } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Server-side total calculation for safety
        const computedTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
        // Tolerance check to handle floats
        if (Math.abs(computedTotal - total) > 0.05) {
            return res.status(400).json({ error: 'Total mismatch' });
        }

        // Generate a premium 4-character hex-like ID for the counter
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // excluding ambiguous chars
        let short_id = '';
        for (let i = 0; i < 4; i++) {
            short_id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Insert into Supabase
        const { error } = await supabase
            .from('orders')
            .insert([
                { short_id, items, total: computedTotal, status: 'pending' },
            ]);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Database error storing order.' });
        }

        return res.status(200).json({ success: true, order: { short_id, total: computedTotal } });
    } catch (error) {
        console.error('Error processing checkout:', error);
        return res.status(500).json({ error: 'Internal server error processing your request.' });
    }
}
