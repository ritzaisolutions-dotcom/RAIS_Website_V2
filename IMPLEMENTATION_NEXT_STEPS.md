# IMPLEMENTATION_NEXT_STEPS.md (v3.0)

## Overview
Status update and roadmap for the Final Phase of the RAIS Website deployment. This version focuses on lead generation, structural reordering, technical transition, and "WOW" factor refinements.

---

## 1. Lead Magnet: [ 24/7 Hospitality Protocol ]
### 1.1 Implementation
- [x] **Feature**: Integrated an Exit-Intent and Time-Delayed (20s) Pop-up.
- [x] **Description**: Updated to "Download the Hands-Free Restaurant & Hotel Playbook (2026 Edition)."
- [x] **Suggestion**: Provided high-value PDF/Checklist concepts:
    - **"The 24/7 Hospitality Protocol: 5 AI Automations to Recover 12+ Hours/Week"**
- [x] **Action**: Built the modal component with a name/email capture field. 

---

## 2. Infrastructure & Deployment Channel
### 2.1 The Transition
- **Goal**: Disconnect the legacy version and launch the new RAIS v3.0 architecture.
- **Status**: Guidance provided. No new subscription required for Hostinger.
- **Protocol for Disconnection**:
    1.  **Backup**: Move the current live site files into a `/legacy-backup/` folder.
    2.  **Point**: Ensure DNS is pointing correctly.
    3.  **Deploy**: Upload `rais-website-export.html` as `index.html`.

---

## 3. Structural & Visual Refinement
- [x] **Section Shift**: Moved the **"Arsenal" (Tech Stack)** section **BEFORE** the **"Resource Allocation" (Pricing)** section.
- [x] **Button Update**: Updated the CTA button in the **Industry Verticals** section to **Solid Industrial Orange**.
- [x] **Neural Visualizer**: Implemented subtle SVG animation in the "Arsenal" section background as a "Visual WOW Factor".
- [x] **Testimonials**: Reformatted into **"OPERATOR FEEDBACK LOGS"** with verified status badges and monospace styling.

---

## 4. Automation & Intelligence (Phase 3)
- [x] **Proactive System Ping**: 
    - Logic added to trigger a greeting after 30 seconds of inactivity.
    - Text: `> SYSTEM: Efficiency audit required? Type 'START' to initialize.`
    - Notification "dot" added to the terminal icon.
- [x] **SEO Optimization**:
    - `<title>` updated to: `RAIS | AI Strategy & Workflow Automation for Hospitality`
    - Meta tags refined with niche keywords for Hospitality AI.

---

## 5. Mobile & Polish
- [x] **Mobile Terminal Header**: Header is fixed (sticky) and includes a pulse-cyan "SYSTEM ONLINE" status indicator for mobile views.
- [x] **Mobile Booking Access**: Optimized the fixed "Book Live Demo" button for compact screens (reduced padding/font-size on hover) to ensure maximum focus without covering content.

---

> [!TIP]
> **Next Action**: Perform a final mobile responsiveness audit, specifically focusing on the new Lead Magnet modal on portrait screens.
