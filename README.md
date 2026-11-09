# Futuroute Career Explorer

BUILD FUTUROUTE — AN AI-POWERED CAREER EXPLORATION PLATFORM

Build a complete, visually stunning, responsive and interactive website called Futuroute — Explore Possibilities. Test Your Potential. Plan Your Future.

Futuroute is an AI-powered career exploration and decision-support platform designed primarily for school and college students who are uncertain about which career path to pursue.

The goal is not simply to recommend careers. Futuroute should help students explore different possibilities, compare careers, experience small samples of the work, and develop realistic learning plans based on their interests, current skills, available time and budget.

This is a university project for a B.Tech Computer Science and Engineering student at The NorthCap University, Gurugram. Build it as a polished startup-quality product that could be demonstrated during a university presentation.

Important implementation requirement: This project is currently at the concept stage. Build a functional frontend and realistic demonstration experience, but do not claim that a production backend, database or live AI integration exists unless it has actually been configured and tested.

1. VISUAL DIRECTION — MATCH THE PROVIDED REFERENCE IMAGE

Use the uploaded dashboard screenshot as the primary visual reference.

Recreate its atmospheric combination of:

Ambient lavender and purple lighting.

Soft cyan and turquoise illumination.

Translucent glass panels.

Deep indigo shadows.

Subtle pink and violet highlights.

Thin, luminous borders.

Soft gradients and carefully controlled glow effects.

The visual result should feel like a premium, futuristic productivity dashboard blended with an approachable career exploration platform.

Do not use the previous navy-blue-orange colour scheme.

Colour palette

Use the following design tokens as the starting point:

Main background: #17152F

Deep indigo: #24204F

Secondary purple: #6F55C8

Ambient lavender: #B68AF5

Bright lavender: #C6A6FF

Cyan: #59D7F2

Turquoise: #65E0D0

Soft pink accent: #E5A5E8

Main text: #F8F6FF

Secondary text: #D0CBE5

Muted text: #AAA5C7

Glass border: translucent white at approximately 20–30% opacity.

Success: #65E0B5

Warning: #FFD58C

Create large, soft purple and cyan radial gradients behind the main interface.

Use CSS radial gradients and subtle blur effects to create ambient lighting. Keep the glows behind the content so that text and controls remain readable.

Glassmorphism

Use translucent cards with:

Semi-transparent indigo backgrounds.

backdrop-filter: blur(...) where supported.

Thin, softly illuminated borders.

Rounded corners, generally 16–24px.

Subtle shadows.

Gentle hover transitions.

Use glassmorphism consistently, but do not make every element excessively transparent. Important content must remain readable.

Typography

Use:

Manrope or Space Grotesk for headings.

Inter for body text and interface elements.

Use a clear type hierarchy, comfortable line spacing, restrained font weights and generous spacing.

Design quality

Avoid:

Generic AI-generated landing-page layouts.

Excessive neon effects.

Excessive animation.

Cartoon illustrations.

Generic stock photography.

Unnecessary decorative statistics.

Tiny text on glass backgrounds.

Purple gradients that make every section look identical.

Prefer original CSS illustrations, branching career paths, elegant progress rings, compact data visualisations, structured cards and useful interactive components.

The website must be fully responsive on desktop, tablet and mobile.

2. BRAND IDENTITY

Product name: Futuroute

Tagline: Explore possibilities. Test your potential. Plan your future.

Primary message:

"Your future isn't a single decision. It's a path you can explore."

Supporting message:

"Discover career possibilities, understand what they involve, try small practical challenges and build a realistic plan for your next step."

Create a distinctive logo featuring a minimal branching-route symbol. It could combine a curved path, three branching nodes and a forward-moving destination point.

The logo should work against both dark and translucent backgrounds.

Use the name Futuroute consistently throughout the interface.

3. APPLICATION STRUCTURE

Create the following pages or functional sections:

Home

Discover Careers

Compare My Futures

