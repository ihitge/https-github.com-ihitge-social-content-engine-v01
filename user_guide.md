
# Social Media Content Factory - User Guide

Welcome to the Social Media Content Factory! This guide will walk you through how to use this powerful AI tool to generate stunning images and videos for all your social media platforms.

## Table of Contents
1.  [Introduction](#introduction)
2.  [The Main Interface](#the-main-interface)
3.  [Generating Your First Piece of Content](#generating-your-first-piece-of-content)
    *   [Step 1: Choose Your Content Type](#step-1-choose-your-content-type)
    *   [Step 2: Select a Platform](#step-2-select-a-platform)
    *   [Step 3: Write a Creative Prompt](#step-3-write-a-creative-prompt)
    *   [Step 4 (Video Only): Add Optional Assets](#step-4-video-only-add-optional-assets)
    *   [Step 5: Generate!](#step-5-generate)
4.  [Video Generation & API Keys](#video-generation--api-keys)
5.  [Previewing and Downloading](#previewing-and-downloading)
6.  [Streamline Your Workflow: The Suggestions Panel](#streamline-your-workflow-the-suggestions-panel)
7.  [Troubleshooting](#troubleshooting)

---

### Introduction

The Social Media Content Factory is designed to accelerate your creative process. Using powerful AI models like Imagen and Veo, you can turn a simple text prompt into high-quality, perfectly formatted content for platforms like TikTok, YouTube Shorts, Instagram, and more.

**Key Features:**
*   **Image & Video Generation:** Create both static images and dynamic short-form videos.
*   **Platform-Aware:** Automatically uses the correct aspect ratio for your chosen social media platform.
*   **Flexible Creation:** Generate from a text prompt, or guide the AI with starting and ending images for videos.
*   **Scale Your Campaigns:** Quickly repurpose a successful creative idea for all your other platforms with a single click.

### The Main Interface

The application is divided into three main sections:

1.  **Controls Panel (Left):** This is where you define what you want to create. You'll select the content type, platform, write your prompt, and upload any optional image assets here.
2.  **Preview Panel (Center):** Your generated content will appear here. This area shows loading status, errors, and the final image or video. A download button will appear below it upon successful generation.
3.  **Suggestions Panel (Right):** This panel helps you scale your content. After you create something you like, this area will suggest creating variations for other platforms.

 <!-- Placeholder for an interface image -->

### Generating Your First Piece of Content

Follow these simple steps to bring your ideas to life.

#### Step 1: Choose Your Content Type
In the **Controls Panel**, select either `Image` or `Video`.
-   **Image:** Generates a static picture using the Imagen 4 model. This is very fast.
-   **Video:** Generates a short video clip using the Veo model. This process can take several minutes.

#### Step 2: Select a Platform
Choose the social media platform you're creating for (e.g., `TikTok`, `Instagram Post`). The app automatically sets the correct aspect ratio (e.g., 9:16 for TikTok, 1:1 for Instagram Post), so you don't have to worry about the dimensions.

#### Step 3: Write a Creative Prompt
This is the most important step! In the **Creative Prompt** text area, describe what you want the AI to create. Be as descriptive as possible for the best results.

**Good Prompt Example:**
> A majestic golden eagle soaring through a dramatic, stormy sky, hyperrealistic, cinematic lighting.

**Simple Prompt Example:**
> A cat.

#### Step 4 (Video Only): Add Optional Assets
If you selected `Video`, you have the option to upload a **Start Image** and an **End Image**.
-   **Start Image:** The video will begin by animating from this image.
-   **End Image:** The video will transition to end on this image.
-   **Both:** The video will animate from the start image to the end image.

This is a powerful way to create a "midjourney" effect and have more control over the video's narrative.

#### Step 5: Generate!
Click the **Generate Content** button. The button will show a loading spinner, and the Preview Panel will display progress messages. Be patient, especially for video generation!

### Video Generation & API Keys

Generating videos with the Veo model requires an API key.
-   The first time you click "Generate Content" for a **video**, a dialog will appear prompting you to select your Google AI Studio API key.
-   Once selected, you'll see a confirmation message, and you can proceed with generation.
-   The app will remember your selection for future video generations. If you encounter an error related to an invalid key, you may be prompted to select a new one.

### Previewing and Downloading

Once the generation is complete, your content will appear in the **Preview Panel**.
-   **Images** will be displayed directly.
-   **Videos** will have player controls so you can play, pause, and loop your creation.

Below the preview, a green **Download** button will appear. Click it to save the file (`.jpg` for images, `.mp4` for videos) to your computer.

### Streamline Your Workflow: The Suggestions Panel

This feature is designed for creating multi-platform campaigns efficiently.

After you've successfully generated a piece of content you're happy with, look at the **Suggestions Panel** on the right. It will populate with buttons for all the *other* platforms.

Simply click one of these buttons (e.g., `Generate for YouTube Shorts`), and the app will automatically re-run your original prompt using the correct aspect ratio for that new platform. It's the fastest way to turn one great idea into a complete social media campaign.

### Troubleshooting

-   **Error: "Please enter a prompt."**
    -   You must write a description in the prompt box before generating.

-   **Error (Video): "Your API key is invalid or not found."**
    -   The API key you selected is no longer valid or has been revoked. The app will reset, allowing you to click "Generate Content" again and trigger the key selection dialog. Please choose a valid key.

-   **General Generation Failure:**
    -   Sometimes, the AI may fail to generate content from a specific prompt. Try rephrasing your prompt or being more/less specific. Check the Gemini API status for any ongoing issues.

---

Happy creating!
