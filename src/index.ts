import * as dotenv from "dotenv";
dotenv.config();

const main = async () => {
  try {
    // Get current public IP
    const ipRes = await fetch("https://api.ipify.org");
    const ip = await ipRes.text();
    console.log(`Current IP: ${ip}`);

    // Call Cloudflare API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/dns_records/${process.env.CF_RECORD_ID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "A",
          name: process.env.CF_RECORD_NAME,
          content: ip,
          ttl: 300,
          proxied: false,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log("✅ DNS record updated!");
    } else {
      console.error("❌ Failed to update:", result.errors || result);
    }
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
  }
};

main();