Budget-to-Skill Planner

Try Before You Choose

My Roadmap

My Dashboard

About Futuroute

Use working navigation between these sections.

The application should feel like one cohesive product, not a collection of disconnected pages.

For the primary experience, use an application dashboard layout with a left sidebar, a top navigation area and a spacious content region.

On mobile, convert the sidebar into a collapsible navigation menu or another intuitive mobile navigation pattern.

Persist appropriate demonstration data using browser local storage.

4. MAIN DASHBOARD

The dashboard is the central visual experience and should closely follow the uploaded reference image.

Use a full-screen, dark ambient background with purple illumination on the left and cyan illumination toward the right.

Left sidebar

Create a translucent vertical sidebar containing:

Futuroute logo and brand name.

Overview.

Discover Careers.

Compare My Futures.

Budget-to-Skill Planner.

Try Before You Choose.

My Roadmap.

Saved Careers.

Settings.

Highlight the active navigation item using a translucent lavender pill with a subtle glow.

Place a compact profile or demonstration-mode card at the bottom.

Do not invent a real user's identity or imply that authentication exists when it does not.

Top header

Display:

"Good to see you. Ready to explore your future?"

Supporting text:

"Your next step starts with understanding your options."

Include:

A search field for careers and skills.

A notification icon if notifications are functional.

A compact settings or menu control.

A prominent "Start Exploring" button.

Avoid using fake notifications or non-functional icons.

Dashboard overview cards

Create four translucent cards with simple icons:

Saved Careers.

Careers Compared.

Roadmap Progress.

Challenges Completed.

Use meaningful values derived from actual local demonstration data.

For example, if the user has not completed any activities, display zero rather than invented progress.

Each card should include a short explanatory label.

Main dashboard layout

Use a spacious two-column layout.

Left: My Career Exploration

Create a large panel showing an interactive career exploration progress visualisation.

Display a branching route diagram with possible paths such as:

Software Development.

Artificial Intelligence.

Data Analytics.

UI/UX Design.

Cybersecurity.

Digital Marketing.

Use luminous connecting lines and small career nodes.

Clicking a node should open the relevant career details.

Below or beside the diagram, show:

Saved career options.

Recently explored careers.

A shortcut to compare careers.

Right: My Roadmap

Create a progress panel with:

A circular progress indicator.

Current learning phase.

Completed tasks.

Remaining tasks.

A "Continue Roadmap" button.

The progress ring must calculate its value from actual completed tasks.

Below it, display a small activity panel showing genuine local demo events, such as a career saved or a roadmap task completed.

If no activity exists, show an attractive empty state.

5. HOMEPAGE

Create a polished public-facing homepage that introduces Futuroute.

Navigation

Include:

Futuroute logo.

Home.

Discover Careers.

Compare Careers.

How It Works.

About.

Start Exploring button.

Hero section

Use a dark ambient background with large lavender and cyan glows.

Headline:

"Your Future Isn't One-Size-Fits-All."

Supporting text:

"Explore career paths that match your interests, compare what they really involve, and build a learning plan that fits your time, skills and budget."

Primary button: "Discover My Path"

Secondary button: "Compare Careers"

Below the buttons, display:

"Explore possibilities. Understand your options. Take your next step."

On the right, create an original, interactive branching career-path illustration.

Include:

A central "Your Interests" node.

Branches leading to different career options.

Floating career cards.

Skill chips.

Small progress indicators.

Soft animated connections.

Keep the illustration elegant and readable.

Additional homepage sections

Feeling unsure about your future?

Explain that students often struggle to choose between multiple interests and do not always know what different careers involve.

Use three cards:

Discover — Explore possible career paths.

Compare — Understand differences, trade-offs and required skills.

Plan — Build realistic next steps based on available time and budget.

How Futuroute works

Display three steps:

Tell us about your interests and goals.

Explore, compare and test career possibilities.

Build a realistic learning roadmap.

