import React from 'react';
import { ScrollyProvider, ScrollyVisualizer, ScrollyText, Step } from '@/components/interactive/Scrollytelling';
import { NLPVisualizer } from '@/components/interactive/NLPVisualizer';
import { InteractiveArticleLayout } from '@/components/interactive/InteractiveArticleLayout';
import { getArticleBySlug } from '@/lib/article-service';

export const metadata = {
  title: 'From Bag of Words to Word2Vec: Fixing the Semantic Gap | BagOfWords',
  description: 'How NLP evolved from counting words to understanding meaning.',
};

export default async function BlogPost() {
  const article = await getArticleBySlug('from-bow-to-word2vec');
  return (
    <InteractiveArticleLayout
      title="From Bag of Words to Context:"
      subtitle="Why Counting Fails"
      date="June 29, 2026"
      readingTime="7 min read"
      tags={[
        { label: 'NLP', variant: 'primary', queryOverride: 'NLP' },
      ]}
      footerTags={['NLP', 'Bag of Words', 'TF-IDF', 'Word2Vec', 'NLP History', 'Algorithms']}
      articleSlug="from-bow-to-word2vec"
      authorId="1"
      articleContent={article?.content || ''}
    >
      <div className="max-w-7xl mx-auto">
        <ScrollyProvider>
          {/* Left Column: The Story / Text */}
          <ScrollyText>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              
              <Step stepIndex={0}>
                <h2>Bag of Words (BoW)</h2>
                <p>
                  Imagine you take a sentence, write each word on a separate piece of paper, and throw them all into a grocery bag. If you shake the bag and look inside, you still know exactly <em>what</em> words you have and <em>how many</em> of each there are. But you've completely lost the sentence structure.
                </p>
                <p>
                  In standard NLP, this is defined simply as an array of counts. For example, a document vector looks like this: <code>[count_of_word1, count_of_word2...]</code>.
                </p>
                <p>
                  <strong>Why is this useful?</strong> It helps classifiers understand the general topic. If an email has high counts of words like "free," "winner," and "click," BoW gives an algorithm enough mathematical evidence to confidently classify it as Spam.
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[450px] w-full">
                  <NLPVisualizer stepOverride={0} />
                </div>
              </Step>

              <Step stepIndex={1}>
                <h2>The Problem with Common Words</h2>
                <p>
                  Because Bag of Words only cares about raw frequency, it gets completely distracted by filler words. 
                </p>
                <p>
                  Imagine you have a highly technical article about <strong>AI</strong>. If you run it through a Bag of Words model, the highest-scoring words won't be "LLMs" or "Data." The highest-scoring words will almost certainly be: <strong>"the," "is," "and," "of,"</strong> and <strong>"to."</strong>
                </p>
                <p>
                  Even if we manually remove "stop words" from our dictionary, BoW has a fundamental flaw: it cannot measure a word's uniqueness across a whole library of documents.
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[450px] w-full">
                  <NLPVisualizer stepOverride={1} />
                </div>
              </Step>

              <Step stepIndex={2}>
                <h2>Enter TF-IDF: Term Frequency &amp; Squashing</h2>
                <p>
                  To fix this, we need a better formula. We start with <strong>Term Frequency (TF)</strong>: <em>How many times does this word appear in this specific document?</em>
                </p>
                <p>
                  But we don't just use raw counts. If a word appears 1000 times, it doesn't mean the document is 1000x more relevant than a document where it appears once. Instead, data scientists use a technique called <strong>logarithmic squashing</strong>.
                </p>
                <p>
                  The formula is <code>TF = log₁₀(count(t, d) + 1)</code>. <br/>
                  If the word "the" appears 1,000 times, the math makes it <code>log₁₀(1001) = 3.0</code>. <br/>
                  If "data" appears 10 times, it becomes <code>log₁₀(11) = 1.04</code>.<br/>
                  Suddenly, that massive, misleading gap is heavily reduced!
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[450px] w-full">
                  <NLPVisualizer stepOverride={2} />
                </div>
              </Step>

              <Step stepIndex={3}>
                <h2>Inverse Document Frequency (IDF)</h2>
                <p>
                  The second half of the magic is <strong>IDF</strong>. It asks: <em>How rare is a word across ALL documents?</em>
                </p>
                <p>
                  The formula is <code>IDF = log₁₀(N / dfₜ)</code> (where N is total documents, and dfₜ is how many documents contain the word).
                </p>
                <p>
                  If "the" appears in every single document, the math results in a multiplier of exactly <strong>0</strong>. We take our Term Frequency and multiply it by IDF. Mathematically, TF-IDF automatically and ruthlessly neutralizes words that appear everywhere, shining a spotlight on the rare keywords that give text its true meaning.
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[450px] w-full">
                  <NLPVisualizer stepOverride={3} />
                </div>
              </Step>

              <Step stepIndex={4}>
                <h2>The Curse of Dimensionality &amp; Semantic Gap</h2>
                <p>
                  TF-IDF was a massive upgrade, but it still shares a fundamental flaw with Bag of Words: <strong>It relies entirely on exact spelling matches. It doesn't understand synonyms.</strong>
                </p>
                <p>
                  Take the phrases <em>"The puppy sprinted"</em> and <em>"The dog ran."</em> As humans, we know these mean the exact same thing. But to TF-IDF, because there are zero overlapping words, the mathematical similarity between these two sentences is <strong>0%</strong>. 
                </p>
                <p>
                  Furthermore, to track a 100,000-word dictionary, you need an array with 100,000 slots for every single sentence, most of which are completely empty zeros. This is known as the Curse of Dimensionality.
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[450px] w-full">
                  <NLPVisualizer stepOverride={4} />
                </div>
              </Step>

              <Step stepIndex={5}>
                <h2>The Solution: Word2Vec</h2>
                <p>
                  By 2013, researchers realized that <em>counting words</em> was a dead end for true comprehension. A famous linguist named John Rupert Firth once said:
                </p>
                <blockquote>
                  "You shall know a word by the company it keeps."
                </blockquote>
                <p>
                  Instead of creating massive lists of zeros, what if a neural network learned to <em>predict</em> a word based on its neighbors? This led to the creation of <strong>Word2Vec</strong>. This was a huge shift—instead of treating words as separate, unrelated things, AI finally started understanding how their meanings connect to each other.
                </p>
                <p className="font-bold text-accent">
                  But how exactly do you turn "meaning" into a math equation? Stay tuned for Part 2...
                </p>
                <div className="lg:hidden mt-8 mb-8 h-[450px] w-full">
                  <NLPVisualizer stepOverride={5} />
                </div>
              </Step>
              
            </div>
          </ScrollyText>

          {/* Right Column: The Sticky Visualizer */}
          <ScrollyVisualizer>
            <NLPVisualizer />
          </ScrollyVisualizer>

        </ScrollyProvider>
      </div>
    </InteractiveArticleLayout>
  );
}