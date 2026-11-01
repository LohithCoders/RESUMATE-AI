# Resumate AI

A responsive, browser-based career intelligence prototype for comparing a resume with a target role. This project uses React, TypeScript and Vite as a lightweight alternative to a Next.js scaffold in this empty workspace.

## Run locally

1. Install Node.js 20 or newer and use a network connection for npm packages on the first setup.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.
4. Run `npm run build` to create a production bundle in `dist/`.

No API key, account service, or paid model is required.

## Demo AI mode

The product labels all analysis as demo-generated. The local engine normalizes text, extracts skills using a small transparent dictionary, scores skills coverage and keyword overlap, and creates recommendations based on visible evidence. It does **not** run Sentence-BERT, a transformer, or a generative model. The displayed score is an application-specific relevance signal, not an official ATS score or hiring probability.

The matching pipeline is isolated in `src/lib/engine.ts`. A future service can replace its deterministic `analyze()` implementation behind the same `AnalysisResult` shape. Keep credentials on a server; never embed AI keys in client code.

## Resume files and privacy

PDF text is extracted with PDF.js, and DOCX text with Mammoth, in the browser. TXT is supported as a fallback. The file limit is 10 MB. Uploaded text, history, preferences and the studio draft may be saved to this browser's local storage. They are not sent to a server by this prototype. Use Settings → Clear all data to remove workspace content. Browser storage is not encrypted; avoid using sensitive production documents on a shared device.

If PDF.js cannot fetch its worker in an offline environment, the app presents a useful error and accepts pasted/TXT text instead. The PDF worker is loaded from a version-pinned CDN at runtime.

## Included workflows

- Landing page, demo login and registration
- Overview dashboard and local analysis history
- Resume upload, role examples, configuration and animated processing
- Results with match score, evidence-based skill groups, radar breakdown, keywords and recommendations
- Editable resume studio with conservative rewrite actions, local text download and print-to-PDF guidance
- Resume library, search and score filters, light/dark appearance settings, notifications and data reset

All sample data is illustrative. Demo authentication does not create a real account. “Continue with Google” is a labeled demo interaction.