Explore popular careers

Create attractive cards for:

Software Developer.

AI/ML Engineer.

Data Analyst.

UI/UX Designer.

Cybersecurity Analyst.

Digital Marketer.

Each card should display:

Career name.

Short description.

Relevant skills.

A "Explore Career" button.

Featured call to action

Headline:

"Don't guess your future. Start exploring it."

Button: "Explore My Options"

Footer

Include:

About Futuroute.

How It Works.

Discover Careers.

Compare Careers.

Privacy.

Contact.

6. CAREER DISCOVERY

Create a functional multi-step questionnaire with a visible progress indicator.

The questionnaire should feel approachable and easy to complete.

Allow users to go back, change previous answers and skip optional questions.

Ask about:

Current education level.

Favourite subjects.

Interests and hobbies.

Skills the student already has.

Preferred types of work.

Careers they are curious about.

Time available per week.

Available learning budget.

Preferred learning style.

Personal priorities, such as creativity, flexibility, stability, problem-solving, impact or earning potential.

Use selectable chips, cards, sliders and simple form controls rather than a long, intimidating form.

After submission, generate a personalised exploration report containing three to five possible careers.

For each career, show:

Why it may align with the user's stated interests.

Typical work activities.

Skills worth exploring.

Common education or qualification routes.

Potential advantages and challenges.

A small beginner-friendly trial activity.

Recommended next steps.

Use transparent explanations.

Do not generate fake compatibility percentages or claim that career suggestions are scientifically validated predictions.

Clearly explain:

"These suggestions are starting points for exploration, not fixed decisions about your future."

Demo-mode behaviour

If live AI is not configured, use a deterministic, rule-based recommendation engine with clearly labelled sample career information.

The recommendations should respond meaningfully to the user's answers rather than always displaying the same careers.

For example:

Interest in mathematics and logical problem-solving may prioritise software development, data analytics or AI.

Interest in visual design and user behaviour may prioritise UI/UX design.

Interest in investigation and digital safety may prioritise cybersecurity.

Interest in communication and campaigns may prioritise digital marketing.

Treat these as illustrative matching rules, not validated psychological assessments.

7. SIGNATURE FEATURE — COMPARE MY FUTURES

This is the most important feature of Futuroute.

Design it as a visually impressive career comparison workspace.

Allow the user to select two or three careers and compare them side by side.

Include sample comparisons such as:

Software Developer vs UI/UX Designer.

Data Analyst vs Cybersecurity Analyst.

AI/ML Engineer vs Web Developer.

For each career, show:

Typical day-to-day work.

Main responsibilities.

Relevant skills.

Useful school subjects.

Common educational pathways.

Beginner projects.

Estimated learning commitment.

Advantages and challenges.

Free or low-cost learning resources.

A practical activity to try before choosing.

Use:

Distinctive career cards.

A clear comparison table.

Skill chips.

Compact progress indicators where meaningful.

Expandable information sections.

A career shortlist.

Include a prominent section titled:

"What should I try first?"

Offer a practical activity based on the comparison.

For example, when comparing software development and UI/UX design:

Software development trial: solve a small logical problem or build a simple webpage.

UI/UX trial: identify usability problems in a sample interface and propose improvements.

Allow users to save careers, remove them and change their selections easily.

Do not automatically declare one career the winner.

Instead, summarise the differences and explain the trade-offs so the student can decide.

8. SIGNATURE FEATURE — BUDGET-TO-SKILL PLANNER

This feature should help students understand how to start learning a skill within their actual constraints.

Create a dedicated planner page with a beautiful, intuitive interface.

Ask the user to provide:

Target career or skill.

Current skill level.

Available budget in INR.

Hours available per week.

Available device: phone, laptop or desktop.

Preferred learning format.

Desired outcome, such as understanding fundamentals or completing a beginner project.

Include useful budget presets:

₹0 — Free resources only.

₹500 — Very limited budget.

₹1,000 — Low-cost learning.

