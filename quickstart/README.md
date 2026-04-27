# 10-Minute First Win

You'll set up Claude Code, drop in a starter Brief and one skill, and produce a real, shippable marketing campaign brief in under 10 minutes. No coding.

If you get stuck at any step, post in `#install-help` in the [free 100x Marketer community](https://www.skool.com/100x-marketer). We answer in under an hour during US business hours.

---

## What you'll have at the end

A polished, ready-to-ship campaign brief in your `Marketing` folder. Real Markdown. Real structure. Something you'd send to a freelancer or paste into Notion right now.

**Time:** 10 minutes
**Cost:** Free with a Claude Pro plan ($20/mo). The free Anthropic tier also works for this walkthrough.
**Required:** A Mac or Windows machine.

---

## Step 1: Sign in to Anthropic (1 minute)

1. Go to **[claude.ai](https://claude.ai)**.
2. Sign in or create an account. Use the email you'll associate with your work.
3. If you don't already have **Claude Pro**, upgrade. It's $20/month and you'll outgrow the free limits within a week of using Claude Code seriously. (You can start free if you want to test the waters first.)

That's the whole account setup. Now we choose how you'll actually use Claude Code.

---

## Step 2: Pick how you'll run Claude Code (3 minutes)

Claude Code is the same brain in three different windows. Pick one. **For most marketers, we recommend the VS Code extension.** Reasons below.

### Option A: Claude Desktop App (easiest)

Best if you've never installed a developer tool and you just want a clean app with a window.

1. Go to **[claude.ai/download](https://claude.ai/download)** and download the desktop app for your OS.
2. Open it. Sign in with the Anthropic account from Step 1.
3. Done. You'll use the app's Files panel to point it at your `Marketing` folder in Step 4.

### Option B: VS Code Extension (recommended)

Best for almost everyone. VS Code is a free Microsoft app that looks and feels like a polished writing tool. You'll see your files in a sidebar, edit them in tabs, and run Claude Code in a panel on the right. It's the closest thing to "Notion + ChatGPT in one window" that exists.

1. Download **VS Code** from **[code.visualstudio.com](https://code.visualstudio.com)**. Install it.
2. Open VS Code. On the left sidebar, click the **Extensions** icon (the four-squares icon).
3. Search for **"Claude Code"**. Install the official Anthropic extension.
4. Sign in with the Anthropic account from Step 1 when prompted.

This is what we use to record every tutorial. Your videos and screen will look like the ones in the community.

### Option C: Terminal (we won't cover this here)

If you're already comfortable in the terminal, you know what to do (`claude` after install). For the rest of this walkthrough, we'll assume you picked A or B. Terminal works identically for the skill we're about to run.

---

## Step 3: Set up your Marketing folder (3 minutes)

We're going to make a folder called `Marketing` on your computer and drop two files into it. The two files are:

1. **CLAUDE.md** (the Brief: tells Claude how to act as your marketing operator)
2. **SKILL.md** (the Playbook: a recipe for producing a campaign brief)

### Easy path: download the files manually

1. **Make a folder** on your Desktop or in your Documents called `Marketing`.
2. Inside `Marketing`, make a subfolder called `skills`. Inside that, make another called `campaign-brief`.
3. **Download these two files and save them to the right spots:**

   - **[Download CLAUDE.md](https://raw.githubusercontent.com/bobrien5/100x-marketer/main/quickstart/CLAUDE.md)** → save to `Marketing/CLAUDE.md`
   - **[Download SKILL.md](https://raw.githubusercontent.com/bobrien5/100x-marketer/main/quickstart/skills/campaign-brief/SKILL.md)** → save to `Marketing/skills/campaign-brief/SKILL.md`

   On most browsers: right-click the link, choose "Save Link As..." or "Download Linked File As...", and pick the right folder.

Your folder should look like this when you're done:

```
Marketing/
├── CLAUDE.md
└── skills/
    └── campaign-brief/
        └── SKILL.md
```

---

## Step 4: Customize the Brief (1 minute)

Open `Marketing/CLAUDE.md` in VS Code (or your desktop app's editor, or any text editor).

Find these three lines near the top and replace the bracketed parts with your real info:

```
- **Company:** [COMPANY NAME]
- **What we sell:** [one-sentence product description]
- **ICP:** [who buys it, what they pay, what their alternative is]
```

Save the file. **That's the only customization you need for the first win.** Everything else has sensible defaults you can edit later.

---

## Step 5: Open the folder in Claude Code and run the skill (2 minutes)

### If you picked VS Code

1. In VS Code, click **File → Open Folder** and pick your `Marketing` folder.
2. Open the Claude Code panel (usually a button on the right side of the window, or `Cmd+Shift+P` then type "Claude").
3. In the Claude chat panel, paste this and press Enter:

```
Run the campaign-brief skill. The campaign idea is: a 4-week awareness push for our spring product launch targeting first-time buyers. Goal is qualified pipeline.
```

(Replace the campaign idea with one of your own if you have one. A real one is more fun to read.)

### If you picked the Desktop App

1. Open the Claude Desktop App.
2. Point it at your `Marketing` folder using the Files / Workspace panel.
3. In the chat, paste the same prompt as above.

---

## What just happened

Claude read your `CLAUDE.md` (the Brief), followed the `campaign-brief` skill (the Playbook), and wrote a complete campaign brief into `Marketing/briefs/`. Open it. Read it. It's real.

You just ran the entire 100x Marketer model in one workflow:

- **The Brief** taught Claude how to act as your marketing operator.
- **The Playbook** told Claude exactly how to produce this output.
- **The Output** is a Markdown file you can ship to a freelancer or paste into Notion today.

From here, every module of the curriculum adds:

- **More skills** (more jobs you can hand off: weekly reports, partnership outreach, SEO briefs, content repurposing)
- **More tools** (the Tool Belt: Notion, Gmail, GA4, Publer wired directly into Claude)
- **More guardrails** (hooks that enforce your brand voice automatically)

## Next steps

1. **Post your output** in [`#wins` in the community](https://www.skool.com/100x-marketer). We feature one per week in the newsletter.
2. **Edit your `CLAUDE.md`.** Add 5 sample lines of your real brand voice. The skill output gets noticeably better.
3. **Module 2 (free):** Add the Notion Tool Belt. Now Claude can write briefs directly to your Notion content calendar.

Stuck? Post in `#install-help`. Be specific about what you tried and what you saw. We'll get you running.

Ship it.
