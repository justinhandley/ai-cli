import React, { type JSX } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'AI-Powered Development',
    icon: '🤖',
    description: (
      <>
        Search GitHub and Stack Overflow with AI analysis, get intelligent debugging assistance, and generate comprehensive code documentation.
      </>
    ),
  },
  {
    title: 'Git Worktree Management',
    icon: '🌳',
    description: (
      <>
        Create multiple isolated development environments, run parallel AI agents, and easily merge changes with advanced Git worktree support.
      </>
    ),
  },
  {
    title: 'Smart Configuration',
    icon: '⚙️',
    description: (
      <>
        Secure API key management, flexible AI model configuration per command, and easy service setup with built-in help.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <span role="img" aria-label={title} className={styles.emoji}>
            {icon}
          </span>
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>Use AI CLI</Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
