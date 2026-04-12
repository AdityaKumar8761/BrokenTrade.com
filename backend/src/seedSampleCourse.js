const User = require('./modules/user');
const Course = require('./modules/course');

const VID_TRADING = 'ZkSQyidxvl4';
const VID_FINANCE = 'AkMTxMN7res';

const CATALOG_DEFS = [
    {
        title: 'Practical Market Analysis — Video Lesson',
        category: 'Trading',
        description:
            'Instructor-led walkthrough using live-style examples. Watch the full session on YouTube and practice concepts in BrokenTrade.',
        videoUrl: `https://youtu.be/${VID_TRADING}?si=3x-CUdp-Di7m2nVX`,
        thumbnail: `https://img.youtube.com/vi/${VID_TRADING}/hqdefault.jpg`,
        content: [
            { type: 'heading', text: 'L1 — Course orientation' },
            {
                type: 'paragraph',
                text: 'How this series is structured, what you should have ready before each session, and how to use BrokenTrade practice mode alongside the lectures.',
            },
            { type: 'heading', text: 'L2 — Reading market context' },
            {
                type: 'paragraph',
                text: 'Interpreting volatility regimes, liquidity pockets, and how headlines interact with intraday structure.',
            },
            { type: 'heading', text: 'L3 — Applied walkthrough' },
            {
                type: 'paragraph',
                text: 'Follow the instructor through a worked example using the main video lesson, pausing to test ideas on charts.',
            },
            { type: 'heading', text: 'L4 — Review and next steps' },
            {
                type: 'paragraph',
                text: 'Checklist for journaling trades, common pitfalls, and suggested follow-up readings.',
            },
        ],
    },
    {
        title: 'Corporate Finance and Capital Structure',
        category: 'Finance',
        description:
            'Foundations of how firms fund operations, trade off debt versus equity, and communicate value to stakeholders.',
        videoUrl: `https://youtu.be/${VID_FINANCE}?si=tUW0LMB_qvqGWoD7`,
        thumbnail: `https://img.youtube.com/vi/${VID_FINANCE}/hqdefault.jpg`,
        content: [
            { type: 'heading', text: 'L1 — Intro to corporate finance' },
            {
                type: 'paragraph',
                text: 'Cash flows, time value of money, and the three main decisions: investment, financing, and payout policy.',
            },
            { type: 'heading', text: 'L2 — Capital structure intuition' },
            {
                type: 'paragraph',
                text: 'Why leverage magnifies returns, introduces default risk, and how markets price different capital mixes.',
            },
            { type: 'heading', text: 'L3 — Cost of capital in practice' },
            {
                type: 'paragraph',
                text: 'Linking WACC assumptions to business risk, cyclicality, and comparables in public markets.',
            },
            { type: 'heading', text: 'L4 — Case wrap-up' },
            {
                type: 'paragraph',
                text: 'Synthesis questions you can use to stress-test a simple DCF or comparables model.',
            },
        ],
    },
    {
        title: 'Long-term Investing and Portfolio Risk',
        category: 'Investing',
        description:
            'Build durable portfolios with diversification, rebalancing discipline, and a clear map from goals to asset mix.',
        videoUrl: `https://youtu.be/${VID_TRADING}?si=3x-CUdp-Di7m2nVX`,
        thumbnail: `https://img.youtube.com/vi/${VID_TRADING}/hqdefault.jpg`,
        content: [
            { type: 'heading', text: 'L1 — Goals and constraints' },
            {
                type: 'paragraph',
                text: 'Translating horizon, liquidity needs, and risk tolerance into a simple policy statement.',
            },
            { type: 'heading', text: 'L2 — Diversification mechanics' },
            {
                type: 'paragraph',
                text: 'Correlations drift over time; what diversification does and does not promise in drawdowns.',
            },
            { type: 'heading', text: 'L3 — Rebalancing rules' },
            {
                type: 'paragraph',
                text: 'Calendar versus threshold approaches, tax awareness, and avoiding over-trading.',
            },
            { type: 'heading', text: 'L4 — Monitoring and revision' },
            {
                type: 'paragraph',
                text: 'Lightweight dashboards for tracking drift, fees, and factor exposures without noise trading.',
            },
        ],
    },
    {
        title: 'Blockchain Essentials for Market Participants',
        category: 'Crypto',
        description:
            'A practitioner-oriented tour of settlement, custody, and how on-chain activity relates to traditional market plumbing.',
        videoUrl: `https://youtu.be/${VID_FINANCE}?si=tUW0LMB_qvqGWoD7`,
        thumbnail: `https://img.youtube.com/vi/${VID_FINANCE}/hqdefault.jpg`,
        content: [
            { type: 'heading', text: 'L1 — Ledgers and trust models' },
            {
                type: 'paragraph',
                text: 'What changes when verification is distributed, and where centralized intermediaries still matter.',
            },
            { type: 'heading', text: 'L2 — Tokens and economic design' },
            {
                type: 'paragraph',
                text: 'Utility versus governance claims, issuance schedules, and simple red flags in documentation.',
            },
            { type: 'heading', text: 'L3 — Market microstructure touchpoints' },
            {
                type: 'paragraph',
                text: 'Liquidity venues, stablecoins, and how price discovery can differ from traditional assets.',
            },
            { type: 'heading', text: 'L4 — Risk checklist' },
            {
                type: 'paragraph',
                text: 'Operational, regulatory, and technology risks to track before sizing any crypto-linked exposure.',
            },
        ],
    },
    {
        title: 'Bond Markets: Pricing, Duration, and Curve trades',
        category: 'Bonds',
        description:
            'Understand yield curves, duration as risk, and how fixed-income instruments behave when rates move.',
        videoUrl: `https://youtu.be/${VID_TRADING}?si=3x-CUdp-Di7m2nVX`,
        thumbnail: `https://img.youtube.com/vi/${VID_TRADING}/hqdefault.jpg`,
        content: [
            { type: 'heading', text: 'L1 — Bond cash flows' },
            {
                type: 'paragraph',
                text: 'Coupons, principal, credit spread, and the basic pricing relationship to discount factors.',
            },
            { type: 'heading', text: 'L2 — Yield and curve shapes' },
            {
                type: 'paragraph',
                text: 'Spot versus yield to maturity, inverted curves, and what practitioners watch day to day.',
            },
            { type: 'heading', text: 'L3 — Duration and convexity' },
            {
                type: 'paragraph',
                text: 'First- and second-order sensitivity, and why convexity matters when volatility rises.',
            },
            { type: 'heading', text: 'L4 — Positioning scenarios' },
            {
                type: 'paragraph',
                text: 'Simple scenarios for steepeners, flatteners, and credit spread widening using liquid benchmarks.',
            },
        ],
    },
];

