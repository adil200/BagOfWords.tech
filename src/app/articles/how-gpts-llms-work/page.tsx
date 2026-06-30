import React from 'react';
import { Metadata } from 'next';
import { ScrollyProvider, ScrollyVisualizer, ScrollyText, Step } from '@/components/interactive/Scrollytelling';
import { LLMVisualizer } from '@/components/interactive/LLMVisualizer';
import { InteractiveArticleLayout } from '@/components/interactive/InteractiveArticleLayout';
import { getArticleBySlug } from '@/lib/article-service';

export const metadata: Metadata = {
  title: 'How GPTs/LLMs work? From prompt to output | BagOfWords',
  description: 'An interactive, animated exploration of how Large Language Models generate human-like text by processing enormous amounts of data.',
};

export default async function ScrollytellingArticle() {
  const article = await getArticleBySlug('how-gpts-llms-work');
  return (
    <InteractiveArticleLayout
      title="How GPTs/LLMs work?"
      subtitle="From prompt to output"
      date="November 8, 2025"
      readingTime="15 min read"
      tags={[
        { label: 'AI Fundamentals', variant: 'primary', queryOverride: 'AI Fundamentals' },
      ]}
      footerTags={['AI Fundamentals', 'LLMs', 'GPT', 'Generative AI', 'Transformers']}
      articleSlug="how-gpts-llms-work"
      authorId="1"
      articleContent={article?.content || ''}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollyProvider>
          <ScrollyText>
            <div className="prose prose-lg max-w-none text-foreground/90">
              
              {/* Step 0 */}
              <Step stepIndex={0}>
                <h2 className="text-3xl font-bold mt-0 text-primary">What are LLMs?</h2>
                <p>
                  <strong>Large Language Models (LLMs)</strong> are deep learning algorithms that can recognize, summarize, translate, predict and generate text and other forms of content based on knowledge gained from massive datasets.
                </p>
                <p>
                  They generate human-like text by processing enormous amounts of information, learning statistical patterns, grammar, reasoning abilities, and even some facts about the world.
                </p>
                <p>
                  <strong>Generative Pre-trained Transformers (GPTs)</strong> are a specific, wildly successful family of LLMs based entirely on the <em>Transformer architecture</em>.
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={0} />
                </div>
              </Step>

              {/* Step 1 */}
              <Step stepIndex={1}>
                <h2 className="text-3xl font-bold text-primary">What was there before LLMs?</h2>
                <p>Before Transformers revolutionized text generation, sequence prediction and classification tasks relied on older neural network architectures, each with distinct limitations.</p>
                
                <h3 className="text-xl font-bold mt-6">RNN (Recurrent Neural Network)</h3>
                <p>RNNs were the gold standard for sequential and time-series data. They processed words one by one, keeping a "memory" of previous words. However, they suffered from the <em>vanishing gradient problem</em>, meaning they would "forget" words from the beginning of a long sentence by the time they reached the end.</p>
                <ul className="list-disc pl-5 mb-4">
                  <li><strong>Example Use Case:</strong> Stock Price Prediction</li>
                  <li><strong>Data Type:</strong> Sequential, Time-Series</li>
                </ul>

                <h3 className="text-xl font-bold mt-6">CNN (Convolutional Neural Network)</h3>
                <p>CNNs are incredibly powerful, but they are built for spatial data, primarily images and video, where local proximity of pixels matters more than temporal sequences.</p>
                <ul className="list-disc pl-5">
                  <li><strong>Example Use Case:</strong> Object tracking, Predicting speed limits from street signs</li>
                  <li><strong>Data Type:</strong> Spatial Data</li>
                </ul>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={1} />
                </div>
              </Step>

              {/* Step 2 */}
              <Step stepIndex={2}>
                <h2 className="text-3xl font-bold text-primary">Traditional NLP</h2>
                <p>
                  Natural Language Processing (NLP) is not a specific framework like RNNs or CNNs; it is an entire discipline of Artificial Intelligence focused purely on making computers understand human text.
                </p>
                <p>
                  Historically, NLP did not rely on massive generative models. It relied on specific, rules-based or statistical libraries designed to break down language mechanically:
                </p>
                <ul className="list-disc pl-5 mb-6">
                  <li><strong>spaCy:</strong> Industrial-strength NLP in Python.</li>
                  <li><strong>NLTK:</strong> The Natural Language Toolkit.</li>
                  <li><strong>SparkNLP:</strong> State-of-the-art NLP for enterprise.</li>
                </ul>
                
                <p>Instead of generating entire essays, traditional NLP focused on highly specific micro-tasks:</p>
                <ul className="list-disc pl-5">
                  <li><strong>Sentiment Analysis:</strong> Is this review positive or negative?</li>
                  <li><strong>NER (Named Entity Recognition):</strong> Finding "Apple" (the company) vs "apple" (the fruit).</li>
                  <li><strong>POS Tagging:</strong> Labeling nouns, verbs, and adjectives.</li>
                </ul>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={2} />
                </div>
              </Step>

              {/* Step 3 */}
              <Step stepIndex={3}>
                <h2 className="text-3xl font-bold text-primary">The Turning Point: 2017</h2>
                <p>
                  Everything changed in 2017. A team of Google researchers led by Ashish Vaswani published what would become one of the most cited papers in computer science history.
                </p>
                <p className="font-semibold text-accent text-xl my-6 pl-4 border-l-4 border-accent italic">
                  "Attention Is All You Need"
                </p>
                <p>
                  This paper introduced the <strong>Transformer Architecture</strong>. It completely discarded the slow, sequential nature of RNNs. Instead, it allowed neural networks to process entire sentences <em>simultaneously</em>, drastically reducing training times and allowing models to "attend" to relationships between words regardless of how far apart they were.
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={3} />
                </div>
              </Step>

              {/* Step 4 */}
              <Step stepIndex={4}>
                <h2 className="text-3xl font-bold text-primary">Step 1: Tokenization & Embedding</h2>
                <p>So, what happens when you type a prompt like <em>"What is Mainframe Modernization?"</em> into an LLM?</p>
                
                <h3 className="text-xl font-bold mt-6">1. Tokenization</h3>
                <p>The AI doesn't read words. It chops your prompt into chunks called <strong>Tokens</strong>. Sometimes a token is a whole word, sometimes it's just a syllable.</p>
                <p className="font-mono bg-muted p-2 rounded text-sm break-all">['What', ' is', ' Main', 'frame', ' Modern', 'ization', '?']</p>

                <h3 className="text-xl font-bold mt-6">2. Embedding</h3>
                <p>Next, it converts those tokens into numbers. Specifically, high-dimensional vectors. Words with similar meanings (like "dog" and "puppy") are placed close together in this mathematical space.</p>
                
                <h3 className="text-xl font-bold mt-6">3. Positional Encoding</h3>
                <p>Because Transformers process everything simultaneously, they have no concept of word order. Positional encoding adds tiny mathematical adjustments to the vectors so the model knows that "dog bites man" is different from "man bites dog".</p>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={4} />
                </div>
              </Step>

              {/* Step 5 */}
              <Step stepIndex={5}>
                <h2 className="text-3xl font-bold text-primary">Step 2: The Attention Mechanism</h2>
                <p>Once the words are converted into numbers, they enter the core of the Transformer.</p>
                
                <p>The magic happens in <strong>Self-Attention</strong>. This allows the model to look at a word and weigh its relevance against every other word in the sentence.</p>
                <p>It does this using three matrices borrowed from database terminology:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li><strong>Query (Q):</strong> What am I looking for?</li>
                  <li><strong>Key (K):</strong> What do I have?</li>
                  <li><strong>Value (V):</strong> What is my actual content?</li>
                </ul>
                <p>By multiplying these matrices together (scaled dot-product attention), the model figures out that in the sentence "The bank of the river", the word "bank" relates to "river", not "money".</p>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={5} />
                </div>
              </Step>

              {/* Step 6 */}
              <Step stepIndex={6}>
                <h2 className="text-3xl font-bold text-primary">Step 3: Decoding & Softmax</h2>
                <p>After passing through multiple layers of Encoders and Decoders, the model reaches the final step: Output.</p>
                <p>The LLM's only job is to <strong>predict the very next token</strong>.</p>
                
                <p>The final layer transforms the dense vectors into a massive array of probabilities—one for every single word in its vocabulary. This is done using a mathematical function called <strong>Softmax</strong>.</p>
                
                <p>The Softmax function ensures all the probabilities add up to 100%. The model might predict:</p>
                <ul className="list-none pl-0 mb-4 bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                  <li>Mainframe -&gt; 85%</li>
                  <li>Cloud -&gt; 10%</li>
                  <li>Computer -&gt; 5%</li>
                </ul>
                <p>It selects "Mainframe", appends it to your prompt, and starts the entire massive process over again for the next word.</p>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={6} />
                </div>
              </Step>

              {/* Step 7 */}
              <Step stepIndex={7}>
                <h2 className="text-3xl font-bold text-primary">Under the Hood: The Code</h2>
                <p>
                  At the absolute lowest code level, the enormous "magic" of an LLM boils down to simple linear algebra.
                </p>
                <p>
                  A simple <strong>Linear Layer</strong> (the fundamental building block of these networks) just multiplies an input matrix by a weight matrix and adds a bias vector. 
                </p>
                <p>
                  When you hear that a model like GPT-4 has "a trillion parameters", those parameters are exactly these weights and biases. The formula for the parameters in a single basic layer is simply <code>(input_size × output_size) + output_size</code>.
                </p>
                <p className="italic mt-6 font-medium border-l-4 border-primary pl-4">
                  The breathtaking capabilities of LLMs arise not from complex logic rules, but simply from stacking billions of these basic mathematical parameters together and training them on the entirety of human knowledge.
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[500px] w-full">
                  <LLMVisualizer stepOverride={7} />
                </div>
              </Step>

            </div>
          </ScrollyText>

          <ScrollyVisualizer>
            <LLMVisualizer />
          </ScrollyVisualizer>
        </ScrollyProvider>
      </div>
    </InteractiveArticleLayout>
  );
}
