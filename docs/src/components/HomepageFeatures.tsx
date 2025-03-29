import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'AI-Powered Search',
    description: (
      <>
        Search GitHub issues and Stack Overflow with AI analysis to find solutions to your coding problems.
      </>
    ),
  },
  {
    title: 'Smart Debugging',
    description: (
      <>
        Get AI-powered debugging assistance with step-by-step analysis and suggested fixes.
      </>
    ),
  },
  {
    title: 'Code Documentation',
    description: (
      <>
        Generate comprehensive documentation for your code files with AI assistance.
      </>
    ),
  },
  {
    title: 'Code Collection',
    description: (
      <>
        Collect and analyze TypeScript files from your project with AI-powered insights.
      </>
    ),
  },
  {
    title: 'Multiple AI Models',
    description: (
      <>
        Choose from various AI models (Claude, GPT-4) for different tasks and optimize for speed or quality.
      </>
    ),
  },
  {
    title: 'Easy Configuration',
    description: (
      <>
        Simple setup with API keys and model configuration for your preferred services.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3 className={styles.featureTitle}>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
} 