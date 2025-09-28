import * as dotenv from "dotenv";
dotenv.config();

async function getRecordId(name: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/dns_records?name=${name}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const result = await response.json();
  return result.result[0].id;
}

async function updateRecord(name: string, recordId: string, ip: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/dns_records/${recordId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "A",
        name: name,
        content: ip,
        ttl: 300,
        proxied: false,
      }),
    }
  );

  const result = await response.json();

  if (result.success) {
    console.log(`✅ ${name} updated`);
    return true;
  } else {
    console.error(`❌ Failed to update ${name}`);
    return false;
  }
}

const main = async () => {
  try {
    // Get current public IP
    const ipRes = await fetch("https://api.ipify.org");
    const ip = await ipRes.text();
    const recoredNamesStr = process.env.CF_RECORD_NAME;
    if (!recoredNamesStr) {
      throw new Error("CF_RECORD_NAME is not set");
    }

    const recoredNames = recoredNamesStr
      .split(",")
      .filter((r) => r.trim() !== "");

    console.log(`Current IP: ${ip}`);
    console.log(recoredNames);

    const configs: {
      name: string;
      recordId: string;
    }[] = await Promise.all(
      recoredNames.map(async (name) => {
        return {
          name,
          recordId: await getRecordId(name),
        };
      })
    );

    for (const config of configs) {
      await updateRecord(config.name, config.recordId, ip);
    }
  } catch (err) {
    console.error("🔥 Unexpected error:", err);
  }
};

main();
