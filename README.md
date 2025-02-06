# Copilot RAG

Load external content to feed GitHub Copilot with relevant context.

**This extension is a very early prototype: it just downloads a URL locally and opens it in the editor.**

## Commands

- `Copilot RAG: Load a web URL`: Load a web page locally and parse it to feed GitHub Copilot with relevant context.

## Extension Settings

None yet. This extension does NOT require an API key.

## About the project

### Implementing a basic RAG architecture in VS Code

LLM, despite being impressively knowledgeable, are language processing models and thus are meant to be fed with up-to-date text context to provide relevant suggestions.

For example, as of early 2024, GPT-4o won't write a proper Next.js App Router route handler and will stick to an older syntax as shown in the illustration below.

![Incorrect LLM response](https://github.com/lbke/copilot-rag/blob/main/img/badresponse.png?raw=true)

The solution : providing proper context to the model. This idea is usally embodied into the "RAG" architecture.

According to [IBM's definition](https://research.ibm.com/blog/retrieval-augmented-generation-RAG):

*Retrieval-augmented generation (RAG) is an AI framework for improving the quality of LLM-generated responses by grounding the model on external sources of knowledge to supplement the LLM’s internal representation of information.*

Copilot RAG extension is meant at implementing a very basic RAG architecture.

## Roadmap 

Loading a web page is sadly usually not enough to craft a proper prompt. 

This early version doesn't parse text, so don't expect significant improvements for GitHub Copilot suggestions after loading a web page.

Potential improvements on our roadmpa:

- Parse HTML document to exclude irrelevant content
- Parse Shiki generated HTML that makes code difficult to consume
- Split content into chunks with Langchain utilities and add a query layer with SQLite to build a relevant context
- Accept an OpenAI API key to use embeddings for a proper semantic search
- Plug your own vector store
- Load GitHub documentation repositories containing markdown files
- Support well-known documentations that are not open-sourced such as Next.js documentation
- Integrate with GitHub Copilot more directly (this part doesn't depend on us)

##  Alternatives

Copilot RAG aims at mimicking [Cursor]() context loading features such as [@Docs](https://docs.cursor.com/context/@-symbols/@-docs).

[Cline](https://github.com/cline/cline) is another powerful alternative with contextualization features.

Despite existing competition, this extension targets GitHub Copilot as it is provided for free to open source developers.

In order to keep the experience as simple as possible, Copilot RAG does not require any API key and sticks to basic retrieval patterns that do not need a model. Read: we won't use embeddings and vector search.

## Contribute

We use a standard VS Code extension development workflow. 

The debugger allows for testing the extension live.

*Copilot RAG is developed by [LBKE](https://www.lbke.fr/), a French training organization.*
*Copilot RAG is not affiliated with GitHub Copilot or Microsoft Copilot.*

## Release Notes

### 0.0.1

Initial release.

### 0.0.2

- Implemented HTML to markdown conversion, inspired by [Cline's approach](https://github.com/cline/cline).
- Made the loading URL input persistent so users can copy-paste the URL from another place.