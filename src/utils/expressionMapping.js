// Expression to monkey image mapping
export const expressionMapping = {
    happy: {
        image: '/monkeys/happy.svg',
        emoji: '😄',
        label: 'Happy',
        description: 'Tongue out monkey'
    },
    surprised: {
        image: '/monkeys/surprised.svg',
        emoji: '😲',
        label: 'Surprised',
        description: 'Wide-eyed monkey'
    },
    neutral: {
        image: '/monkeys/neutral.svg',
        emoji: '😐',
        label: 'Neutral',
        description: 'Thinking monkey'
    },
    sad: {
        image: '/monkeys/sad.svg',
        emoji: '😢',
        label: 'Sad',
        description: 'Awkward smile monkey'
    },
    angry: {
        image: '/monkeys/angry.svg',
        emoji: '😠',
        label: 'Angry',
        description: 'Shocked monkey'
    },
    fearful: {
        image: '/monkeys/fearful.svg',
        emoji: '😨',
        label: 'Fearful',
        description: 'Scared hands monkey'
    },
    disgusted: {
        image: '/monkeys/disgusted.svg',
        emoji: '🤢',
        label: 'Disgusted',
        description: 'Confused monkey'
    }
};

// Get the dominant expression from face-api.js detection result
export const getDominantExpression = (expressions) => {
    if (!expressions) return 'neutral';

    let maxExpression = 'neutral';
    let maxValue = 0;

    Object.entries(expressions).forEach(([expression, value]) => {
        if (value > maxValue) {
            maxValue = value;
            maxExpression = expression;
        }
    });

    return maxExpression;
};

// Get monkey data for a given expression
export const getMonkeyForExpression = (expression) => {
    return expressionMapping[expression] || expressionMapping.neutral;
};
