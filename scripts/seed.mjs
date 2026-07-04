import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function seed() {
  console.log("🌱 Seeding Turso database...\n");

  // --- salon_services ---
  console.log("Inserting salon_services...");
  await client.execute(`
    INSERT OR REPLACE INTO salon_services (id, name, description, duration_minutes, price, image_url, created_at) VALUES
    ('07df42aa-ac7a-4545-b41b-04f991d53635', 'Keratin Treatment', 'Smoothing treatment to eliminate frizz and add shine.', 90, 150.00, 'https://images.unsplash.com/photo-1747398690600-ffe8ecda9df1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2026-03-08 09:08:36.842695+00'),
    ('15a1f9b3-086b-4cfb-b9f8-f6592c3fa486', 'Classic Haircut', 'Expensive ass haircut that takes forever!', 60, 100.00, 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop', '2026-03-08 09:08:36.842695+00'),
    ('286a4b7c-0a0b-40b3-a6c2-466cdc27d0bb', 'Beard Trim & Sculpt', 'Professional beard trimming, shaping, and conditioning.', 20, 20.00, 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop', '2026-03-08 09:08:36.842695+00'),
    ('32a0d901-b438-4a74-a85e-3450c7ad50bd', 'Test Service', 'This is a test service', 100, 100.00, 'https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2026-03-20 12:00:30.150174+00'),
    ('3357f4e9-d27f-4046-9292-467c16a852a8', 'Scalp Massage & Wash', 'Relaxing scalp massage followed by a deep cleansing wash.', 15, 150.00, 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop', '2026-03-08 09:08:36.842695+00'),
    ('42df1495-b316-46c9-80d3-1d2de39d28be', 'Full Hair Coloring', 'Complete hair color transformation using premium dyes.', 120, 120.00, 'https://images.unsplash.com/photo-1712213396688-c6f2d536671f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2026-03-08 09:08:36.842695+00'),
    ('b1adf407-cd4e-4c34-ba2a-d22d94794fde', 'Master Haircut', 'this is a demo description for a master haircut', 120, 1000.00, 'https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2026-03-20 12:10:27.227531+00'),
    ('e08ddf16-ae68-4afb-9493-8969bc491856', 'Pedicure For Women', 'this is a pedicure!', 60, 100.00, 'https://images.unsplash.com/photo-1519419451778-14599a49ec41?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2026-03-18 04:14:22.552137+00')
  `);
  console.log("✅ salon_services seeded.\n");

  // --- salon_stylists ---
  // service_ids stored as JSON arrays (text column with mode: "json")
  console.log("Inserting salon_stylists...");
  await client.execute(`
    INSERT OR REPLACE INTO salon_stylists (id, name, image_url, service_ids, password, description) VALUES
    ('aarav_mehta', 'Aarav Mehta', 'https://i.pravatar.cc/150?u=a042581f4e29026024d', '["15a1f9b3-086b-4cfb-b9f8-f6592c3fa486","286a4b7c-0a0b-40b3-a6c2-466cdc27d0bb","3357f4e9-d27f-4046-9292-467c16a852a8"]', 'clipper123', 'Precision-driven stylist known for effortless, modern transformations.'),
    ('johnromero', 'John Romero', null, '["07df42aa-ac7a-4545-b41b-04f991d53635","3357f4e9-d27f-4046-9292-467c16a852a8","e08ddf16-ae68-4afb-9493-8969bc491856"]', 'johnromero', 'Color specialist blending creativity with trend-forward techniques.'),
    ('neha_sharma', 'Neha Sharma', 'https://i.pravatar.cc/150?u=a04258114e29026702d', '["15a1f9b3-086b-4cfb-b9f8-f6592c3fa486","2cd8a711-001f-4286-9dd4-ee60d32c4576","3357f4e9-d27f-4046-9292-467c16a852a8"]', 'salon456', 'Master of lived-in looks and low-maintenance luxury hair.'),
    ('NickKygios', 'NK', 'https://i.pravatar.cc/400?img=69', '["286a4b7c-0a0b-40b3-a6c2-466cdc27d0bb","15a1f9b3-086b-4cfb-b9f8-f6592c3fa486","42df1495-b316-46c9-80d3-1d2de39d28be"]', '12345678', 'Detail-obsessed stylist delivering polished, confidence-boosting finishes.'),
    ('novak', 'Novak Djokovic', null, '["2cd8a711-001f-4286-9dd4-ee60d32c4576"]', 'djokernole', 'Creative cutter crafting shapes that move and evolve beautifully.'),
    ('rogerfederer', 'Roger Federer', null, '["42df1495-b316-46c9-80d3-1d2de39d28be","15a1f9b3-086b-4cfb-b9f8-f6592c3fa486","b1adf407-cd4e-4c34-ba2a-d22d94794fde"]', 'rogerfederer', 'Style expert turning everyday hair into signature statements.'),
    ('rohan_kapoor', 'Rohan Kapoor', 'https://i.pravatar.cc/150?u=a042581f4e29026704d', '["15a1f9b3-086b-4cfb-b9f8-f6592c3fa486","42df1495-b316-46c9-80d3-1d2de39d28be","07df42aa-ac7a-4545-b41b-04f991d53635"]', 'style789', 'Trend-savvy stylist creating personalized looks that feel fresh, wearable, and uniquely you.')
  `);
  console.log("✅ salon_stylists seeded.\n");

  // --- salon_appointments ---
  console.log("Inserting salon_appointments...");
  await client.execute(`
    INSERT OR REPLACE INTO salon_appointments (id, user_id, service_id, stylist_id, date, time, status, customer_name, rating, review) VALUES
    ('0d209e23-c570-4d33-98a9-744d2e42cf61', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', 'e08ddf16-ae68-4afb-9493-8969bc491856', 'johnromero', '2026-05-14', '03:30 PM', 'pending', 'Yugandhar Patil', null, null),
    ('6a6b613a-766c-4f55-9aa9-0e2059a00605', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '42df1495-b316-46c9-80d3-1d2de39d28be', 'NickKygios', '2026-03-19', '04:30 PM', 'completed', 'Yugandhar Patil', 5, ''),
    ('83cc5bc6-8cb5-4d4a-8bff-d0840736a8b5', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '286a4b7c-0a0b-40b3-a6c2-466cdc27d0bb', 'aarav_mehta', '2026-03-09', '09:00 AM', 'completed', 'Yugandhar Patil', 5, 'amazing stuff!'),
    ('84601cab-40e6-4b46-9136-f1d36deca0d0', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '42df1495-b316-46c9-80d3-1d2de39d28be', 'rogerfederer', '2026-03-24', '02:00 PM', 'completed', 'Yugandhar Patil', 1, 'poor services provided by roger federer'),
    ('8dc6e7ee-7441-4e94-8805-99f05fa5d59a', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '3357f4e9-d27f-4046-9292-467c16a852a8', 'johnromero', '2026-03-26', '01:00 PM', 'completed', 'Yugandhar Patil', 1, 'bad scalp massage by john romero!'),
    ('95aaa925-b077-4ba1-91c8-20b053d8af55', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '42df1495-b316-46c9-80d3-1d2de39d28be', 'rogerfederer', '2026-03-20', '11:00 AM', 'completed', 'Yugandhar Patil', 5, 'roger''s hair coloring was amazing!'),
    ('98aefd75-ff8c-44d5-8ac1-ede112f9b0be', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', 'b1adf407-cd4e-4c34-ba2a-d22d94794fde', 'rogerfederer', '2026-03-20', '02:00 PM', 'pending', 'Yugandhar Patil', 1, null),
    ('9e46d36f-887f-4e6c-a27f-dd3c82beeecc', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '286a4b7c-0a0b-40b3-a6c2-466cdc27d0bb', 'aarav_mehta', '2026-05-31', '09:00 AM', 'pending', 'Yugandhar Patil', null, null),
    ('a94763ff-951f-4b65-b014-c2edbe047249', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '3357f4e9-d27f-4046-9292-467c16a852a8', 'johnromero', '2026-03-26', '02:00 PM', 'completed', 'Yugandhar Patil', 1, 'bad scalp massage by john romero!'),
    ('af5c2ad8-8ca2-4769-9bc0-c6147aeca3a0', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '286a4b7c-0a0b-40b3-a6c2-466cdc27d0bb', 'aarav_mehta', '2026-03-21', '10:00 AM', 'completed', 'Yugandhar Patil', 3, 'good sculpt'),
    ('b2055021-d2d9-4819-ae1d-ca1f401d9700', 'user_3AZ6S1FBtT5iwNz2qiW9xLgIDpA', '15a1f9b3-086b-4cfb-b9f8-f6592c3fa486', 'neha_sharma', '2026-03-31', '03:30 PM', 'pending', 'Yugandhar Patil', 1, null)
  `);
  console.log("✅ salon_appointments seeded.\n");

  console.log("🎉 Database seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