₹5,000 — Flexible beginner budget.

Custom budget.

The student should be able to edit the budget manually.

Generate a structured plan with:

What to learn

List the skills and foundational concepts required for the chosen goal.

Where to learn

Recommend relevant free or low-cost learning resources.

Only include real resource links that have been verified. If a resource has not been verified, label it as requiring verification rather than inventing a URL.

What it costs

Display estimated expenses in Indian rupees.

Clearly distinguish:

Free resources.

Optional paid resources.

Estimated additional expenses.

Do not recommend a paid course as necessary when suitable free resources are sufficient.

How much time it takes

Provide an estimated schedule based on weekly availability.

Make it clear that the schedule is an approximation, not a guarantee.

What to build

Suggest a small practical project that demonstrates the skills being learned.

Next action

Finish with a clear, actionable button:

"Add Plan to My Roadmap"

Validate the total estimated cost against the user's budget.

If the proposed plan exceeds the budget, explain why and suggest a lower-cost alternative.

Never invent course prices or guarantee that a plan will produce a job or a particular salary.

9. TRY BEFORE YOU CHOOSE

Build an interactive mini-challenge area that lets students experience small examples of different careers.

Provide challenges for:

Software Development

Present a simple logical problem with multiple-choice answers or a basic interactive coding-style task.

UI/UX Design

Display a sample interface and ask the student to identify usability problems.

Data Analytics

Show a small chart or dataset and ask the student to interpret it.

Cybersecurity

Present a basic online-safety scenario and ask the student to identify the safest action.

Digital Marketing

Ask the student to select an audience and develop a campaign idea.

Each challenge should include:

Clear instructions.

An interactive task.

Functional answer selection or input.

Feedback after submission.

An explanation of the skills involved.

An optional reflection question.

After completing a challenge, ask:

"Did you enjoy this activity?"

Allow answers such as:

Enjoyed it.

It was okay.

Not for me.

Save completed challenges and reflections in local storage.

Explain that enjoying a short activity does not necessarily determine career suitability. It simply provides another useful signal for exploration.

10. PERSONALIZED ROADMAP

Create a roadmap generator connected to career discovery and the Budget-to-Skill Planner.

The roadmap should account for:

Chosen career.

Current skill level.

Weekly available time.

Budget.

Preferred learning format.

Desired beginner project.

Organise the roadmap into manageable phases, such as:

Phase 1: Foundations.

Phase 2: Core Skills.

Phase 3: Practical Application.

Phase 4: Review and Next Steps.

Adapt the schedule to the student's available time.

Each task should display:

Task title.

Short description.

Estimated effort.

Relevant resource, if verified.

Completion checkbox.

Allow the user to mark tasks complete and reverse completion when necessary.

Calculate progress from completed tasks.

Display a circular progress indicator and a clear list of remaining tasks.

Persist roadmap progress in local storage.

Include a "Continue Learning" button that opens the next incomplete task.

Never suggest that completing a short roadmap guarantees employment, professional qualification or a particular salary.

11. PERSONAL DASHBOARD AND SAVED PROGRESS

The dashboard should bring the whole experience together.

Include:

Saved careers.

Career comparison shortlist.

Current roadmap.

Completed roadmap tasks.

Completed career challenges.

Challenge reflections.

Recently explored careers.

Continue where you left off.

Use meaningful progress rings, milestone cards and compact visualisations.

All dashboard statistics must be calculated from actual user activity or clearly labelled demonstration data.

Implement a useful first-visit state for users who have not explored any careers yet.

Provide direct actions to:

Start career discovery.

Compare two careers.

Create a learning plan.

Try a career challenge.

Do not build a fake analytics dashboard with invented revenue, active-user counts or meaningless statistics. This is a student-facing career platform, not an e-commerce management application.

12. AI INTEGRATION

Structure the application so that live AI can be added later.

Create separate prompt templates for:

Career discovery.

Career comparison.

