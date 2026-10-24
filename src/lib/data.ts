import type { Author, Category, Article, Comment } from '@/types';
import { getR2AssetUrl } from './file-mapping';

// Helper functions for Cloudflare R2 URLs
export const getAppwriteImageUrl = (filename: string) => {
  return getR2AssetUrl(filename);
};

export const getOptimizedHtmlImageUrl = (filename: string, width: number = 1080) => {
  const rawUrl = getAppwriteImageUrl(filename);
  if (!rawUrl) return '';
  return `/_next/image?url=${encodeURIComponent(rawUrl)}&w=${width}&q=75`;
};

export const getAppwriteFileUrl = (filename: string) => {
  return getR2AssetUrl(filename);
};

export const authors: Author[] = [
  {
    id: '1',
    name: 'Adil Naib',
    avatarUrl: getR2AssetUrl('adil (1).png'),
    bio: 'Adil Naib is a data science enthusiast and Kaggle Notebooks Expert, specializing in EDA, Data Visualization, and Predictive Modelling. He shares his insights through blogs and aims to contribute significantly to the data science community.',
  },
  {
    id: '2',
    name: 'BagOfWords Team',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Content contributed by the BagOfWords team, focusing on diverse topics in AI, ML, and NLP.',
  },
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'AI Fundamentals',
    slug: 'ai-fundamentals',
    description: 'Core concepts and theories behind Artificial Intelligence.',
  },
  {
    id: '2',
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Exploring algorithms, models, and applications of ML.',
  },
  {
    id: '3',
    name: 'Natural Language Processing',
    slug: 'nlp',
    description: 'Understanding how computers process and analyze human language.',
  },
  {
    id: '5',
    name: 'AI Tools Review',
    slug: 'ai-tools-review',
    description: 'In-depth reviews and comparisons of AI tools and platforms.',
  }
];

