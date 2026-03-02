import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await resend.emails.send({
            from: 'Roastly Cafe Contact Form <onboarding@resend.dev>',
            // IMPORTANT: You must either add CONTACT_EMAIL to your Vercel secrets, 
            // or change this string to the email address you registered with Resend.
            to: process.env.CONTACT_EMAIL || 'delivered@resend.dev',
            subject: `New Contact Request from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
            replyTo: email,
        });

        if (error) {
            return res.status(400).json({ error });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
