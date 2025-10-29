# Social Media Content Factory - User Guide

Welcome to the Social Media Content Factory! This guide will walk you through how to use this powerful AI tool to generate stunning, campaign-ready images and videos for all your social media platforms.

## Table of Contents
1.  [Introduction](#introduction)
2.  [The Main Interface](#the-main-interface)
3.  [Generating Your First Piece of Content](#generating-your-first-piece-of-content)
    *   [Step 1: Choose Your Content Type](#step-1-choose-your-content-type)
    *   [Step 2: Select a Platform](#step-2-select-a-platform)
    *   [Step 3: Provide Your Creative Input](#step-3-provide-your-creative-input)
    *   [Step 4 (Video Only): Add Optional Assets](#step-4-video-only-add-optional-assets)
    *   [Step 5: Generate!](#step-5-generate)
4.  [Video Generation & API Keys](#video-generation--api-keys)
5.  [Previewing, Captioning, and Downloading](#previewing-captioning-and-downloading)
6.  [Streamline Your Workflow: The Suggestions Panel](#streamline-your-workflow-the-suggestions-panel)
7.  [Troubleshooting](#troubleshooting)

---

### Introduction

The Social Media Content Factory is designed to accelerate your creative process. Using powerful AI models like Imagen and Veo, you can turn a simple text prompt into high-quality, perfectly formatted content for platforms like TikTok, YouTube Shorts, Instagram, and more.

**Key Features:**
*   **Image & Video Generation:** Create both static images and dynamic short-form videos.
*   **Automated Text Overlays:** Instantly add headlines, key messages, and calls to action to your visuals, making them ready for "sound-off" viewing.
*   **Platform-Aware:** Automatically uses the correct aspect ratio for your chosen social media platform.
*   **Flexible Creation:** Generate from a text prompt, or guide the AI with starting and ending images for videos.
*   **Scale Your Campaigns:** Quickly repurpose a successful creative idea for all your other platforms with a single click.

### The Main Interface

The application is divided into three main sections:

1.  **Controls Panel (Left):** This is where you define what you want to create. You'll select the content type, platform, write your visual prompt and text overlays, and upload any optional image assets here.
2.  **Preview Panel (Center):** Your generated content will appear here. This area shows loading status, errors, and the final image or video. A download button and other actions will appear below it.
3.  **Suggestions Panel (Right):** This panel helps you scale your content. After you create something you like, this area will suggest creating variations for other platforms.

### Generating Your First Piece of Content

Follow these simple steps to bring your ideas to life.

#### Step 1: Choose Your Content Type
In the **Controls Panel**, select either `Image` or `Video`.
-   **Image:** Generates a static picture. Text overlays will be "baked into" the final image. This is very fast.
-   **Video:** Generates a short video clip. Text is provided as captions you can copy and paste into your social media post. This process can take several minutes.

#### Step 2: Select a Platform
Choose the social media platform you're creating for (e.g., `TikTok`, `Instagram Post`). The app automatically sets the correct aspect ratio (e.g., 9:16 for TikTok, 1:1 for Instagram Post).

#### Step 3: Provide Your Creative Input
This is the most important step! Fill in the fields to describe the visual and the text you want to add.

*   **Visual Prompt:** Describe what you want the AI to create visually. Be as descriptive as possible for the best results.
    *   *Example: A majestic golden eagle soaring through a dramatic, stormy sky, hyperrealistic, cinematic lighting.*
*   **Hook (Headline):** The main headline that grabs attention in the first 3 seconds.
    *   *Example: The Future is Now*
*   **Key Messages (Body):** 1-2 short, impactful points. You can put each message on a new line.
    *   *Example: Skate with AI\nAvailable Tomorrow*
*   **Call to Action (CTA):** What you want the viewer to do next.
    *   *Example: Shop Now*

#### Step 4 (Video Only): Add Optional Assets
If you selected `Video`, you have the option to upload a **Start Image** and an **End Image**.
-   **Start Image:** The video will begin by animating from this image.
-   **End Image:** The video will transition to end on this image.
-   **Both:** The video will animate from the start image to the end image.

This is a powerful way to have more control over the video's narrative.

#### Step 5: Generate!
Click the **Generate Content** button. The button will show a loading spinner, and the Preview Panel will display progress messages. Be patient, especially for video generation!

### Video Generation & API Keys

Generating videos with the Veo model requires an API key.
-   The first time you click "Generate Content" for a **video**, a dialog will appear prompting you to select your Google AI Studio API key.
-   Once selected, the generation will proceed automatically.
-   The app will remember your selection for future video generations. If you encounter an error related to an invalid key, you may be prompted to select a new one.

### Previewing, Captioning, and Downloading

Once the generation is complete, your content will appear in the **Preview Panel**.

*   **For Images:** The text you provided for the Hook, Key Messages, and CTA will be automatically drawn onto the image with a semi-transparent background for readability.
*   **For Videos:** The video will appear without baked-in text. Below the video player, your Hook, Messages, and CTA will be displayed as captions. Use the **Copy Captions** button to easily copy all the text to your clipboard, ready to be pasted into your TikTok or Instagram post description.

Below the preview, a green **Download Content** button will appear. Click it to save the file (`.jpg` for images, `.mp4` for videos) to your computer.

### Streamline Your Workflow: The Suggestions Panel

This feature is designed for creating multi-platform campaigns efficiently.

After you've successfully generated a piece of content you're happy with, look at the **Suggestions Panel** on the right. It will populate with buttons for all the *other* platforms.

Simply click one of these buttons (e.g., `Generate for YouTube Shorts`), and the app will automatically re-run your original visual prompt and text overlays using the correct aspect ratio for that new platform.

### Troubleshooting

-   **Error: "Please enter a visual prompt."**
    -   You must write a description in the "Visual Prompt" box before generating.

-   **Error (Video): "Your API key is invalid or not found."**
    -   The API key you selected is no longer valid or has been revoked. The app will reset, allowing you to click "Generate Content" again and trigger the key selection dialog. Please choose a valid key.

-   **General Generation Failure:**
    -   Sometimes, the AI may fail to generate content from a specific prompt. Try rephrasing your prompt or being more/less specific.

---

Happy creating!