export const articles: Article[] = [
  {
    slug: 'gemini-diffusion-review',
    title: 'Gemini Diffusion Review',
    category: 'ai-tools-review',
    tags: ['Gemini Diffusion', 'AI Coding Assistant', 'Code Generation', 'AI Development', 'Productivity', 'Gemini'],
    author: authors[0],
    publishDate: new Date('2025-06-02T00:00:00Z'), // Ensure this is a recent date to be featured
    readingTime: '7 min read',
    heroImageUrl: getAppwriteImageUrl('diffusion.png'),
    excerpt: "A sneak peek at Gemini Diffusion, an AI coding assistant claiming performance like a future Gemini 2.0 Flash-Lite model but 5x faster, generating hundreds of lines of code in seconds.",
    content: `
      <p>Alright folks, gather 'round, because I've just had a sneak peek at something that’s about to rock the world of code generation and editing, and my jaw is still on the floor. If you’ve ever felt that slight lag, that waiting game, when interacting with AI coding assistants, prepare to have your expectations completely shattered. I'm talking about <strong>Gemini Diffusion</strong>, and when I say it's fast, I mean it's <em>unbelievably, mind-bendingly fast</em>.</p>
      <p>We're talking performance that's being compared to the quality you'd anticipate from a future <strong>Gemini 2.0 Flash-Lite model, but at a staggering 5x the speed!</strong> Yes, you read that right. Five. Times. Faster. This isn't just an incremental improvement; this is a leap.</p>
      <p>Feeling the need for speed already? You can (and should!) jump on the waitlist right here:<br/>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdsxa-YU25JIPJGmu-pySJEYeTy6lwbdZAzxlZ11x3GPj6DhA/viewform" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">Sign up for the Gemini Diffusion Waitlist</a></p>
      <p>Now, let's dive into what makes this so darn exciting.</p>
      
      <h3>The Playground: Where Code Springs to Life in a Blink</h3>
      <p>First up, let's talk about the "Playground." Imagine your typical chat interface, but instead of just text responses, you're getting fully-fledged, functional code. And the speed? Oh, the speed! We're talking about generating <strong>hundreds of lines of code in less than one or two seconds</strong>. Seriously, it's often faster than you can finish reading your own prompt.</p>
      <p>I threw a pretty hefty request at it to see how it would cope:</p>
      <p><strong>My Prompt:</strong><code>Make a simple interactive visualization of the K-means clustering algorithm, where I can adjust K, add my own data points but also random data, and add a toggle to switch to its K-medoids variant.</code></p>
      
      <div class="my-6 aspect-video w-full rounded-md flex items-center justify-center text-muted-foreground">
        <video controls width="100%"  class="rounded-md" data-ai-hint="code algorithm">
          <source src="${getAppwriteFileUrl('First.mp4')}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <p class="text-center text-sm text-muted-foreground italic">Video: Interactive K-means/K-medoids visualization generated by Gemini Diffusion.</p>
      
      <p>The result? Bam! Complex, interactive code, ready to go, almost instantaneously. It's the kind of request that would have older models chugging along, or me spending a good hour or two scaffolding.</p>
      <p>And here's a feature I absolutely <em>love</em>: <strong>it often shows the code's output or a visual representation directly on the right side of the interface.</strong> This is HUGE. No more copying, pasting into a local environment, running, then debugging. You see the result right there, making the iteration cycle incredibly tight and efficient. It’s a fantastic user experience.</p>
      
      <h3>Instant Edits: Debug and Refine at Lightning Speed</h3>
      <p>But Gemini Diffusion isn't just about generating code from scratch. Its "Instant Edits" feature is where the magic truly amplifies.
      Have a snippet of code that's bugging you? Need to refactor something quickly? Just **copy-paste any code** directly into the interface, then enter a prompt like "fix this error," "refactor this for better readability," or "add error handling to this function."</p>
      <p>The model doesn't just suggest changes; it **makes the modifications directly in the code box, right before your eyes, at lightning speed.** It’s like having a senior developer pair-programming with you, but one that types at the speed of thought.</p>
      <p><strong>Let's talk about a real stress test:</strong></p>
      <p>We threw a <strong>LeetCode Hard problem</strong> at it. These are designed to be tricky, time-consuming, and push your algorithmic thinking.
      Gemini Diffusion didn't flinch.</p>
      <ul>
        <li><strong>Result:</strong> It generated a correct and optimized solution <strong>in a second.</strong></li>
        <li><strong>Performance:</strong> When submitted, the code passed all test cases and achieved an incredible:
            <ul>
                <li><strong>Runtime: 6ms</strong></li>
                <li><strong>Beats: 85.48%</strong> of other submissions!</li>
            </ul>
        </li>
      </ul>
      <p>This isn't just fast; it's top-tier performance, delivered instantly. Debugging sessions that used to take hours can now be resolved in minutes, if not seconds.</p>
      
      <div class="my-6 aspect-video w-full rounded-md flex items-center justify-center text-muted-foreground">
        <video controls width="100%"  class="rounded-md" data-ai-hint="software development">
          <source src="${getAppwriteFileUrl('Second.mp4')}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <p class="text-center text-sm text-muted-foreground italic">Video: Gemini Diffusion's Instant Edits feature in action, fixing code and adding features.</p>
      
      <h3>Conclusion: The Future of Coding is Fast, and It's Gemini Diffusion</h3>
      <p>Look, I've seen a lot of AI tools, and I get excited by genuine innovation. Gemini Diffusion isn't just an iteration; it feels like a paradigm shift. The sheer velocity transforms the way you interact with AI for coding. It moves from being a "tool you wait for" to an "extension of your thoughts."</p>
      <p>The ability to generate complex applications from a prompt in seconds, or to have existing code refactored and debugged almost in real-time, is going to unlock new levels of productivity and creativity for developers. Less time wrestling with boilerplate or head-scratching over obscure bugs means more time innovating and building amazing things.</p>
      <p>I'm genuinely thrilled about the potential here. This is the kind of speed that doesn't just make things faster; it makes new workflows possible.</p>
      <p>Don't just take my word for it – get on that waitlist and prepare to be amazed. The speed is real, and it’s spectacular.</p>
      <p>What are your thoughts? Are you ready for coding at the speed of Gemini Diffusion? Let me know in the comments below!</p>
    `,
  },
  {
    slug: 'password-manager-PasswordCrypto',
    title: 'Implement a Password Manager with the PasswordCrypto Python Library',
    category: 'ai-fundamentals',
    tags: ['Python', 'Password Management', 'Python Libraries'],
    author: authors[0], 
    publishDate: new Date('2025-05-17T00:00:00Z'),
    readingTime: '6 min read',
    heroImageUrl: getAppwriteImageUrl('PasswordCrypto.png'),
    excerpt: 'PasswordCrypto is a Python library that simplifies secure password management by encrypting and storing sensitive login information.',
    content: `
      <p>PasswordCrypto is a powerful Python library that allows users to securely store and retrieve passwords for various websites. It helps users encrypt, store, and manage sensitive login information, ensuring that their online security is maintained. This library implements robust encryption algorithms to protect data, making it an essential tool for anyone concerned about password security in the digital age.</p>
      <p>In this article, we will explore the various functionalities of the PasswordCrypto Python library. We will begin by learning how to install the library on your system. Then, we will discuss what PasswordCrypto is, why it’s needed, and its benefits. After that, we will implement the core functionalities in Python, starting with initializing a password manager, securely storing passwords, retrieving stored passwords, and storing sensitive text within the password manager. By the end of this article, you will have a strong understanding of PasswordCrypto and be equipped to securely store sensitive information without relying on browser storage, which can be compromised.</p>
      
      <h2>Installation</h2>
      <p>To install the PasswordCrypto library, simply run the following command in your terminal:</p>
      <pre><code>pip install passwordcrypto</code></pre>
      
      <h2>About PasswordCrypto</h2>
      <p>In an era where data breaches and password leaks are increasingly common, having a robust password manager is crucial. The PasswordCrypto library offers an easy way to implement secure password storage with encryption techniques that ensure that even if the password file is compromised, the actual passwords remain protected.</p>
      
      <h2>API Reference</h2>
      <p>The PasswordCrypto library provides many functions to handle different operations in the password management system.</p>
      <ul>
        <li><b>generate_key_from_password(password: bytes) -&gt; Fernet:</b> This function creates a Fernet key from the user's password to ensure secure encryption options.</li>
        <li><b>class Passwd(filename: str, key: bytes) -&gt; None:</b> This is the main class for interacting with the password manager. It initializes the manager, reads and writes encrypted passwords, and encrypts sensitive text.
          <ul>
            <li><b>filename (str):</b> The name of the file to store encrypted passwords.</li>
            <li><b>key (bytes):</b> The Fernet key used for encryption and decryption.</li>
          </ul>
        </li>
        <li><b>getEncryptedPasswds() -&gt; list[bytes]:</b> Retrieves encrypted passwords from the file.</li>
        <li><b>read() -&gt; list[list[str]]:</b> Decrypts the stored passwords and returns them in a structured format.</li>
        <li><b>encrypt(text: str) -&gt; bytes:</b> Encrypts a given text.</li>
        <li><b>write(app: str, email: str, password: str) -&gt; None:</b> Adds new password entries to the file.
          <ul>
            <li><b>app (str):</b> Application or service name.</li>
            <li><b>email (str):</b> Email address used for the service.</li>
            <li><b>password (str):</b> The password for the specified service.</li>
          </ul>
        </li>
      </ul>
      
      <h2>Initialization</h2>
      <p>Before using PasswordCrypto, let’s initialize the password manager by setting a master password, which will be used to encrypt and decrypt the stored passwords. We will import the passwordcrypto library, take the master password as input, convert it to bytes, and specify a filename where passwords will be stored. Finally, we'll initialize the password manager.</p>
      <pre><code>import passwordcrypto
      
      password = bytes(input("Enter your master password: ").encode("utf-8"))
      filename = 'my_passwords.txt'
      
      password_manager = passwordcrypto.Passwd(filename, password)</code></pre>
      <p><b>OUTPUT:</b></p>
      <pre><code>Enter your master password: adil2002</code></pre>
      
      <h2>Writing Passwords</h2>
      <p>The first functionality is to securely store website login credentials. Define the website name, email address, and password, then use the <code>write()</code> function of the initialized password manager.</p>
      <pre><code># Storing a new password for a website
      website_name = 'Geeksforgeeks'
      email_address = 'adil.m.naib@gmail.com'
      user_password = 'EnterYourSecurePassword!'
      
      password_manager.write(website_name, email_address, user_password)
      print("New Geeksforgeeks password stored successfully.")
      
      
      # Storing a new password for a website
      website_name = 'Facebook'
      email_address = 'adil.m.naib@gmail.com'
      user_password = 'FacebookSecurePassword!'
      
      password_manager.write(website_name, email_address, user_password)
      print("New Facebook password stored successfully.")</code></pre>
      <p><b>OUTPUT:</b></p>
      <pre><code>New Geeksforgeeks password stored successfully.
      New Facebook password stored successfully.</code></pre>
      
      <h2>Reading Passwords</h2>
      <p>You can view the saved passwords using the <code>read()</code> function, which returns all stored entries. Iterate through these entries to display the website, email, and password.</p>
      <pre><code>password_entries = password_manager.read()
      
      print("Stored Website Credentials:")
      for entry in password_entries:
          print(f"Website: {entry[0]}, Email: {entry[1]}, Password: {entry[2]}")</code></pre>
      <p><b>OUTPUT:</b></p>
      <pre><code>Stored Website Credentials:
      Website: Geeksforgeeks, Email: adil.m.naib@gmail.com, Password: EnterYourSecurePassword!
      Website: Facebook, Email: adil.m.naib@gmail.com, Password: FacebookSecurePassword!</code></pre>
      
      <h2>Encrypt Text</h2>
      <p>Besides storing passwords, PasswordCrypto also allows encrypting sensitive personal text, such as API keys or private notes, using the <code>encrypt()</code> function.</p>
      <pre><code>text_to_encrypt = 'My secure note for Facebook login.'
      encrypted_text = password_manager.encrypt(text_to_encrypt)
      
      print(f"Encrypted note: {encrypted_text}")</code></pre>
      <p><b>OUTPUT:</b></p>
      <pre><code>Encrypted note: b'gAAAAABmxuN0IvVQCHTyEFo0FWTcFBpvSEi5WsjpRYX4nccHFGRv4HqPS74X1KHXoOtS3OG6WPWURt76Hzgf7xQG-TmQcIchgswjgskKfJD_gCiOGmlrUgYkgqCM46B-d6eZ1uu-DMMv'</code></pre>

    `,
  },
  {
    slug: 'corporate-and-personal-firewalls',
    title: 'How do Corporate and Personal Firewalls work?',
    category: '', 
    tags: ['Firewall', 'Network Security'],
    author: authors[0], 
    publishDate: new Date('2025-05-17T00:00:00Z'),
    readingTime: '4 min read',
    heroImageUrl: getAppwriteImageUrl('Firewall.png'),
    excerpt: 'Firewalls are essential for securing corporate networks from internet threats by acting as a barrier that monitors and controls incoming and outgoing traffic based on predefined security rules.',
    content: `
      <h1>Securing Corporate Networks with Firewalls</h1>
      <p>Every computer that is connected to the internet, especially those that are connected to a high-speed cable modem or DSL modem will have potential danger from hackers. Even every corporate network connected to the internet is vulnerable to attack due to the internet’s openness. Hackers can break into corporate networks and can cause many problems like stealing or damaging important data, using corporate resources etc. To avoid this problem we can’t just turn off the internet, hence we can use firewalls to protect the corporate network.</p>
      <p>Norton</p>

      <h2>What are Firewalls?</h2>
      <p>Firewalls are a combination of hardware and software components that are built using servers, routers, and a variety of software. Firewalls act as a connection between a corporate network and the internet. Firewalls work by monitoring incoming and outgoing traffic based on a predefined set of security rules. Firewalls protect corporate networks from hackers by restricting unauthorized access to the network while allowing authorized communication to pass. Firewalls are important for securing both corporate and personal networks.</p>
      <p>Some of the simplest kind of firewalls uses packet filtering. In packet filtering, there is a screening router that examines the header of every packet of data travelling between the internet and the corporate network. Using this the firewalls can restrict certain packets from being transferred from the internet to the corporate network. For example, we can block any traffic except for mail, and it can restrict traffic to and from suspicious websites or users.</p>

      <h2>How do Corporate Firewalls work?</h2>
      <p>Whenever an employee wants to access the internet on the corporate network inside the firewall, the data must pass through a choke router. This router ensures that all data packets travelling between the corporate network and the internet are authorized. The router examines the packet headers to extract important information, such as the protocol being used, the source and destination addresses, and other identification details.</p>
      <p>As discussed, based on the information from the headers of the packets, the screening router allows specific packets to pass. Not only that, the choke router can restrict traffic to and from specific locations. System administrators can set these rules that determine which packets to allow and which to block.</p>
      <p>One of the ports from the choke router is connected to a Bastion Host. This host serves as the main point of contact for incoming connections from the internet for services like receiving mail and providing access to the company’s FTP site. The Bastion Host can be replaced with proxy servers, which process requests from the corporate network to the internet, such as browsing and downloading. This Bastion Host is a heavily protected server with many built-in security provisions.</p>
      <p>The Bastion Host is placed in a perimeter network, also known as a demilitarized zone (DMZ), within the firewall, rather than on the corporate network itself. This placement is crucial for the safety of the corporate network, as it prevents potential hackers from gaining access to all computers in the network if the Bastion Host is compromised.</p>
      <p>The last component is the access router which is positioned between the perimeter network and the internet. This router adds an extra level of security by checking packets based on the same rules as the internal screening system.</p>

      <h2>Conclusion</h2>
      <p>In conclusion, firewalls are important for securing corporate networks from threats and unauthorized access. As they are the barrier between the trusted internal network and the untrusted external network, they help prevent malicious attacks from entering into untrusted external network. The firewalls use techniques like packet filtering and components like choke routers, and perimeter networks to ensure that only authorized traffic is allowed.</p>
      <p>Although firewalls are highly effective in safeguarding corporate networks, additional solutions can further enhance network security. Combining firewalls with other measures, such as intrusion detection systems and regular security assessments, provides comprehensive protection. Continuous monitoring is essential, and system administrators should regularly update security rules. Additionally, educating employees about safe internet practices is crucial for maintaining overall security.</p>  
    `,
  },
  {
    slug: 'google-imagen-3-002',
    title: "Google's Imagen 3.0-002 Can Now Create Realistic People and Accurate In-Image Text",
    category: 'ai-tools-review',
    tags: ['Google AI', 'Text-to-Image', 'Generative AI', 'AI Art', 'imagen-3.0-generate-002', 'Realistic People AI', 'Text in Image AI'],
    author: authors[0], 
    publishDate: new Date('2025-05-19T00:00:00Z'),
    readingTime: '6 min read',
    heroImageUrl: getAppwriteImageUrl('hero.png'),
    excerpt: "Google's latest AI model, Imagen 3 (imagen-3.0-generate-002), now generates strikingly realistic humans and renders accurate text directly within images. Discover its capabilities, how to access it, and potential uses.",
    content: `
       
        <h2>What is Imagen 3.0 002 Model?</h2>
        <p>The <b><code>imagen-3.0-generate-002</code> model</b> (often referred to as part of the Imagen 3 family) is Google's latest and most advanced foundation model for text-to-image generation. It's designed to understand natural language prompts with greater nuance and produce high-quality, photorealistic, and artistically diverse images.</p>
        <p>
        Imagen 3 aims to:<br>
        </p>
        <ul>
          <li>Generate images with unprecedented detail and realism.</li>
          <li>Understand long and complex user prompts more accurately.</li>
          <li>Render text within images more reliably.</li>
          <li>Produce fewer distracting artifacts compared to previous generations.</li>
          <li>Offer a range of artistic styles and creative outputs.</li>
        </ul>
        <p>
        It's available through Google Cloud's Vertex AI platform and the Gemini API, and can also be experimented with via Google AI Studio, providing different avenues for users with varying needs.
        </p>
  
        <h2>How to Access and Use Imagen 3.0 002 model for free?</h2>
        <p>You have a couple of primary ways to get your hands on Imagen 3, one of which offers a free tier to get started:</p>
  
        <h3>1. Using Google AI Studio (Free Limited Quota)</h3>
        <ul>
            <li><strong>What it is:</strong> Google AI Studio provides a web-based interface to quickly prototype and experiment with Google's generative AI models, including Imagen 3.</li>
            <li><strong>Cost:</strong> It typically offers a free quota, making it an excellent way to try out <code>imagen-3.0-generate-002</code> without initial financial commitment. This is perfect for initial tests and exploring its capabilities.</li>
            <li><strong>How to access:</strong> Visit the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer"><strong>Google AI Studio</strong></a> website and sign in with your Google account. You can then select the Imagen model to start generating images.</li>
            <li><strong>Limitations:</strong> The free quota will have limits on the number of requests you can make. For more extensive use, you'll need to consider Vertex AI.</li>
        </ul>
  
        <h3>2. Vertex AI (Google Cloud Console)</h3>
        <ul>
            <li><strong>What it is:</strong> Vertex AI is Google Cloud's unified machine learning platform. It provides robust tools for developers and enterprises to build, deploy, and manage ML models at scale, including Imagen 3.</li>
            <li><strong>Cost & Setup:</strong>
                <ol>
                    <li><strong>Need to create a project:</strong> You'll first need a Google Cloud Platform (GCP) project.</li>
                    <li><strong>Need to enable billing:</strong> While GCP has a free tier for many services, using advanced models like Imagen 3 on Vertex AI will incur costs based on usage. You must enable billing for your project.
                        <ul><li><strong>Check pricing:</strong> Always refer to the official pricing page for the most up-to-date information: <a href="https://cloud.google.com/vertex-ai/pricing#generative_ai_models" target="_blank" rel="noopener noreferrer"><strong>Vertex AI Pricing - Generative AI Models</strong></a></li></ul>
                    </li>
                </ol>
            </li>
            <li><strong>Additional Features (Why consider Vertex AI over the free AI Studio quota?):</strong>
                <ul>
                    <li><strong>Refined Prompt Generation:</strong> Vertex AI can offer tools to help you refine your prompts, potentially suggesting improvements or variations to get better results from Imagen 3.
                        <figure class="my-6">
                            <img src="${getOptimizedHtmlImageUrl('prompt.png')}" alt="Vertex AI prompt refinement feature for Imagen 3" loading="lazy" class="block max-w-xl w-full h-auto mx-auto rounded-md shadow-lg object-contain" data-ai-hint="AI prompt">
                        </figure>
                    </li>
                    <li><strong>High-Quality Export Options & More Control:</strong> Vertex AI often provides more granular control over generation parameters and options for exporting images at very high quality, suitable for professional use cases.
                        <figure class="my-6">
                            <img src="${getOptimizedHtmlImageUrl('export.png')}" alt="Vertex AI high-quality export options for Imagen 3" loading="lazy" class="block max-w-xl w-full h-auto mx-auto rounded-md shadow-lg object-contain" data-ai-hint="AI export">
                        </figure>
                        <br>
                        <strong>Output:</strong>
                        <br>
                        <figure class="my-6">
                            <img src="${getOptimizedHtmlImageUrl('Output3.png')}" alt="Output" loading="lazy" class="block max-w-xl w-full h-auto mx-auto rounded-md shadow-lg object-contain" data-ai-hint="AI output">
                        </figure>
                    </li><br>
                    <li><strong>API Access:</strong> For programmatic use and integration into applications, Vertex AI provides API access to Imagen 3.</li>
                    <li><strong>Project Approval for Certain Features:</strong> As discussed, for sensitive generations like images of children, going through project review and approval on Vertex AI might be the necessary pathway.</li>
                </ul>
            </li>
        </ul>
  
        <h2>Key Features & Improvements with examples</h2>
        <p>Imagen 3 (<code>imagen-3.0-generate-002</code>) brings several enhancements to the table:</p>
        <table>
          <thead>
              <tr>
                  <th>Feature</th>
                  <th>Details</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td><strong>Image ratios and resolutions</strong></td>
                  <td style="text-align: center;">• <strong>1:1:</strong> 1024x1024<br>• <strong>3:4:</strong> 896x1280<br>• <strong>4:3:</strong> 1280x896<br>• <strong>9:16:</strong> 768x1408<br>• <strong>16:9:</strong> 1408x768</td>
              </tr>
              <tr>
                  <td><strong>Prompt languages</strong></td>
                  <td style="text-align: center;">• English<br>• Chinese (simplified) <em>preview</em><br>• Chinese (traditional) <em>preview</em><br>• Hindi <em>preview</em><br>• Japanese <em>preview</em><br>• Korean <em>preview</em><br>• Portuguese <em>preview</em><br>• Spanish <em>preview</em></td>
              </tr>
          </tbody>
      </table>
  
        <h3>Examples</h3>
        <h4>1. Image generation with humans in them:</h4>
        <ul>
            <li><strong>Prompt:</strong> <code>Generate an image of children playing football.</code></li>
            <li><strong>Result:</strong>
                <figure class="my-6">
                    <img src="${getOptimizedHtmlImageUrl('Output1.png')}" loading="lazy" alt="Imagen 3 generated image of children playing football" class="block max-w-xl w-full h-auto mx-auto rounded-md shadow-lg object-contain" data-ai-hint="children football">
                </figure>
            </li>
            <li><strong>Note:</strong> As discussed, Imagen 3 excels at rendering humans. However, generating images of children often requires explicit consent, project approval within Google Cloud, or specific parameter settings (like ensuring <code>person_generation</code> is not set to <code>BLOCK_CHILD</code> or <code>ALLOW_ADULT_ONLY</code> if that's the default for your access point). Always adhere to Google's responsible AI guidelines. The realism for adult figures is also a significant step up.</li>
        </ul>
  
        <h4>2. Text in generated images:</h4>
        <ul>
            <li><strong>Prompt:</strong> <code>A cutout browser page with paddings on all sides, featuring a search bar displaying 'BagOfWords' and a link at the top reading 'BagOfWords.tech', modern design, clean layout, smooth edges</code></li>
            <li><strong>Result:</strong>
                <figure class="my-6">
                    <img src="${getOptimizedHtmlImageUrl('Output2.png')}" loading="lazy" alt="Imagen 3 generated image with text 'BagOfWords' and 'BagOfWords.tech'" class="block max-w-xl w-full h-auto mx-auto rounded-md shadow-lg object-contain" data-ai-hint="AI webpage">
                </figure>
            </li>
            <li><strong>Note:</strong> Notice the clarity and accuracy of the text "BagOfWords" and "BagOfWords.tech". This is a notable improvement, making Imagen 3 useful for creating visuals that require specific text overlays or branding.</li>
        </ul>
  
        <p>Other key improvements generally include:</p>
        <ul>
            <li><strong>Enhanced Photorealism:</strong> Images tend to have better lighting, textures, and fewer uncanny artifacts.</li>
            <li><strong>Better Prompt Adherence:</strong> The model is more adept at understanding complex, detailed prompts and translating those details into the final image.</li>
            <li><strong>Diverse Styles:</strong> While photorealism is a strength, it can also generate images in various artistic styles.</li>
        </ul>
  
        <h2>Potential Use Cases & Applications</h2>
        <p>The capabilities of Imagen 3 open up a vast range of applications:</p>
        <ul>
            <li><strong>Marketing & Advertising:</strong> Creating unique ad creatives, social media visuals, and product mockups with specific branding and even people (adhering to guidelines).</li>
            <li><strong>Content Creation:</strong> Generating compelling blog post headers, presentation slides, and illustrations for articles.</li>
            <li><strong>Art & Design:</strong> Rapidly prototyping artistic concepts, generating character designs, and exploring new visual styles.</li>
            <li><strong>Education & Training:</strong> Creating custom visuals for educational materials.</li>
            <li><strong>Personalization:</strong> Designing personalized avatars, cards, or scenes.</li>
            <li><strong>Storyboarding & Prototyping:</strong> Visualizing scenes for films, games, or user interfaces.</li>
        </ul>
  
        <h2>Limits</h2>
        <p>It's important to be aware of the usage limits, especially when using the API via Vertex AI. These limits are typically in place to ensure fair usage and system stability.</p>
        <table>
          <thead>
              <tr>
                  <th>Limit Type</th>
                  <th>Value</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td><strong>Maximum API requests per minute per project</strong></td>
                  <td style="text-align: center;">20</td>
              </tr>
              <tr>
                  <td><strong>Maximum images returned per request (text-to-image)</strong></td>
                  <td style="text-align: center;">4</td>
              </tr>
              <tr>
                  <td><strong>Maximum image size uploaded/sent in request (MB)</strong></td>
                  <td style="text-align: center;">10 MB</td>
              </tr>
              <tr>
                  <td><strong>Maximum input tokens (text-to-image prompt text)</strong></td>
                  <td style="text-align: center;">480 tokens</td>
              </tr>
          </tbody>
      </table>
        <p><em>Source and more details: <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/models/imagen/3-0-generate-002" target="_blank" rel="noopener noreferrer"><strong>Imagen 3.0 generate 002 Documentation</strong></a></em></p>
  
        <h2>My Early Thoughts & Review</h2>
        <p>Having experimented with Imagen 3 (<code>imagen-3.0-generate-002</code>), my initial impressions are overwhelmingly positive.</p>
        <ul>
            <li><strong>The Realism of People:</strong> The ability to generate human figures, particularly adults, with such a high degree of realism is genuinely impressive. Details in faces, clothing, and natural poses are often rendered convincingly. While the generation of children requires careful consideration and adherence to Google's approval processes, the underlying capability is clearly powerful.</li>
            <li><strong>Text Generation is a Game-Changer:</strong> The improved accuracy in rendering text within images is a standout feature. This has been a significant pain point for many text-to-image models, and Imagen 3 makes substantial strides here.</li>
            <li><strong>Prompt Understanding:</strong> I found it to be quite responsive to nuanced prompts, capturing more details than I've experienced with some older models.</li>
            <li><strong>Image Quality:</strong> The overall image quality is high, with rich colors, good lighting dynamics, and fewer of the strange artifacts that can plague AI-generated images.</li>
        </ul>
        <p>While the API limits are something to be mindful of for heavy usage, and the specific procedures for generating images of children add a layer of necessary responsibility, the creative potential unlocked by Imagen 3 is immense. The ability to access it initially via Google AI Studio's free tier is a fantastic way for anyone to get a taste of its power before committing to a more robust Vertex AI setup.</p>
        <p>Imagen 3 feels like a significant step forward, and I'm excited to see the incredible and responsible ways creators will leverage its capabilities!</p>
      `
  },
  {
    slug: 'PyRegExp', // This will no longer be a featured article
    title: 'PyRegExp: A Comprehensive Guide to Python Regular Expressions',
    category: 'nlp',
    tags: ['Python', 'Regular Expressions'],
    author: authors[0], 
    publishDate: new Date('2025-05-17T00:00:00Z'), // Older date
    readingTime: '7 min read',
    heroImageUrl: getAppwriteImageUrl('PyRegExp.png'),
    excerpt: 'PyRegExp is a Python library designed to simplify regular expression usage, enabling users to efficiently identify and extract specific string patterns crucial for data analysis.',
    content: `
      <h1>PyRegExp: Simplifying Regular Expressions in Python</h1>
      <p>PyRegExp is a Python library that simplifies the use of regular expressions in Python. We can use this library to identify and extract specific strings from a text, such as particular patterns of characters. This process of extracting specific information from large datasets is essential in data analysis and text preprocessing.</p>
      <p>In this article, we will explore all the functions provided by the PyRegExp Python library. One of the main reasons PyRegExp stands out as an excellent choice for regular expressions is its comprehensive feature set, which covers all common regex operations. Below is a table summarizing some of the main features and their corresponding syntax:</p>
      

      <h2>Installation</h2>
      <p>To install PyRegExp, simply run the below command in your terminal:</p>
      <pre><code>pip install pyregexp</code></pre>

      <h2>Match Start and End</h2>
      <p>We can use PyRegExp to match the start and end of a string, which is fundamental in regex operations. The library provides straight forward syntax for these operations, making it easy to check if a string begins or ends with specific patterns.</p>
      <p>Now let’s implement this. We will use the <code>RegexEngine</code> from the <code>pyregexp</code> library to match patterns in strings. We will start by creating an object of <code>RegexEngine()</code>. Then, we will define two patterns: one to check if the string starts with ‘hello’ and another to check if the string ends with ‘world’. We will use the <code>match()</code> method to apply these patterns to the text “hello world” and print the results.</p>
      <pre><code>from pyregexp.engine import RegexEngine
      reng = RegexEngine()
      
      # Pattern to match if the string starts with 'hello'
      result = reng.match('^hello', 'hello world')
      print(result)
      
      # Pattern to match if the string ends with 'world'
      result1 = reng.match('world$', 'hello world')
      print(result1)
      
      OUTPUT:
      
      (True, 5)
      
      (True, 11)</code></pre>
      
            <h2>Matching with Wildcards</h2>
            <p>We can use wildcards in regular expressions to add flexibility when matching patterns. The dot (<code>.</code>) character acts as a wildcard that matches any single character except a newline. This feature is useful when we need to match patterns with unknown characters in specific positions.</p>
            <p>Let’s implement this using the <code>RegexEngine</code> to match a pattern where any single character is followed by ‘bc’. We will define the pattern <code>a.bc</code>, which specifies that the string should start with ‘a’, followed by any character, and then ‘bc’. We will apply this pattern to the text “axbc” using the <code>match()</code> method and print the result.</p>
            <pre><code># Pattern to match any single character followed by 'bc'
      result = reng.match('a.bc', 'axbc')
      print(result)
      
      OUTPUT:
      
      (True, 4)</code></pre>
      
            <h2>Grouping and Quantifiers</h2>
            <p>We can use grouping and quantifiers in regular expressions to match repeated patterns or apply quantifiers to specific parts of a pattern. Grouping is done using parentheses <code>()</code>, while quantifiers like <code>+</code>, <code>*</code>, and <code>?</code> specify how many times a pattern should occur.</p>
            <p>Let’s implement this using the <code>RegexEngine</code> to match a pattern where ‘abc’ is repeated one or more times. We will define the pattern <code>(abc)+</code>, where the <code>+</code> quantifier specifies that ‘abc’ must appear at least once, but can repeat multiple times. We will apply this pattern to the text “abcabc” using the <code>match()</code> method and print the result.</p>
            <pre><code># Pattern to match 'abc' repeated one or more times
      result = reng.match('(abc)+', 'abcabc')
      print(result)
      
      OUTPUT:
      
      (True, 6)</code></pre>
      
            <h2>Named Groups</h2>
            <p>We can use named groups in regular expressions to assign names to specific parts of a pattern. This feature is particularly useful when we need to extract multiple pieces of information from a string and prefer referencing them by name rather than position. Named groups make our regex patterns more readable and self-documenting, especially in complex matching scenarios.</p>
            <p>Let’s implement this using the <code>RegexEngine</code> to match a specific pattern and name the matched group as ‘word’. We will define the pattern <code>(?<word>hello)</code>, where <code>(?<word>…)</code> is used to name the group ‘word’ that matches the text ‘hello’. We will apply this pattern to the string “hello” using the <code>match()</code> method and print the result.</p>
            <pre><code># Pattern to match and name the group as 'word'
      result = reng.match('(?<word>hello)', 'hello')
      print(result)
      
      OUTPUT:
      
      (True, 5)</code></pre>
      
            <h2>Alternation in Matching</h2>
            <p>We can use alternation in regular expressions to specify multiple alternative patterns to match. This feature is useful when we want to match one of several possible patterns at a given position in the text. Alternation is achieved using the vertical bar (<code>|</code>) character, which acts as an “OR” operator between different pattern options.</p>
            <p>In this case, we will use the <code>RegexEngine</code> to match a pattern that checks for either ‘cat’ or ‘dog’ in a string. We will define the pattern <code>cat|dog</code>, where the <code>|</code> operator allows matching either ‘cat’ or ‘dog’. We will apply this pattern to the string “dog” using the <code>match()</code> method and print the result.</p>
            <pre><code># Pattern to match either 'cat' or 'dog'
      result = reng.match('cat|dog', 'dog')
      print(result)
      
      OUTPUT:
      
      (True, 3)</code></pre>
      
            <h2>Matching Whitespace Characters</h2>
            <p>We can use regular expressions to match whitespace characters, which is a common requirement in text processing tasks. The <code>\\s</code> metacharacter is particularly useful as it matches any whitespace character, including spaces, tabs, and newlines.</p>
            <p>In this example, we will use the <code>RegexEngine</code> to match a pattern that looks for a whitespace character followed by ‘world’. We will define the pattern <code>\\\\s+world</code>, where <code>\\\\s+</code> matches one or more whitespace characters. We will apply this pattern to the string “ world” using the <code>match()</code> method and print the result.</p>
            <pre><code># Pattern to match a whitespace character followed by 'world'
      result = reng.match('\\s+world', '  world')
      print(result)
      
      OUTPUT:
      
      (True, 7)</code></pre>
      
            <h2>Matching a Range of Characters</h2>
            <p>We can use regular expressions to match a range of characters, which allows us to specify a set or range of characters to match at a particular position. This is done using square brackets <code>[]</code> to define a character class. Character ranges are particularly useful when we want to match any character within a specific set, such as all lowercase letters or digits.</p>
            <p>In this case, we will use the <code>RegexEngine</code> to match a pattern that checks for any lowercase letter or digit from 0 to 9. We will define the pattern <code>[a-z0-9]</code>, where <code>[a-z]</code> matches any lowercase letter and <code>[0-9]</code> (corrected from 0–9) matches any digit. We will apply this pattern to the string “A” using the <code>match()</code> method and print the result.</p>
            <pre><code># Pattern to match any lowercase letter or digit from 0 to 9
      result = reng.match('[a-z0-9]', 'A')
      print(result)
      
      OUTPUT:
      
      (False, 0)</code></pre>
      
            <h2>Curly Brace Quantification</h2>
            <p>We can use curly brace quantification in regular expressions to specify exact counts or ranges for pattern repetitions. This feature gives us precise control over how many times a pattern should occur, which is especially useful when dealing with matching patterns with specific length requirements.</p>
            <p>In this case, we will use the <code>RegexEngine</code> to match patterns based on the number of occurrences of the letter ‘a’. First, we will define the pattern <code>a{3}</code>, which matches exactly 3 consecutive occurrences of the letter ‘a’. We will apply this pattern to the string “aaa” using the <code>match()</code> method and print the result.</p>
            <p>Next, we will define the pattern <code>a{2,4}</code>, which matches between 2 and 4 consecutive occurrences of the letter ‘a’. We will apply this pattern to the same string “a” and print the result.</p>
            <pre><code># Pattern to match exactly 3 occurrences of the letter 'a'
      result = reng.match('a{3}', 'aaa')
      print(result)
      
      # Pattern to match between 2 to 4 occurrences of the letter 'a'
      result1 = reng.match('a{2,4}', 'a')
      print(result1)
      
      OUTPUT:
      
      (True, 3)
      
      (False, 0)</code></pre>
      `,
  },
];

