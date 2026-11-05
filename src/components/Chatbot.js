"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const AGENT_URL = "https://n6ccvhfblm4kw6zcny6aejgw.agents.do-ai.run/static/chatbot/widget.js";
const PERSON_ICON = "https://n6ccvhfblm4kw6zcny6aejgw.agents.do-ai.run/static/chatbot/icons/default-agent.svg";
const PRIMARY = "#227cff";
const VISITOR = "#e8f1ff";

/**
 * DigitalOcean Gradient launcher. Their iframe draws a fixed 64px circle;
 * the page scales that circle down.
 */
export default function Chatbot() {
  const pathname = usePathname();
  const en = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <Script
      src={AGENT_URL}
      strategy="afterInteractive"
      data-agent-id="e229326f-d69a-11f0-b074-4e013e2ddde4"
      data-chatbot-id="t50ijh3mRJBZtGwCri5zZObUlZIgH9qx"
      data-name="Selekcija"
      data-primary-color={PRIMARY}
      data-secondary-color={VISITOR}
      data-button-background-color={PRIMARY}
      data-button-text-color="#ffffff"
      data-starting-message={en ? "Hello, how can I help you?" : "Pozdrav, kako Vam mogu pomoći?"}
      data-logo={PERSON_ICON}
    />
  );
}
