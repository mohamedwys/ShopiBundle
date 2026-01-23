import { useState, useCallback, useEffect } from "react";
import {
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
  BlockStack,
  InlineStack,
  Text,
  Checkbox,
} from "@shopify/polaris";
import useFetch from "@/hooks/useFetch";

interface AIFBTConfigProps {
  shop: string;
  onGenerate?: () => void;
}

export default function AIFBTConfig({ shop, onGenerate }: AIFBTConfigProps) {
  const fetch = useFetch();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [config, setConfig] = useState({
    isEnabled: false,
    minSupport: 0.01,
    minConfidence: 0.3,
    minLift: 1.0,
    maxBundlesPerProduct: 3,
    lookbackDays: 90,
  });

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ai/fbt/config?shop=${shop}`);
      const data = await response.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setLoading(false);
    }
  }, [shop, fetch]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      await fetch("/api/ai/fbt/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, ...config }),
      });
      setMessage({ type: "success", text: "Configuration saved successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save configuration" });
    } finally {
      setLoading(false);
    }
  }, [shop, config, fetch]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const response = await fetch("/api/ai/fbt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Generated ${data.bundlesCreated} bundles from ${data.transactionsAnalyzed} orders`,
        });
        if (onGenerate) onGenerate();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to generate bundles" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to generate bundles" });
    } finally {
      setGenerating(false);
    }
  }, [shop, fetch, onGenerate]);

  return (
    <Card>
      <BlockStack gap="400">
        {message && (
          <Banner
            tone={message.type === "success" ? "success" : "critical"}
            onDismiss={() => setMessage(null)}
          >
            {message.text}
          </Banner>
        )}

        <BlockStack gap="400">
          <Text variant="headingMd" as="h2">
            AI FBT Configuration
          </Text>

          <Checkbox
            label="Enable AI-powered Frequently Bought Together"
            checked={config.isEnabled}
            onChange={(value) => setConfig({ ...config, isEnabled: value })}
          />

          <FormLayout>
            <TextField
              label="Minimum Support (%)"
              type="number"
              value={String(config.minSupport * 100)}
              onChange={(value) =>
                setConfig({ ...config, minSupport: parseFloat(value) / 100 || 0.01 })
              }
              autoComplete="off"
              helpText="Minimum percentage of orders that must contain the bundle"
            />

            <TextField
              label="Minimum Confidence (%)"
              type="number"
              value={String(config.minConfidence * 100)}
              onChange={(value) =>
                setConfig({ ...config, minConfidence: parseFloat(value) / 100 || 0.3 })
              }
              autoComplete="off"
              helpText="Minimum confidence score for bundle recommendations"
            />

            <TextField
              label="Minimum Lift"
              type="number"
              value={String(config.minLift)}
              onChange={(value) =>
                setConfig({ ...config, minLift: parseFloat(value) || 1.0 })
              }
              autoComplete="off"
              helpText="Minimum lift value (> 1.0 means products are bought together more than random)"
            />

            <TextField
              label="Max Bundles Per Product"
              type="number"
              value={String(config.maxBundlesPerProduct)}
              onChange={(value) =>
                setConfig({ ...config, maxBundlesPerProduct: parseInt(value) || 3 })
              }
              autoComplete="off"
            />

            <TextField
              label="Lookback Days"
              type="number"
              value={String(config.lookbackDays)}
              onChange={(value) =>
                setConfig({ ...config, lookbackDays: parseInt(value) || 90 })
              }
              autoComplete="off"
              helpText="Number of days of order history to analyze"
            />
          </FormLayout>

          <InlineStack gap="400">
            <Button loading={loading} onClick={handleSave}>
              Save Configuration
            </Button>
            <Button
              loading={generating}
              onClick={handleGenerate}
              disabled={!config.isEnabled}
            >
              Generate AI Bundles
            </Button>
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
