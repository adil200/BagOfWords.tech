
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <header className="text-center pb-8">
        <FileText className="h-16 w-16 text-accent mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-primary mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">
          Please read these terms carefully.
        </p>
      </header>

      <section className="bg-card p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-4">Coming Soon</h2>
        <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
          Our official Terms of Service document is currently under review and will be published here shortly. This document will govern your use of the BagOfWords website and its content.
        </p>
        <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
          Key areas that will be covered include acceptable use, intellectual property rights, limitations of liability, and dispute resolution.
        </p>
        <p className="text-lg text-foreground/80 leading-relaxed">
          We appreciate your patience. In the meantime, if you have any questions, please do not hesitate to <a href="/contact" className="text-accent hover:underline">contact us</a>.
        </p>
      </section>
    </div>
  );
}
