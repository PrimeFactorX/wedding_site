import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    duration_months: number;
    is_active: boolean;
}

export interface BusinessSubscription {
    id: string;
    business_id: string;
    plan_id: string;
    status: string;
    start_date: string;
    end_date: string;
    plan?: SubscriptionPlan;
}

export const useSubscription = (businessId: string | null) => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [subscription, setSubscription] = useState<BusinessSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    const defaultPlans: SubscriptionPlan[] = [
        { id: "11111111-1111-1111-1111-111111111111", name: "Başlanğıc", price: 0, duration_months: 12, is_active: true },
        { id: "22222222-2222-2222-2222-222222222222", name: "Professional", price: 29, duration_months: 1, is_active: true },
        { id: "33333333-3333-3333-3333-333333333333", name: "Premium", price: 49, duration_months: 1, is_active: true },
    ];

    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from("subscription_plans")
                .select("*")
                .eq("is_active", true)
                .order("price", { ascending: true });

            if (error) {
                console.error("Error fetching plans:", error);
                setPlans(defaultPlans);
                return;
            }

            if (!data || data.length === 0) {
                setPlans(defaultPlans);
                seedPlans().catch(e => console.error("Seeding failed:", e));
            } else {
                setPlans(data);
            }
        } catch (e) {
            console.error("Exception fetching plans:", e);
            setPlans(defaultPlans);
        }
    };

    const seedPlans = async () => {
        for (const plan of defaultPlans) {
            // We MUST include the ID so the fallback UI matches the DB records
            const { error } = await supabase.from("subscription_plans").insert(plan);
            if (error) console.error("Error seeding plan:", plan.name, error);
        }
    };

    const fetchSubscription = async () => {
        if (!businessId) return;

        const { data, error } = await supabase
            .from("business_subscriptions")
            .select("*, plan:subscription_plans(*)")
            .eq("business_id", businessId)
            .eq("status", "active")
            .maybeSingle();

        if (error && error.code !== "PGRST116") {
            console.error("Error fetching subscription:", error);
        }

        if (data) {
            // @ts-ignore - Supabase types are tricky with joins sometimes
            setSubscription(data as BusinessSubscription);
        } else {
            setSubscription(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        if (businessId) {
            fetchSubscription();
        } else {
            setLoading(false);
        }
    }, [businessId]);

    const subscribe = async (planId: string) => {
        if (!businessId) return false;

        try {
            // Deactivate current subscription if exists
            if (subscription) {
                await supabase
                    .from("business_subscriptions")
                    .update({ status: "cancelled" })
                    .eq("id", subscription.id);
            }

            const plan = plans.find(p => p.id === planId);
            if (!plan) return false;

            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + plan.duration_months);

            // Create new subscription
            const { error } = await supabase
                .from("business_subscriptions")
                .insert({
                    business_id: businessId,
                    plan_id: planId,
                    status: "active",
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                });

            if (error) {
                // Check for Foreign Key Violation (code 23503) or generic error that might imply missing plan
                // Since we can't always rely on error codes in client, we'll try to heal if it failed.
                if (error.code === '23503' || error.message.includes("foreign key")) {
                    console.log("Missing plan in DB, attempting to create...", plan.name);
                    const { error: planError } = await supabase.from("subscription_plans").insert(plan);

                    if (planError) {
                        console.error("Failed to create missing plan:", planError);
                        throw error; // Throw original error if we can't fix it
                    }

                    // Retry subscription
                    const { error: retryError } = await supabase
                        .from("business_subscriptions")
                        .insert({
                            business_id: businessId,
                            plan_id: planId,
                            status: "active",
                            start_date: startDate.toISOString(),
                            end_date: endDate.toISOString(),
                        });

                    if (retryError) throw retryError;
                } else {
                    throw error;
                }
            }

            toast.success("Abunəlik uğurla yeniləndi!");
            await fetchSubscription();
            return true;
        } catch (error: any) {
            console.error("Subscription error:", error);
            toast.error(`Abunəlik xətası: ${error.message || "Bilinməyən xəta"}`);
            return false;
        }
    };

    const checkLimit = (currentCount: number, type: "image" | "video") => {
        if (!subscription || !subscription.plan) {
            // If no subscription, assume basic limits (or restrict completely)
            // For now, let's treat no subscription as "No Plan" -> maybe restrict?
            // Or auto-assign Basic
            if (type === "image") return currentCount < 5;
            return false;
        }

        const planName = subscription.plan.name;

        if (planName === "Başlanğıc") {
            if (type === "image") return currentCount < 5;
            if (type === "video") return false;
        }

        if (planName === "Professional") {
            if (type === "image") return true; // Unlimited
            if (type === "video") return false;
        }

        if (planName === "Premium") {
            // Unlimited everything
            return true;
        }

        return false;
    };

    return {
        plans,
        subscription,
        loading,
        subscribe,
        checkLimit,
        refreshSubscription: fetchSubscription
    };
};
