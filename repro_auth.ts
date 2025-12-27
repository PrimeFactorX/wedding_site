
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://wlbvcrlvjzsfuaivchtf.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsYnZjcmx2anpzZnVhaXZjaHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTQ2MDcsImV4cCI6MjA4MDYzMDYwN30.AyPVLL5PaPepd-FenOM6YkWLAKMwHAEUE8vMc_4BrEE";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistration() {
    const timestamp = Date.now();
    const email = `testuser_${timestamp}@example.com`;
    const password = 'password123';

    console.log(`Attempting to register user: ${email}`);

    // Simulate AuthPagesignUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: "Test User",
                phone: null,
            }
        }
    });

    if (authError) {
        console.error("Signup error:", authError);
        return;
    }

    const userId = authData.user?.id;
    console.log(`User registered with ID: ${userId}`);

    if (!userId) {
        console.error("No user ID returned");
        return;
    }

    // Simulate AuthPage 'upsert' logic
    console.log("Upserting role 'business'...");
    const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: "business" }, { onConflict: "user_id" });

    if (roleError) console.error("Role upsert error:", roleError);

    // Now check the role
    console.log("Checking assigned role...");
    const { data: roleData, error: fetchError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

    if (fetchError) {
        console.error("Error fetching role:", fetchError);
    } else {
        console.log(`Role in DB: ${roleData?.role}`);
        if (roleData?.role === 'admin') {
            console.error("CRITICAL: User was assigned ADMIN role!");
        } else if (roleData?.role === 'business') {
            console.log("User correctly assigned 'business' role.");
        } else {
            console.log(`User assigned unknown role: ${roleData?.role}`);
        }
    }
}

testRegistration();
