import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Feature = {
  title: string;
  description: string;
  image: string;
  borderColor: string;
  bgColor: string;
  glowColor: string;
  cornerColor: string;
  textColor: string;
  textShadow: string;
  descColor: string;
  iconBg: string;
  iconBorder: string;
};

const features: Feature[] = [
  {
    title: "Real-time Detection",
    description:
      "Instant analysis of URLs and content with AI-powered threat detection algorithms.",
    image: "/assets/generated/feature-realtime-transparent.dim_128x128.png",
    borderColor: "oklch(0.65 0.25 220 / 0.25)",
    bgColor: "oklch(0.14 0.03 240 / 0.8)",
    glowColor: "oklch(0.65 0.25 220 / 0.2)",
    cornerColor:
      "linear-gradient(225deg, oklch(0.65 0.25 220 / 0.12) 0%, transparent 60%)",
    textColor: "oklch(0.65 0.25 220)",
    textShadow: "0 0 10px oklch(0.65 0.25 220 / 0.5)",
    descColor: "oklch(0.65 0.05 220)",
    iconBg: "oklch(0.65 0.25 220 / 0.1)",
    iconBorder: "oklch(0.65 0.25 220 / 0.2)",
  },
  {
    title: "Deepfake Analysis",
    description:
      "Advanced detection of manipulated media and deepfake content to protect against misinformation.",
    image: "/assets/generated/feature-deepfake-transparent.dim_128x128.png",
    borderColor: "oklch(0.7 0.28 160 / 0.25)",
    bgColor: "oklch(0.14 0.03 240 / 0.8)",
    glowColor: "oklch(0.7 0.28 160 / 0.2)",
    cornerColor:
      "linear-gradient(225deg, oklch(0.7 0.28 160 / 0.12) 0%, transparent 60%)",
    textColor: "oklch(0.7 0.28 160)",
    textShadow: "0 0 10px oklch(0.7 0.28 160 / 0.5)",
    descColor: "oklch(0.65 0.05 220)",
    iconBg: "oklch(0.7 0.28 160 / 0.1)",
    iconBorder: "oklch(0.7 0.28 160 / 0.2)",
  },
  {
    title: "URL Phishing Scan",
    description:
      "Comprehensive scanning of suspicious links to identify phishing attempts and malicious websites.",
    image: "/assets/generated/feature-url-scan-transparent.dim_128x128.png",
    borderColor: "oklch(0.65 0.25 220 / 0.25)",
    bgColor: "oklch(0.14 0.03 240 / 0.8)",
    glowColor: "oklch(0.65 0.25 220 / 0.2)",
    cornerColor:
      "linear-gradient(225deg, oklch(0.65 0.25 220 / 0.12) 0%, transparent 60%)",
    textColor: "oklch(0.65 0.25 220)",
    textShadow: "0 0 10px oklch(0.65 0.25 220 / 0.5)",
    descColor: "oklch(0.65 0.05 220)",
    iconBg: "oklch(0.65 0.25 220 / 0.1)",
    iconBorder: "oklch(0.65 0.25 220 / 0.2)",
  },
];

export default function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="group relative overflow-hidden transition-all duration-300 backdrop-blur-sm"
          style={{
            background: feature.bgColor,
            border: `1px solid ${feature.borderColor}`,
            boxShadow: `0 0 20px ${feature.glowColor}, inset 0 1px 0 oklch(1 0 0 / 0.04)`,
          }}
        >
          {/* Corner accent */}
          <div
            className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
            style={{ background: feature.cornerColor }}
          />
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: feature.iconBg,
                  border: `1px solid ${feature.iconBorder}`,
                }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-16 w-16 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <CardTitle
              className="text-center text-xl"
              style={{
                color: feature.textColor,
                textShadow: feature.textShadow,
              }}
            >
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription
              className="text-center"
              style={{ color: feature.descColor }}
            >
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