/**
 * Ensures five catalog courses exist (Trading, Finance, Investing, Crypto, Bonds) for a real instructor.
 */
async function seedSampleCourse() {
    try {
        const instructor =
            (await User.findOne({ type: 'Instructor', name: { $regex: /aditya/i } })) ||
            (await User.findOne({ type: 'Instructor' }).sort({ createdAt: 1 }));

        if (!instructor) {
            console.log('[seed] No Instructor user in database; skipping catalog courses.');
            return;
        }

        for (const def of CATALOG_DEFS) {
            const existing = await Course.findOne({ title: def.title });
            if (!existing) {
                await Course.create({
                    instructorId: instructor._id,
                    instructorName: instructor.name,
                    title: def.title,
                    category: def.category,
                    description: def.description,
                    videoUrl: def.videoUrl,
                    thumbnail: def.thumbnail,
                    views: 0,
                    enrolledCount: 0,
                    content: def.content,
                });
                console.log('[seed] Created course:', def.title);
            } else {
                const needsSync =
                    String(existing.instructorId) !== String(instructor._id) ||
                    existing.instructorName !== instructor.name;
                if (needsSync) {
                    await Course.updateOne(
                        { _id: existing._id },
                        {
                            $set: {
                                instructorId: instructor._id,
                                instructorName: instructor.name,
                            },
                        }
                    );
                }
            }
        }
        console.log('[seed] Catalog courses ensured (up to 5).');
    } catch (err) {
        console.error('[seed] Catalog course error:', err);
    }
}

module.exports = seedSampleCourse;
