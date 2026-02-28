import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Real-time Detection',
    description: 'Instant analysis of URLs and content with AI-powered threat detection algorithms.',
    image: '/assets/generated/feature-realtime.dim_128x128.png',
  },
  {
    title: 'Deepfake Analysis',
    description: 'Advanced detection of manipulated media and deepfake content to protect against misinformation.',
    image: '/assets/generated/feature-deepfake.dim_128x128.png',
  },
  {
    title: 'URL Phishing Scan',
    description: 'Comprehensive scanning of suspicious links to identify phishing attempts and malicious websites.',
    image: '/assets/generated/feature-url-scan.dim_128x128.png',
  },
];

export default function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="cyber-border hover:shadow-cyber-glow transition-all duration-300 bg-card/50 backdrop-blur-sm group"
        >
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img
                src={feature.image}
                alt={feature.title}
                className="h-24 w-24 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardTitle className="text-center text-xl cyber-glow group-hover:cyber-glow-green transition-all">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-muted-foreground">{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