// Update image URLs in comments to use placehold.co
export const comments: Comment[] = [
  {
    id: 'c1',
    articleSlug: 'understanding-neural-networks', 
    author: authors[1], 
    content: 'Great overview! Really helped clarify the basics for me.',
    timestamp: new Date('2024-07-16T10:00:00Z'),
    upvotes: 15,
    downvotes: 1,
  },
  {
    id: 'c2',
    articleSlug: 'understanding-neural-networks', 
    author: { id: '3', name: 'Jane Doe', avatarUrl: 'https://placehold.co/100x100.png' },
    content: 'Thanks for the code snippet. Could you explain the activation function choice a bit more?',
    timestamp: new Date('2024-07-16T11:30:00Z'),
    upvotes: 8,
    downvotes: 0,
    replies: [
      {
        id: 'c2_r1',
        articleSlug: 'understanding-neural-networks', 
        author: authors[0], 
        content: 'Good question! The step function is a very simple one for illustration. Modern networks often use ReLU or Sigmoid. I plan to cover those in a follow-up!',
        timestamp: new Date('2024-07-16T12:00:00Z'),
        upvotes: 5,
        downvotes: 0,
      }
    ]
  },
  {
    id: 'c3',
    articleSlug: 'getting-started-with-nlp', 
    author: { id: '4', name: 'AI Enthusiast', avatarUrl: 'https://placehold.co/100x100.png' },
    content: 'NLP is fascinating! Looking forward to more articles on Transformers.',
    timestamp: new Date('2024-07-21T08:15:00Z'),
    upvotes: 12,
    downvotes: 0,
  },
  {
    id: 'c4',
    articleSlug: 'understanding-neural-networks', 
    author: { id: 'currentUser', name: 'AI Reader', avatarUrl: 'https://placehold.co/100x100.png' },
    content: 'This is a fantastic introduction!',
    timestamp: new Date('2024-07-22T10:00:00Z'),
    upvotes: 5,
    downvotes: 0,
    replies: [],
  }
];

// Helper functions to get data
export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((article) => article.slug === slug);

export const getCommentsByArticleSlug = (slug: string): Comment[] =>
  comments.filter((comment) => comment.articleSlug === slug && !comment.replies?.find(r => r.id === comment.id)); 

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((category) => category.slug === slug);
  
export const getAuthorById = (id: string): Author | undefined =>
  authors.find((author) => author.id === id);

    




