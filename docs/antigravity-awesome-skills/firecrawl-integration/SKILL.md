---
name: firecrawl-integration
description: "Integrate Firecrawl web crawler and scraper into full-stack applications (NestJS/Node.js) for AI Chatbots, RAG (Retrieval-Augmented Generation), and web data extraction."
category: development
risk: safe
source: custom
date_added: "2026-06-03"
---

# Firecrawl Integration Skill

Integrate the Firecrawl web crawling and scraping API into full-stack applications (NestJS/Node.js) to convert dynamic websites into clean Markdown or structured JSON, enabling LLM-powered Chatbots and RAG pipelines.

## When to Use This Skill

- User asks to "build an AI chatbot that reads external websites"
- Setting up a RAG (Retrieval-Augmented Generation) pipeline from web URLs
- Scraping dynamic, JavaScript-heavy pages into clean Markdown or JSON
- Bypassing scraping obstacles like rate limits, proxies, dynamic DOMs, or Cloudflare

## Setup

Use the official Node.js SDK:

```bash
# Install the Firecrawl JS SDK
yarn add @mendable/firecrawl-js
# or
npm install @mendable/firecrawl-js
```

Ensure the environment variable `FIRECRAWL_API_KEY` is configured in your `.env` file. If self-hosting, also configure `FIRECRAWL_API_URL`.

---

## NestJS Implementation Example

### 1. Firecrawl Service

Create a dedicated NestJS Service to handle client initialization and scraping operations.

```typescript
// api/src/modules/ai/services/firecrawl.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import FirecrawlApp from '@mendable/firecrawl-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirecrawlService {
  private readonly logger = new Logger(FirecrawlService.name);
  private firecrawl: FirecrawlApp;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('FIRECRAWL_API_KEY');
    const apiUrl = this.configService.get<string>('FIRECRAWL_API_URL'); // Optional if self-hosting

    if (!apiKey) {
      this.logger.warn('FIRECRAWL_API_KEY is not defined in the environment variables.');
    }

    this.firecrawl = new FirecrawlApp({
      apiKey: apiKey || '',
      apiUrl: apiUrl || undefined,
    });
  }

  /**
   * Scrapes a single URL and converts its content into clean Markdown.
   * Useful for instantly retrieving page content for a Chatbot.
   */
  async scrapeUrl(url: string): Promise<string> {
    try {
      this.logger.log(`Scraping URL: ${url}`);
      const response = await this.firecrawl.scrapeUrl(url, {
        formats: ['markdown'],
      });

      if (!response.success) {
        throw new Error(response.error || 'Unknown error occurred during scraping');
      }

      return response.markdown || '';
    } catch (error) {
      this.logger.error(`Failed to scrape URL ${url}: ${error.message}`);
      throw new HttpException(
        `Scraping failed: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Scrapes a URL and extracts structured data based on a JSON Schema.
   * Extremely useful for turning a website into standard objects.
   */
  async extractStructuredData<T>(url: string, schema: any): Promise<T> {
    try {
      this.logger.log(`Extracting structured data from URL: ${url}`);
      const response = await this.firecrawl.scrapeUrl(url, {
        formats: ['json'],
        jsonOptions: {
          schema: schema, // Zod schema or JSON Schema format
        },
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed structured extraction');
      }

      return response.json as T;
    } catch (error) {
      this.logger.error(`Failed structured extraction on URL ${url}: ${error.message}`);
      throw new HttpException(
        `Structured extraction failed: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Crawls a website recursively and returns a job ID to poll.
   * Useful for bulk-indexing a documentation site or knowledge base.
   */
  async startCrawl(url: string, limit = 100): Promise<string> {
    try {
      this.logger.log(`Starting crawl for URL: ${url} (limit: ${limit})`);
      const response = await this.firecrawl.crawlUrl(url, {
        limit: limit,
        scrapeOptions: {
          formats: ['markdown'],
        },
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to start crawl');
      }

      return response.id;
    } catch (error) {
      this.logger.error(`Failed to start crawl on ${url}: ${error.message}`);
      throw new HttpException(
        `Crawling failed: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Polls the status of an active crawl job.
   */
  async getCrawlStatus(jobId: string) {
    try {
      return await this.firecrawl.checkCrawlStatus(jobId);
    } catch (error) {
      this.logger.error(`Failed to check crawl status for job ${jobId}: ${error.message}`);
      throw new HttpException(
        `Failed to retrieve crawl status: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
```

### 2. Integration with a Chatbot Controller

Provide an endpoint where the chatbot can fetch context on-the-fly from a URL provided by a user.

```typescript
// api/src/modules/ai/controllers/chatbot.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FirecrawlService } from '../services/firecrawl.service';
import { OpenAIResponseService } from '../services/openai.service'; // Example LLM service

@Controller('api/chatbot')
export class ChatbotController {
  constructor(
    private readonly firecrawlService: FirecrawlService,
    private readonly aiService: OpenAIResponseService,
  ) {}

  @Post('query-with-url')
  async queryWithUrl(
    @Body('message') message: string,
    @Body('url') url?: string,
  ) {
    let context = '';

    if (url) {
      // Fetch fresh, clean markdown from the URL to feed to the LLM
      context = await this.firecrawlService.scrapeUrl(url);
    }

    // Call LLM with the context and the user's message
    const prompt = `
Context from Webpage:
---
${context}
---

User Message: ${message}

Instructions: Answer the user's message using the provided context. If the webpage context is empty or irrelevant, answer to the best of your knowledge but mention that the URL content could not be read or didn't contain relevant info.
`;

    const reply = await this.aiService.generateText(prompt);

    return {
      success: true,
      reply,
    };
  }
}
```

---

## Best Practices

### 1. Implement Caching
Web scraping takes several seconds. Avoid scraping the same URL repeatedly by caching the resulting markdown (e.g., using Redis) for a few hours:
```typescript
const cacheKey = `scrape:${url}`;
const cached = await this.redis.get(cacheKey);
if (cached) return cached;
// Scrape and cache
const result = await this.firecrawlService.scrapeUrl(url);
await this.redis.set(cacheKey, result, 'EX', 3600 * 6); // Cache for 6 hours
```

### 2. Context Window Safeguards
Very large websites can generate massive Markdown dumps. Make sure to truncate or summarize the crawled content if it exceeds the token limit of the target LLM context window (e.g., limit to the first 10,000 characters or run a chunk-ranking pass).

### 3. Handle Anti-Bot Warnings
Firecrawl automatically manages proxies and bypassing, but if a site returns empty or blocked states, fallback gracefully and inform the user that the site has strict scraping protections or requires manual interaction parameters.

## Related Skills

- `api-endpoint-builder` — For creating endpoints
- `performance-optimizer` — For caching and rate limiting
- `logic-lens` — For structured extraction schema design
