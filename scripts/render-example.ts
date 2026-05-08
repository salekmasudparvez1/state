import { writeFileSync } from 'fs';
import { generateProSVG } from '../src/index';

const stats = {
    username: 'octocat',
    name: 'The Octocat',
    avatarUrl: '',
    totalRepos: 8,
    totalStars: 1234,
    totalForks: 56,
    totalCommits: 789,
    totalFollowers: 345,
    totalFollowing: 12,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    topLanguages: [
        { name: 'JavaScript', count: 5, percentage: 50 },
        { name: 'TypeScript', count: 3, percentage: 30 },
        { name: 'Python', count: 2, percentage: 20 }
    ],
    contributionStreak: 12
};

const svg = generateProSVG(stats as any, 'ocean', true);
writeFileSync('/tmp/github-stats-example.svg', svg, 'utf8');
console.log('Wrote /tmp/github-stats-example.svg');
