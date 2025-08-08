# Research Extractor

## Get insights from research papers using [LlamaExtract](https://cloud.llamaindex.ai)

Research Extractor is an application powered by [NextJS](https://nextjs.org) and [LlamaCloud](https://cloud.llamaindex.ai) aimed at making your studying and research easier by extracting key insights from research papers for you, in an elegant and copy-pasteable markdown format.

### Install and Launch

Clone the GitHub repostory:

```bash
git clone https://github.com/run-llama/research-extractor
cd research-extractor
```

Install all the needed dependencies:

```bash
npm install
```

Export the `LLAMA_CLOUD_API_KEY` env variable:

```bash
export LLAMA_CLOUD_API_KEY="llx-***"
```

Or store it into an `.env` file:

```env
LLAMA_CLOUD_API_KEY="llx-***"
```

And now you are ready to launch the development app:

```bash
npm run dev
```

And start interacting with the app at http://localhost:3000

### Deploy

You can fork this repository and deploy the application on [Vercel](https://vercel.com) with one click!

### License

This application is provided under a [MIT license](LICENSE).
