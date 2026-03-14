export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Truth-Lens. All rights reserved. | Protecting the
            web, one scan at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