Budget-aware roadmap generation.

Beginner career challenges.

AI-generated information should be structured, consistent and easy to display in the interface.

Validate inputs and handle empty responses, errors and unavailable services.

Never expose private API keys in frontend code.

If no AI service is configured, use a clearly labelled Demo Mode with functional rule-based recommendations and curated sample content.

Display a small, unobtrusive label:

"Demo Mode — sample recommendations; live AI not connected."

Do not pretend that demo results came from a live AI model.

Keep the architecture ready for a secure server-side integration later.

13. FUNCTIONAL REQUIREMENTS

Build a working application, not just a static mockup.

Implement:

Working navigation.

Responsive sidebar and mobile navigation.

Functional career discovery questionnaire.

Form validation.

Career recommendations that respond to questionnaire answers.

Side-by-side career comparison.

Career saving and removal.

Budget-to-Skill Planner.

Budget validation.

Interactive mini-challenges.

Challenge feedback and reflection saving.

Roadmap creation.

Roadmap task completion tracking.

Dashboard statistics calculated from saved activity.

Browser local-storage persistence.

Useful empty states.

Loading states where asynchronous operations exist.

Error handling.

Accessible keyboard interactions.

Readable text against translucent backgrounds.

Use reusable components and a consistent design system.

Do not create buttons that look interactive but do nothing.

If a feature cannot be fully implemented, either provide a working demonstration version or clearly label the limitation.

14. TECHNICAL IMPLEMENTATION

Use the existing Lovable project framework and integrations wherever possible.

Prefer:

React.

TypeScript.

Tailwind CSS.

Reusable UI components.

Lucide icons.

CSS gradients and restrained animations.

Local storage for the initial demonstration.

Organise the code into reusable components and separate page-level views.

Create reusable components for:

Sidebar navigation.

Top navigation.

Glass cards.

Career cards.

Career comparison tables.

Progress rings.

Roadmap tasks.

Question steps.

Mini-challenges.

Empty states.

Notification and feedback messages.

Use a central design system for colours, spacing, typography, borders, shadows and radii.

Make sure the layout works at common desktop, tablet and mobile widths.

Avoid unnecessary dependencies.

Do not configure an external database or authentication system unless it is actually available and required. Start with a reliable local demonstration experience and make any later backend integration explicit.

15. ACCESSIBILITY AND RESPONSIVE DESIGN

Ensure:

Good contrast for text on glass panels.

Visible keyboard focus.

Semantic headings.

Proper labels for forms.

Accessible button names.

Useful error messages.

Touch-friendly controls.

Reduced-motion support.

Responsive tables or card-based comparisons on mobile.

On smaller screens:

Stack dashboard panels vertically.

Keep key actions visible.

Convert the sidebar to mobile navigation.

Allow career comparison cards to scroll horizontally or stack clearly.

Avoid horizontal page overflow.

16. FINAL QUALITY STANDARD

The final website should look like a premium, ambient SaaS dashboard inspired by the uploaded reference image.

The visual signature should be:

Deep indigo + glowing lavender + luminous cyan + translucent glass panels + soft atmospheric lighting.

The product signature should be:

Discover careers → Compare futures → Try practical activities → Plan within your budget → Track your progress.

Prioritise the following in order:

Excellent visual design.

A functional Compare My Futures experience.

Meaningful career discovery.

A useful Budget-to-Skill Planner.

Interactive career challenges.

Personalised roadmap and progress tracking.

Reliable local demonstration data.

A clear path toward future AI and backend integration.

Build the complete experience with coherent navigation and working interactions.

Do not stop after creating the homepage.

Do not replace meaningful functionality with decorative placeholder cards.

Do not invent research results, salaries, prices, qualifications or AI outputs.

The result should be polished enough to demonstrate as a university project while remaining honest about which features are implemented, which operate in demo mode and which require future integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9bc28e6e-7625-442e-af4b-b3855ca9294f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
