const { createClient } = require('@supabase/supabase-js');
const url = 'https://fyppwfdlcaspkivbwsmt.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5cHB3ZmRsY2FzcGtpdmJ3c210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDg3MDYsImV4cCI6MjA4Nzk4NDcwNn0.VHlSbE1L1zJkYUqI-IUQbyKZjdmpLNPwcLv1t5hKNp0';
const supabase = createClient(url, key);

async function test() {
    const { data, error } = await supabase.from('orders').insert([
        { short_id: 'ABCD', items: [{ id: 1, name: 'Coffee', price: 5, qty: 1 }], total: 5, status: 'pending' }
    ]).select();
    console.log("Error:", error);
    console.log("Data:", data);
}
test();
